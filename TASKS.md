# TASKS.md

# AI Interview Agent Roadmap

> This document is the execution plan for the project. Complete every phase before moving to the next. Every task should be marked as completed (`[x]`) once finished.

---

# Project Status

**Current Phase:** Phase 1 — Project Foundation

---

# Phase 1 — Project Foundation

## 1.1 Repository Setup

- [x] Create project structure
- [ ] Initialize Git repository
- [x] Setup Express backend
- [ ] Setup React (Vite) frontend
- [ ] Configure Tailwind CSS
- [ ] Configure ESLint & Prettier
- [x] Configure environment variables
- [x] Setup API folder structure
- [x] Setup shared configuration
- [ ] Verify frontend-backend communication

---

## 1.2 Backend Structure

- [x] Create `controllers/`
- [x] Create `routes/`
- [x] Create `services/`
- [x] Create `agents/`
- [x] Create `middleware/`
- [x] Create `config/`
- [x] Create `utils/`
- [x] Create `models/`
- [x] Create `storage/`
- [x] Create `prompts/`
- [x] Create `curriculum/`
- [x] Create `reports/`
- [x] Create `uploads/`

---

## 1.3 OpenRouter Integration

- [x] Register OpenRouter API key
- [x] Configure API client
- [x] Build reusable LLM service
- [x] Add request retry logic
- [x] Add timeout handling
- [x] Add structured JSON response parsing
- [x] Add token usage logging
- [x] Test with a sample prompt

---

## 1.4 Curriculum Loader

- [x] Create curriculum schema and types
- [x] Build CurriculumValidator for runtime JSON validation
- [x] Build CurriculumRepository with lookup indexes
- [x] Build CurriculumLoader to parse files
- [x] Create sample curriculum JSON
- [x] Expose read-only lookup APIs

---

# Phase 2 — Candidate Analyzer

## Goal

Analyze the candidate profile and prepare interview context.

## 2.1 Candidate Profile Loader

- [x] Create candidate profile schema and types
- [x] Build CandidateValidator for profile JSON
- [x] Build CandidateRepository for immutable data storage
- [x] Build CandidateProfileLoader to parse candidates
- [x] Create sample candidate JSON
- [x] Expose read-only lookup APIs

### Tasks

- [x] Design candidate schema
- [x] Build Candidate Analyzer agent
- [x] Create analyzer prompt
- [x] Parse resume/profile input
- [x] Estimate candidate level
- [x] Identify strengths
- [x] Identify weak areas
- [x] Recommend interview topics
- [x] Return structured JSON
- [x] Test with multiple profiles

---

## 2.2 Candidate Answer Analyzer

- [x] Create Candidate Analyzer agent
- [x] Create analyzer prompt
- [x] Extract key technical concepts
- [x] Detect uncertainty and guessing
- [x] Handle empty/off-topic answers
- [x] Output structured JSON

---

# Phase 3 — Interview Planner

## Goal

Generate an interview roadmap before asking questions.

### Tasks

- [ ] Design interview plan schema
- [ ] Create planner prompt
- [ ] Generate interview duration
- [ ] Select interview topics
- [ ] Decide difficulty level
- [ ] Decide question count
- [ ] Build interview timeline
- [ ] Validate generated plan

---

# Phase 4 — Topic Selector

## Goal

Select the best topic for the next question.

### Tasks

- [x] Build topic selector agent
- [x] Track covered topics
- [x] Track candidate performance
- [x] Prioritize weak topics
- [x] Avoid duplicate topics
- [x] Return next topic
- [x] Test adaptive topic switching

---

# Phase 5 — Question Generator

## Goal

Generate high-quality interview questions dynamically.

### Tasks

- [x] Create question generator prompt
- [x] Support multiple difficulty levels
- [x] Generate conceptual questions
- [x] Generate practical questions
- [x] Generate scenario-based questions
- [x] Generate coding questions (future-ready)
- [x] Define expected answer points
- [x] Return structured JSON
- [x] Validate generated questions

---

# Phase 6 — Answer Evaluator

## Goal

Evaluate every candidate response objectively.

### Tasks

- [x] Create evaluator prompt
- [x] Evaluate technical accuracy
- [x] Evaluate reasoning
- [x] Evaluate communication
- [x] Evaluate completeness
- [x] Evaluate practical understanding
- [x] Assign normalized score
- [x] Generate concise feedback
- [x] Store evaluation results

