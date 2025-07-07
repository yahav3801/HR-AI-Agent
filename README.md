# HR AI Agent 🤖

An intelligent HR management system that allows natural language querying of employee data using AI agents. Built with LangGraph for agent orchestration and MongoDB vector search for semantic employee lookup.

## 🌟 Features

- **Conversational AI Interface**: Chat naturally with your HR data
- **Smart Employee Search**: Find employees by skills, department, or any criteria
- **Employee Management**: Create, read, and update employee records
- **Memory Persistence**: Conversations maintain context across interactions
- **Vector Search**: Semantic search powered by OpenAI embeddings
- **Real-time Updates**: Changes reflect immediately in the interface

## 🛠 Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- TypeScript

**Backend:**
- Node.js + Express
- LangGraph (AI Agent Orchestration)
- MongoDB Atlas (Database + Vector Search)

**AI Services:**
- OpenAI API (Embeddings for vector search)
- Anthropic API (Claude for chat/reasoning)

## 🏗 Architecture

```
User Chat Input
      ↓
  LangGraph Agent
      ↓
 Reasoning Node (Claude)
      ↓
Conditional Routing
      ↓
┌─────────────────┐
│  Tool Nodes:    │
│ • Employee Lookup│
│ • Create Employee│
│ • Update Employee│
└─────────────────┘
      ↓
MongoDB Vector Search
      ↓
Structured Response
```

The agent uses a graph-based architecture where:
1. **Agent Node**: Claude analyzes user input and decides next action
2. **Tool Nodes**: Execute specific operations (lookup, create, update)
3. **Conditional Edges**: Route between nodes based on agent reasoning
4. **Vector Search**: Semantic employee search using OpenAI embeddings

## 🚀 API Endpoints

- `POST /chat` - Start new conversation
- `POST /chat/:threadId` - Continue existing conversation (hardcoded for demo)

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- OpenAI API key
- Anthropic API key

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
MONGO_ATLAS_URI=your_mongodb_connection_string

# AI APIs
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

### MongoDB Setup

1. Create a MongoDB Atlas cluster
2. Create a database named `hr_database`
3. Create a collection named `employees`
4. Set up a vector search index named `vector_index` on the `employees` collection

### Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd hr-ai-agent

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the Application

```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm run dev
```

The application will be available at `http://localhost:5173`

## 💬 Usage Examples

Try these natural language queries:

- "Show me all employees in the Engineering department"
- "Who has birthdays this month?"
- "Find employees with JavaScript skills"
- "Create a new employee named John Doe"
- "Update Alice's job title to Senior Developer"

## 🎯 Demo Notes

- **Thread ID**: Hardcoded for demo purposes (no authentication required)
- **Memory**: Conversations maintain context within the session
- **Data**: Pre-seeded with sample employee records

## 🤝 Contributing

This is a portfolio project, but feedback and suggestions are welcome! Feel free to:

- Open issues for bugs or feature requests
- Submit pull requests for improvements
- Share ideas for enhancements

## 📚 What I Learned

- LangGraph agent orchestration and graph-based workflows
- Vector search implementation with MongoDB Atlas
- Integrating multiple AI APIs (OpenAI + Anthropic)
- Building conversational AI interfaces
- Production deployment with Vercel

## 🔗 Live Demo

**[View Live Demo](https://hr-ai-agent-one.vercel.app/)**

---

*Built by Yahav Ben Harush as a first learning project to explore AI agent development with TypeScript and modern web technologies.*
