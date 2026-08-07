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

        # Prioritize weak areas first
        selected_days.extend(profile.weak_days)

        # Add completed curriculum days
        for day in profile.completed_days:

            if day not in selected_days:
                selected_days.append(day)

        # Keep only required number of curriculum days
        selected_days = selected_days[: self.MIN_CURRICULUM_DAYS]

        # Create structured interview plan
        for index, day in enumerate(selected_days):

            if index == 0:
                difficulty = "easy"
                question_type = "concept"

            elif index == 1:
                difficulty = "medium"
                question_type = "implementation"

            elif index == 2:
                difficulty = "medium"
                question_type = "scenario"

            else:
                difficulty = "hard"
                question_type = "architecture"

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