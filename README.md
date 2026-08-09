# Interview AI Agent

An adaptive AI technical interviewer that conducts personalized interviews based on a candidate's learning journey through the ABTalks AI Cohort.

The system uses curriculum-aware question generation, candidate context, adaptive follow-up questions, answer evaluation, and structured interview feedback.

## Features

- Adaptive technical interview flow
- Curriculum-aware question generation
- Candidate-specific interview context
- Dynamic follow-up questions
- Structured answer evaluation
- Interview feedback generation
- Session-based interview state
- Retrieval-based curriculum context
- Progress tracking
- Web-based interview interface

## Tech Stack

### Backend
- FastAPI
- Python
- Pydantic
- SQLite
- OpenRouter API

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### AI / Retrieval
- OpenRouter
- LLM-based question generation
- LLM-based answer evaluation
- Curriculum retrieval
- FAISS

## Architecture

The application is divided into a frontend and backend.

```text
Candidate
   |
   v
Next.js Frontend
   |
   v
FastAPI Backend
   |
   +----------------------+
   |                      |
   v                      v
Candidate / Session    Curriculum Retriever
Services                   |
   |                       v
   |                    Context
   |                       |
   +----------+------------+
              |
              v
        Interview AI
              |
       +------+------+
       |             |
       v             v
 Question       Answer
 Generation     Evaluation
       |             |
       +------+------+
              |
              v
       Interview Feedback