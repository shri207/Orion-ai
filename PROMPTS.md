# Chat Prompts History

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.You are the lead software architect for this project.

Your task is to build ONLY the project foundation.

Tech Stack:
- Node.js
- Express
- TypeScript
- OpenRouter API (will be integrated later)
- pnpm
- dotenv
- pino (logging)

Objectives

Create the complete project foundation.

Create the folder structure:

src/
    app.ts
    server.ts

    config/
        env.ts

    routes/
        health.route.ts

    middleware/

    utils/
        logger.ts

    types/

    interfaces/

    services/

    modules/

    data/

    storage/

    prompts/

    constants/

tests/

docs/

scripts/

Create:

- package.json
- tsconfig.json
- .gitignore
- .env.example
- README starter

Configure:

- Express server
- Environment variable loader
- Central logger
- Error handling middleware
- Health endpoint

Health endpoint:

GET /health

returns

{
    "status":"ok",
    "service":"ai-interview-agent"
}

Requirements

- Strict TypeScript
- Clean architecture
- No interview logic
- No AI calls
- No session manager
- No curriculum loader
- No placeholder interview code

After implementation, explain:

1. Folder structure
2. Responsibilities of each folder
3. Files created
4. Why each dependency exists

Do not continue beyond the foundation.

Wait for my next instruction.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

You are continuing an existing TypeScript Express project.

Use the existing project foundation exactly as it is.

Build ONLY the Session Manager.

Do not modify unrelated files.

Responsibilities

Create a Session Manager module responsible only for interview lifecycle.

Features

- Create interview session
- Resume session
- Save session state
- End interview session
- Generate unique Session IDs
- Store timestamps
- Track current interview status

Session states

CREATED

ACTIVE

PAUSED

COMPLETED

ABANDONED

Store

Session ID

Candidate ID

Current topic

Current question

Answered questions

Interview metadata

Created time

Updated time

Status

Architecture

Create:

modules/session/

SessionManager.ts

SessionRepository.ts

SessionTypes.ts

SessionInterfaces.ts

SessionUtils.ts

Expose a clean public API.

No Express routes.

No AI.

No curriculum.

No candidate logic.

No interview questions.

Use dependency injection where appropriate.

Include complete TypeScript interfaces.

Explain:

- Session lifecycle
- Data model
- Public methods
- Future extension points

Stop after Session Manager.

Wait for next instruction.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

Continue from the existing project.

Build ONLY the Curriculum Loader.

Use the existing Session Manager.

Do not modify unrelated modules.

Purpose

Load interview curriculum from JSON files.

Responsibilities

- Load curriculum JSON
- Validate schema
- Parse modules
- Parse topics
- Parse subtopics
- Parse learning objectives
- Build lookup indexes
- Expose lookup APIs

Create

modules/curriculum/

CurriculumLoader.ts

CurriculumValidator.ts

CurriculumRepository.ts

CurriculumTypes.ts

CurriculumInterfaces.ts

CurriculumUtils.ts

Create a sample curriculum JSON inside

data/curriculum/

The loader should expose APIs such as

loadCurriculum()

getModule()

getTopic()

getSubtopic()

getAllModules()

getTopicsByModule()

validateCurriculum()

Requirements

- Strong TypeScript typing
- Runtime validation
- Graceful error handling
- Read-only lookup APIs
- Cache loaded curriculum

Do NOT build

Interview logic

Question generation

AI integration

Candidate evaluation

Routes

Explain

- JSON schema
- Validation strategy
- Lookup architecture
- Public APIs

Stop here.

Wait for next instruction.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

Continue from the existing project.

Build ONLY the Candidate Profile Loader.

Use the existing Session Manager.

Do not modify unrelated modules.

Purpose

Manage candidate profile information for interviews.

Responsibilities

- Load candidate profile
- Parse skills
- Parse experience
- Parse education
- Parse projects
- Parse certifications
- Parse resume summary
- Store preferred interview difficulty
- Validate profile format
- Expose lookup APIs

Create

modules/candidate/

CandidateProfileLoader.ts

CandidateRepository.ts

CandidateValidator.ts

CandidateTypes.ts

CandidateInterfaces.ts

CandidateUtils.ts

Create a sample candidate JSON inside

data/candidates/

Example fields

Candidate ID

Name

Email

Role

Years of experience

Primary skills

Secondary skills

Projects

Education

Certifications

Resume summary

Preferred interview difficulty

Preferred language

The module should expose APIs

loadCandidate()

getCandidate()

getSkills()

getExperience()

getDifficulty()

validateCandidate()

Requirements

- Strong TypeScript typing
- Runtime validation
- Immutable profile objects
- Clear interfaces
- Proper error handling

Do NOT build

Interview questions

Scoring

LLM integration

Analysis

Evaluation

Feedback

Explain

- Candidate schema
- Validation strategy
- Public APIs
- Folder responsibilities

Stop after Candidate Profile Loader.

Wait for my next instruction.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

# Module 5 — Topic Selector

You are continuing an existing TypeScript Express project.

The project foundation already exists.
Do NOT recreate or modify unrelated files.

Your task is to build ONLY the Topic Selector module.

## Objective

Create a Topic Selector responsible for deciding what interview topic should be asked next.

It must be independent, reusable, and deterministic.

Do NOT generate interview questions.

Do NOT analyze answers.

Do NOT control interview flow.

Only select the next topic.

---

## Responsibilities

Implement:

- Topic selection
- Curriculum traversal
- Difficulty balancing
- Random topic selection (when enabled)
- Prevent recently repeated topics
- Track completed topics
- Support sequential curriculum progression
- Support custom topic priority

---

## Inputs

The Topic Selector should receive:

- Current interview session
- Candidate progress
- Curriculum definition
- Previously completed topics
- Current difficulty level

---

## Outputs

Return:

- Selected topic
- Difficulty
- Reason for selection
- Remaining topics
- Updated topic state

---

## Selection Rules

Support:

1. Sequential mode
   - Follow curriculum order

2. Random mode
   - Random topic
   - Never repeat recent topics

3. Adaptive mode
   - Prefer weak topics
   - Balance easy/medium/hard

---

## Difficulty Rules

Support:

- Easy
- Medium
- Hard

Should be configurable.

---

## Curriculum

Assume curriculum is loaded elsewhere.

Do NOT hardcode curriculum.

Only consume it.

---

## Session Integration

Use the existing Session Manager.

Store:

- completedTopics
- currentTopic
- topicHistory
- remainingTopics

Do not redesign Session Manager.

---

## Folder

Create only the files required for Topic Selector.

Do not modify unrelated modules.

---

## Code Requirements

- TypeScript
- SOLID
- Dependency Injection
- Small functions
- Interfaces
- Proper typing
- Logging
- Error handling

---

## Deliverables

Implement only:

- TopicSelector
- interfaces
- types
- helper utilities
- tests (if project uses them)

Do not implement Question Generator.

Do not implement Interview Controller.

Stop after Topic Selector is complete.

Wait for the next instruction.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

# Module 6 — Question Generator

You are continuing an existing TypeScript Express project.

The project foundation, Session Manager, and Topic Selector already exist.

Do NOT recreate or modify unrelated files.

Your task is to build ONLY the Question Generator module.

---

## Objective

Create a Question Generator responsible for generating interview questions based on the selected topic and difficulty level.

This module must only generate questions.

It must NOT:
- control interview flow
- analyze answers
- select topics
- score candidates
- manage sessions

---

## AI Provider

Use OpenRouter as the LLM provider.

Create a reusable OpenRouter client/service that can be used by future modules.

The API key must be loaded from environment variables.

Do not hardcode secrets.

---

## Responsibilities

Implement:

- Generate interview questions
- Respect selected topic
- Respect difficulty level
- Respect interview type
- Respect candidate experience (if provided)
- Generate one question at a time
- Produce deterministic output when temperature is configured
- Retry on transient API failures
- Validate AI responses before returning

---

## Inputs

The generator should accept:

- Selected topic
<truncated 1387 bytes>
 fails.

---

## OpenRouter Integration

Create:

- OpenRouter client
- Request builder
- Response parser
- Error handler
- Retry strategy
- Configuration loader

Support configurable:

- model
- temperature
- max tokens
- timeout

---

## Configuration

Read configuration from environment variables.

Examples:

OPENROUTER_API_KEY
OPENROUTER_MODEL
OPENROUTER_BASE_URL
OPENROUTER_TIMEOUT
QUESTION_TEMPERATURE

Do not hardcode configuration.

---

## Error Handling

Handle:

- API timeout
- Invalid JSON
- Empty response
- Rate limiting
- Authentication errors
- Network failures

Return typed errors.

---

## Logging

Log:

- Generation started
- Topic
- Difficulty
- Model used
- Request duration
- Retry attempts
- Success
- Failure

Do not log API keys.

---

## Folder Structure

Create only the files necessary for the Question Generator.

Do not modify unrelated modules.

Do not implement Follow-up Generator.

Do not implement Interview Flow Controller.

---

## Code Requirements

- TypeScript
- SOLID principles
- Dependency Injection
- Interfaces
- Proper typing
- Small reusable functions
- Unit-test friendly
- Clean architecture

---

## Deliverables

Implement only:

- QuestionGenerator
- OpenRouter client/service
- Prompt templates
- Interfaces
- Types
- Validators
- Response parser
- Retry utilities
- Tests (if the project uses them)

Do NOT implement any other module.

Stop once the Question Generator is complete.

Wait for the next instruction.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

# Module 7 — Follow-up Question Generator

You are continuing an existing TypeScript Express project.

The following modules already exist:

- Project Foundation
- Session Manager
- Topic Selector
- Question Generator

Do NOT recreate or modify unrelated files.

Your task is to build ONLY the Follow-up Question Generator module.

---

## Objective

Create a Follow-up Question Generator responsible for generating intelligent probing questions based on the candidate's previous response.

This module must only generate follow-up questions.

It must NOT:

- control interview flow
- score candidates
- manage sessions
- select interview topics
- generate the initial interview question

---

## Responsibilities

Implement:

- Analyze the previous interview question
- Analyze the candidate's answer
- Identify weak or incomplete areas
- Generate one relevant follow-up question
- Request clarification when needed
- Explore deeper technical understanding
- Avoid repeating previous follow-up questions
- Respect configured follow-up limits

---

## Inputs

The module should accept:

- Original interview question
- Candidate answer
- Topic
- Difficulty
- Interview type
- Previous follow-up questions
- Candidate
<truncated 1970 bytes>
es JSON schema
- Required fields exist
- Topic remains unchanged
- Question is relevant to the previous answer

Retry generation if validation fails.

---

## Limits

Support configurable settings:

- Maximum follow-up questions per topic
- Maximum follow-up questions per interview
- Prevent duplicate follow-ups
- Prevent infinite follow-up loops

---

## Error Handling

Handle:

- Invalid AI response
- Empty response
- Invalid JSON
- API timeout
- Rate limiting
- Network failures

Return typed errors.

---

## Logging

Log:

- Follow-up generation started
- Topic
- Difficulty
- Follow-up strategy
- Request duration
- Retry attempts
- Success
- Failure

Do not log API keys or candidate answers unless debug mode is enabled.

---

## Folder Structure

Create only the files necessary for the Follow-up Question Generator.

Do not modify unrelated modules.

Do not implement Interview Flow Controller.

---

## Code Requirements

- TypeScript
- SOLID principles
- Dependency Injection
- Interfaces
- Proper typing
- Small reusable functions
- Clean architecture
- Unit-test friendly

---

## Deliverables

Implement only:

- FollowUpQuestionGenerator
- Prompt templates
- Interfaces
- Types
- Validators
- Response parser
- Helper utilities
- Tests (if the project uses them)

Reuse the existing OpenRouter service from Module 6.

Do NOT implement any other module.

Stop once the Follow-up Question Generator is complete.

Wait for the next instruction.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

# Module 8 — Interview Flow Controller

You are continuing an existing TypeScript Express project.

The following modules already exist:

- Project Foundation
- Session Manager
- Topic Selector
- Question Generator
- Follow-up Question Generator

Do NOT recreate or modify unrelated files.

Your task is to build ONLY the Interview Flow Controller module.

---

## Objective

Create the Interview Flow Controller responsible for orchestrating the entire interview lifecycle.

This module coordinates existing modules but does NOT implement their internal logic.

It acts as the central orchestrator for interview execution.

---

## Responsibilities

Implement:

- Start interview
- Resume interview
- Pause interview
- End interview
- Generate next question
- Decide when to ask a follow-up
- Move to the next topic
- Skip questions/topics
- Track interview progress
- Track elapsed time
- Enforce interview limits
- Persist session updates through Session Manager

Do NOT generate questions directly.

Do NOT analyze answers directly.

Always delegate work to existing modules.

---

## Modules to Use

Reuse the existing modules through dependency injection:

- Session Manager
- Topic Selector
- Question Generat
<truncated 2431 bytes>
on generated
- Follow-up generated
- Question skipped
- Topic skipped
- State transitions
- Interview ended
- Errors

Avoid logging sensitive candidate responses unless debug mode is enabled.

---

## Events (Optional but Recommended)

Design the controller to emit events such as:

- InterviewStarted
- TopicChanged
- QuestionGenerated
- FollowUpGenerated
- AnswerSubmitted
- InterviewPaused
- InterviewResumed
- InterviewCompleted
- InterviewFailed

Keep the event system loosely coupled.

---

## Folder Structure

Create only the files required for the Interview Flow Controller.

Do not modify unrelated modules unless minimal dependency wiring is required.

Do not implement scoring, evaluation, feedback generation, reporting, analytics, or persistence beyond Session Manager integration.

---

## Code Requirements

- TypeScript
- SOLID principles
- Clean Architecture
- Dependency Injection
- Interfaces
- Strong typing
- Small reusable functions
- Unit-test friendly
- State-machine based design
- Comprehensive inline documentation

---

## Deliverables

Implement only:

- InterviewFlowController
- State machine
- Interfaces
- Types
- Orchestration logic
- Progress tracker
- Time tracker
- Controller tests (if the project uses them)

Reuse the existing:

- Session Manager
- Topic Selector
- Question Generator
- Follow-up Question Generator

Do NOT implement any additional modules.

Stop once the Interview Flow Controller is complete.

Wait for the next instruction.
```

---

### Model: Gemini 3

**Prompt:**
```text
Continue
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

Build only the Technical Accuracy Checker.

Do not build any other modules.

Goal:
Evaluate the technical correctness of a candidate's interview answer based on the interview question and expected concepts.

Responsibilities:
- Verify technical correctness.
- Compare the answer against expected concepts.
- Detect factual errors.
- Detect incorrect terminology.
- Detect misconceptions.
- Detect partially correct explanations.
- Identify missing technical details.
- Evaluate whether the candidate answered the actual question.
- Produce objective technical feedback.
- Generate structured JSON only.

Inputs:
- Interview question
- Candidate answer
- Topic metadata
- Difficulty level
- Expected concepts
- Candidate Analyzer output

Output JSON:

{
  "overall_score": 0,
  "technical_accuracy": 0,
  "concept_scores": [
    {
      "concept": "",
      "score": 0,
      "status": "correct",
      "feedback": ""
    }
  ],
  "correct_concepts": [],
  "partially_correct_concepts": [],
  "incorrect_concepts": [],
  "missing_concepts": [],
  "factual_errors": [
    {
      "statement": "",
      "reason": "",
      "severity": "low"
    }
  ],
  "misconceptions": [],
  "question_coverage": 0,
  "strengths": [],
  "improvements": [],
  "technical_feedback": "",
  "metadata": {
    "processing_time_ms": 0,
    "model": ""
  }
}

Scoring Guidelines:
- Technical Accuracy: 0–100
- Question Coverage: 0–100
- Overall Score: weighted from concept correctness and coverage.

Requirements:
- Create TypeScript interfaces.
- Use Candidate Analyzer output as supporting context.
- Do not evaluate grammar, communication, confidence, or professionalism.
- Do not generate the next interview question.
- Do not modify interview state.
- Keep the module deterministic.
- No API routes.
- No database.
- No UI.
- Handle empty answers gracefully.
- Handle off-topic answers.
- Handle partially correct answers fairly.
- Return structured JSON only.

Use the existing project architecture and shared types.

Do not modify unrelated files.

Wait for the next instruction.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

Build only the Communication Analyzer.

Do not build any other modules.

Goal:
Evaluate how effectively the candidate communicates their technical knowledge, independent of technical correctness.

