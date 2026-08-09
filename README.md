# AI Interview Agent

> An autonomous AI interviewer that conducts realistic technical interviews, evaluates candidates, adapts questions in real-time, and generates detailed feedback.

---

# Overview

The AI Interview Agent is designed to simulate an experienced technical interviewer.

Instead of simply asking predefined questions, the system:

- Understands the candidate profile
- Selects interview topics dynamically
- Generates contextual questions
- Creates follow-up questions based on answers
- Detects weak and strong areas
- Adjusts interview difficulty
- Scores communication and technical knowledge
- Produces comprehensive interview reports

The goal is to replicate a real-world engineering interview while remaining scalable and customizable.

---

# Core Features

## Candidate Profile Analysis

The system analyzes:

- Resume
- Skills
- Experience
- Target role
- Seniority
- Preferred technologies

This profile becomes the interview context.

---

## Dynamic Topic Selection

Instead of fixed question lists, the AI chooses topics during the interview based on:

- Curriculum
- Job requirements
- Candidate experience
- Previous answers
- Difficulty progression

Example:

```
Candidate:
Node.js
Express
MongoDB

↓

Interview Starts

↓

Node Basics

↓

Express

↓

REST APIs

↓

Authentication

↓

JWT

↓

Security

↓

Scaling
```

---

## AI Question Generation

Questions are generated in real time.

They are not stored in a database.

Each question depends on:

- Current topic
- Previous answer
- Difficulty level
- Candidate confidence
- Remaining interview time

---

## Follow-up Engine

The interviewer listens to every answer.

If an answer is:

Good
→ Go deeper.

Weak
→ Ask easier question.

Incorrect
→ Explore the misunderstanding.

Excellent
→ Increase difficulty.

This creates natural conversations.

---

## Evaluation System

Every answer is evaluated on multiple dimensions.

Example:

Technical Accuracy

Problem Solving

Depth of Knowledge

Communication

Confidence

Completeness

Reasoning

Practical Experience

---

## Interview Report

At the end the AI generates:

Overall Score

Topic-wise Scores

Strengths

Weaknesses

Missed Concepts

Improvement Suggestions

Hiring Recommendation

Difficulty Analysis

Interview Summary

---

# High-Level Workflow

```
Candidate

↓

Profile Analysis

↓

Interview Planning

↓

Topic Selection

↓

Question Generation

↓

Candidate Answer

↓

Answer Evaluation

↓

Follow-up Decision

↓

Next Question

↓

Repeat

↓

Final Evaluation

↓

Feedback Report
```

---

# Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios

---

## Backend

- Node.js
- Express.js
- TypeScript
- Pino (Logging)

---

## Setup and Development

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Setup environment variables:**
   Copy `.env.example` to `.env` and fill in your OpenRouter API key.

3. **Run the development server:**
   ```bash
   pnpm run dev
   ```

The server will start on `http://localhost:3000` (or your configured `PORT`). You can verify the server is running by hitting the health check endpoint at `GET /health`.

---

## AI

- OpenRouter API
- Multiple LLM Support
- Configurable Models

---

## Storage

Initially:

- JSON Files

Later:

- PostgreSQL
or
- MongoDB

---

## Authentication

Planned

- JWT
- Role-based access

---

# Project Goals

Build an interviewer—not just a chatbot.

The AI should behave like a senior engineering interviewer capable of conducting adaptive interviews for multiple technical domains.

---

# Future Features

- Voice interviews
- Screen sharing
- Coding interviews
- Whiteboard mode
- Live code execution
- ATS resume parsing
- Company-specific interview modes
- Multi-round interviews
- Team interviews
- Behavioral interviews
- Analytics dashboard
- Candidate history
- Organization management

---

# Project Structure (Planned)

```
client/
server/

docs/

curriculum/

prompts/

reports/

interviews/

uploads/
```

---

# Development Philosophy

- AI-first architecture
- Modular services
- Prompt-driven logic
- Easy model swapping via OpenRouter
- Production-ready codebase
- Extensible agent pipeline
- Clean separation of responsibilities

---

# License

MIT License