---

## 6.1 Technical Accuracy Checker

- [x] Create Technical Accuracy Checker agent
- [x] Create technical evaluator prompt
- [x] Verify technical correctness against expected concepts
- [x] Detect factual errors and misconceptions
- [x] Integrate Candidate Analyzer output context
- [x] Generate structured technical feedback and scoring
- [x] Output strict JSON

---

## 6.2 Communication Analyzer

- [x] Create Communication Analyzer agent
- [x] Create communication evaluator prompt
- [x] Evaluate grammar, clarity, and professionalism
- [x] Detect filler words, ambiguity, and repetition
- [x] Generate structured communication feedback and scoring
- [x] Output strict JSON

---

## 6.3 Confidence Estimator

- [x] Create Confidence Estimator agent
- [x] Create confidence estimator prompt
- [x] Estimate overall confidence and specific claim certainty
- [x] Detect bluffing, hesitation, and hedging
- [x] Integrate Candidate and Communication Analyzer contexts
- [x] Output strict JSON

---

## 6.4 Rubric Engine

- [x] Create Rubric Engine agent
- [x] Create rubric evaluator prompt
- [x] Integrate outputs from multiple analyzers
- [x] Support externalized weight configuration
- [x] Deterministically calculate weighted overall score and grade
- [x] Produce detailed reasoning for every sub-score
- [x] Output strict JSON

---

# Phase 7 — Follow-up Engine

## Goal

Adapt the interview based on candidate performance.

### Tasks

- [ ] Build decision engine
- [ ] Detect strong answers
- [ ] Detect weak answers
- [ ] Detect misconceptions
- [ ] Increase difficulty
- [ ] Decrease difficulty
- [x] Generate follow-up questions
- [ ] Skip mastered topics
- [ ] Maintain interview flow

---

## 7.1 Follow-up Question Generator

- [x] Create follow-up generator prompt
- [x] Analyze candidate answer and original question
- [x] Apply follow-up strategy (Clarification, Depth, Trade-offs, etc.)
- [x] Enforce configurable follow-up limits
- [x] Validate structured JSON response

---

# Phase 8 — Interview Session Manager

## Goal

Manage interview state across the session.

### Tasks

- [x] Create session schema
- [x] Store interview progress
- [x] Store questions asked
- [x] Store candidate answers
- [x] Store scores
- [x] Resume interrupted sessions
- [x] Persist session data

---

## 8.1 Interview Flow Controller

- [x] Build central orchestrator
- [x] Implement InterviewState state machine
- [x] Wire up Question and Follow-up Generators
- [x] Implement Start, Pause, Resume, End flows
- [x] Track Interview Progress and Elapsed Time
- [x] Enforce session config limits
- [x] Persist orchestration data to SessionManager

---

# Phase 9 — Feedback Generator

## Goal

Generate a comprehensive interview report.

### Tasks

- [ ] Build feedback prompt
- [ ] Calculate overall score
- [ ] Calculate topic-wise scores
- [ ] Summarize interview
- [ ] Highlight strengths
- [ ] Highlight weaknesses
- [ ] Generate improvement plan
- [ ] Generate hiring recommendation
- [ ] Export report as JSON

---

## 9.1 Skill Matrix Generator

- [x] Create Skill Matrix Generator agent
- [x] Create skill matrix prompt
- [x] Extract and merge cross-topic evidence
- [x] Build comprehensive competency matrix
- [x] Detect strengths, weaknesses, and learning paths
- [x] Ensure deterministic JSON output

---

## 9.2 Hiring Recommendation Engine

- [x] Create Hiring Recommendation Engine agent
- [x] Create hiring recommendation prompt
- [x] Aggregate evidence across all evaluators and matrices
- [x] Implement deterministic thresholding and penalty overrides
- [x] Generate role readiness and learning priorities
- [x] Ensure strict JSON generation for downstream consumption

---

# Phase 10 — Backend API

## Goal

Expose all functionality through REST APIs.

### Tasks

- [ ] `POST /candidate/analyze`
- [ ] `POST /interview/start`
- [ ] `POST /interview/question`
- [ ] `POST /interview/answer`
- [ ] `POST /interview/finish`
- [ ] Add request validation
- [ ] Add centralized error handling
- [ ] Add API documentation

