from app.models.interview_profile import InterviewProfile


class InterviewPolicy:
    """
    Responsible for deterministic interview decisions.

    This class NEVER calls the LLM.

    It decides:
    - Interview plan
    - Difficulty progression
    - Follow-up rules
    - Interview completion
    """

    MIN_QUESTIONS = 8
    MAX_QUESTIONS = 10
    MIN_CURRICULUM_DAYS = 4

    def __init__(self):
        pass

    def create_interview_plan(
        self,
        profile: InterviewProfile,
    ) -> list[dict]:

        plan = []
        selected_days = []

        # 1. Prioritize weak areas.
        for day in profile.weak_days:
            if day not in selected_days:
                selected_days.append(day)

        # 2. Add completed curriculum days.
        for day in profile.completed_days:
            if day not in selected_days:
                selected_days.append(day)

        # 3. Select at least the required number of
        # curriculum days, when available.
        selected_days = selected_days[: self.MIN_CURRICULUM_DAYS]

        # 4. Assign an initial difficulty and question type
        # to each curriculum area.
        question_types = [
            ("easy", "concept"),
            ("medium", "implementation"),
            ("medium", "scenario"),
            ("hard", "architecture"),
        ]

        for index, day in enumerate(selected_days):

            difficulty, question_type = question_types[
                min(index, len(question_types) - 1)
            ]

            plan.append(
                {
                    "day": day,
                    "difficulty": difficulty,
                    "type": question_type,
                }
            )

        return plan

    def next_difficulty(
        self,
        average_score: float,
    ) -> str:

        if average_score >= 4.5:
            return "hard"

        if average_score >= 3:
            return "medium"

        return "easy"

    def should_follow_up(
        self,
        score: float,
    ) -> bool:

        return score < 4

    def interview_complete(
        self,
        question_count: int,
    ) -> bool:

        return question_count >= self.MIN_QUESTIONS

    def should_increase_difficulty(
        self,
        score: float,
    ) -> bool:

        return score >= 4.5

    def should_decrease_difficulty(
        self,
        score: float,
    ) -> bool:

        return score <= 2.5