Responsibilities:
- Analyze grammar.
- Analyze clarity.
- Analyze sentence structure.
- Analyze logical flow.
- Analyze vocabulary and terminology usage.
- Analyze professionalism.
- Analyze confidence in communication.
- Detect filler words and excessive repetition.
- Detect vague or ambiguous explanations.
- Produce structured JSON only.

Inputs:
- Interview question
- Candidate answer
- Candidate Analyzer output

Output JSON:

{
  "overall_score": 0,
  "grammar": {
    "score": 0,
    "issues": []
  },
  "clarity": {
    "score": 0,
    "issues": []
  },
  "structure": {
    "score": 0,
    "feedback": ""
  },
  "logical_flow": {
    "score": 0,
    "feedback": ""
  },
  "professionalism": {
    "score": 0,
    "feedback": ""
  },
  "confidence_in_communication": {
    "score": 0,
    "indicators": []
  },
  "filler_words": [
    {
      "word": "",
      "count": 0
    }
  ],
  "repetition": [],
  "ambiguous_statements": [],
  "strengths": [],
  "improvements": [],
  "communication_feedback": "",
  "metadata": {
    "processing_time_ms": 0,
    "model": ""
  }
}

Scoring Guidelines:
- Overall Score: 0–100
- Grammar: 0–100
- Clarity: 0–100
- Structure: 0–100
- Logical Flow: 0–100
- Professionalism: 0–100
- Confidence in Communication: 0–100

Requirements:
- Create TypeScript interfaces.
- Keep this module independent.
- Evaluate communication only.
- Do not judge technical correctness.
- Do not detect factual errors.
- Do not generate interview questions.
- No API routes.
- No database.
- No UI.
- Handle short answers gracefully.
- Handle empty answers gracefully.
- Handle spoken-style interview responses naturally.
- Return deterministic structured JSON.

Use the existing project architecture and shared types.

Do not modify unrelated files.

Wait for the next instruction.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

Build only the Confidence Estimator.

Do not build any other modules.

Goal:
Estimate the candidate's confidence level while answering, distinguishing genuine confidence from uncertainty or bluffing. This module evaluates behavioral and linguistic signals only—it does not judge technical correctness.

Responsibilities:
- Estimate overall confidence.
- Detect uncertainty signals.
- Detect hesitation.
- Detect possible bluffing or overconfidence.
- Detect consistency between statements.
- Identify confidence indicators.
- Estimate certainty for each major claim.
- Produce structured JSON only.

Inputs:
- Interview question
- Candidate answer
- Candidate Analyzer output
- Communication Analyzer output

Output JSON:

{
  "overall_confidence_score": 0,
  "confidence_level": "Medium",
  "confidence_indicators": [],
  "uncertainty_indicators": [],
  "hesitation_signals": [],
  "bluffing_probability": 0,
  "overconfidence_probability": 0,
  "consistency_score": 0,
  "claim_confidence": [
    {
      "claim": "",
      "confidence": 0,
      "evidence": ""
    }
  ],
  "language_patterns": {
    "certain_phrases": [],
    "uncertain_phrases": [],
    "hedging_phrases": [],
    "speculative_phrases": []
  },
  "behavioral_summary": "",
  "recommendations": [],
  "metadata": {
    "processing_time_ms": 0,
    "model": ""
  }
}

Scoring Guidelines:
- Overall Confidence Score: 0–100
- Consistency Score: 0–100
- Bluffing Probability: 0–100
- Overconfidence Probability: 0–100

Confidence Levels:
- Very Low
- Low
- Medium
- High
- Very High

Detection Guidelines:
- Look for uncertainty phrases such as "I think", "maybe", "probably", "I'm not sure".
- Look for confident statements supported by consistent explanations.
- Detect contradictions within the answer.
- Detect excessive certainty without supporting reasoning as a possible bluffing signal.
- Separate confidence from technical accuracy—a candidate can be confident and incorrect, or uncertain and correct.

Requirements:
- Create TypeScript interfaces.
- Keep this module independent.
- Do not evaluate technical correctness.
- Do not score grammar or communication quality beyond using Communication Analyzer output as context.
- Do not generate interview questions.
- No API routes.
- No database.
- No UI.
- Handle empty answers gracefully.
- Handle very short answers gracefully.
- Return deterministic structured JSON.

Use the existing project architecture and shared types.

Do not modify unrelated files.

Wait for the next instruction.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

Build only the Rubric Engine.

Do not create any other modules.

Purpose:
Evaluate a candidate's interview performance using structured scoring criteria.

Inputs:
- Candidate Analyzer output
- Technical Accuracy Checker output
- Follow-up Evaluator output
- Session Manager state
- Current question metadata

Responsibilities:
- Calculate Technical Knowledge score (0–100)
- Calculate Communication score (0–100)
- Calculate Confidence score (0–100)
- Calculate Problem Solving score (0–100)
- Calculate Depth of Understanding score (0–100)
- Calculate Accuracy score (0–100)

Use configurable weighted scoring.

Example default weights:
- Technical Knowledge: 35%
- Problem Solving: 20%
- Accuracy: 15%
- Communication: 15%
- Confidence: 10%
- Depth: 5%

Requirements:
- Weight configuration must be externalized.
- Support different interview types (Frontend, Backend, Full Stack, DevOps, AI, etc.).
- Produce deterministic scores.
- Include detailed reasoning for every sub-score.
- Never hallucinate missing evidence.
- Penalize guessing, factual errors, contradictions, and shallow explanations.
- Reward clear reasoning, correctness, examples, and structured thinking.

Output a structured JSON object similar to:

{
  "scores": {
    "technical": 86,
    "communication": 81,
    "confidence": 78,
    "problemSolving": 90,
    "depth": 84,
    "accuracy": 88
  },
  "weightedScore": 85.2,
  "grade": "A",
  "reasoning": {
    "technical": "...",
    "communication": "...",
    "confidence": "...",
    "problemSolving": "...",
    "depth": "...",
    "accuracy": "..."
  }
}

Design the module to be reusable, testable, and independent.

Do not implement Hiring Recommendation.

Do not implement Skill Matrix.

Wait for the next instruction.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

Build only the Skill Matrix Generator.

Do not create any other modules.

Purpose:
Generate a comprehensive competency profile for the candidate based on the entire interview session.

Use existing modules:
- Session Manager
- Topic Selector
- Candidate Analyzer
- Technical Accuracy Checker
- Follow-up Evaluator
- Rubric Engine

Inputs:
- Complete interview session data
- Per-question analysis results
- Rubric Engine scores
- Topic metadata
- Candidate responses

Responsibilities:
- Identify technical strengths
- Identify technical weaknesses
- Measure topic coverage
- Build a competency matrix
- Calculate confidence per skill
- Track performance across all interview topics
- Detect knowledge gaps
- Detect inconsistent understanding across questions
- Highlight areas requiring improvement

Generate a competency profile for each topic including:
- Skill name
- Questions asked
- Questions answered correctly
- Coverage percentage
- Competency score (0–100)
- Confidence score (0–100)
- Strength level
- Improvement priority
- Supporting evidence

Classify skills into:
- Strong
- Good
- Average
- Weak
- Critical Gap

Track interview coverage such as:
- Core concepts covered
- Advanced concepts covered
- Missed concepts
- Follow-up questions triggered
- Unexplored topics
- Total topic completion percentage

Generate a competency matrix similar to:

{
  "overallCoverage": 82,
  "skills": [
    {
      "topic": "JavaScript",
      "competency": 91,
      "confidence": 88,
      "coverage": 95,
      "classification": "Strong",
      "strengths": [
        "...",
        "..."
      ],
      "weaknesses": [
        "..."
      ],
      "missingConcepts": [
        "..."
      ],
      "evidence": [
        "..."
      ]
    }
  ],
  "summary": {
    "strongestSkills": [],
    "weakestSkills": [],
    "criticalGaps": [],
    "recommendedLearningOrder": []
  }
}

Requirements:
- Base every conclusion on interview evidence only.
- Never infer skills that were not evaluated.
- Merge evidence across multiple questions on the same topic.
- Handle repeated questions without duplicating results.
- Support configurable competency thresholds.
- Produce deterministic outputs.
- Keep the module independent and reusable.

Do not implement Hiring Recommendation.

Wait for the next instruction.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

Build only the Hiring Recommendation Engine.

Do not create any other modules.

Purpose:
Generate a final hiring decision using evidence collected throughout the interview.

Use existing modules:
- Session Manager
- Candidate Analyzer
- Technical Accuracy Checker
- Follow-up Evaluator
- Rubric Engine
- Skill Matrix Generator

Inputs:
- Rubric Engine results
- Skill Matrix
- Interview session summary
- Per-question evaluations
- Technical accuracy reports
- Candidate analysis results

Responsibilities:
- Produce a final hiring recommendation.
- Explain the reasoning behind the recommendation.
- Identify major strengths.
- Identify major weaknesses.
- Highlight critical knowledge gaps.
- Assess interview consistency.
- Evaluate role readiness.
- Suggest onboarding or learning priorities when applicable.

Supported recommendations:
- Strong Hire
- Hire
- Lean Hire
- Maybe
- Lean No Hire
- No Hire
- Strong No Hire

Evaluation Criteria:
- Overall weighted score
- Technical competency
- Problem-solving ability
- Communication skills
- Confidence calibration
- Accuracy and correctness
- Breadth of topic coverage
- Depth of understanding
- Consistency across the interview
- Critical skill gaps
- Severity of
<truncated 160 bytes>
mend based on a single score alone.
- A critical skill gap may override an otherwise high overall score.
- Multiple severe factual errors should reduce the recommendation.
- Reward strong reasoning and consistent performance across topics.

Generate structured output similar to:

{
  "recommendation": "Hire",
  "confidence": 0.91,
  "overallScore": 84.7,
  "decisionFactors": {
    "technical": 86,
    "communication": 81,
    "problemSolving": 89,
    "accuracy": 88,
    "coverage": 83
  },
  "strengths": [
    "...",
    "..."
  ],
  "weaknesses": [
    "...",
    "..."
  ],
  "criticalGaps": [
    "..."
  ],
  "reasoning": [
    "...",
    "...",
    "..."
  ],
  "roleReadiness": {
    "currentLevel": "Mid-Level Backend Engineer",
    "estimatedExperience": "2-4 years",
    "readyForProduction": true
  },
  "recommendations": {
    "learningPriorities": [
      "...",
      "..."
    ],
    "interviewSummary": "..."
  }
}

Requirements:
- Every recommendation must be supported by evidence.
- Never hallucinate candidate abilities.
- Never infer knowledge that was not tested.
- Clearly separate observed evidence from inferred conclusions.
- Make the engine modular, deterministic, reusable, and fully testable.
- Support multiple interview types (Frontend, Backend, Full Stack, AI/ML, DevOps, Mobile, etc.).
- Keep business rules configurable.

Do not generate reports or PDFs.
Do not implement analytics dashboards.

Wait for the next instruction.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

# Module 16 — Interview Memory

Build ONLY the Interview Memory module.

Do NOT build any other modules.
Do NOT modify unrelated files.
Wait for the next instruction after completing this module.

## Goal

Create a persistent interview memory layer that allows the interview engine to remember everything important during a single interview session.

## Responsibilities

Implement the following capabilities:

### Previous Questions
- Store every question asked.
- Prevent duplicate questions.
- Support lookup by topic and difficulty.
- Preserve question order.

### Candidate Answers
- Store the candidate's answer for every question.
- Associate answers with question IDs.
- Record timestamps.
- Support retrieval of recent answers.

### Repeated Mistakes
Track recurring mistakes such as:
- Same misconception appearing multiple times
- Repeated syntax errors
- Missing edge cases
- Poor communication patterns
- Weak problem-solving approaches

Expose methods to retrieve:
- Most frequent mistakes
- Mistakes by topic
- Latest mistake
- Mistake frequency

### Interview Context
Maintain interview-level context including:
- Current topic
- Previous topic
- Current difficulty
- Topics completed
- Topics skipped
- Strong topics
- Weak topics
- Follow-up chain
- Candidate confidence trend

### Session Summary Support
Provide APIs to retrieve:
- Complete interview history
- Question history
- Answer history
- Mistake history
- Context snapshot

## Requirements

Design the module to be:
- In-memory for now (no database)
- Strongly typed (TypeScript)
- Easily replaceable with Redis/Postgres later
- Modular and dependency-injected
- Thread-safe for concurrent requests

## Deliverables

Create:
- InterviewMemory interface
- InterviewMemoryService implementation
- Memory models/types
- Utility/helper functions
- Unit-test-friendly architecture

## Constraints

- No LLM code
- No scoring logic
- No prompt generation
- No API routes
- No database
- No persistence beyond runtime

Only build the Interview Memory module.

After completion, stop and wait for the next module.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

# Module 17 — Conversation Context Manager

Build ONLY the Conversation Context Manager module.

Do NOT build any other modules.
Do NOT modify unrelated files.
Wait for the next instruction after completing this module.

## Goal

Create a context management layer that keeps the interview within the LLM's context window while preserving the most relevant information throughout the interview.

This module should work with the existing Interview Memory module and prepare optimized context for future LLM requests.

## Responsibilities

### Context Window Management
Implement logic to:
- Maintain the active conversation context
- Track token usage (estimated)
- Prevent context overflow
- Keep recent conversation prioritized
- Support configurable context size limits

### Conversation Compression
Implement strategies to reduce context size by:
- Summarizing older conversation history
- Removing redundant information
- Merging repetitive interactions
- Preserving important technical discussions
- Preserving candidate reasoning and explanations

The compression strategy should be replaceable with an LLM-powered summarizer in the future.

### Relevant Memory Retrieval
Retrieve the most relevant memories ba
<truncated 213 bytes>
mechanism for memory relevance.

### Context Assembly
Build a final context object containing:
- Recent conversation
- Compressed history
- Relevant memories
- Current interview state
- Candidate profile
- Active topic
- Difficulty level
- Pending follow-up information

### Context Snapshot
Support creation of immutable snapshots that can be:
- Stored
- Restored
- Compared
- Logged
- Debugged

### Token Estimation
Implement approximate token counting for:
- Messages
- Memory
- Summaries
- Final assembled context

The estimator should be easily replaceable with an actual tokenizer later.

## Integration

Use the existing Interview Memory module.

Do not duplicate interview history storage.

This module should consume memory and produce optimized context.

## Deliverables

Create:
- ConversationContext interface
- ConversationContextManager implementation
- Context models/types
- ContextAssembler
- MemoryRetriever
- ConversationCompressor
- TokenEstimator
- ContextSnapshot utilities

## Requirements

Design the module to be:
- Strongly typed (TypeScript)
- Modular
- Dependency-injected
- Easily testable
- Extensible for future vector database integration
- Extensible for future semantic search

## Constraints

Do NOT implement:
- LLM API calls
- Prompt generation
- Embeddings
- Vector database
- Scoring engine
- Database persistence

Only build the Conversation Context Manager module.

After completion, stop and wait for the next module.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

# Module 18 — OpenRouter Client

Build ONLY the OpenRouter Client module.

Do NOT build any other modules.
Do NOT modify unrelated files.
Wait for the next instruction after completing this module.

## Goal

Create a production-ready OpenRouter API client that serves as the single gateway between the interview system and all LLM providers.

The client must be provider-agnostic, resilient, configurable, and reusable throughout the application.

## Responsibilities

### API Wrapper
Implement a reusable client that:
- Sends chat completion requests
- Supports synchronous and streaming responses
- Accepts configurable model names
- Supports system, user, and assistant messages
- Supports temperature, max tokens, top_p, stop sequences, and other common parameters
- Uses environment variables for configuration

### Model Switching
Support dynamic model selection:
- Default model
- Runtime model override
- Automatic fallback model
- Easy addition of new models

Examples:
- OpenAI
- Anthropic
- Google
- DeepSeek
- Qwen
- Mistral
- Meta Llama

The implementation should not be tied to any specific provider.

### Retry Logic
Implement configurable retry behavior:
- Exponential backoff
- Maximum retry attempt
<truncated 342 bytes>
cific responses.

### Streaming Support
Implement streaming using async iterators.

Support:
- Token-by-token streaming
- Stream completion detection
- Stream cancellation
- Error propagation
- Partial response accumulation

### Request Logging
Provide optional logging for:
- Model used
- Latency
- Token estimates
- Retry attempts
- Request ID
- Provider
- Success/failure status

