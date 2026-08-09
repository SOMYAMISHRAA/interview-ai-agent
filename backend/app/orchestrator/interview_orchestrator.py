import uuid
from typing import Any

from app.ai.evaluator import InterviewEvaluator
from app.ai.feedback_generator import FeedbackGenerator
from app.ai.interview_agent import InterviewAgent
from app.policy.interview_policy import InterviewPolicy
from app.retriever.curriculum_retriever import CurriculumRetriever
from app.services.candidate_service import CandidateService
from app.state.interview_state import InterviewState
from app.state.session_store import session_store


class InterviewOrchestrator:
    """
    Central workflow coordinator for the AI Interview Agent.

    Responsibilities:
    - Start interviews
    - Load candidate profiles
    - Create interview plans
    - Generate questions
    - Evaluate answers
    - Decide follow-ups and difficulty changes
    - Track interview state
    - Generate final feedback

    The orchestrator coordinates components but does not contain
    LLM prompts or model-specific logic.
    """

    def __init__(self):

        self.candidate_service = CandidateService()
        self.curriculum_retriever = CurriculumRetriever()

        self.policy = InterviewPolicy()

        self.interview_agent = InterviewAgent()
        self.evaluator = InterviewEvaluator()
        self.feedback_generator = FeedbackGenerator()

        # Expose the shared session store to the API layer.
        self.session_store = session_store

    # ------------------------------------------------------------------
    # START INTERVIEW
    # ------------------------------------------------------------------

    def start_interview(self, candidate_id: str) -> dict[str, Any]:

        profile = self.candidate_service.build_interview_profile(
            candidate_id
        )

        if profile is None:
            raise ValueError(
                f"Candidate '{candidate_id}' was not found."
            )

        # Create deterministic interview plan.
        interview_plan = self.policy.create_interview_plan(
            profile
        )

        # The hackathon requires at least four curriculum days.
        if len(interview_plan) < self.policy.MIN_CURRICULUM_DAYS:
            raise ValueError(
                "Candidate does not have enough curriculum coverage "
                "to conduct the required interview."
            )

        session_id = str(uuid.uuid4())

        # Retrieve curriculum context for selected days.
        selected_days = [
            item["day"]
            for item in interview_plan
        ]

        curriculum_context = self.curriculum_retriever.get_context(
            selected_days
        )

        # Generate the first question.
        first_plan_item = interview_plan[0]

        question = self.interview_agent.generate_question(
            curriculum_context=curriculum_context,
            interview_plan=interview_plan,
            conversation_history=[],
            current_plan_item=first_plan_item,
            is_follow_up=False,
        )

        question_data = question.model_dump()

        # Create interview state.
        state = InterviewState(
            session_id=session_id,
            candidate_id=candidate_id,
            candidate_profile=profile.__dict__,
            interview_plan=interview_plan,
            current_question=question_data,
            current_difficulty=question.difficulty,
        )

        state.asked_questions.append(question_data)

        state.covered_topics.add(question.topic)

        self.session_store.create(state)

        return {
            "sessionId": session_id,
            "question": question_data,
            "progress": self._build_progress(state),
            "done": False,
        }

    # ------------------------------------------------------------------
    # SUBMIT ANSWER
    # ------------------------------------------------------------------

    def submit_answer(
        self,
        session_id: str,
        answer: str,
    ) -> dict[str, Any]:

        state = self.session_store.get(session_id)

        if state is None:
            raise ValueError(
                f"Interview session '{session_id}' was not found."
            )

        if state.interview_complete:
            return {
                "sessionId": session_id,
                "done": True,
                "feedback": state.final_feedback,
                "progress": self._build_progress(state),
            }

        if state.current_question is None:
            raise ValueError(
                "No active interview question exists."
            )

        # --------------------------------------------------------------
        # 1. Evaluate candidate answer
        # --------------------------------------------------------------

        selected_days = [
            item["day"]
            for item in state.interview_plan
        ]

        curriculum_context = self.curriculum_retriever.get_context(
            selected_days
        )

        evaluation = self.evaluator.evaluate_answer(
            question=state.current_question,
            candidate_answer=answer,
            curriculum_context=curriculum_context,
        )

        evaluation_data = evaluation.model_dump()

        # --------------------------------------------------------------
        # 2. Store candidate answer and evaluation
        # --------------------------------------------------------------

        state.candidate_answers.append(answer)

        state.evaluation_history.append(
            {
                "question": state.current_question,
                "answer": answer,
                "evaluation": evaluation_data,
            }
        )

        # --------------------------------------------------------------
        # 3. Check whether interview is complete
        # --------------------------------------------------------------

        question_count = len(state.asked_questions)

        if self.policy.interview_complete(question_count):

            state.interview_complete = True

            feedback = self.feedback_generator.generate_feedback(
                candidate_profile=state.candidate_profile,
                evaluation_history=state.evaluation_history,
                covered_topics=state.covered_topics,
            )

            state.final_feedback = feedback.model_dump()

            self.session_store.update(state)

            return {
                "sessionId": session_id,
                "evaluation": evaluation_data,
                "done": True,
                "feedback": state.final_feedback,
                "progress": self._build_progress(state),
            }

        # --------------------------------------------------------------
        # 4. Determine next difficulty
        # --------------------------------------------------------------

        score = evaluation.score

        if self.policy.should_increase_difficulty(score):

            state.current_difficulty = "hard"

        elif self.policy.should_decrease_difficulty(score):

            state.current_difficulty = "easy"

        else:

            state.current_difficulty = self.policy.next_difficulty(
                score
            )

        # --------------------------------------------------------------
        # 5. Decide whether this should be a follow-up
        # --------------------------------------------------------------

        is_follow_up = self.policy.should_follow_up(score)

        # --------------------------------------------------------------
        # 6. Determine next curriculum plan item
        # --------------------------------------------------------------

        next_plan_item = self._get_next_plan_item(state)

        if next_plan_item is None:

            next_plan_item = {
                "day": state.interview_plan[
                    question_count % len(state.interview_plan)
                ]["day"],
                "difficulty": state.current_difficulty,
                "type": "scenario",
            }

        else:

            next_plan_item = {
                **next_plan_item,
                "difficulty": state.current_difficulty,
            }

        # --------------------------------------------------------------
        # 7. Build conversation history
        # --------------------------------------------------------------

        conversation_history = []

        for item in state.evaluation_history:

            conversation_history.append(
                {
                    "question": item["question"],
                    "answer": item["answer"],
                    "evaluation": item["evaluation"],
                }
            )

        # --------------------------------------------------------------
        # 8. Generate next question
        # --------------------------------------------------------------

        next_question = self.interview_agent.generate_question(
            curriculum_context=curriculum_context,
            interview_plan=state.interview_plan,
            conversation_history=conversation_history,
            current_plan_item=next_plan_item,
            is_follow_up=is_follow_up,
        )

        next_question_data = next_question.model_dump()

        # --------------------------------------------------------------
        # 9. Update state
        # --------------------------------------------------------------

        state.current_question = next_question_data

        state.asked_questions.append(next_question_data)

        state.covered_topics.add(
            next_question.topic
        )

        self.session_store.update(state)

        return {
            "sessionId": session_id,
            "evaluation": evaluation_data,
            "question": next_question_data,
            "done": False,
            "progress": self._build_progress(state),
        }

    # ------------------------------------------------------------------
    # HELPERS
    # ------------------------------------------------------------------

    def _get_next_plan_item(
        self,
        state: InterviewState,
    ) -> dict[str, Any] | None:

        current_question_count = len(
            state.asked_questions
        )

        plan_index = current_question_count

        if plan_index < len(state.interview_plan):
            return state.interview_plan[plan_index]

        return None

    def _build_progress(
        self,
        state: InterviewState,
    ) -> dict[str, Any]:

        question_count = len(
            state.asked_questions
        )

        total = self.policy.MAX_QUESTIONS

        percent = min(
            int((question_count / total) * 100),
            100,
        )

        return {
            "currentQuestion": question_count,
            "minimumQuestions": self.policy.MIN_QUESTIONS,
            "maximumQuestions": self.policy.MAX_QUESTIONS,
            "percentComplete": percent,
            "curriculumDaysCovered": len(
                state.covered_topics
            ),
        }