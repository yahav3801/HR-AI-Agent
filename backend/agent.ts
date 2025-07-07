import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StateGraph } from "@langchain/langgraph";
import { Annotation } from "@langchain/langgraph";
import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";
import { z } from "zod";
import "dotenv/config";
import {
  createEmployeeSummary,
  Employee,
  EmployeeSchema,
  parser,
  UpdateEmployeeSchema,
} from "./seed-database";

export async function callAgent(
  client: MongoClient,
  query: string,
  thread_id: string
) {
  //define mongodb database and collections
  const dbName = "hr_database";
  const db = client.db(dbName);
  const collection = db.collection("employees");

  const GraphsState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
      reducer: (x, y) => x.concat(y),
    }),
  });

  const employeeLookupTool = tool(
    async ({ query, n = 10 }) => {
      console.log("Employee Lookup Tool called.");

      const dbConfig = {
        collection: collection,
        indexName: "vector_index",
        textKey: "embedding_text",
        embeddingKey: "embedding",
      };

      const vectorStore = new MongoDBAtlasVectorSearch(
        new OpenAIEmbeddings(),
        dbConfig
      );
      const result = await vectorStore.similaritySearchWithScore(query, n);
      return JSON.stringify(result);
    },
    {
      name: "Employee_Lookup",
      description: "Gather employee details from the HR database",
      schema: z.object({
        query: z.string().describe("The search query"),
        n: z
          .number()
          .optional()
          .default(10)
          .describe("The number of results to return"),
      }),
    }
  );

  const employeeAddingTool = tool(
    async (employeeData: Employee) => {
      console.log("Employee Adding Tool called.");
      try {
        const existingEmployee = await collection.findOne({
          "metadata.employee_id": employeeData.employee_id,
        });

        if (existingEmployee) {
          const timestamp = Date.now().toString().slice(-4);
          const randomNum = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0");
          employeeData.employee_id = `EMP-${timestamp}-${randomNum}`;

          console.log(
            `Duplicate ID detected, using new ID: ${employeeData.employee_id}`
          );
        }

        const record = {
          pageContent: await createEmployeeSummary(employeeData),
          metadata: { ...employeeData },
        };

        const dbConfig = {
          collection,
          indexName: "vector_index",
          textKey: "embedding_text",
          embeddingKey: "embedding",
        };

        await MongoDBAtlasVectorSearch.fromDocuments(
          [record],
          new OpenAIEmbeddings(),
          dbConfig
        );
        return `Successfully added employee: ${employeeData.first_name} ${employeeData.last_name}`;
      } catch (error: any) {
        console.error(`Error creating employee: ${error.message}`);
        return `Error creating employee: ${error.message}`;
      }
    },
    {
      name: "Employee_Adding",
      description: `Add employee document to the HR database. ${parser.getFormatInstructions()}`,
      schema: EmployeeSchema.describe("The stracture of employee data."),
    }
  );

  const employeeUpdateTool = tool(
    async ({ employee_id, updates }) => {
      console.log(
        `Employee Update Tool called for employee ID: ${employee_id}.`
      );

      try {
        const currentEmployee = await collection.findOne({
          employee_id: employee_id,
        });

        if (!currentEmployee) {
          return `Employee with ID ${employee_id} not found.`;
        }

        const excludedFields = [
          "summary_change",
          "embedding",
          "embedding_text",
        ];
        const updateFields: Record<string, any> = {};
        Object.keys(updates).forEach((key) => {
          if (!excludedFields.includes(key)) {
            updateFields[key] = (updates as any)[key];
          }
        });

        if (Object.keys(updateFields).length > 0) {
          const updatedEmployeeData = {
            ...currentEmployee,
            ...updateFields,
          } as unknown as Employee;

          const newSummary = await createEmployeeSummary(updatedEmployeeData);

          const newEmbedding = await new OpenAIEmbeddings().embedQuery(
            newSummary
          );

          updateFields.embedding_text = newSummary;
          updateFields.embedding = newEmbedding;

          await collection.updateOne(
            { employee_id: employee_id },
            { $set: updateFields }
          );

          return `Successfully updated employee ${employee_id} and refreshed embeddings`;
        }

        return `No changes detected for employee ${employee_id}`;
      } catch (error: any) {
        console.error(`Error updating employee: ${error.message}`);
        return `Error updating employee: ${error.message}`;
      }
    },
    {
      name: "Employee_Update",
      description: `Update existing employee information. Extract employee ID from the query. ${parser.getFormatInstructions()}`,
      schema: UpdateEmployeeSchema,
    }
  );

  const tools = [employeeLookupTool, employeeAddingTool, employeeUpdateTool];

  //we extract the state type via 'graphstate.state' for the tool node.
  const toolNode = new ToolNode<typeof GraphsState.State>(tools);

  const model = new ChatAnthropic({
    model: "claude-3-5-sonnet-20240620",
    temperature: 0,
  }).bindTools(tools);

  function shouldContinue(state: typeof GraphsState.State) {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1] as AIMessage;

    //if llm makes a tool call then we route to the "tools" node
    if (lastMessage.tool_calls?.length) {
      return "tools";
    }
    //otherwise we stop (reply to the user)
    return "__end__";
  }

  async function callModel(state: typeof GraphsState.State) {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a helpful AI assistant, collaborating with other assistants. Use the provided tools to progress towards answering the question. If you are unable to fully answer, that's OK, another assistant with different tools will help where you left off. Execute what you can to make progress. If you or any of the other assistants have the final answer or deliverable, prefix your response with FINAL ANSWER so the team knows to stop. You have access to the following tools: {tool_names}.\n{system_message}\nCurrent time: {time}.`,
      ],
      new MessagesPlaceholder("messages"),
    ]);

    const formattedPrompt = await prompt.formatMessages({
      system_message: "You are helpful HR Chatbot Agent",
      time: new Date().toISOString(),
      tool_names: tools.map((t) => t.name).join(", "),
      messages: state.messages,
    });

    const result = await model.invoke(formattedPrompt);
    return { messages: [result] };
  }

  const workflow = new StateGraph(GraphsState)
    //define the stations on the graph
    .addNode("agent", callModel)
    .addNode("tools", toolNode)

    //define the edges meaning the lines connecting nodes to each other
    .addEdge("__start__", "agent")
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tools", "agent");

  const checkpointer = new MongoDBSaver({ client, dbName });

  const app = workflow.compile({ checkpointer });

  const finalState = await app.invoke(
    {
      messages: [new HumanMessage(query)],
    },
    { recursionLimit: 15, configurable: { thread_id: thread_id } }
  );

  console.log(finalState.messages[finalState.messages.length - 1].content);

  return finalState.messages[finalState.messages.length - 1].content;
}