Do not log sensitive prompts or API keys.

### Configuration
Load configuration from environment variables.

Examples:
- OPENROUTER_API_KEY
- OPENROUTER_BASE_URL
- DEFAULT_MODEL
- REQUEST_TIMEOUT
- MAX_RETRIES

Configuration should be injectable for testing.

### Testing Support
Allow dependency injection for:
- HTTP client
- Logger
- Retry strategy
- Time provider
- Configuration provider

Avoid hardcoded implementations.

## Deliverables

Create:
- OpenRouterClient interface
- OpenRouterClient implementation
- Request/Response models
- Streaming utilities
- Retry manager
- Error classes
- Configuration loader
- Logger abstraction
- HTTP abstraction

## Requirements

Design the module to be:
- Strongly typed (TypeScript)
- Provider-agnostic
- Dependency-injected
- Unit-test friendly
- Easily extensible
- Production-ready

## Constraints

Do NOT build:
- Prompt Builder
- Response Parser
- Interview logic
- Scoring engine
- Memory modules
- API routes
- UI components

Only build the OpenRouter Client module.

After completion, stop and wait for the next module.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

# Module 19 — Prompt Builder

Build ONLY the Prompt Builder module.

Do NOT build any other modules.
Do NOT modify unrelated files.
Wait for the next instruction after completing this module.

## Goal

Create a modular Prompt Builder that constructs high-quality prompts for the LLM by combining system instructions, interview context, curriculum data, candidate information, and conversation history.

The Prompt Builder must be reusable, configurable, provider-agnostic, and easy to extend.

## Responsibilities

### System Prompt Builder
Generate the system prompt that defines the LLM's behavior.

The system prompt should include:
- AI interviewer role
- Interview objectives
- Interview rules
- Response format requirements
- Evaluation constraints
- Professional tone
- Difficulty adaptation guidelines
- Safety instructions

Support multiple system prompt templates.

---

### User Prompt Builder

Generate user prompts using:
- Current interview state
- Current question objective
- Candidate's latest answer
- Follow-up requirements
- Topic-specific instructions
- Difficulty level
- Time constraints (if applicable)

Ensure prompts are deterministic and structured.

---

### Context Injection

Inject con
<truncated 1354 bytes>
ore sending.

Check for:
- Missing required fields
- Empty sections
- Duplicate content
- Excessive size
- Invalid placeholders
- Context overflow

Return structured validation errors.

---

### Token Estimation

Estimate prompt size before submission.

Provide:
- Estimated input tokens
- Estimated output tokens
- Total context size
- Remaining token budget

Use the existing TokenEstimator when available.

---

## Integration

Integrate with:
- Interview Memory
- Conversation Context Manager
- Curriculum Loader
- Candidate Analyzer
- Session Manager
- OpenRouter Client interfaces

The Prompt Builder should prepare prompts only.

It must NOT call the LLM.

---

## Deliverables

Create:
- PromptBuilder interface
- PromptBuilderService
- PromptTemplateEngine
- SystemPromptBuilder
- UserPromptBuilder
- ContextInjector
- CurriculumInjector
- CandidateInjector
- PromptValidator
- PromptAssembler
- Prompt models/types
- Utility/helper functions

---

## Requirements

Design the module to be:
- Strongly typed (TypeScript)
- Modular
- Dependency-injected
- Provider-agnostic
- Unit-test friendly
- Easily extensible
- Production-ready

---

## Constraints

Do NOT implement:
- LLM API calls
- Response parsing
- Scoring engine
- Database persistence
- API routes
- UI components
- Interview execution logic

Only build the Prompt Builder module.

After completion, stop and wait for the next module.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

# Module 20 — Response Parser

Build ONLY the Response Parser module.

Do NOT build any other modules.
Do NOT modify unrelated files.
Wait for the next instruction after completing this module.

## Goal

Create a robust Response Parser that safely converts raw LLM responses into strongly typed application objects.

The parser must tolerate malformed outputs, validate structure, recover from common formatting issues, and provide normalized results for downstream modules.

## Responsibilities

### LLM Response Parsing

Parse responses from the OpenRouter Client.

Support:
- JSON responses
- Markdown-wrapped JSON
- Plain text
- Mixed text + JSON
- Streaming responses
- Partial responses

Return a consistent internal representation.

---

### JSON Extraction

Extract JSON from responses that may contain:
- Markdown code blocks
- Extra explanations
- Prefix/suffix text
- Multiple JSON objects
- Nested JSON

Identify the most relevant JSON payload.

---

### Schema Validation

Validate parsed data against predefined schemas.

Support validation for:
- Interview questions
- Follow-up questions
- Candidate feedback
- Evaluation results
- Metadata
- Conversation summaries
- Tool responses (future support)

<truncated 1181 bytes>

Collect parser statistics including:
- Parse duration
- Recovery attempts
- Validation failures
- Successful recoveries
- Response size
- Estimated token count

Expose metrics without affecting parser behavior.

---

### Extensibility

Design the parser so additional response schemas can be added without modifying the core parser.

Use a registry or strategy pattern for parser plugins.

---

## Integration

Integrate with:
- OpenRouter Client
- Prompt Builder
- Interview Memory
- Conversation Context Manager
- Scoring Engine (future)

The parser should consume raw LLM responses and produce validated domain objects.

It must NOT call the LLM.

---

## Deliverables

Create:
- ResponseParser interface
- ResponseParserService
- JsonExtractor
- JsonRepair utility
- SchemaValidator
- ResponseNormalizer
- StreamingResponseParser
- ParserError hierarchy
- ParserMetrics collector
- Response models/types
- Utility/helper functions

---

## Requirements

Design the module to be:
- Strongly typed (TypeScript)
- Modular
- Dependency-injected
- Provider-agnostic
- Unit-test friendly
- Easily extensible
- Production-ready

Use interfaces for all external dependencies.

---

## Constraints

Do NOT implement:
- LLM API calls
- Prompt generation
- Scoring logic
- Database persistence
- API routes
- UI components
- Interview orchestration

Only build the Response Parser module.

After completion, stop and wait for the next module.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

Build the Report Generator module.

Goal:
Generate a structured interview report from all completed interview data.

Responsibilities:
- Generate an overall interview report
- Include candidate information
- Include interview metadata
- Include per-topic results
- Include overall scores
- Include evaluation summary
- List strengths
- List weaknesses
- Include interviewer observations
- Generate a final hiring recommendation

Inputs:
- Interview session
- Candidate profile
- Rubric scores
- Skill matrix
- Question history
- AI evaluations
- Communication metrics

Outputs:
Return a structured report object (JSON), not PDF.

Suggested structure:

report/
 ├── ReportGenerator.ts
 ├── types.ts
 ├── formatter.ts
 ├── summary.ts
 ├── recommendation.ts
 └── index.ts

The report should contain:

1. Candidate Information
   - Name
   - Role
   - Experience
   - Interview date
   - Duration

2. Overall Scores
   - Technical
   - Communication
   - Problem Solving
   - Confidence
   - Overall

3. Topic Breakdown
   - Topic
   - Questions asked
   - Score
   - Accuracy
   - Notes

4. Strengths
   - Bullet list
   - Evidence from interview

5. Weaknesses
   - Bullet list
   - Evidence from interview

6. AI Summary
   - 3–8 paragraph summary
   - Overall interview performance
   - Behavioral observations
   - Technical observations

7. Recommendation
   One of:
   - Strong Hire
   - Hire
   - Borderline
   - No Hire

Requirements:
- Fully typed TypeScript
- No UI
- No PDF generation
- No charts
- Reusable service
- Clean architecture
- Dependency injection where appropriate
- Comprehensive error handling
- Unit-test friendly

Do NOT build:
- Improvement plans
- PDF export
- Email functionality
- Dashboard
- Charts

Only implement the Report Generator module.

Wait for the next instruction.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

Build the Improvement Plan Generator module.

Goal:
Generate a personalized learning and improvement roadmap based on the completed interview report and evaluation results.

Responsibilities:
- Analyze interview performance
- Identify knowledge gaps
- Prioritize weaknesses
- Recommend learning topics
- Suggest learning resources
- Generate a structured improvement roadmap
- Estimate learning duration
- Create actionable next steps

Inputs:
- Report Generator output
- Overall scores
- Skill matrix
- Rubric scores
- Topic-wise evaluations
- Candidate profile
- AI observations

Outputs:
Return a structured improvement plan object (JSON), not PDF.

Suggested structure:

improvement/
├── ImprovementPlanGenerator.ts
├── analyzer.ts
├── roadmap.ts
├── resources.ts
├── priorities.ts
├── milestones.ts
├── recommendations.ts
├── types.ts
└── index.ts

The improvement plan should contain:

1. Performance Overview
   - Overall assessment
   - Current proficiency level
   - Readiness summary

2. Priority Improvements
   For each weakness:
   - Topic
   - Severity
   - Why it matters
   - Expected impact

3. Learning Roadmap
   Organized into phases:
   - Phas
<truncated 61 bytes>
 (Optional)

Each phase should include:
- Topics
- Learning objectives
- Practical exercises
- Mini projects
- Completion criteria

4. Recommended Resources
For each topic include:
- Documentation
- Articles
- YouTube courses
- Books
- Practice platforms
- Coding challenges

5. Practice Plan
- Daily tasks
- Weekly goals
- Revision schedule
- Mock interview recommendations

6. Estimated Timeline
Examples:
- 2 Weeks
- 1 Month
- 2 Months
- 3 Months

Include:
- Estimated hours per week
- Total learning hours

7. Milestones
Examples:
- Finish DSA fundamentals
- Complete SQL practice
- Build REST API
- Solve 100 coding problems
- Complete mock interview

8. Success Metrics
Track measurable improvements such as:
- Topic mastery
- Practice completion
- Mock interview score
- Confidence improvement
- Communication improvement

9. Final Encouragement
Generate a concise motivational summary with practical next steps.

Requirements:
- Fully typed TypeScript
- Clean architecture
- Modular design
- Reusable services
- Dependency injection where appropriate
- Unit-test friendly
- Configurable recommendation rules
- No hardcoded resources where possible
- Support future addition of company-specific roadmaps

Do NOT build:
- PDF export
- Charts
- UI
- Email functionality
- Report generation (reuse existing report)
- External API integrations

Only implement the Improvement Plan Generator module.

Wait for the next instruction.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

Build the PDF Export module.

Goal:
Generate a professional, printable PDF report from the completed interview report and improvement plan.

Responsibilities:
- Generate a polished PDF report
- Format candidate information
- Display interview scores
- Render skill matrix
- Include strengths and weaknesses
- Include AI-generated summary
- Include personalized improvement plan
- Render tables and charts
- Add branding and professional styling
- Export the PDF to file or stream

Inputs:
- Report Generator output
- Improvement Plan output
- Candidate profile
- Interview metadata
- Skill matrix
- Overall scores

Outputs:
Generate a professional PDF document.

Suggested structure:

pdf/
├── PdfExporter.ts
├── ReportTemplate.ts
├── ChartGenerator.ts
├── TableRenderer.ts
├── Theme.ts
├── Assets.ts
├── types.ts
└── index.ts

Suggested PDF sections:

1. Cover Page
- Company logo (optional)
- AI Interview Assessment
- Candidate name
- Position
- Interview date
- Report generation date

2. Candidate Overview
- Name
- Role
- Experience
- Interview duration
- Topics covered

3. Executive Summary
- Overall performance
- AI summary
- Hiring recommendation

4. Overall 
<truncated 337 bytes>
akness level
- Competency indicators
- Skill ratings

7. Strengths
- Bullet list
- Supporting evidence

8. Weaknesses
- Bullet list
- Supporting evidence

9. Improvement Plan
Include:
- Priority topics
- Learning roadmap
- Recommended resources
- Estimated timeline
- Milestones

10. Charts
Generate visualizations such as:
- Bar chart
- Radar chart
- Score comparison
- Topic performance chart

Charts should be optional and configurable.

11. Final Recommendation
One of:
- Strong Hire
- Hire
- Borderline
- No Hire

Include AI reasoning.

12. Footer
- Generated by AI Interview Agent
- Timestamp
- Page numbers
- Version information

Requirements:
- Fully typed TypeScript
- Modular architecture
- Reusable templates
- Configurable themes
- Support light and dark themes
- Support company branding
- Configurable page size (A4 by default)
- High-resolution PDF output
- Embed fonts and icons where applicable
- Professional spacing and typography
- Export to:
  - File
  - Buffer
  - Readable stream

Suggested libraries (choose one):
- pdf-lib
- PDFKit
- Puppeteer (HTML-to-PDF)
- React PDF

The implementation should abstract the PDF engine behind an interface to allow swapping libraries later.

Do NOT build:
- Report generation (reuse Module 21)
- Improvement plan generation (reuse Module 22)
- Email sending
- Dashboard
- Storage uploads
- Printing service integrations

Only implement the PDF Export module.

Wait for the next instruction.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

# Module 24 — Interview API

You are building ONLY the Interview API module for the AI Interview Agent.

Do NOT create any other modules.
Do NOT modify unrelated files.
Use the existing project architecture and previously created modules.
If a required module does not exist yet, define clear interfaces only and assume it will be implemented later.

## Goal

Create REST API endpoints for managing an interview session.

## Responsibilities

Implement the following endpoints:

### POST /api/interview/start
- Create a new interview session
- Accept:
  - candidateId
  - role
  - difficulty
  - interviewType
- Initialize interview state
- Return:
  - sessionId
  - firstQuestion
  - metadata

---

### POST /api/interview/:sessionId/next
- Return the next interview question
- Use the existing Topic Selector and Question Generator
- Maintain interview context
- Handle end-of-interview conditions

---

### POST /api/interview/:sessionId/answer
- Accept:
  - answer
  - timestamp
  - optional audio metadata
- Validate input
- Pass answer to Candidate Analyzer
- Store response using Interview Memory
- Return:
  - evaluation summary
  - score
  - follow-up required (boolean)

---

### POST /api/interview/:sessionId/end
- Finalize interview
- Save interview state
- Trigger Report Generator
- Return:
  - interview summary
  - reportId
  - overall score

---

## Error Handling

Return proper HTTP status codes:

- 200 Success
- 201 Created
- 400 Invalid request
- 404 Session not found
- 500 Internal server error

Use a consistent JSON response format.

---

## Validation

Validate:
- Missing fields
- Invalid session IDs
- Empty answers
- Invalid interview state

---

## Output

Create only the files required for this module.

Typical structure:

server/
└── routes/
    └── interview.routes.ts

server/
└── controllers/
    └── interview.controller.ts

server/
└── services/
    └── interviewApi.service.ts

Do not generate any report APIs.
Do not generate authentication.
Do not generate unrelated endpoints.

After completing this module, stop and wait for the next instruction.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

# Module 25 — Report API

You are building ONLY the Report API module for the AI Interview Agent.

Do NOT create any other modules.
Do NOT modify unrelated files.
Use the existing project architecture and previously created modules.
If a required module does not exist yet, define clear interfaces only and assume it will be implemented later.

## Goal

Create REST API endpoints for retrieving interview reports, downloading reports, and viewing interview history.

## Responsibilities

Implement the following endpoints:

### GET /api/reports/:reportId
- Fetch a complete interview report
- Return:
  - reportId
  - candidate information
  - interview metadata
  - overall score
  - section-wise scores
  - strengths
  - weaknesses
  - summary
  - improvement plan
  - generatedAt

---

### GET /api/reports/:reportId/pdf
- Generate or retrieve the PDF version of the report
- Return downloadable PDF
- Set proper headers
- Handle missing reports gracefully

---

### GET /api/reports/history/:candidateId
- Return interview history for a candidate
- Include:
  - reportId
  - interview date
  - role
  - difficulty
  - interview type
  - overall score
- Support:
  - pagination
  - sorting
  - optional date filtering

---

## Validation

Validate:
- Invalid report IDs
- Invalid candidate IDs
- Missing resources
- Pagination parameters
- Date filters

---

## Error Handling

Return proper HTTP status codes:

- 200 Success
- 400 Invalid request
- 404 Report not found
- 500 Internal server error

Use a consistent JSON response format across all endpoints.

---

## Integration

Use existing modules where applicable:

- Report Generator
- Improvement Plan Generator
- PDF Generator
- Interview Memory
- Session Manager

If these modules are unavailable, create interface contracts only.

---

## Output

Create only the files required for this module.

Typical structure:

