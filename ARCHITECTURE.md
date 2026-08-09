# ARCHITECTURE.md

# AI Interview Agent Architecture

Version: 1.0

---

# Vision

The AI Interview Agent is designed as a collection of independent services that work together to conduct an adaptive technical interview.

Instead of one massive prompt, every responsibility is handled by its own module.

Each module has a single responsibility.

This makes the system:

- scalable
- maintainable
- testable
- easy to improve
- model independent

---

# High Level Architecture

```
                    +----------------------+
                    |     React Client     |
                    +----------+-----------+
                               |
                               |
                     REST API / WebSocket
                               |
                               |
                    +----------v-----------+
                    |    Express Server    |
                    +----------+-----------+
                               |
        -------------------------------------------------
        |        |        |        |        |           |
        |        |        |        |        |           |
        v        v        v        v        v           v

 Candidate   Interview   Topic    Question  FollowUp  Feedback
 Analyzer     Planner   Selector Generator  Engine    Generator

        |        |        |        |        |           |
        -------------------------------------------------
                               |
                               |
                      OpenRouter LLM API
                               |
                               |
                        JSON / Database
```

---

# System Flow

```
Candidate

↓

Upload Resume

↓

Candidate Analyzer

↓

Interview Planner

↓

Topic Selector

↓

Question Generator

↓

Candidate Answers

↓

Answer Evaluation

↓

Follow-up Decision

↓

Next Question

↓

...

↓

Interview Finished

↓

Feedback Generator

↓

Report
```

---

# Core Modules

## 1. Candidate Analyzer

### Responsibility

Reads candidate information.

### Inputs

- Name
- Experience
- Skills
- Resume
- Role
- Years of Experience

### Output

```json
{
  "level": "Intermediate",
  "strengths": [],
  "weak_topics": [],
  "recommended_topics": [],
  "estimated_difficulty": "Medium"
}
```

---

## 2. Interview Planner

Creates the interview strategy.

Instead of asking random questions, it builds a roadmap.

Example:

```
Node.js

↓

Express

↓

Authentication

↓

JWT

↓

Scaling

↓

System Design
```

Output

```json
{
  "duration":45,
  "questionCount":12,
  "difficulty":"Medium",
  "topics":[]
}
```

---

## 3. Topic Selector

Chooses the next interview topic.

Inputs

- Interview Plan
- Previous Questions
- Candidate Performance

Example

```
Current Topic

↓

Express

↓

Score = High

↓

Move to JWT
```

If score is poor

```
Express

↓

Routing

↓

Middleware

↓

Retry Express
```

---

## 4. Question Generator

Generates one interview question.

Inputs

- Topic
- Difficulty
- Previous Context

Output

```json
{
 "question":"Explain JWT Authentication.",
 "expected_points":[]
}
```

Questions are generated dynamically.

No static database.

---

## 5. Answer Evaluator

Evaluates every candidate answer.

Evaluation Categories

- Technical Accuracy

- Depth

- Communication

- Confidence

- Practical Thinking

- Completeness

- Examples

Returns

```json
{
 "score":8.2,
 "feedback":"Good explanation."
}
```

---

## 6. Follow-up Engine

Decides what happens next.

Decision Tree

```
Answer

↓

Excellent

↓

Harder Question


Answer

↓

Average

↓

Same Difficulty


Answer

↓

Weak

↓

Simpler Question


Answer

↓

Wrong

↓

Clarification
```

---

## 7. Feedback Generator

Runs after interview completion.

Generates

- Summary

- Overall Score

- Topic Scores

- Weak Areas

- Strong Areas

- Hiring Recommendation

---

# LLM Layer

Every AI module communicates with OpenRouter.

```
Module

↓

Prompt Builder

↓

OpenRouter API

↓

LLM

↓

Structured JSON

↓

Application
```

Benefits

- Easy model switching

- Prompt isolation

- Better debugging

- Lower token usage

---

# Prompt Architecture

Every module owns its own prompt.

```
prompts/

candidate-analyzer.md

interview-planner.md

topic-selector.md

question-generator.md

answer-evaluator.md

followup-engine.md

feedback-generator.md
```

No giant prompts.

Each prompt has one responsibility.

---

# Backend Structure

```
server/

src/

controllers/

routes/

services/

agents/

prompts/

middleware/

config/

utils/

types/

models/

storage/

reports/

uploads/

curriculum/

index.js
```

---

# Frontend Structure

```
client/

src/

pages/

components/

hooks/

services/

store/

contexts/

layouts/

assets/

styles/

utils/
```

---

# API Flow

```
Client

↓

POST /interview/start

↓

Candidate Analyzer

↓

Interview Planner

↓

Interview Session Created

↓

Return sessionId
```

---

```
POST /interview/question

↓

Topic Selector

↓

Question Generator

↓

Question Returned
```

---

```
POST /interview/answer

↓

Answer Evaluator

↓

Follow-up Engine

↓

Store Result

↓

Return Next Action
```

---

```
POST /interview/finish

↓

Feedback Generator

↓

Generate Report

↓

Return Report
```

---

# Session State

Each interview maintains its own state.

```json
{
  "sessionId": "",
  "candidate": {},
  "currentTopic": "",
  "currentQuestion": {},
  "askedQuestions": [],
  "answers": [],
  "scores": [],
  "difficulty": "Medium",
  "status": "Running"
}
```

Initially stored as JSON.

Can later migrate to PostgreSQL or MongoDB without changing business logic.

---

# Data Storage

Phase 1

```
JSON Files
```

Phase 2

```
PostgreSQL
```

Phase 3

```
Redis
```

Optional

```
Vector Database

Pinecone

Qdrant

Weaviate
```

For semantic interview memory.

---

# Error Handling

Every AI request should include:

- Timeout

- Retry

- JSON validation

- Response schema validation

- Logging

- Token usage tracking

- Cost tracking

---

# Future Architecture

```
                AI Interview Agent

                        |

    --------------------------------------------

    |          |          |         |          |

 Technical  HR Round  Coding   System Design  Behavioral

    |          |          |         |          |

    --------------------------------------------

                    Shared AI Core
```

Future additions

- Voice interviews

- Live coding execution

- Screen sharing

- Multi-agent interviewing

- Company-specific interview modes

- Interview analytics dashboard

- ATS integration

- Resume parsing

- Candidate history

- Team collaboration

---

# Design Principles

- Single responsibility for every module

- AI-first architecture

- Prompt-driven workflows

- Model agnostic through OpenRouter

- Stateless APIs where possible

- Structured JSON between modules

- Replaceable AI services

- Production-ready folder organization

- Easy to test and extend

---

# Architecture Summary

```
Candidate
     │
     ▼
Candidate Analyzer
     │
     ▼
Interview Planner
     │
     ▼
Topic Selector
     │
     ▼
Question Generator
     │
     ▼
Candidate Answer
     │
     ▼
Answer Evaluator
     │
     ▼
Follow-up Engine
     │
     ├────────► Next Question
     │
     ▼
Feedback Generator
     │
     ▼
Final Interview Report
```