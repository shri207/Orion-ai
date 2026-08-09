# Core Feature & Architecture Updates

This implementation plan outlines the structural changes needed across the frontend and backend to fulfill the 6 requested features.

## 1. Interviewer Dashboard Leaderboard
**Goal**: Display a ranking table of candidates/interviews based on their overall scores.
- **Backend**: Add a new route `GET /api/report/leaderboard` (or extend `/api/report`) to fetch all completed interview sessions joined with their `overallScore` from the database.
- **Frontend**: Create a new "Leaderboard" or "Ranking" component on the `DashboardPage.tsx`. It will display the candidate names, job roles, and their final computed scores, sorted descending.

## 2. Granular Knowledge Assessment in Final Report
**Goal**: Show specific knowledge assessments for topics actually asked (e.g., "Prompt Engineering Fundamentals").
- **Backend**: Update the `ReportGenerator` LLM prompt in `backend/src/services/llm` to extract topic-specific mastery based on the `topicPerformanceTracker` records. Include this in the `reportData` schema.
- **Frontend**: Update `ReportPage.tsx` to visualize these granular topics (e.g., using a Radar chart or horizontal skill bars) mapping exactly to what the AI evaluated.

## 3. Dynamic Difficulty & Randomized 31 Topics (Speed & Ease)
**Goal**: If a candidate answers fast or easily, increase difficulty. Randomly select questions from the 31 topics.
- **Backend Changes**: 
  - Update `AdaptiveDifficulty` service to calculate difficulty dynamically based on `timeTakenMs` (passed from frontend) and the LLM's `confidence` score of the answer.
  - Update `TopicSelector` service to select topics randomly from the full 31-topic curriculum rather than linearly.

## 4. Backend-Enforced Countdown Timer
**Goal**: Move the countdown timer logic to the backend to prevent client-side manipulation and accurately track speed.
- **Backend**: The `SessionState` will store `questionStartTime`. The `POST /api/interview/answer` endpoint will compute the time taken, validate if it exceeded the limit (e.g., 2 minutes), and automatically terminate or penalize if time ran out.
- **Frontend**: Will sync its visual timer to the backend's provided timestamp/limit, but the backend acts as the true source of authority.

## 5. Follow-Up Question Cap (Max 2)
**Goal**: Prevent infinite loops on the same topic by capping follow-ups.
- **Backend**: Add a `followUpCount` property to `IInterviewSessionState`. In `InterviewEngine.ts`, increment it during follow-ups. If `followUpCount >= 2`, force `needsFollowUp = false` and force the `TopicSelector` to jump to a new topic, resetting the count.

## 6. Developer API Sandbox (Technical Spec)
**Goal**: Expose `POST /api/interview` exactly as defined in the Hackathon spec.
- **Backend**: Create a dedicated, unauthenticated route in `app.ts` (`app.use('/api/interview', hackathonRouter)`) positioned *before* the JWT middleware.
- **Routing**: Map the single POST endpoint to handle both `candidate` (Start Interview) and `message` (Submit Answer) payloads, adapting them to the internal `interviewEngine` methods.

## 7. Hiring Recommendation Engine Integration
**Goal**: Wire up the orphaned `hiring-recommendation-engine` module to automatically output a hiring decision (e.g., Hire, No Hire, Strong Hire) at the end of the interview.
- **Backend**: 
  - Register the `HiringRecommendationEngine` and `SkillMatrixGenerator` in `container.ts`.
  - Update `ReportGenerator` or `InterviewEngine.completeInterview` to call `evaluateRecommendation()` using the compiled interview data.
  - Save the final `HiringRecommendationDecision` into the database alongside the `InterviewReport`.
- **Frontend**: Display this final hiring recommendation prominently on the Candidate's Final Report page and the Recruiter Dashboard Leaderboard.

---

> [!IMPORTANT]
> **User Review Required**
> 1. For the **Countdown Timer**, what should the hard limit be per question? (e.g., 120 seconds)? What happens if time runs out—do we auto-fail the question and move on, or end the entire interview?
> 2. For the **Leaderboard**, do you want this to replace the current dashboard charts, or sit alongside them?
> 3. For the **Hiring Recommendation**, the engine supports "Strong Hire", "Hire", "Lean Hire", "Maybe", "No Hire", and "Strong No Hire". Do you want all these tiers displayed on the UI?
> 4. Does this plan align with your vision? Click **Proceed** if you're ready for me to start building this out!