server/
├── routes/
│   └── report.routes.ts
│
├── controllers/
│   └── report.controller.ts
│
├── services/
│   └── reportApi.service.ts
│
├── utils/
│   └── pdfGenerator.ts
│
└── types/
    └── report.types.ts

Do not implement authentication.
Do not create dashboard endpoints.
Do not modify unrelated modules.

After completing this module, stop and wait for the next instruction.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

Build the WebSocket Manager for the AI Interview Agent.

Responsibilities:
- Manage WebSocket connections for live interview sessions.
- Stream interview questions to the frontend in real time.
- Stream live feedback, progress updates, and interview status.
- Handle connection lifecycle (connect, disconnect, reconnect).
- Support multiple concurrent interview sessions.
- Broadcast messages only to the correct session/client.
- Provide a clean API for other modules to send events.
- Implement heartbeat/ping-pong to detect stale connections.
- Handle errors and unexpected disconnects gracefully.
- Keep business logic separate from WebSocket transport logic.

Requirements:
- Follow the existing project architecture.
- Use dependency injection where appropriate.
- Write clean, modular, production-ready code.
- Add comprehensive type hints and documentation.
- Do not modify unrelated files.
- Do not build Authentication or Database Layer yet.
- Wait for the next instruction after completing this module.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

Build the Authentication module for the AI Interview Agent.

Responsibilities:
- Implement secure user login.
- Generate and validate JWT access tokens.
- Validate user sessions for protected endpoints.
- Support authenticated access for candidates and interview sessions.
- Provide middleware/dependencies for route protection.
- Handle token expiration and invalid tokens gracefully.
- Hash and verify passwords securely.
- Keep authentication logic separate from business logic.
- Prepare the module for future support of refresh tokens and OAuth without implementing them now.

Requirements:
- Follow the existing project architecture.
- Use dependency injection where appropriate.
- Write clean, modular, production-ready code.
- Add comprehensive type hints and documentation.
- Do not modify unrelated files.
- Do not implement the Database Layer yet.
- Do not implement frontend authentication UI.
- Wait for the next instruction after completing this module.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

Build the Database Layer for the AI Interview Agent.

Responsibilities:
- Implement the Repository Pattern for all database access.
- Create repositories for:
  - Interview Sessions
  - Interview Reports
  - Candidate Profiles
- Support CRUD operations for each repository.
- Separate database models from business logic.
- Provide transaction support where appropriate.
- Implement connection/session management.
- Handle database errors gracefully.
- Make the layer database-agnostic so different database engines can be swapped with minimal changes.
- Provide clean interfaces that other modules can consume without direct database access.

Requirements:
- Follow the existing project architecture.
- Use dependency injection where appropriate.
- Write clean, modular, production-ready code.
- Add comprehensive type hints and documentation.
- Do not modify unrelated files.
- Do not implement API endpoints or business logic in this module.
- Wait for the next instruction after completing this module.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

You are building Module 29 of an AI Interview Agent.

Module Name:
Configuration Manager

Objective:
Create a centralized configuration system for the entire application.

Responsibilities:
- Load environment variables
- Validate required configuration
- Support multiple environments (development, staging, production)
- Centralize model configuration
- Centralize API configuration
- Support feature flags
- Prevent hardcoded secrets
- Expose typed configuration throughout the application

Requirements:
- Use the existing project architecture.
- Do NOT modify unrelated modules.
- Create only the files required for this module.
- Use environment variables for all secrets and API keys.
- Validate missing or invalid configuration during application startup.
- Provide sensible default values where appropriate.
- Support enabling/disabling features using feature flags.
- Separate configuration into logical sections such as:
  - Application
  - AI Models
  - Database
  - Authentication
  - Logging
  - Monitoring
  - External APIs
- Ensure configuration can easily support multiple AI providers in the future.

Deliverables:
- Configuration manager
- Environment loader
- Validation utilities
- Feature flag manager
- Model configuration
- Documentation/comments for integration

Constraints:
- Do not build any other module.
- Do not modify unrelated files.
- Wait after completing this module.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

You are building Module 30 of an AI Interview Agent.

Module Name:
Error Handler

Objective:
Build a centralized error handling system that provides consistent, secure, and user-friendly error management across the entire application.

Responsibilities:
- Global exception handling
- Structured error responses
- Logging integration
- Recovery mechanisms
- User-friendly error messages
- Error categorization
- Support for API, LLM, database, authentication, and validation errors

Requirements:
- Use the existing project architecture.
- Do NOT modify unrelated modules.
- Create only the files required for this module.
- Integrate with the Configuration Manager from Module 29.
- Ensure all errors are handled through a centralized pipeline.
- Never expose stack traces, secrets, API keys, or internal implementation details to end users.
- Generate structured logs for every error.
- Support different logging levels (INFO, WARNING, ERROR, CRITICAL).
- Include correlation/request IDs where available.
- Implement graceful recovery for recoverable errors.
- Return consistent API error responses.
- Handle asynchronous errors correctly.
- Support custom exception classes.

The error system should support categories including:
- Validation errors
- Authentication/Authorization errors
- Database errors
- AI/LLM provider errors
- Network/Timeout errors
- External API failures
- File handling errors
- Configuration errors
- Rate limiting errors
- Internal server errors

Features:
- Global exception middleware
- Custom exception hierarchy
- Error serializer
- Error response formatter
- Logging hooks
- Retry support for transient failures
- Recovery utilities
- Safe fallback messages
- Error code mapping
- Optional debug mode controlled by configuration

Deliverables:
- Global error handler
- Exception classes
- Error middleware
- Response formatter
- Logging integration
- Recovery utilities
- Error documentation/comments for integration

Constraints:
- Do not build any other module.
- Do not modify unrelated files.
- Wait after completing this module.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

You are building Module 31 of an AI Interview Agent.

Module Name:
Monitoring & Metrics

Objective:
Build a centralized monitoring and observability system that collects application, API, AI model, and infrastructure metrics for production environments.

Responsibilities:
- API metrics
- LLM latency tracking
- Token usage tracking
- Error monitoring
- Request monitoring
- Performance metrics
- Health monitoring
- Resource usage
- Observability hooks

Requirements:
- Use the existing project architecture.
- Do NOT modify unrelated modules.
- Create only the files required for this module.
- Integrate with:
  - Configuration Manager (Module 29)
  - Error Handler (Module 30)
- Ensure monitoring can be enabled or disabled through configuration.
- Keep monitoring asynchronous and lightweight to minimize performance overhead.
- Design the module so it can later integrate with services like Prometheus, Grafana, OpenTelemetry, Datadog, New Relic, or CloudWatch.

The monitoring system should collect:

Application Metrics
- Total requests
- Active requests
- Request duration
- API throughput
- Endpoint usage
- Success/failure rates
- Concurrent sessions

LLM Metrics
- Model name
- Provider
- Prompt tokens
- C
<truncated 41 bytes>
ed cost
- Response latency
- Retry count
- Streaming duration
- Cache hits/misses

Interview Metrics
- Interviews started
- Interviews completed
- Average interview duration
- Question generation time
- Answer evaluation time
- Report generation time

Performance Metrics
- CPU usage
- Memory usage
- Disk usage
- Network latency
- Queue sizes
- Worker utilization

Error Metrics
- Error count
- Error categories
- Exception frequency
- Failed API calls
- Failed LLM requests
- Database failures
- Authentication failures
- Rate limit events

Health Monitoring
- Application health
- Database connectivity
- AI provider availability
- Cache availability
- Storage availability
- External API status

Features
- Metrics collector
- Metrics registry
- Timers
- Counters
- Histograms
- Gauges
- Health checks
- Middleware for automatic request metrics
- Request correlation IDs
- Background metric aggregation
- Export-ready architecture

Logging
- Integrate with the Error Handler.
- Record latency for important operations.
- Track slow requests.
- Track failed requests.
- Generate structured metric events.

Deliverables
- Monitoring manager
- Metrics collector
- Metrics registry
- Health check service
- Request monitoring middleware
- LLM metrics tracker
- Token usage tracker
- Performance monitoring utilities
- Documentation/comments for integration

Constraints
- Do not build any other module.
- Do not modify unrelated files.
- Wait after completing this module.
```

---

### Model: Gemini 3

**Prompt:**
```text
Project Documentation Rules

Before writing any code:

1. Read:
   - README.md
   - ARCHITECTURE.md
   - TASKS.md

2. Treat these documents as the project's single source of truth.

3. Follow the documented architecture, folder structure, naming conventions, and implementation guidelines.

4. Do NOT recreate, replace, or rewrite these files.

5. Only update the relevant sections if your module introduces new information.

After completing the module:

- Update README.md only if setup or usage changes.
- Update ARCHITECTURE.md only with details related to the module you implemented.
- Update TASKS.md by marking completed tasks and adding any new subtasks discovered during implementation.

Do not modify unrelated documentation.

Stop after completing the assigned module and wait for the next instruction.

Build the Main InterviewEngine orchestrator.

Objective:
Integrate all previously built modules into one complete interview pipeline. Do NOT rewrite existing modules. Only connect them through clean interfaces and dependency injection.

Responsibilities:
- Initialize all required services
- Start a new interview session
- Load candidate profile
- Load curriculum/job role configuration
- Select the first interview topic
- Request Question Generator to create a question
- Send the question to the user/client
- Receive and validate the candidate's answer
- Pass the answer to Candidate Analyzer
- Pass analysis results to Scoring Engine
- Determine whether a follow-up question is needed
- If follow-up is required:
    - Generate contextual follow-up
    - Continue the interview loop
- Otherwise:
    - Move to the next topic
- Continue until interview completion criteria are met
- Trigger Report Generator
- Store interview history through Database Layer
- Notify Monitoring & Metrics module
- End the session cleanly

The InterviewEngine should coordinate these existing modules:

- Session Manager
- Candidate Manager
- Curriculum Loader
- Topic Selector
- Question Generator
- Follow-up Generator
- Answer Va
<truncated 175 bytes>
rics
- Configuration Manager
- Error Handler

Requirements:
- Use dependency injection.
- Keep business logic inside existing modules.
- InterviewEngine should only orchestrate workflow.
- No duplicated logic.
- Support asynchronous execution.
- Support graceful error recovery through Error Handler.
- Log important events through Monitoring & Metrics.
- Be modular and easy to extend.

Expected workflow:

Start Interview
↓
Initialize Services
↓
Create Session
↓
Load Candidate
↓
Load Curriculum
↓
Initialize Interview Context
↓
Select Topic
↓
Generate Question
↓
Send Question
↓
Receive Answer
↓
Validate Answer
↓
Analyze Answer
↓
Calculate Score
↓
Update Candidate State
↓
Determine Follow-up
      ├── Yes â†’ Generate Follow-up â†’ Ask â†’ Receive Answer â†’ Analyze
      └── No
↓
Check Remaining Topics
      ├── Yes â†’ Select Next Topic
      └── No
↓
Generate Final Report
↓
Save Interview Data
↓
Close Session
↓
Return Final Results

Deliverables:
1. InterviewEngine class
2. Clean interfaces between modules
3. Dependency Injection setup
4. Interview lifecycle management
5. Async orchestration flow
6. Sequence diagram (Markdown)
7. Example execution flow
8. Folder structure updates (if required)

Do NOT modify unrelated modules.
Do NOT create duplicate implementations.
Only integrate the existing architecture.

Wait for the next instruction after completing the InterviewEngine.
```

---

### Model: Gemini 3

**Prompt:**
```text
now write a detailed report on what has built fully, what has to be added, what has done fully in this chat
```

---

### Model: Gemini 3

**Prompt:**
```text
You are a Senior Staff Backend Engineer.

We have already completed all backend modules for an AI Interview Agent using Clean Architecture and Dependency Injection.

DO NOT rewrite existing modules.

DO NOT change existing business logic.

Your job is ONLY to integrate everything into one runnable backend.

---------------------------------------------------
GOAL
---------------------------------------------------

Create the application entry point.

When I run

npm run dev

the server should start successfully.

---------------------------------------------------
TASKS
---------------------------------------------------

1. Create server.ts

Responsibilities:

- Load environment variables
- Initialize configuration
- Create Express app
- Register middleware
- Register routes
- Register global error middleware
- Start HTTP server
- Attach WebSocket server
- Print startup logs

Example startup:

==================================
AI Interview Agent
Environment: Development
Port: 5000
HTTP Ready
WebSocket Ready
==================================

---------------------------------------------------

2. Dependency Injection

Create one dependency container.

Register ALL modules.

For example:

ConfigurationManager

Logger

ErrorHandler

MonitoringService

SessionManager

CandidateManager

CurriculumManager

TopicSelector

DifficultyManager

QuestionGenerator

HintGenerator

ResponseAnalyzer

EvaluationEngine

ScoringEngine

FeedbackGenerator

InterviewStateManager

QuestionHistory

TimeManager

PromptBuilder

LLMProvider

EmbeddingProvider

CacheManager

RateLimiter

StorageRepository

TranscriptService

AudioService

RealtimeGateway

NotificationService

AuthenticationService

AuthorizationService

AnalyticsService

InterviewEngine

Do NOT recreate implementations.

Only register them.

---------------------------------------------------

3. Build InterviewEngine

Inject every dependency through constructor.

The engine should expose methods:

startInterview()

submitAnswer()

nextQuestion()

endInt
<truncated 1618 bytes>
Error

AuthenticationError

RateLimitError

LLMError

DatabaseError

UnknownError

Return proper HTTP status codes.

---------------------------------------------------

11. Project Structure

Output the final structure.

Example

src/

server.ts

app.ts

container.ts

routes/

controllers/

middleware/

websocket/

config/

---------------------------------------------------

12. Package.json

Verify required packages.

express

socket.io

cors

helmet

compression

dotenv

tsyringe (or inversify)

reflect-metadata

morgan

uuid

zod

express-rate-limit

typescript

ts-node-dev

---------------------------------------------------

13. Testing

Generate a Postman collection that tests:

1.
POST
/api/interview/start

↓

Receive sessionId

↓

2.
POST
/api/interview/answer

↓

Receive score

↓

3.
GET
/api/interview/{id}

↓

Receive interview state

↓

4.
POST
/api/interview/end

↓

Receive summary

---------------------------------------------------

14. Acceptance Criteria

Running

npm run dev

should show

====================================

AI Interview Agent Started

Express Ready

Socket Ready

Database Connected

Redis Connected

Configuration Loaded

====================================

Then Postman should successfully complete:

Start Interview

↓

Generate Question

↓

Submit Answer

↓

Receive Score

↓

Finish Interview

No placeholder code.

No TODOs.

Only integrate existing modules.
```

---

### Model: Gemini 3

**Prompt:**
```text
Your plan is solid and follows good software architecture principles. Here's how I'd answer the two open questions.

1. Manual Composition Root vs. tsyringe

Yes—a manual composition root is the right approach if your existing modules weren't designed with @injectable() and constructor injection metadata.

A manual container.ts that:

Instantiates dependencies in the correct order
Wires them together
Exports singleton instances
Creates the InterviewEngine

is a standard and production-quality pattern. In fact, many large systems intentionally avoid runtime DI frameworks and use manual composition for better type safety and startup performance.

So your container.ts can look conceptually like:

// Infrastructure
const config = new ConfigurationManager();
const logger = new Logger(config);
const cache = new CacheManager(config);
const repository = new StorageRepository(config);

// Domain services
const sessionManager = new SessionManager(repository);
const topicSelector = new TopicSelector();
const questionGenerator = new QuestionGenerator(...);

// Application
const interviewEngine = new InterviewEngine({
  sessionManager,
  topicSelector,
  questionGenerator,
  ...
});

export {
  interviewEngine,
  logger,
  config,
};

No decorators are required.

2. Missing Modules

Do not create fake or mock services just to satisfy the list.

Instead:

Wire only the modules that actually exist.
If another module expects a dependency that hasn't been implemented, create a minimal interface-compatible placeholder that throws a clear "Not Implemented" error if invoked, rather than pretending to implement functionality.

For example:

export class AudioService {
  process() {
    throw new Error("AudioService is not implemented.");
  }
}

Only do this if it's required to satisfy compilation. Otherwise, don't introduce unused services.

The goal is:

No fake business logic
No unnecessary modules
Only enough placeholders to allow the application to compile and run
Additional Recommendation

Before integrating everything, create this dependency graph:

server.ts
    │
    ▼
app.ts
    │
    ▼
container.ts
    │
    ▼
