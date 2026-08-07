from dataclasses import dataclass, field
from typing import Any


@dataclass
class InterviewState:
    session_id: str

    candidate_id: str
    candidate_profile: dict[str, Any]

    interview_plan: list[dict[str, Any]]

    current_question: dict[str, Any] | None = None

    asked_questions: list[dict[str, Any]] = field(default_factory=list)

    candidate_answers: list[str] = field(default_factory=list)

    evaluation_history: list[dict[str, Any]] = field(default_factory=list)

    covered_topics: set[str] = field(default_factory=set)

    current_difficulty: str = "medium"

    interview_complete: bool = False

    final_feedback: dict[str, Any] | None = None

    running_summary: str = ""