---

# Phase 11 — Frontend

## Goal

Build the user interface.

### Pages

- [ ] Landing Page
- [ ] Candidate Setup
- [ ] Interview Dashboard
- [ ] Live Question Screen
- [ ] Answer Submission
- [ ] Progress Tracker
- [ ] Interview Report
- [ ] Settings

### Components

- [ ] Navbar
- [ ] Sidebar
- [ ] Question Card
- [ ] Timer
- [ ] Progress Bar
- [ ] Topic Indicator
- [ ] Score Card
- [ ] Feedback Panel
- [ ] Loading States
- [ ] Error States

---

# Phase 12 — Testing

## Goal

Ensure reliability and quality.

### Tasks

- [ ] Unit tests
- [ ] Integration tests
- [ ] API tests
- [ ] Prompt validation
- [ ] JSON schema validation
- [ ] Performance testing
- [ ] Edge case testing
- [ ] Manual interview testing

---

# Phase 13 — Deployment

## Backend

- [ ] Configure production environment
- [ ] Deploy Express API
- [ ] Secure environment variables
- [ ] Enable logging
- [ ] Configure monitoring

### Frontend

- [ ] Production build
- [ ] Deploy to Vercel
- [ ] Configure API endpoints
- [ ] Test production deployment

---

# Phase 14 — Future Enhancements

## AI Features

- [ ] Voice interviews
- [ ] Speech-to-text integration
- [ ] Text-to-speech interviewer
- [ ] Behavioral interview mode
- [ ] HR interview mode
- [ ] System Design interview mode
- [ ] DSA interview mode
- [ ] Multi-language interviews
- [ ] Company-specific interview templates
- [ ] AI interview analytics

---

# Stretch Goals

- [ ] Resume parser
- [ ] ATS compatibility analysis
- [ ] Live coding editor
- [ ] Whiteboard collaboration
- [ ] Webcam emotion analysis (optional)
- [ ] Team interview support
- [ ] Organization dashboard
- [ ] Candidate history
- [ ] Export PDF reports
- [ ] Email interview reports

---

# Definition of Done

A phase is considered complete only when:

- [ ] All tasks in the phase are completed
- [ ] Code is documented
- [ ] APIs are tested
- [ ] Prompts are validated
- [ ] JSON responses follow schema
- [ ] No critical bugs remain
- [ ] Changes are committed to Git

---

# Overall Progress

| Phase | Status |
|--------|--------|
| Phase 1 — Foundation | ⬜ Not Started |
| Phase 2 — Candidate Analyzer | ⬜ Not Started |
| Phase 3 — Interview Planner | ⬜ Not Started |
| Phase 4 — Topic Selector | ⬜ Not Started |
| Phase 5 — Question Generator | ⬜ Not Started |
| Phase 6 — Answer Evaluator | ⬜ Not Started |
| Phase 7 — Follow-up Engine | ⬜ Not Started |
| Phase 8 — Session Manager | ⬜ Not Started |
| Phase 9 — Feedback Generator | ⬜ Not Started |
| Phase 10 — Backend API | ⬜ Not Started |
| Phase 11 — Frontend | ⬜ Not Started |
| Phase 12 — Testing | ⬜ Not Started |
| Phase 13 — Deployment | ⬜ Not Started |
| Phase 14 — Future Enhancements | ⬜ Not Started |
---

# Phase 16 � Interview Memory

## Goal

Create a persistent interview memory layer that allows the interview engine to remember everything important during a single interview session.

### Tasks

- [x] Create InterviewMemory interface
- [x] Create InterviewMemoryService implementation
- [x] Implement Question tracking
- [x] Implement Answer tracking
- [x] Implement Repeated Mistake tracking
- [x] Implement Context tracking


---

# Phase 17 � Conversation Context Manager

## Goal

Create a context management layer that keeps the interview within the LLM's context window while preserving the most relevant information.

### Tasks

- [x] Create ConversationContext interface
- [x] Create ConversationContextManager implementation
- [x] Implement TokenEstimator
- [x] Implement ConversationCompressor
- [x] Implement MemoryRetriever
- [x] Implement ContextAssembler
- [x] Implement ContextSnapshot utilities