InterviewEngine
    │
    ├── SessionManager
    ├── CandidateManager
    ├── CurriculumManager
    ├── TopicSelector
    ├── DifficultyManager
    ├── QuestionGenerator
    ├── ResponseAnalyzer
    ├── EvaluationEngine
    ├── ScoringEngine
    ├── FeedbackGenerator
    ├── ...

This helps ensure there are no circular dependencies before wiring the application together.
```

---

### Model: Gemini 3

**Prompt:**
```text
how can i check thw working of backend
```

---

### Model: Gemini 3

**Prompt:**
```text
You are a Senior Backend Architect specializing in Clean Architecture, Domain-Driven Design, PostgreSQL, and Prisma ORM.

PROJECT CONTEXT

I have already built an AI Interview Agent backend consisting of 31+ modules.

Current Status:
- Phase 12 completed.
- Backend is fully integrated.
- Express server runs successfully.
- InterviewEngine works.
- REST APIs work.
- WebSockets work.
- Dependency Injection is already configured.

Currently, persistence is implemented using in-memory Maps.

DO NOT change business logic.

DO NOT rewrite modules.

DO NOT change service APIs.

DO NOT change repository interfaces.

Your ONLY task is replacing the storage layer.

==================================================
GOAL
==================================================

Replace every Map-based repository with PostgreSQL using Prisma ORM.

Repository interfaces MUST remain identical so no application or domain code changes are required.

Only repository implementations should change.

==================================================
DATABASE
==================================================

Use PostgreSQL.

Use Prisma ORM.

Create:

prisma/

    schema.prisma

Generate Prisma Client.

==================================================
TABLES
==================================================

Create proper normalized tables for:

Users

Candidates

Interviews

Questions

Answers

Scores

Reports

Sessions

Analytics

Use UUID primary keys.

Add createdAt and updatedAt timestamps where appropriate.

Use foreign keys with referential integrity.

==================================================
SUGGESTED RELATIONS
==================================================

Users
    id
    name
    email

Candidates
    id
    userId

Interviews
    id
    candidateId
    status
    startedAt
    endedAt

Questions
    id
    interviewId
    topic
    difficulty
    question

Answers
    id
    interviewId
    questionId
    answer
    submittedAt

Scores
    id
    interviewId
    questionId
    score
    feedba
<truncated 2095 bytes>
========================

Use

Indexes

Foreign keys

Unique constraints

Pagination support

==================================================
TESTING
==================================================

Generate tests verifying

Create interview

Read interview

Save answer

Save score

Generate report

Delete interview

==================================================
DELIVERABLES
==================================================

Generate:

✓ prisma/schema.prisma

✓ migrations

✓ seed.ts

✓ PrismaClient singleton

✓ Repository implementations

✓ Updated container.ts

✓ Updated package.json

✓ Updated .env.example

✓ Migration commands

✓ Seed commands

✓ Project folder tree

==================================================
IMPORTANT CONSTRAINTS
==================================================

DO NOT modify

InterviewEngine

Services

Controllers

Routes

Business logic

Repository interfaces

DTOs

Events

Only replace persistence.

The application should continue to work exactly as before.

After completion, running:

npm install
npx prisma generate
npx prisma migrate dev
npm run dev

should produce:

====================================
AI Interview Agent Started
Express Ready
Socket Ready
Database Connected
Redis Connected
Configuration Loaded
====================================

All existing Postman tests must pass without modification.

Provide complete production-ready code with no TODOs, no placeholders, and no mocked database logic.
```

---

### Model: Gemini 3

**Prompt:**
```text
Yes. That is exactly the approach I would recommend.

Your plan preserves Clean Architecture because the InterviewEngine continues to work with domain objects rather than Prisma models.

Answer to the Open Question

Yes — use include({ user: true }) (or an equivalent join) inside the repository and map the result back to the existing ICandidateProfile.

For example:

const candidate = await prisma.candidate.findUnique({
  where: { id },
  include: {
    user: true
  }
});

if (!candidate) return null;

return {
  id: candidate.id,
  name: candidate.user.name,
  email: candidate.user.email,
  role: candidate.role,
  experienceLevel: candidate.experienceLevel
};

The repository is the correct place for this transformation because:

Prisma schema ≠ Domain model
Database normalization should not leak into business logic
The repository acts as an anti-corruption layer between persistence and the domain
One Recommendation

I would make one architectural improvement before implementing.

Instead of only three repositories:

CandidateProfileRepository
InterviewSessionRepository
InterviewReportRepository

split persistence into repositories that mirror the aggregate roots.

For example:

UserRepository

CandidateRepository

InterviewRepository

QuestionRepository

AnswerRepository

ScoreRepository

ReportRepository

SessionRepository

AnalyticsRepository

Then your existing repositories can orchestrate these internally if necessary.

Benefits:

Smaller repository classes
Better separation of concerns
Easier testing
Easier future expansion
Better Prisma queries
Also Add These Tables

Since you're replacing the database completely, I'd recommend slightly expanding the schema to avoid another migration later.

Interview
id
candidateId
status
currentQuestionIndex
currentTopic
difficulty
startedAt
endedAt
createdAt
updatedAt
Question
id
interviewId
topic
difficulty
question
order
createdAt
Answer
id
questionId
interviewId
answer
latency
tokensUsed
submittedAt
Score
id
answerId
questionId
score
feedback
rubric
createdAt

This keeps answers and scores independently queryable.

Report

Instead of only

summary
overallScore

I'd store

summary

strengths JSON

weaknesses JSON

recommendations JSON

overallScore

generatedAt

This supports richer reporting without schema changes.

Add Indexes

I would also explicitly define indexes for frequently queried fields.

@@index([candidateId])

@@index([interviewId])

@@index([status])

@@index([startedAt])

@@unique([email])

This will make interview lookups and reporting much faster.

Transactions

Wrap the following operations in Prisma transactions:

Start Interview
Create Interview
Create Session
Submit Answer
Save Answer
Save Score
Update Interview
End Interview
Update Interview
Create Report
Save Analytics

This ensures consistency if any step fails.

Overall Assessment

I'd rate the plan:

Architecture: 10/10
Clean Architecture compliance: 10/10
Prisma integration: 10/10
Repository abstraction: 10/10
Migration safety: 10/10

With the repository mapping approach you described, the InterviewEngine, services, controllers, and API layer remain completely unaware of Prisma, which is exactly the outcome you want for a maintainable and testable architecture.
```

---

### Model: Gemini 3

**Prompt:**
```text
run it
```

---

### Model: Gemini 3

**Prompt:**
```text
try again
```

---

### Model: Gemini 3

**Prompt:**
```text
password is 1122
```

---

### Model: Gemini 3

**Prompt:**
```text
postman working
```

---

### Model: Gemini 3

**Prompt:**
```text
okay next buuild the frontend, no fancy ui/ux, create a simple text ui for only thw working purpose
```

---

### Model: Gemini 3

**Prompt:**
```text
Comments on artifact URI: file:///c%3A/Users/shrik/.gemini/antigravity-ide/brain/c55402fe-638f-430c-8232-855b8c8a4bb1/implementation_plan.md

The user has approved this document.
```

---

### Model: Gemini 3

**Prompt:**
```text
Starting interview...
[ERROR] SessionManager.createSession is not implemented.
```

---

### Model: Gemini 3

**Prompt:**
```text
Comments on artifact URI: file:///c%3A/Users/shrik/.gemini/antigravity-ide/brain/c55402fe-638f-430c-8232-855b8c8a4bb1/implementation_plan.md

The user has approved this document.
```

---

### Model: Gemini 3

**Prompt:**
```text
[ERROR] io is not defined
```

---

### Model: Gemini 3

**Prompt:**
```text
Starting interview...
[SYSTEM] Session ID: 7f294497-5995-44d0-86ec-cb9ffb47528e
[AI] Initial interview setup complete. Connecting...
[ERROR] io is not defined
Starting interview...
[SYSTEM] Session ID: 53cec51d-fcdb-46e7-84bd-0defce316170
[AI] Initial interview setup complete. Connecting...
[ERROR] io is not defined
```

---

### Model: Gemini 3

**Prompt:**
```text
Starting interview...
[SYSTEM] Session ID: f3e0d9dd-eb87-45a5-b8a9-24e5ae32bb05
[AI] Initial interview setup complete. Connecting...
[SYSTEM] WebSocket Connected
[YOU] hi
[ERROR] Not currently waiting for an answer
```

---

### Model: Gemini 3

**Prompt:**
```text
@[../PROJECTS/curriculum.json] use this for topics
```

---

### Model: Gemini 3

**Prompt:**
```text
sk-or-v1-[REDACTED]

use this openrouter api
```

---

### Model: Gemini 3

**Prompt:**
```text
this is coming
```

---

### Model: Gemini 3

**Prompt:**
```text
how many questions will the ai ask?
```

---

### Model: Gemini 3

**Prompt:**
```text
You are acting as the Lead Technical Architect for this project.

Analyze the ENTIRE codebase and provide a comprehensive Project Status Report.

Do NOT modify any files.
Do NOT generate new code.
Only inspect and report.

Your report must include the following sections:

# 1. Executive Summary
- Current project completion percentage
- Overall health (Excellent / Good / Moderate / Poor)
- Is the architecture consistent?
- Is the project runnable today?

# 2. Folder Structure
Display the complete project tree.

# 3. Modules Analysis

For every module/component include:

- Module Name
- Purpose
- Current Status
  - ✅ Complete
  - 🟡 Partial
  - âŒ Missing
- Files involved
- Dependencies
- Public interfaces
- Issues found
- Suggested improvements

# 4. Clean Architecture Review

Check whether the project correctly follows:

- Domain Layer
- Application Layer
- Infrastructure Layer
- Presentation/API Layer
- Dependency Injection
- SOLID Principles
- Repository Pattern
- Interface Segregation

Report every violation.

# 5. Backend Progress

Analyze:

- API endpoints
- Controllers
- Services
- Repositories
- Database integration
- Prisma
- PostgreSQL
- Validation
- Authentication (if present)
- Error handling
- Logging
- Middleware

Mark each as:

✅ Complete
🟡 Partial
âŒ Missing

# 6. Interview Engine Analysis

Inspect:

- Session Manager
- Candidate Profile
- Curriculum Manager
- Topic Selector
- Difficulty Engine
- Question Generator
- Evaluation Engine
- Hint Engine
- Adaptive Question Flow
- Report Generator
- Feedback Generator

For each module provide:

Purpose
Current implementation
Missing features
Integration status

# 7. AI Integration

Analyze:

LLM providers
Prompt templates
AI services
Evaluation prompts
Question generation prompts
Retry logic
Streaming support
Token handling

# 8. Database Status

Inspect:

Schema
Relations
Indexes
Repositories
Migration status
Prisma Client
Transactions
Performance concerns

# 9. API Status

Generate a table:

Endpoint
Method
Purpose
Implemented
<truncated 451 bytes>
on
Authorization
File upload safety

# 13. Performance Review

Analyze:

Database queries
Memory usage
Caching
Concurrency
Async handling
Potential bottlenecks

# 14. Missing Features

List every missing feature required for a production-ready AI Interview Agent.

Group into:

Critical
Important
Optional

# 15. Integration Status

Verify whether all modules are actually connected.

Generate a dependency graph showing:

API
↓
Interview Engine
↓
Services
↓
Repositories
↓
Database
↓
AI Services

Highlight broken links.

# 16. Production Readiness Score

Rate:

Architecture
Maintainability
Scalability
Reliability
Security
Performance
Testing
Documentation

Give a score out of 10 for each.

# 17. Technical Debt

List:

Short-term issues
Long-term issues
Refactoring opportunities
Risk level

# 18. Next Steps Roadmap

Generate the remaining work in execution order.

For each task include:

Priority
Estimated effort
Dependencies
Files affected

# 19. Final Verdict

Answer:

Can this project be deployed today?

If not:

- Why not?
- What blockers remain?
- Estimated completion percentage
- Top 10 tasks remaining

# 20. Confidence Assessment

State:

- Confidence in the analysis
- Files successfully analyzed
- Files skipped
- Any assumptions made

IMPORTANT:
- Base the report only on the existing codebase.
- Do not guess implementation details.
- If something is missing, explicitly state it.
- Cite the relevant files for every conclusion.
- Present the report in well-formatted Markdown with tables where appropriate.
```

---

### Model: Gemini 3

**Prompt:**
```text
# Phase 1 — Critical Production Fixes

You are working on the AI Interview Agent backend.

The project follows **Clean Architecture**, **Dependency Injection**, **TypeScript**, **Express**, **Prisma**, and **PostgreSQL**.

## Rules

* Do NOT break existing architecture.
* Maintain Clean Architecture boundaries.
* Do NOT introduce shortcuts.
* Do NOT rewrite unrelated modules.
* Preserve existing repository interfaces whenever possible.
* Produce production-ready code.
* Keep all code strongly typed.
* Explain every architectural change before implementing it.
* After each completed task, stop and summarize what changed.

---

# Task 1 — Fix Interview Report Foreign Key Bug

## Current Problem

The interview crashes when finishing.

Root cause:

`InterviewReport` is currently being created using:

```
sessionId
```

instead of

```
interviewId
```

which violates the database foreign key constraint.

## Goal

Trace the interview completion flow from beginning to end.

Identify:

* where interview records are created
* where interview IDs are generated
* where reports are saved

Then:

* retrieve the correct `interviewId`
* propagate it through the application layers
* pass it into the report repository
* ensure InterviewReport references Interview.id
* remove every place where `sessionId` is incorrectly used as a foreign key

Validate:

* interview completes successfully
* report saves successfully
* no Prisma foreign key errors occur

Do not duplicate IDs.

---

# Task 2 — Replace In-Memory State with Redis

The application currently stores runtime interview state using:

```
topicStateMap
historyMap
```

These are in-memory Maps.

They must be completely removed.

## Replace them with Redis.

Create a dedicated infrastructure service.

Example:

```
RedisInterviewStateStore
```

Responsibilities:

* save topic state
* retrieve topic state
* save interview history
* retrieve interview history
* 
<truncated 813 bytes>
e:

* generic interfaces
* discriminated unions
* type guards
* interface extraction
* repository generics
* dependency injection typing
* Prisma-generated types
* DTO improvements

Do NOT replace one unsafe cast with another.

The final codebase should compile with:

```
strict: true
```

without relying on `as any`.

---

# Validation

After implementation:

Run:

* TypeScript compilation
* Prisma validation
* lint
* unit tests
* integration tests

Specifically verify:

✅ Interview starts

✅ Questions generate

✅ Topic selection works

✅ Redis state persists

✅ Redis reconnects correctly

✅ Interview completes

✅ Report saves successfully

✅ No foreign key violations

✅ No runtime crashes

✅ No remaining `as any`

---

# Deliverables

At the end, provide:

## 1. Files Modified

List every modified file.

---

## 2. Architecture Changes

Explain:

* interviewId flow
* Redis architecture
* dependency injection updates
* typing improvements

---

## 3. Migration Notes

Include:

* Redis environment variables
* required packages
* Prisma changes (if any)
* deployment considerations

---

## 4. Verification Checklist

Provide a completed checklist confirming:

* Foreign key issue fixed
* Redis replacement complete
* In-memory Maps removed
* All `as any` removed
* Application compiles successfully
* Tests pass
* Ready for production deployment

Do not mark the task complete until every validation step succeeds.
```

---

### Model: Gemini 3

**Prompt:**
```text
This implementation plan is well structured and follows the right architectural direction. There are, however, a few important corrections I'd make before implementation.

## Overall Assessment

**Overall:** 9.5/10

* ✅ Clean Architecture is preserved.
* ✅ Redis abstraction is the correct approach.
* ✅ Type safety improvements are appropriate.
* ✅ Verification plan is solid.

The main issue is in **Task 1**.

---

# 1. Foreign Key Fix (Needs Correction)

Your diagnosis of the problem is correct:

> Domain sessionId ≠ Database Interview.id

However, I would **not** solve it this way:

> "Update SessionRepository adapter to return the database-generated id and let SessionManager adopt it."

That mixes two concepts.

A session ID and an interview ID represent different things.

Instead, the application should explicitly distinguish them.

For example:

```ts
interface InterviewSession {
    sessionId: string;      // runtime identifier
    interviewId: string;    // database primary key
}
```

Flow:

