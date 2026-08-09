# Interview AI Agent Architecture

**Version:** 2.0

**Project:** Interview AI Agent

**Hackathon:** ABTalks Vibe Coding Hackathon

---

# 1. Project Vision

Interview AI Agent is an adaptive AI-powered technical interviewer that conducts personalized technical interviews based on a candidate's learning journey throughout the ABTalks AI Cohort.

Unlike traditional interview bots that follow predefined question sets, Interview AI analyzes candidate progress, creates an interview strategy, dynamically adapts questions based on candidate responses, maintains interview state throughout the conversation, and produces structured feedback at the end of the interview.

The goal is to simulate a realistic technical interview while evaluating conceptual understanding, practical reasoning, communication skills, and architectural thinking.

---

# 2. Design Goals

The system is designed to:

- Conduct conversational technical interviews
- Personalize questions using candidate progress
- Cover multiple curriculum topics
- Generate intelligent follow-up questions
- Adapt interview difficulty dynamically
- Maintain interview context
- Evaluate candidate responses
- Generate actionable feedback
- Expose a single FastAPI endpoint

---

# 3. Design Principles

## Personalization

Every interview is customized using:

- completed missions
- skipped topics
- learning signals
- number of attempts

---

## Adaptive Interviewing

Interview difficulty evolves based on answer quality.

Strong answers increase complexity.

Weak answers trigger clarification or easier follow-up questions.

---

## Separation of Concerns

Each component owns one responsibility.

No component performs unrelated tasks.

---

## Deterministic State Management

Interview progress is maintained by backend logic.

The LLM never stores application state.

---

## Efficient LLM Usage

The LLM is only used where reasoning is required.

Used for:

- question generation
- follow-up generation
- evaluation
- feedback

Everything else is handled using deterministic Python logic.

---

# 4. High-Level Architecture

```
Next.js Frontend
        │
        ▼
POST /api/interview
        │
        ▼
FastAPI Controller
        │
        ▼
Interview Orchestrator
        │
 ┌──────┼──────────────┬──────────────┐
 ▼      ▼              ▼              ▼
Candidate Curriculum Interview Prompt
 Service Retriever     State Manager
        │              │              │
        └──────┬───────┴──────────────┘
               ▼
       GPT-5.5 Interview Agent
               │
               ▼
      Answer Evaluation Engine
               │
               ▼
      Interview State Update
               │
               ▼
 Interview Complete?
        │               │
       No              Yes
        │               │
        ▼               ▼
Generate Next      Feedback Generator
 Question               │
                        ▼
                 JSON Response
```

---

# 5. Request Lifecycle

Every interview request follows the same lifecycle.

```
POST /api/interview

↓

Load/Create Session

↓

Build Interview Profile

↓

Create Interview Plan

↓

Retrieve Curriculum Context

↓

Generate Question

↓

Receive Candidate Answer

↓

Evaluate Answer

↓

Interview Policy decides:

• Follow-up?
• Increase difficulty?
• Change topic?
• Finish interview?

↓

Update Interview State

↓

Return Next Question

OR

Generate Final Feedback
```

---

# 6. Interview State

Interview State acts as the single source of truth.

It stores:

- Session ID
- Candidate Profile
- Interview Plan
- Current Question
- Question History
- Candidate Answers
- Covered Curriculum Days
- Evaluation Scores
- Running Summary
- Interview Progress
- Final Feedback

---

# 7. Context Window Policy

To avoid unnecessary token usage, the LLM does not receive the complete interview history.

Each request includes:

- Candidate Profile
- Interview Plan
- Current Interview State
- Last 3 Question–Answer pairs
- Running Interview Summary
- Relevant Curriculum Context

This keeps prompts efficient while maintaining conversation continuity.

---

# 8. Interview Policy

Interview Policy contains deterministic decision rules.

Responsibilities:

- difficulty progression
- follow-up decisions
- topic transitions
- interview completion rules
- curriculum coverage

The Interview Orchestrator coordinates execution while Interview Policy decides interview progression.

---

# 9. Prompt Architecture

Prompt templates are separated by responsibility.

## System Prompt

Defines interviewer personality and global rules.

---

## Question Prompt

Generates new interview questions.

Returns structured JSON.

---

## Evaluation Prompt

Evaluates candidate answers.

Returns:

- technical accuracy
- reasoning
- communication
- score

---

## Feedback Prompt

Produces final interview report.

Returns:

- summary
- strengths
- gaps
- recommendations

---

# 10. Structured Output Contract

Every LLM response returns structured JSON.

Example Question

```json
{
  "question": "...",
  "difficulty": "medium",
  "topic": "RAG",
  "follow_up": false
}
```

Example Evaluation

```json
{
  "accuracy":4,
  "reasoning":5,
  "communication":4,
  "feedback":"..."
}
```

This avoids parsing free-form responses.

---

# 11. Personalization Example

Candidate Profile

- Completed Day 8
- Completed Day 9
- Skipped Day 15 (RAG)
- Two failed attempts on Day 18

↓

Interview Plan

- Begin with medium questions
- Probe RAG concepts
- Delay deployment questions

↓

Interview

Question 1

↓

Weak RAG answer

↓

Follow-up RAG clarification

↓

Strong answer

↓

Escalate to architecture-level RAG question

↓

Continue interview

---

# 12. State Persistence

Interview state is persisted using SQLite.

Each interview is uniquely identified using a Session ID.

If the backend restarts, interview progress can be restored.

---

# 13. Error Handling

If an LLM request fails:

1. Retry once.
2. Retry with exponential backoff.
3. If still unsuccessful, return a predefined backup question.

This prevents interview interruption during live demonstrations.

---

# 14. Out of Scope

The following are intentionally excluded:

- Authentication
- Rate Limiting
- Multi-user administration
- Analytics Dashboard
- Long-term Memory
- HR Integrations

These are future enhancements rather than hackathon requirements.

---

# 15. Future Enhancements

- Voice Interviews
- Resume Parsing
- ATS Integration
- HR Dashboard
- Interview Replay
- Multi-language Interviews
- Candidate Analytics
- Email Interview Reports