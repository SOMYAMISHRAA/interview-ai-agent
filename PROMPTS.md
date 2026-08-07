# AI Usage Log

This document records the significant AI-assisted development activities carried out while building the Interview AI Agent during the ABTalks Vibe Coding Hackathon.

The purpose of this log is to document how AI tools were used throughout the engineering process.

---

## 2026-08-08

### Session 1 — Project Planning & Architecture

#### Objective

Understand the hackathon problem statement and design a scalable architecture before writing code.

#### AI Used

- ChatGPT (GPT-5.5)

#### Discussion Topics

- Understanding the technical specification
- Breaking the system into modular components
- Choosing an appropriate technology stack
- Planning backend and frontend architecture
- Designing the interview pipeline

#### Decisions Made

- FastAPI for backend
- Next.js for frontend
- FAISS for semantic retrieval
- GPT-5.5 as the primary reasoning model
- Modular architecture separating:
  - Candidate Analyzer
  - Curriculum Retriever
  - Interview Planner
  - Interview Agent
  - Memory Manager
  - Feedback Generator

#### Outcome

Created the initial project structure and finalized the engineering approach before implementation.

---