```
Start Interview
      │
      ▼
Create Interview row
      │
      ▼
Prisma returns Interview.id
      │
      ▼
Store interviewId inside session
      │
      ▼
Entire interview uses:

session.sessionId
session.interviewId

Finish Interview
      │
      ▼
ReportRepository.create({
    interviewId: session.interviewId
})
```

This is much cleaner than replacing the session ID with the database ID.

**Recommendation:** Keep both identifiers.

---

# 2. Redis

Excellent.

One addition:

Store each concern separately.

```
interview:{sessionId}:topic
interview:{sessionId}:history
interview:{sessionId}:candidate
interview:{sessionId}:state
```

instead of

```
interview:{sessionId}
```

This makes updates cheaper and avoids rewriting a large JSON blob for every change.

Also add:

* namespace prefix
* configurable TTL
* atomic updates where appropriate
* graceful shutdown (`
<truncated 1367 bytes>
everywhere, I'd make the API explicit.

Current:

```ts
save(report)
```

Better:

```ts
saveReport({
    interviewId,
    ...
})
```

The interface immediately tells the caller what identifier is required.

---

# 8. Redis TTL

Instead of hardcoding:

```
24 hours
```

Use configuration:

```
INTERVIEW_STATE_TTL_SECONDS=86400
```

This avoids future code changes.

---

# 9. Verification

Add these tests.

### Foreign Key

* Start interview
* Finish interview
* Report inserted
* FK satisfied

### Redis

* Restart server mid-interview
* Continue interview
* State restored

### Multi-instance

Server A:

```
Question 1
```

Server B:

```
Question 2
```

Interview continues successfully.

### Type Safety

```
tsc --noEmit --strict
```

### Memory

Confirm:

```
grep -R "new Map(" src
```

returns no runtime interview state.

---

# 10. Additional Production Checks

I'd also include:

* Health check verifies Redis connectivity.
* Redis connection retry with exponential backoff.
* Graceful degradation if Redis is unavailable.
* Structured logging for Redis failures.
* Metrics for Redis latency and state operations.

## Final Verdict

With these adjustments, I'd rate the implementation plan **10/10**. The key architectural improvement is to **treat `sessionId` and `interviewId` as distinct identifiers** rather than replacing one with the other. That preserves clear domain semantics while resolving the foreign key issue cleanly.
```

---

### Model: Gemini 3

**Prompt:**
```text
move on to task2
```

---

### Model: Gemini 3

**Prompt:**
```text
move on to task 3
```

---

### Model: Gemini 3

**Prompt:**
```text
# Phase 2 — Comprehensive Testing & Quality Assurance

You are working on the AI Interview Agent backend.

**Do NOT implement new features in this phase.**

The goal is to establish a robust automated testing foundation after completing Phase 1.

The current project reports approximately **0% test coverage**. Your objective is to build a production-grade testing suite covering the core business logic and API workflows.

---

# Rules

* Do NOT modify business logic unless required to make it testable.
* Preserve Clean Architecture.
* Avoid mocking more than necessary.
* Prefer dependency injection over monkey-patching.
* Every new test should be deterministic.
* No flaky tests.
* Tests must run automatically using npm scripts.
* Follow Arrange â†’ Act â†’ Assert structure.
* Use descriptive test names.
* Isolate external dependencies (LLMs, Redis, PostgreSQL).

---

# Testing Stack

Use the project's existing testing framework if present.

If no framework exists, configure:

* Vitest (preferred) or Jest
* Supertest
* Testcontainers or Docker-based PostgreSQL/Redis (preferred for integration tests)
* Prisma test database
* Mock Service utilities where appropriate

Do not use production databases.

---

# Task 1 — Configure Test Infrastructure

Create a complete testing environment.

Include:

* unit test configuration
* integration test configuration
* coverage reporting
* separate test database
* separate Redis instance
* environment configuration
* global setup
* global teardown
* reusable test helpers
* mock factories
* fixtures

Create appropriate folders such as:

```text
tests/
    unit/
    integration/
    fixtures/
    helpers/
    mocks/
```

Configure npm scripts:

```text
npm run test

npm run test:unit

npm run test:integration

npm run test:coverage
```

Coverage reports should include:

* statements
* branches
* functions
* lines

---

# Task 2 — Unit Tests

Write comprehensive unit tes
<truncated 2625 bytes>


---

# Task 7 — Coverage

Achieve minimum coverage targets:

* Statements â‰¥ 90%
* Functions â‰¥ 90%
* Branches â‰¥ 85%
* Lines â‰¥ 90%

Generate an HTML coverage report.

Identify uncovered files.

Suggest additional tests if needed.

---

# Task 8 — Continuous Integration Readiness

Ensure tests are CI-friendly.

Requirements:

* deterministic execution
* isolated databases
* isolated Redis
* parallel execution where safe
* automatic cleanup
* no dependency on local machine state

---

# Validation

Run:

```bash
npm run test
```

```bash
npm run test:unit
```

```bash
npm run test:integration
```

```bash
npm run test:coverage
```

Ensure:

* All tests pass.
* No flaky tests.
* No open handles.
* No resource leaks.
* Coverage thresholds are satisfied.

---

# Deliverables

At the end, provide:

## 1. Test Summary

* Total unit tests
* Total integration tests
* Total API tests
* Total repository tests
* Total Redis tests

---

## 2. Coverage Report

Include:

* Statements
* Functions
* Branches
* Lines

Highlight any uncovered areas.

---

## 3. Files Added

List every new test file and testing utility.

---

## 4. Files Modified

List configuration and source files modified to support testing.

---

## 5. CI Readiness

Confirm the project is ready to run automated tests in CI/CD pipelines.

Do not consider this phase complete until all tests pass successfully and the required coverage thresholds are met.
```

---

### Model: Gemini 3

**Prompt:**
```text
his is a very strong implementation plan (9.8/10) and is close to what I'd use for a production backend. I would make a few adjustments to improve maintainability, CI reliability, and test design.

Overall Verdict

✅ Excellent framework selection

Vitest ✅
Supertest ✅
Testcontainers ✅
Coverage V8 ✅

These are all modern choices.

1. Testcontainers

I would approve Testcontainers if your CI supports Docker (GitHub Actions, GitLab CI, self-hosted runners, etc.).

However, don't make every test depend on Docker.

Instead, split the test suite into layers:

tests/

unit/
integration/
api/
contract/

Run them like this:

npm run test:unit

No Docker.

npm run test:integration

Docker.

npm run test:api

Docker.

This keeps local development fast.

2. Add Contract Tests

You're missing one important layer.

Between unit and integration:

Repository Interface
        ▲
        │
Contract Tests
        │
Repository Implementation

These ensure every implementation behaves the same.

For example:

InterviewSessionRepository Contract

✓ save()

✓ get()

✓ update()

✓ delete()

✓ throws expected errors

Later, if you replace Prisma with MongoDB, these tests remain valid.

3. Folder Structure

I'd slightly expand it.

tests/

unit/

integration/

api/

contract/

fixtures/

factories/

helpers/

mocks/

builders/

Builders are extremely useful.

Example:

InterviewBuilder

CandidateBuilder

SessionBuilder

ReportBuilder

Instead of creating giant JSON objects repeatedly.

4. Mock Strategy

Instead of

mock the LLM

Create an interface:

ILLMProvider

Then

OpenRouterProvider

OpenAIProvider

FakeLLMProvider

Unit tests inject

FakeLLMProvider

instead of mocking HTTP.

This is far more maintainable.

5. API Tests

Don't stop at the happy path.

Add:

POST /start

✓ success

✓ invalid candidate

✓ invalid curriculum

✓ missing body

✓ malformed JSON

✓ duplicate session

Same for

POST /answer

✓ success

✓ empty answer

✓ expired interview

✓ invalid session

✓ R
<truncated 1077 bytes>
nswerFactory

ReportFactory

Factories make tests easier to maintain.

12. Coverage Report

Instead of only HTML, generate multiple formats:

html

lcov

json

text-summary

CI systems can use these directly.

13. Additional Assertions

For the E2E interview flow:

Verify not only the HTTP responses but also:

Interview record exists in PostgreSQL.
InterviewReport references the correct interviewId.
Redis keys are created during the interview.
Redis keys are deleted (or expired) after completion.
No orphaned records remain.
Foreign key relationships are valid.
14. CI Pipeline

I would explicitly require:

Pipeline

↓

Install

↓

Prisma Generate

↓

Prisma Migrate

↓

Start PostgreSQL

↓

Start Redis

↓

Run Unit Tests

↓

Run Contract Tests

↓

Run Integration Tests

↓

Run API Tests

↓

Coverage

↓

Lint

↓

Type Check

↓

Build

This ensures every pull request is validated consistently.

Final Recommendation

I would approve the plan with the following enhancements:

Add contract tests between unit and integration.
Use a FakeLLMProvider rather than HTTP interception for unit tests.
Add builder/factory utilities for generating test data.
Include transaction rollback, Redis crash recovery, and parallel interview scenarios.
Produce multiple coverage formats (HTML, LCOV, JSON, text summary).
Define a CI pipeline that runs linting, type checking, build, and all test layers.

With these additions, the testing strategy becomes enterprise-grade and provides an excellent foundation for future development.
```

---

### Model: Gemini 3

**Prompt:**
```text
Comments on artifact URI: file:///c%3A/Users/shrik/.gemini/antigravity-ide/brain/c55402fe-638f-430c-8232-855b8c8a4bb1/implementation_plan.md

The user has approved this document.
```

---

### Model: Gemini 3

**Prompt:**
```text
run it
```

---

### Model: Gemini 3

**Prompt:**
```text
how to test
```

---

### Model: Gemini 3

**Prompt:**
```text
# Phase 3 — Production Security Hardening

You are working on the AI Interview Agent backend built with **TypeScript**, **Express**, **Prisma**, **PostgreSQL**, **Redis**, and **Clean Architecture**.

The objective of this phase is to make the backend production-ready by implementing a comprehensive security layer.

**Do not add new business features.**

Focus exclusively on authentication, authorization, input validation, request protection, prompt security, and secure middleware.

---

# Rules

* Preserve Clean Architecture.
* Do not bypass dependency injection.
* Security must be implemented as reusable middleware/services.
* Do not hardcode secrets.
* All secrets must come from environment variables.
* Maintain strict TypeScript typing.
* Follow OWASP API Security Best Practices.
* Keep security concerns separate from business logic.

---

# Target Request Flow

Every protected endpoint should follow this pipeline:

```text
Incoming Request
        │
        ▼
Helmet
        │
        ▼
CORS
        │
        ▼
Request ID / Logging
        │
        ▼
Rate Limiter
        │
        ▼
API Key Validation
        │
        ▼
JWT Authentication
        │
        ▼
Zod Request Validation
        │
        ▼
Prompt Injection Protection
        │
        ▼
Controller
        │
        ▼
Interview Engine
        │
        ▼
Response
```

---

# Task 1 — JWT Authentication

Implement secure JWT authentication.

Requirements:

* Access tokens
* Configurable expiration
* HS256 (or RS256 if already supported)
* Environment-based secret
* Middleware-based authentication
* User identity attached to request context
* Proper authentication error responses

Create:

```text
JwtService
JwtMiddleware
AuthMiddleware
```

Support:

* token verification
* token expiration
* invalid token handling
* missing token handling

Never expose sensitive token information.

---


<truncated 4068 bytes>
ic

✓ Burst traffic

✓ Limit exceeded

✓ Retry after timeout

---

## Zod Validation

✓ Valid payload

✓ Missing fields

✓ Invalid types

✓ Malformed JSON

---

## Prompt Security

✓ Normal interview answer

✓ Prompt injection attempt blocked

✓ Jailbreak attempt blocked

✓ Oversized prompt rejected

---

## Middleware

✓ Security headers present

✓ CORS works correctly

✓ Compression enabled

✓ Request IDs generated

---

# Deliverables

Provide:

## 1. Files Added

List all new middleware, services, schemas, and utilities.

---

## 2. Files Modified

List every modified controller, route, and configuration file.

---

## 3. Security Architecture

Explain:

* authentication flow
* authorization flow
* request validation flow
* prompt protection flow
* rate limiting strategy
* middleware execution order

---

## 4. Environment Variables

List every required environment variable with descriptions.

---

## 5. Security Checklist

Confirm:

* JWT authentication implemented
* API key authentication implemented
* Redis-backed rate limiting enabled
* Zod validation integrated
* Prompt injection protection active
* Security headers configured
* Secure error handling implemented
* Environment validation added
* Audit logging enabled
* Ready for production deployment

Do not mark this phase complete until all validation scenarios pass successfully and the application remains fully compatible with the existing Clean Architecture.
```

---

### Model: Gemini 3

**Prompt:**
```text
This is a very strong production security plan (9.8/10). It follows Clean Architecture well and covers the major security concerns. I would make a few architectural improvements before implementation.

Overall Verdict

✅ JWT

✅ API Keys

✅ Zod

✅ Rate Limiting

✅ Prompt Protection

✅ Helmet

✅ Request IDs

✅ Environment Validation

This is an excellent baseline for a production API.

1. Authentication Architecture

I would separate Authentication from Authorization.

Instead of a single middleware:

ApiKeyMiddleware

↓

AuthMiddleware

Use:

ApiKeyMiddleware

↓

JwtAuthenticationMiddleware

↓

AuthorizationMiddleware

↓

Controller

Responsibilities:

Authentication

Verify JWT
Verify API Key
Identify caller

Authorization

Check roles
Check permissions
Check scopes

Even if roles aren't needed today, this separation makes future expansion much easier.

2. JWT

HS256 is perfectly acceptable for this phase.

Do not introduce RS256 unless you actually need:

multiple services
external identity provider
public/private key rotation

For a single backend:

HS256

is simpler and secure.

3. API Keys

I would not hardcode them forever in .env.

Instead design the abstraction now.

IApiKeyRepository

↓

EnvApiKeyRepository

Later you can replace it with

DatabaseApiKeyRepository

without touching middleware.

4. Rate Limiting

Instead of one limiter:

authLimiter

apiLimiter

heavyLimiter

I'd recommend endpoint-specific policies.

Example:

Endpoint	Limit
/auth/*	10/min
/start	20/min
/answer	120/min
/end	20/min
/reports	10/min
/health	unlimited or very high

This prevents legitimate interview traffic from being throttled unnecessarily.

5. Prompt Injection Protection

This is the biggest improvement I'd recommend.

Don't make it only:

PromptSecurityService

Instead split it into stages.

Candidate Answer

↓

Normalization

↓

Pattern Detection

↓

Risk Scoring

↓

Sanitization

↓

Decision Engine

↓

LLM

For example:

Normalization
trim
normalize unicode
remove invi
<truncated 2071 bytes>
keep-alive timeout
Security Monitoring

Count:

JWT failures
API key failures
Rate-limit violations
Prompt-injection detections

These metrics are valuable for dashboards and alerts.

Final Architecture

I recommend this middleware pipeline:

Incoming Request
        │
        ▼
Helmet
        │
        ▼
CORS
        │
        ▼
Compression
        │
        ▼
Request ID
        │
        ▼
Security Logging
        │
        ▼
Rate Limiter
        │
        ▼
API Key Authentication
        │
        ▼
JWT Authentication
        │
        ▼
Authorization
        │
        ▼
Zod Validation
        │
        ▼
Prompt Security
        │
        ▼
Controller
        │
        ▼
Interview Engine
        │
        ▼
Error Handler
        │
        ▼
Response
Final Recommendation

I would approve this plan with the following refinements:

Separate authentication and authorization into distinct middleware.
Abstract API key storage behind an IApiKeyRepository to support future database-backed keys.
Make prompt injection protection a multi-stage pipeline with risk scoring instead of a simple block/allow check.
Add endpoint-specific rate-limiting policies.
Include requestId and timestamp in standardized error responses.
Configure explicit security headers and add request size limits, CORS allowlists, and audit logging separation.

With these changes, the security layer would be suitable for a production deployment while remaining aligned with Clean Architecture principles.
```

---

### Model: Gemini 3

**Prompt:**
```text
@[d:\New11\TASKS.md:L80-L100] Implement the remaining Candidate Profile Analysis module for the AI Interview Agent backend.

The implementation must strictly follow Clean Architecture, SOLID principles, Dependency Injection, and existing project architecture.

Do NOT modify existing business logic unless required for integration.

Do NOT use any.

Do NOT break existing interfaces.

Remaining Tasks

Implement all of the following:

Build Candidate Analyzer Agent
Create analyzer prompt
Parse resume/profile input
Estimate candidate level
Identify strengths
Identify weak areas
Recommend interview topics
Return structured JSON
Test with multiple candidate profiles
Functional Requirements

The analyzer receives either:

Candidate Profile JSON
Resume text
Parsed resume
Combined profile + resume

and generates an AI-powered assessment.

The analyzer should understand:

Skills
Experience
Education
Projects
Certifications
Technologies
Programming languages
Career level
Domain expertise
Create Module Structure
src/modules/candidate-analyzer/

├── CandidateAnalyzer.ts
├── ICandidateAnalyzer.ts
├── CandidateAnalyzerService.ts
├── CandidateAnalysis.ts
├── CandidateAnalysisParser.ts
├── prompts/
│   └── candidate-analyzer.md
├── types/
│   ├── CandidateAnalysisResult.ts
│   ├── CandidateLevel.ts
│   └── InterviewRecommendation.ts
└── index.ts
Candidate Analyzer Responsibilities

The analyzer must:

Read candidate profile
Parse resume text
Understand technical stack
Detect primary specialization
Estimate experience level
Estimate interview difficulty
Identify strongest skills
Detect missing knowledge
Recommend interview topics
Produce structured output
Candidate Level Classification

Support:

BEGINNER

JUNIOR

MID_LEVEL

SENIOR

STAFF

PRINCIPAL

Estimate using:

years of experience
projects
technologies
complexity
education
responsibilities

Never rely on only one factor.

Strength Analysis

Return:

Top strengths

Example

[
 "Java"
<truncated 2270 bytes>
QL
REST
Profile 3

Senior Full Stack

Expected:

Senior
System Design
Scalability
Leadership
Profile 4

Data Scientist

Expected:

ML
Python
Statistics
SQL
Profile 5

Incomplete Resume

Expected:

Graceful degradation
Lower confidence
No crashes
Acceptance Criteria

The implementation is complete only if:

Clean Architecture is preserved.
SOLID principles are followed.
Dependency Injection is used throughout.
No any types are introduced.
The analyzer returns deterministic, schema-valid JSON.
Resume parsing is resilient to incomplete input.
AI responses are validated before use.
Unit tests pass for all sample profiles.
Existing project functionality remains unchanged.
```

---

### Model: Gemini 3

**Prompt:**
```text
I agree with the implementation plan's recommendation.

**Choose Option 1: Name Isolation (`candidate-profile-analyzer`)**.

### Why this is the best approach

Your project already has a `candidate-analyzer` module responsible for **evaluating candidate answers during an interview**. The new module has a completely different responsibility: **analyzing a candidate's profile before the interview begins**.

Keeping them separate follows the **Single Responsibility Principle (SRP)** and avoids:

* Breaking existing imports
* Overwriting `CandidateAnalyzer.ts`
* Confusing developers about the purpose of the module
* Future maintenance issues

It also better reflects the interview lifecycle:

```
Candidate Profile
        │
        ▼
CandidateProfileAnalyzer
        │
        ▼
Interview Configuration
        │
        ▼
InterviewEngine
        │
        ▼
CandidateAnalyzer
        │
        ▼
RubricEngine
        │
        ▼
ReportGenerator
```

Here:

* **CandidateProfileAnalyzer** â†’ analyzes the resume/profile *before* the interview.
* **CandidateAnalyzer** â†’ analyzes the candidate's *answers* during the interview.

---

## Suggested module structure

```
src/modules/candidate-profile-analyzer/

├── CandidateProfileAnalyzer.ts
├── ICandidateProfileAnalyzer.ts
├── CandidateProfileAnalyzerService.ts
├── CandidateAnalysisParser.ts
├── prompts/
│   └── candidate-profile-analyzer.md
├── types/
│   ├── CandidateAnalysisResult.ts
│   ├── CandidateLevel.ts
│   └── InterviewRecommendation.ts
└── index.ts
```

---

## Additional recommendations

Since your backend is already following Clean Architecture, I'd also recommend adding these improvements:

### 1. Confidence scoring

Return confidence for each inferred value, not just the overall result.

Example:

```json
{
  "candidateLevel": {
    "value": "MID_LEVEL",
    "confidence"
<truncated 1022 bytes>
ioralRound": true
  }
}
```

This can later be consumed directly by your `InterviewEngine`.

---

### 5. Topic weighting

Rather than:

```json
"Java"
```

Return:

```json
{
  "topic": "Java",
  "importance": 10,
  "difficulty": "MEDIUM",
  "questionCount": 5
}
```

Your `TopicSelector` can then prioritize topics based on these weights.

---

### 6. Resume completeness score

Provide an assessment of how complete the candidate's profile is.

Example:

```json
{
  "profileQuality": {
    "score": 74,
    "missingSections": [
      "Projects",
      "Certifications"
    ]
  }
}
```

This helps distinguish between a weak candidate and an incomplete resume.

---

## Integration into your architecture

The flow would become:

```
Resume/Profile
      │
      ▼
CandidateProfileLoader
      │
      ▼
CandidateProfileAnalyzer
      │
      ▼
CandidateRepository
      │
      ▼
InterviewEngine
      │
      ▼
TopicSelector
      │
      ▼
QuestionGenerator
```

This cleanly separates **pre-interview profile analysis** from **live interview answer evaluation**.

**Overall assessment:** The proposed implementation plan is well aligned with your existing architecture. I would approve it with **Option 1 (Name Isolation)** and the additional enhancements above, as they improve extensibility while preserving your Clean Architecture and avoiding any risk to the existing `candidate-analyzer` module.
```

---

### Model: Gemini 3

**Prompt:**
```text
Use the following implementation prompt for the remaining **Phase 4 — Topic Selector** tasks. It is designed to fit your existing Clean Architecture, DI-based AI Interview Agent backend.

---

# Phase 4 — Topic Selector (Adaptive Topic Selection)

## Goal

Enhance the existing Topic Selector to intelligently adapt interview topics based on the candidate's performance throughout the interview.

The implementation **must preserve the existing Clean Architecture**, **SOLID principles**, and **Dependency Injection**. Do **not** modify existing business logic unless required for integration. Do **not** introduce `any` types or break existing interfaces.

---

# Remaining Tasks

Implement the following:

* Track candidate performance
* Test adaptive topic switching

---

# Functional Requirements

The Topic Selector must choose the next interview topic using:

* Curriculum structure
* Topics already covered
* Candidate performance
* Candidate profile analysis
* Weak skill prioritization
* Difficulty progression
* Interview stage
* Follow-up history

The selector should adapt dynamically as the interview progresses.

---

# Existing Responsibilities

Preserve the existing functionality:

* Topic selection agent
* Covered topic tracking
* Weak topic prioritization
* Duplicate topic prevention
* Next topic recommendation

Do not regress existing behavior.

---

# Adaptive Performance Tracking

Track candidate performance after every question.

Maintain performance per topic.

Example:

```json
{
  "Java": {
    "questions": 4,
    "averageScore": 62,
    "confidence": 0.81
  },
  "SQL": {
    "questions": 2,
    "averageScore": 91,
    "confidence": 0.95
  }
}
```

Performance must update after every evaluated answer.

---

# Performance Classification

Classify each topic as:

```text
STRONG
GOOD
AVERAGE
WEAK
CRITICAL
```

Use:

* Rubric score
* Technical accuracy
* Confidence
* Follow-up count
* Hint usa
<truncated 3693 bytes>
 prioritized
* Difficulty reduced
* Additional reinforcement

---

## Test Case 3 — Mixed Performance

Profile:

* Strong in Java
* Weak in SQL

Expected:

* More SQL questions
* Fewer Java questions

---

## Test Case 4 — Duplicate Prevention

Verify:

* Completed topics are never selected twice unless the interview strategy explicitly allows review.

---

## Test Case 5 — Curriculum Completion

When all topics are covered:

Expected:

* Return interview completion signal
* No invalid topic selection

---

## Test Case 6 — Adaptive Strategy

Run the same interview using:

* Balanced
* Weakness First
* Breadth First
* Depth First
* Challenge Mode

Verify that topic ordering changes according to the selected strategy.

---

# Acceptance Criteria

The implementation is complete only if:

* Existing Topic Selector functionality remains unchanged.
* Candidate performance is tracked throughout the interview.
* Topic selection adapts based on candidate performance.
* Duplicate topics are prevented.
* Difficulty progression is dynamic and configurable.
* Selection decisions are deterministic and explainable.
* All new functionality integrates through existing interfaces.
* Comprehensive unit and integration tests pass.
* Clean Architecture, SOLID principles, and Dependency Injection are fully preserved.
```

---

### Model: Gemini 3

**Prompt:**
```text
Overall, this is a **strong implementation plan (9.5/10)** and aligns well with the adaptive topic selection goals. I would make a few architectural refinements to keep the `TopicSelector` focused on decision-making and avoid turning it into a state manager.

## Recommendation on the open questions

### 1. Configuration Manager

Yes, **extend the existing `config-manager`** rather than creating a separate configuration source.

Add configurable values such as:

* `adaptiveStrategy`
* `difficultyEscalationThreshold`
* `difficultyDeescalationThreshold`
* `weakTopicThreshold`
* `criticalTopicThreshold`
* `maxFollowUpDepth`
* `reviewCompletedTopics`
* `minimumCoverageBeforeEscalation`

Expose them through the existing configuration service rather than reading environment variables directly inside `TopicSelector`.

---

### 2. Performance Tracking

I would **not** make the `TopicSelector` responsible for updating performance.

Instead:

```text
InterviewEngine
        │
        ▼
RubricEngine
        │
        ▼
TechnicalAccuracyChecker
        │
        ▼
TopicPerformanceTracker
        │
        ▼
Redis Topic State
        │
        ▼
TopicSelector
```

This keeps responsibilities clean:

* **TopicPerformanceTracker** â†’ updates state
* **TopicSelector** â†’ reads state and selects the next topic

---

# Suggested architecture improvements

## 1. Keep TopicSelector Pure

The selector should behave like a pure decision engine.

Input:

```text
Candidate Profile

Current Topic State

Curriculum

Interview Phase

Configuration

Performance History
```

Output:

```json
{
  "nextTopic": "...",
  "difficulty": "...",
  "reason": "...",
  "priority": 92
}
```

It should never mutate Redis or internal state.

---

## 2. Expand Performance Metrics

Instead of:

```text
averageScore
confidence
```

Track richer metrics:

```text
questionsAnswered

averageScore

averageConfidence

t
<truncated 2790 bytes>
omponent:

```text
TopicSelector

│

├── TopicPriorityCalculator

├── DifficultyPolicy

├── TopicPerformanceTracker

├── DependencyResolver

└── AdaptiveStrategyEngine
```

This keeps the selector small and focused while making each algorithm independently testable.

---

# Final recommendation

I would approve this implementation with the following adjustments:

1. **Use the existing Configuration Manager** for all adaptive settings.
2. **Keep `TopicSelector` read-only**; move all performance updates into `TopicPerformanceTracker`.
3. **Introduce a `TopicSelectionContext`** to avoid interface bloat.
4. **Use a weighted priority algorithm** instead of scattered conditional logic.
5. **Support topic dependencies** so prerequisite knowledge influences selection.
6. **Require multiple consecutive strong/weak performances before changing difficulty**, avoiding abrupt swings.
7. **Split the adaptive logic into dedicated helper components** (`TopicPriorityCalculator`, `DifficultyPolicy`, `AdaptiveStrategyEngine`) to maintain Clean Architecture and improve testability.

With these refinements, the adaptive topic selection module will be more maintainable, deterministic, extensible, and consistent with the rest of your AI Interview Agent architecture.
```

---

### Model: Gemini 3

**Prompt:**
```text
@[d:\New11\TASKS.md:L172-L188] has this been completed?
```

---

### Model: Gemini 3

**Prompt:**
```text
give the list of frontend. i have to created, give every page name with description, give the name with only the details, dont create them
```

---
# Chat Prompts History

### Model: Claude Sonnet 4

**Prompt:**
```text
when i send a message, it is simply not doing anything, and add this files also @[../PROJECTS/candidates.json] @directory:"D:\PROJECTS\curriculum.json" @file:technical-spec.md"
```

---

### Model: Gemini 3

**Prompt:**
```text
run it
```

---

### Model: Claude Sonnet 4

**Prompt:**
```text
FIX THIS ERROR
```

---

### Model: Claude Sonnet 4

**Prompt:**
```text
Interview start failed: [object Object]

STILL SHOW THIS
```

---

### Model: Claude Sonnet 4

**Prompt:**
```text
ai is not responding,fix it

(anonymous) @ client:529
api/interview/answer:1  Failed to load resource: the server responded with a status of 500 (Internal Server Error)
client:529 Submit error: AxiosError: Request failed with status code 500
    at settle (settle.js:19:12)
    at XMLHttpRequest.onloadend (xhr.js:63:9)
    at Axios$1.request (Axios.js:46:41)
    at async submitAnswer (interview.ts:45:15)
    at async handleSubmit (InterviewPage.tsx:117:20)
(anonymous) @ client:529
api/interview/answer:1  Failed to load resource: the server responded with a status of 500 (Internal Server Error)
client:529 Submit error: AxiosError: Request failed with status code 500
    at settle (settle.js:19:12)
    at XMLHttpRequest.onloadend (xhr.js:63:9)
    at Axios$1.request (Axios.js:46:41)
    at async submitAnswer (interview.ts:45:15)
    at async handleSubmit (InterviewPage.tsx:117:20)
(anonymous) @ client:529
[NEW] Explain Console errors by using Copil
```

---

### Model: Claude Sonnet 4

**Prompt:**
```text
still the same, fix it, what to do
```

---

### Model: Claude Sonnet 4

**Prompt:**
```text
confidence meter is not working, and dont show the questions rate, keep the question limit to 10 question, after it , it will show the report of how the user answered and show improvements, bad answers, good answer
```

---

### Model: Gemini 3

**Prompt:**
```text
run it
```

---

### Model: Claude Sonnet 4

**Prompt:**
```text
Your solution must:

Conduct a conversational technical interview.
Ask a minimum of 8 questions covering at least 4 different curriculum days.
Generate follow-up questions based on previous responses.
Maintain conversation context throughout the interview.
Produce structured feedback at the end of the interview.
Expose the required HTTP endpoint defined in the Technical Specification.

just answer this, is this project doing this?
```

---

### Model: Gemini 3

**Prompt:**
```text
Your solution must:

Conduct a conversational technical interview.
Ask a minimum of 8 questions covering at least 4 different curriculum days.
Generate follow-up questions based on previous responses.
Maintain conversation context throughout the interview.
Produce structured feedback at the end of the interview.
Expose the required HTTP endpoint defined in the Technical Specification.

just answer this, is this project doing this?
```

---

### Model: Gemini 3

**Prompt:**
```text
say some suggestions, to macth this requirements
```

---

### Model: Gemini 3

**Prompt:**
```text
The Situation
The AI Cohort is a 31-day enterprise AI engineering program covering modern AI topics including:

Retrieval-Augmented Generation (RAG)
Vector Databases
Prompt Engineering
Agentic AI
Model Context Protocol (MCP)
AI Deployment
Production AI Systems
After completing the cohort, learners should be able to confidently explain the systems they built and the engineering decisions behind them.

However, preparing for technical interviews and effectively communicating this knowledge remains one of the biggest challenges.

Your task is to build an AI Interview Agent that conducts personalized technical interviews based on a candidate's learning journey throughout the cohort.

Your Challenge
Design and build an AI agent capable of conducting a realistic, multi-turn technical interview.

The interview should:

Assess the candidate's understanding of the concepts they have completed.
Adapt naturally throughout the conversation.
Ask intelligent follow-up questions.
Maintain context across the interview.
Provide actionable feedback at the end.
The overall experience should resemble a real technical interview rather than a scripted questionnaire.

What You're Given
Every team will receive the following resources:

1. Curriculum
A structured JSON containing the complete 31-day AI Cohort curriculum, including:

Modules
Daily topics
Learning objectives
Tools used throughout the program
2. Candidate Profiles
A collection of candidate profiles describing each participant's progress through the cohort, including:

Completed missions
Attempts
Skipped topics
Learning signals
3. Technical Specification
A separate document defining:

Required API contract
Submission requirements
Request/response formats
Minimum Requirements
Your solution must:

Conduct a conversational technical interview.
Ask a minimum of 8 questions covering at least 4 different curriculum days.
Generate follow-up questions based on previous responses.
Maintain conversation context throughout the interview.
Produce structured feedback at the end of the interview.
Expose the required HTTP endpoint defined in the Technical Specification.
You are free to choose any:

AI models
Frameworks
Agent orchestration strategy
Retrieval pipeline
System architecture
Out of Scope
The following are not required:

Voice interaction
User authentication
Persistent user accounts
Long-term conversation history
Mobile applications
Notes
All curriculum and candidate data provided for this challenge are synthetic and intended solely for the hackathon.
Teams may use any AI models, agent frameworks, vector databases, or supporting technologies.
Creativity in interview flow, reasoning, interaction design, and overall user experience is highly encouraged.


i have the statement, what i have done and what i have to do, any extra advice
```

---

### Model: Gemini 3

**Prompt:**
```text
replace the report page for the user for this screens with @directory:"D:\New11\stitch_ui_extracted\stitch_interview_agent_cinematic_landing\interview_assessment_report_cinematic_editorial"
```

---

### Model: Gemini 3

**Prompt:**
```text
just add a skip the interview button  for testing  purpose, we can remove it later
```

---

### Model: Gemini 3

**Prompt:**
```text
analyse this follder and say which screen is useful for user and interviwer, two sidesstitch_ui_extracted
```

---

### Model: Gemini 3

**Prompt:**
```text
add this screen form this folder, as the page after clicking being interview or explore curiiclum stitch_interview_agent_cinematic_landing (1)
```

---

### Model: Gemini 3

**Prompt:**
```text
🧑💻 For the Candidate (The Interviewee)
These screens form the flow for someone taking the technical assessment:

interview_agent_landing_page
Purpose: The welcoming front door. It sells the cinematic, high-tech nature of the AI interviewer and provides the main "Start Interview" call to action.
candidate_preparation_upload_cinematic
Purpose: The staging area. Candidates would use this to upload their resume/details and select which curriculum they are testing against before hitting start.
ai_interview_interface_cinematic_thinking_state
Purpose: The core product. This is the real-time chat interface (like the one we've built) where the candidate answers questions while the AI "thinks" and evaluates them.
interview_assessment_report_cinematic_editorial
Purpose: The feedback loop. (This is the one we just implemented!) It gives the candidate immediate feedback on their strengths, weaknesses, and a Q&A log.
curriculum_explorer_31_day_ai_cohort
Purpose: Study material. A visual explorer for the 31-day cohort topics so the candidate knows what they are expected to know before starting.
404_lost_in_the_interview
Purpose: A themed "Page Not Found" screen if they navigate to a broken link.
👔 For the Interviewer (The Recruiter / Admin)
These screens form a backend portal for evaluating the talent pool and managing the system:

recruiter_dashboard_cinematic_overview
Purpose: The command center. Shows an overview of all candidates, average cohort scores, completion rates, and who the top performers are.
interview_history_cinematic_timeline
Purpose: The talent archive. A searchable list of all past interviews, allowing recruiters to pull up old reports (like Alexander Volkov's) and compare candidates.
ai_coaching_performance_analysis
Purpose: Deep analytics. Used by hiring managers to see macro-trends across the cohort (e.g., "70% of candidates are failing the Vector Database questions, we need to adjust our training").
settings_elite_protocol
Purpose: System configuration. Admin panel to configure LLM prompts, difficulty scaling, API keys, and system thresholds.
(Note: The folders labeled shader_1 through shader_4 and three.js, obsidian_emerald are just graphical assets and 3D effects used across both sides to give it that premium cinematic feel!)

what pages needed to add?
```

---

### Model: Gemini 3

**Prompt:**
```text
just say what i have to add extra, say the extra pages, so i can generate them
The Situation
The AI Cohort is a 31-day enterprise AI engineering program covering modern AI topics including:

Retrieval-Augmented Generation (RAG)
Vector Databases
Prompt Engineering
Agentic AI
Model Context Protocol (MCP)
AI Deployment
Production AI Systems
After completing the cohort, learners should be able to confidently explain the systems they built and the engineering decisions behind them.

However, preparing for technical interviews and effectively communicating this knowledge remains one of the biggest challenges.

Your task is to build an AI Interview Agent that conducts personalized technical interviews based on a candidate's learning journey throughout the cohort.

Your Challenge
Design and build an AI agent capable of conducting a realistic, multi-turn technical interview.

The interview should:

Assess the candidate's understanding of the concepts they have completed.
Adapt naturally throughout the conversation.
Ask intelligent follow-up questions.
Maintain context across the interview.
Provide actionable feedback at the end.
The overall experience should resemble a real technical interview rather than a scripted questionnaire.

What You're Given
Every team will receive the following resources:

1. Curriculum
A structured JSON containing the complete 31-day AI Cohort curriculum, including:

Modules
Daily topics
Learning objectives
Tools used throughout the program
2. Candidate Profiles
A collection of candidate profiles describing each participant's progress through the cohort, including:

Completed missions
Attempts
Skipped topics
Learning signals
3. Technical Specification
A separate document defining:

Required API contract
Submission requirements
Request/response formats
Minimum Requirements
Your solution must:

Conduct a conversational technical interview.
Ask a minimum of 8 questions covering at least 4 different curriculum days.
Generate follow-up questions based on previous responses.
Maintain conversation context throughout the interview.
Produce structured feedback at the end of the interview.
Expose the required HTTP endpoint defined in the Technical Specification.
You are free to choose any:

AI models
Frameworks
Agent orchestration strategy
Retrieval pipeline
System architecture
Out of Scope
The following are not required:

Voice interaction
User authentication
Persistent user accounts
Long-term conversation history
Mobile applications
Notes
All curriculum and candidate data provided for this challenge are synthetic and intended solely for the hackathon.
Teams may use any AI models, agent frameworks, vector databases, or supporting technologies.
Creativity in interview flow, reasoning, interaction design, and overall user experience is highly encouraged.
```

---

### Model: Gemini 3

**Prompt:**
```text
. API Sandbox / Developer Protocol (developer_api_sandbox_cinematic)

Why: The hackathon explicitly requires you to "Expose the required HTTP endpoint defined in the Technical Specification."
What to generate: A dark-mode, matrix-style API testing page where users can see the raw JSON requests and responses firing in real-time, proving your backend meets the technical spec perfectly.
2. Candidate Leaderboard / Global Ranking (candidate_leaderboard_holographic)

Why: To show what happens after multiple candidates are interviewed.
What to generate: A cinematic leaderboard showing the synthesized scores of all the synthetic candidate profiles, ranking them by confidence score, technical depth, and communication.
3. The "AI Brain" / Thought Visualizer (ai_reasoning_visualizer_matrix)

Why: The prompt says "Creativity in interview flow, reasoning, interaction design... is highly encouraged."
What to generate: A page that visually graphs how the AI selected its questions based on the candidate's candidates.json profile (e.g., a node graph showing it targeting a candidate's weak spots).

give the prompt to generate them
```

---

### Model: Gemini 3

**Prompt:**
```text
say the flow and features of this project for interviewer and Candidate
```

---

### Model: Gemini 3

**Prompt:**
```text
@[frontend/src/pages/PreparePage.tsx] TASK: Redesign the "Initialize Candidate" screen to correctly represent the provided AI Cohort curriculum.

IMPORTANT:
Do NOT rebuild the entire application.
Do NOT change the interview logic, backend APIs, candidate data, authentication, routing, or existing functionality.
Only modify the UI/UX and curriculum-selection representation on this screen, while preserving existing behavior.

SOURCE OF TRUTH:
The provided curriculum.json is the authoritative curriculum.

The curriculum is:

AI Cohort · 31 days · 8 modules

Module 1:
Environment & Tooling
Days 1–3

Module 2:
Data Foundations
Days 4–6

Module 3:
Embeddings & Vector Search
Days 7–10

Module 4:
LLM Core, Prompting & Fine-Tuning
Days 11–15

Module 5:
Chatbot Application Build
Days 16–20

Module 6:
Agentic AI & MCP
Days 21–24

Module 7:
Evaluation, Security & Deployment
Days 25–28

Module 8:
Production & Capstone
Days 29–31


CURRENT PROBLEM:

The current Curriculum UI contains options such as:

- NODE.JS BACKEND
- REACT FRONTEND
- ML SYSTEMS
- SYSTEM DESIGN
- PYTHON BACKEND
- CLOUD & DEVOPS

These do NOT represent the provided AI Cohort curriculum.

Replace this concept entirely with the actual AI Cohort structure.

CORE UX CONCEPT:

This application is building ONE AI technical interviewer.

The 31 curriculum days are NOT 31 separate interviews.

The 8 modules are NOT separate interview sessions.

The curriculum is the knowledge scope that the AI interviewer uses when conducting one personalized interview.

The user selects a candidate and the AI Cohort curriculum.

The interviewer then uses the candidate's completed missions, skipped topics, attempts, and learning signals to determine what should be asked during the interview.

==================================================
1. CURRICULUM HEADER
==================================================

Change the current Curriculum header to:

CURRICULUM

Under it show:

● SELECTED: AI COHORT · 31 DAYS

Use the existing visual style of
<truncated 8849 bytes>
IC AI & MCP

Day 21
Agentic Frameworks: LangChain Agents & Tool Use

Day 22
Multi-Agent Orchestration

Day 23
Model Context Protocol (MCP)

Day 24
Agentic Chatbot Integration

==================================================
16. SUCCESS CRITERIA
==================================================

The implementation is successful when:

1. The old fake curricula are completely removed.
2. "AI COHORT · 31 DAYS" is the selected curriculum.
3. All 8 real modules are represented.
4. Clicking a module reveals its actual curriculum days.
5. Day titles come from curriculum.json.
6. The screen still feels like ONE AI technical interview setup.
7. The 8-question indicator remains.
8. The UI communicates that 8 is the minimum interview question count.
9. Candidate selection still works.
10. Candidate missions/signals still work.
11. No existing backend/interview functionality is broken.
12. The design remains visually consistent with the current screen.
13. No fake curriculum data is introduced.
14. The UI does not imply that each day is a separate interview.

Before making changes, inspect the existing component structure and identify the component responsible for this "Initialize Candidate" screen.

Modify the smallest reasonable set of files.

After implementation, verify the screen visually and ensure there are no TypeScript, React, or runtime errors.
```

---

### Model: Gemini 3

**Prompt:**
```text
make the changes in @[frontend/src/services/curriculum.ts] page also
```

---

### Model: Gemini 3

**Prompt:**
```text
TASK: Redesign and connect the Candidate Selection section of the "Initialize Candidate" screen to the provided candidates.json data.

IMPORTANT:
Do NOT rebuild the entire application.
Do NOT change the interview engine, backend architecture, authentication, routing, API contracts, or existing interview functionality unless required to connect the candidate data.

The goal is to make the Candidate Selection UI accurately represent the real candidate dataset provided in candidates.json.

==================================================
SOURCE OF TRUTH
==================================================

Use the provided candidates.json as the authoritative source for candidate data.

The candidate dataset contains 20 candidates.

Each candidate contains:

member:
- id
- name
- jobRole
- yearsExperience
- education
- status

missions:
- day
- title
- passed
- skipped
- attempts

signals:
- commitDays
- missionsCompleted
- missionsFirstTry

Do NOT invent candidate names, roles, experience values, or learning data.

Do NOT use the current fake/hardcoded candidate values if candidates.json is available.

==================================================
1. CANDIDATE HEADER
==================================================

Keep the existing heading:

INITIALIZE
CANDIDATE

Keep the supporting text:

"Select a candidate profile and interview curriculum to begin."

However, make sure the candidate list is now populated from candidates.json.

==================================================
2. REMOVE HARDCODED CANDIDATES
==================================================

The current UI contains candidates such as:

Sarah Johnson
Alex Turner
Emily Chen
David Miller
Michael Brown
Wendy Foster
Ethan Brooks
Harold Whitfield
Zara Ahmadi
Gerald Combs
Mia Alvarez
Chen Wei

These names happen to exist in candidates.json, but they must no longer be manually hardcoded in the UI.

Render them dynamically from candidates.json.

Also include the remaining candidates in the dataset.

The dataset contains:

1. Sarah
<truncated 17144 bytes>
 visually consistent with the current design.
22. The candidate grid is responsive.
23. No TypeScript/React/runtime errors are introduced.

==================================================
29. IMPORTANT FINAL CHECK
==================================================

Before finishing:

- Inspect the current implementation.
- Identify the existing Initialize Candidate component.
- Identify how candidate state is currently stored.
- Identify whether candidates are currently hardcoded.
- Replace hardcoded candidate data with candidates.json.
- Preserve existing state/API contracts where possible.
- Verify all 20 candidates render.
- Select several different candidates and verify the right panel changes.
- Verify skipped missions are not treated as passed.
- Verify failed missions are not treated as skipped.
- Verify attempts display correctly.
- Verify signals change when candidates change.
- Verify the curriculum remains AI COHORT · 31 DAYS.
- Verify no old curriculum options remain.
- Run the project's existing typecheck/build/lint commands if available.
- Fix any errors introduced by the changes.

Make the smallest clean implementation necessary.
Do not rewrite unrelated parts of the application.

@[frontend/src/pages/PreparePage.tsx]
```

---

### Model: Gemini 3

**Prompt:**
```text
fix this, and when i select candidate, it just shows the begin interview without selecting the cirilum
```

---

### Model: Gemini 3

**Prompt:**
```text
fix the name half visible correctly
```

---

### Model: Gemini 3

**Prompt:**
```text
redesign this, i dont want the 8 questions minimum circle, do something else
```

---

### Model: Gemini 3

**Prompt:**
```text
some features i like to add
1. a ranking table for interviewer in dahsboard by their scores
2. final report for the candidate also shows their knowledge from the asked areas, if a questions from prompt engineering fundamentals are asked, it shows the knowledge of him in that area at final report
3. in interview, if the candidate answer fastly or easily, increase the difficulty and the aksed questions must be from randomly selected topic from the 31 topics
4.move the countdown time to backend
5.cap the follow up questions from same topic, change topics after 2 questions
6.Expose the required HTTP endpoint defined in the Technical Specification.


tell me what to do
```

---

### Model: Gemini 3

**Prompt:**
```text
just tell me what does this folder D:\New11\src" do? it has many folder in it, rubric engine...etc
```

---

### Model: Gemini 3

**Prompt:**
```text
is it being used?
```

---

### Model: Gemini 3

**Prompt:**
```text
which modules are not being used
```

---

### Model: Gemini 3

**Prompt:**
```text
add a extra feature 
hiring-recommendation-engine - Never imported anywhere.
and reask me for apporval
```

---

### Model: Gemini 3

**Prompt:**
```text
give all the prompts used in chat to build this project, with the models used, put it in sepreate md file
```

---
# User Prompts Used for the Project

**Model Name:** Gemini 3.1 Pro (High)

### Prompt 1

```text
@[d:\New11\Implementation-plan.md:L21-L50] proceed
```

---

### Prompt 2

```text
run this
```

---

### Prompt 3

```text
i want you to do some things
the score is always 67 and  like the minimum requirements mentioned, 4 topics are not covered, only general topics are covered, and strengths and areas to probe is not given, fix it, divide 10 questions by 2, 5 topics must be covered
```

---

### Prompt 4

```text
Continue
```

---

### Prompt 5

```text
run it
```

---

### Prompt 6

```text
Can you explain what a variable is in programming?

for all interview, it is just asking questions from general topics, not from the cirruclum topics, make it choose a random topics from cirruclum and asks 2 questions and move on to the next topics, make it logic, make n mistake
```

---

### Prompt 7

```text
another things is that, when i start the interview, the timer counts and when i start a second interview, it starts from the previous interview time, i comleteed first interview at 4.34 time and secend interview starts from 4.34 and for the history of interview, dont add any mock up data, went i complete the interview, it should save in history, a technial assement should be showed to me and a report of the interview shoul be vieweable for the interviwer in the history page, with a his conversation and his analytics
```

---

### Prompt 8

```text
it stays zero throughout the interview
```

---

### Prompt 9

```text
put all the prompts used for this project in this cat ina seprate md file with model name
```

---

### Prompt 10

```text
put all the prompts used to create this project in this chat ina seprate md file with model name
```

---

### Prompt 11

```text
so now the project is working perfectly, your purpose is to polish the ui/ux and enhance the experince of the candidate and interviewr and replace the website name with Orian The Interviewer, 60fps animations, smooth transistion, no user discomfort make it happen
```
----
