from dataclasses import dataclass, field


@dataclass
class InterviewProfile:
    candidate_id: str
    candidate_name: str
    job_role: str
    years_experience: int
    education: str

    completed_days: list[int] = field(default_factory=list)
    skipped_days: list[int] = field(default_factory=list)
    failed_days: list[int] = field(default_factory=list)

    strong_days: list[int] = field(default_factory=list)
    weak_days: list[int] = field(default_factory=list)

    difficulty: str = "medium"

    commit_days: int = 0
    missions_completed: int = 0
    first_try_success: int = 0