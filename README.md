# Orion AI
<div align="center">
  <img src="./demo/logo.png" alt="Orion AI Logo" width="200" />
</div>
Orion AI is a cutting-edge, AI-powered technical interviewer platform. It conducts adaptive, real-time technical interviews tailored to specific curriculums, evaluates candidates across multiple dimensions (technical depth, communication, problem-solving, and confidence), and generates comprehensive assessment reports and hiring recommendations.

## Screenshots

<div align="center">
  <img src="./demo/Landing%20Page.png" alt="Landing Page" width="800" />
  <br />
  <img src="./demo/Dashboard.png" alt="Dashboard" width="800" />
  <br />
  <img src="./demo/Interview-page.png" alt="Interview Page" width="800" />
  <br />
  <img src="./demo/Chat-{age.png" alt="Chat Page" width="800" />
  <br />
  <img src="./demo/Report%20For%20Candidate.png" alt="Report For Candidate" width="800" />
</div>

## Features

- 🤖 **Adaptive AI Interviewer**: Leverages OpenRouter and advanced LLMs to conduct dynamic, conversational interviews that adapt in difficulty based on the candidate's performance.
- 🎯 **Curriculum-Based Pacing**: Automatically cycles through required topics from a structured curriculum (e.g., Node.js Basics, Databases, Express.js), ensuring complete technical coverage.
- 📊 **Multidimensional Scoring**: Evaluates answers across various criteria, detecting knowledge gaps and providing a detailed breakdown of strengths and areas for improvement.
- 📜 **Comprehensive Assessment Reports**: Generates detailed final reports with a complete question history, overall score, confidence ratings, and an AI-driven hiring recommendation.
- 🕰️ **History Dashboard**: A dedicated dashboard for recruiters to view all past interview sessions, complete with performance scores and durations.
- ⚡ **Real-Time Communication**: Uses WebSockets for seamless, instant, two-way communication during the interview.

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Framer Motion (Animations)
- Zustand (State Management)

**Backend:**
- Node.js & Express
- Prisma ORM (PostgreSQL)
- WebSockets (`ws`)
- OpenRouter API (LLM Integration)

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v18+)
- PostgreSQL Database
- An OpenRouter API Key

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/shri207/Orion-ai.git
cd Orion-ai
```

### 2. Backend Setup

Install backend dependencies:
```bash
npm install
```

Set up your `.env` file in the root directory:
```env
# Server
PORT=3000
NODE_ENV=development

# Database (PostgreSQL)
DATABASE_URL="postgres://username:password@localhost:5432/orion"

# AI Integration
OPENROUTER_API_KEY="your-openrouter-api-key"
AI_MODEL_INTERVIEWER="anthropic/claude-3.5-sonnet:beta"

# Other
JWT_SECRET="your-jwt-secret"
FRONTEND_URL="http://localhost:5173"
```

Run the database migrations to set up your PostgreSQL schema:
```bash
npx prisma migrate dev --name init
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Set up your frontend environment variables by creating a `.env` file in the `frontend` directory:
```env
VITE_API_URL="http://localhost:3000"
VITE_API_KEY="your-optional-api-key"
```

Start the frontend development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Deployment

### Backend (Railway)
1. Create a new project on Railway and provision a PostgreSQL database.
2. Link this GitHub repository.
3. In the Railway dashboard, set all the environment variables from your root `.env` file.
4. Set the Build Command to `npm install && npx prisma generate && npm run build`.
5. Set the Start Command to `npm run start`.
6. Run `npm run migrate` on the Railway terminal to initialize the database tables.

### Frontend (Vercel)
1. Import this repository into Vercel.
2. Ensure the root directory is set to `./` (not `frontend`). The custom `vercel.json` will handle building the frontend correctly.
3. Add the `VITE_API_URL` environment variable pointing to your deployed Railway backend URL (ensure it starts with `https://`).
4. Click Deploy.

## License

Distributed under the MIT License. See `LICENSE` for more information.