---

# Phase 18 � OpenRouter Client

## Goal

Create a production-ready OpenRouter API client that serves as the single gateway between the interview system and all LLM providers.

### Tasks

- [x] Create OpenRouterClient interface
- [x] Create OpenRouterClient implementation
- [x] Implement Request/Response models
- [x] Implement Error classes
- [x] Implement Retry manager
- [x] Implement Streaming utilities
- [x] Implement Configuration loader
- [x] Implement Logger/HTTP abstraction


---

# Phase 19 � Prompt Builder

## Goal

Create a modular Prompt Builder that constructs high-quality prompts for the LLM by combining system instructions, interview context, curriculum data, candidate information, and conversation history.

### Tasks

- [x] Create PromptBuilder interface and Service
- [x] Create PromptTemplateEngine
- [x] Create SystemPromptBuilder and UserPromptBuilder
- [x] Create ContextInjector, CurriculumInjector, and CandidateInjector
- [x] Create PromptAssembler and PromptValidator
- [x] Implement Token Estimation support


---

# Phase 20 � Response Parser

## Goal

Create a robust Response Parser that safely converts raw LLM responses into strongly typed application objects.

### Tasks

- [x] Create ResponseParser interface and Service
- [x] Create JsonExtractor for markdown unwrapping
- [x] Create JsonRepair utility for malformed output
- [x] Create SchemaValidator for dynamic validation
- [x] Create ResponseNormalizer
- [x] Create StreamingResponseParser
- [x] Implement ParserError hierarchy
- [x] Implement ParserMetrics collector


---

# Phase 21 � Report Generator

## Goal

Generate a structured interview report from all completed interview data.

### Tasks

- [x] Create ReportGenerator types
- [x] Create ReportFormatter for structural conversions
- [x] Create ReportSummaryGenerator
- [x] Create RecommendationEngineAdapter
- [x] Implement ReportGenerator orchestration


---

# Phase 22 � Improvement Plan Generator

## Goal

Generate a personalized learning and improvement roadmap based on the completed interview report and evaluation results.

### Tasks

- [x] Create ImprovementPlan types
- [x] Create ImprovementAnalyzer for performance overview
- [x] Create PriorityIdentifier for weakness prioritization
- [x] Create RoadmapGenerator for learning phases
- [x] Create ResourceRecommender for topic resources
- [x] Create MilestoneGenerator for timelines and metrics
- [x] Create RecommendationGenerator for practice plans
- [x] Implement ImprovementPlanGenerator orchestration


---

# Phase 23 � PDF Export

## Goal

Generate a professional, printable PDF report from the completed interview report and improvement plan.

### Tasks

- [x] Create IPdfEngine abstraction
- [x] Create PdfExporter
- [x] Create ReportTemplate
- [x] Create TableRenderer and ChartGenerator
- [x] Create Theme config
- [x] Support multiple output formats (Buffer, Stream, File)


---

# Phase 24 � Interview API

## Goal

Create REST API endpoints for managing an interview session.

### Tasks

- [x] Create interviewApi.service.ts with mocked dependency interfaces
- [x] Create interview.controller.ts with request validation
- [x] Create interview.routes.ts mapping endpoints to controller
- [x] Implement robust HTTP status code handling (200, 201, 400, 404, 500)


---

# Phase 25 � Report API

## Goal

Create REST API endpoints for retrieving interview reports, downloading reports, and viewing interview history.

### Tasks

- [x] Create report.types.ts with pagination and response models
- [x] Create reportApi.service.ts with mocked dependency interfaces
- [x] Create report.controller.ts with request validation
- [x] Create report.routes.ts mapping endpoints to controller
- [x] Create pdfGenerator.ts utility facade
- [x] Implement HTTP status code handling (200, 400, 404, 500)


---

# Phase 26 � WebSocket Manager

## Goal

Manage WebSocket connections for live interview sessions, streaming questions, feedback, and progress updates.

### Tasks

- [x] Create generic IWebSocketConnection interface to decouple from transport
- [x] Implement WebSocketClient for individual connection lifecycle and ping-pong handling
- [x] Implement WebSocketManager for session multiplexing and concurrent broadcasts
- [x] Add heartbeat interval to prune stale connections and handle unexpected disconnects


