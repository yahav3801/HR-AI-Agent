import express, { Express, Request, Response } from "express";
import { MongoClient } from "mongodb";
import "dotenv/config";
import { callAgent } from "./agent";
import cors from "cors";

const app: Express = express();
app.use(
  cors({
    origin: ["https://hr-ai-agent-one.vercel.app", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new MongoClient(process.env.MONGO_ATLAS_URI as string);

async function startServer() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    app.get("/", (req: Request, res: Response) => {
      res.send("LangGraph Agent Server");
    });

    app.post("/chat", async (req: Request, res: Response) => {
      const initialMessage = req.body.message;
      const threadId = "3801";
      try {
        const response = await callAgent(client, initialMessage, threadId);
        res.json({ threadId, response });
      } catch (error) {
        console.error("error starting conversation", error);
        res.status(500).json({ error: "internal server error" });
      }
    });

    app.post("/chat/:threadId", async (req: Request, res: Response) => {
      const { threadId } = req.params;
      const { message } = req.body;

      try {
        const response = await callAgent(client, message, threadId);
        res.json({ threadId, response });
      } catch (error) {
        console.error("error in chat:", error);
        res.status(500).json({ error: "internal server error" });
      }
    });

    app.get("/employees", async (req: Request, res: Response) => {
      try {
        const dbName = "hr_database";
        const db = client.db(dbName);
        const collection = db.collection("employees");
        const employees = await collection.find({}).toArray();
        res.json(employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ error: "Failed to fetch employees" });
      }
    });

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("error connectiong to db", error);
    process.exit(1);
  }
}
startServer();