---

# Phase 27 � Authentication Module

## Goal

Implement secure user login, JWT generation, and protected route middleware without database bindings.

### Tasks

- [x] Create AuthTypes.ts for IAuthUser, IJwtPayload, and interfaces
- [x] Create JwtService.ts for token generation and cryptographically secure verification
- [x] Create PasswordService.ts using native Node crypto scrypt
- [x] Create AuthService.ts with mocked database logic
- [x] Create AuthMiddleware.ts for intercepting HTTP headers and decoding JWTs securely


---

# Phase 28 � Database Layer

## Goal

Implement an abstract, ORM-agnostic Repository Pattern for managing data persistence.

### Tasks

- [x] Define IDatabaseConnection and ITransaction interfaces
- [x] Create core Domain Models for persistence (Sessions, Profiles, Reports)
- [x] Create abstract IRepository generic interface
- [x] Implement CandidateProfileRepository
- [x] Implement InterviewSessionRepository
- [x] Implement InterviewReportRepository
- [x] Implement mock in-memory store mapping to enable DI without a real database


---

# Phase 29 � Configuration Manager

## Goal

Create a centralized configuration system parsing process env strings securely.

### Tasks

- [x] Create strict typings spanning App, AI Models, DB, and Auth categories
- [x] Implement EnvironmentLoader for safe fallback value defaults
- [x] Create ValidationUtils to aggressively validate missing critical configuration (e.g. Prod DB strings)
- [x] Integrate FeatureFlagManager abstraction
- [x] Architect a Singleton ConfigurationManager root service


---

# Phase 30 � Error Handler

## Goal

Build a centralized error handling system providing consistent, secure, and user-friendly error management.

### Tasks

- [x] Create strict ErrorTypes enumerating categories and log levels
- [x] Define BaseAppException and specialized hierarchy (Validation, Auth, Database, AI Provider)
- [x] Create ErrorFormatter to mask operational details from users while preserving logs
- [x] Implement ErrorLogger integrated with ConfigurationManager for dynamic verbosity
- [x] Create global Express ErrorMiddleware to safely capture and structure inbound crashes
- [x] Create RetryUtility for transparent exponential backoff on transient external failures


---

# Phase 31 � Monitoring & Metrics

## Goal

Build a centralized monitoring and observability system collecting app, LLM, and infra metrics.

### Tasks

- [x] Create generic MetricsRegistry wrapping Counters, Gauges, and Histograms
- [x] Implement async MetricsCollector for lightweight background aggregation
- [x] Create RequestMonitoringMiddleware with ConfigManager toggle support
- [x] Build PerformanceMonitor hooking into native OS stats
- [x] Integrate ErrorLogger for HTTP failure/latency tracking
- [x] Implement HealthCheckService for deep component checks
- [x] Create LlmMetricsTracker for tracking tokens, latency, cost, and cache state


---

# Phase 32 � Interview Engine

## Goal

Build the main orchestration loop integrating all 30+ previously built modules via Clean Architecture Dependency Injection.

### Tasks

- [x] Create IInterviewEngineDependencies port interface to loosely couple all modules
- [x] Implement InterviewEngine state machine (INITIALIZING, WAITING, PROCESSING)
- [x] Implement async \startInterview\ initialization flow (DB, Config, Topics)
- [x] Implement \submitAnswer\ async callback loop (Validate -> Analyze -> Score -> FollowUp)
- [x] Embed WebSocketManager hooks for realtime bi-directional IO
- [x] Hook in Error Handler and Monitoring hooks natively into orchestrator flows
- [x] Generate Mermaid sequence diagram illustrating orchestrator control flow


---

# Phase 33 - Prisma ORM Migration

## Goal

Replace all in-memory Map-based repositories with a persistent PostgreSQL database using Prisma ORM, strictly maintaining the Domain layer and anti-corruption interfaces.

### Tasks

- [x] Create normalized Prisma schema (User, Candidate, Interview, Question, Answer, Score, Report)
- [x] Setup singleton DatabaseClient using PrismaPg adapter
- [x] Rewrite CandidateProfileRepository
- [x] Rewrite InterviewSessionRepository
- [x] Rewrite InterviewReportRepository
- [x] Create transactionally-safe database Seed script

