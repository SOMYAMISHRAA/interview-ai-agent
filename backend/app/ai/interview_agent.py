import json

from pydantic import BaseModel, Field
from openai import OpenAI

from app.core.config import settings


class GeneratedQuestion(BaseModel):
    """
    Structured output produced by the LLM when generating
    the next interview question.
    """

    question: str = Field(
        description="The technical interview question to ask the candidate."
    )

    topic: str = Field(
        description="The curriculum topic being tested."
    )

    difficulty: str = Field(
        description="Question difficulty: easy, medium, or hard."
    )

    question_type: str = Field(
        description=(
            "Question type: concept, implementation, scenario, or architecture."
        )
    )

    is_follow_up: bool = Field(
        description=(
            "Whether this question directly follows up on the candidate's "
            "previous answer."
        )
    )


class InterviewAgent:
    """
    AI layer responsible for generating interview questions.
    """

    def __init__(self):
        self.client = OpenAI(
            api_key=settings.OPENROUTER_API_KEY,
            base_url="https://openrouter.ai/api/v1",
        )

        self.model = settings.MODEL_NAME

    def generate_question(
        self,
        curriculum_context: list[dict],
        interview_plan: list[dict],
        conversation_history: list[dict],
        current_plan_item: dict,
        is_follow_up: bool = False,
    ) -> GeneratedQuestion:

        system_prompt = """
You are a technical interviewer for an AI engineering interview.

Generate exactly ONE technical interview question.

Rules:

1. Ask one clear question at a time.
2. Stay within the supplied curriculum.
3. Match the requested difficulty.
4. Prefer practical reasoning over memorized definitions.
5. If this is a follow-up, directly build on the candidate's previous answer.
6. Do not reveal the interview plan.
7. Do not mention internal policies or scoring.
8. Do not provide the answer.
9. Do not invent curriculum topics.
10. Keep the question concise.

Return ONLY a JSON object.

Required structure:

{
  "question": "technical interview question",
  "topic": "curriculum topic",
  "difficulty": "easy",
  "question_type": "concept",
  "is_follow_up": false
}

difficulty must be one of:

easy
medium
hard

question_type must be one of:

concept
implementation
scenario
architecture

is_follow_up must be true or false.
"""

        # Keep the prompt small for faster responses.
        relevant_curriculum = curriculum_context[:5]
        relevant_plan = interview_plan[:5]
        relevant_history = conversation_history[-4:]

        user_prompt = f"""
CURRENT INTERVIEW PLAN ITEM:

{current_plan_item}

CURRICULUM:

{relevant_curriculum}

INTERVIEW PLAN:

{relevant_plan}

RECENT CONVERSATION:

{relevant_history}

FOLLOW-UP:

{is_follow_up}

Generate the next interview question.

Return ONLY JSON.
"""

        # ---------------------------------------------------------
        # Generate question using OpenRouter
        # ---------------------------------------------------------

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],
            max_tokens=500,
            temperature=0.2,

            # Important for reasoning models such as gpt-oss.
            extra_body={
                "reasoning": {
                    "effort": "low",
                    "exclude": True,
                }
            },
        )

        # ---------------------------------------------------------
        # Debug response
        # ---------------------------------------------------------

        if not response.choices:
            raise RuntimeError(
                "The AI model returned no choices."
            )

        message = response.choices[0].message

        content = message.content

        print("\n========== INTERVIEW AI RESPONSE ==========")
        print("MODEL:", self.model)
        print("CONTENT:", repr(content))
        print(
            "REASONING:",
            repr(getattr(message, "reasoning", None))
        )
        print(
            "FINISH REASON:",
            response.choices[0].finish_reason
        )
        print("===========================================\n")

        # ---------------------------------------------------------
        # Empty response check
        # ---------------------------------------------------------

        if not content:
            raise RuntimeError(
                "The AI model returned an empty interview question."
            )

        content = content.strip()

        # ---------------------------------------------------------
        # Remove markdown code fences
        # ---------------------------------------------------------

        if content.startswith("```"):
            lines = content.splitlines()

            if lines and lines[0].strip().startswith("```"):
                lines = lines[1:]

            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]

            content = "\n".join(lines).strip()

        # ---------------------------------------------------------
        # Parse JSON
        # ---------------------------------------------------------

        try:
            question_data = json.loads(content)

        except json.JSONDecodeError:

            start = content.find("{")
            end = content.rfind("}")

            if start == -1 or end == -1 or end <= start:
                raise RuntimeError(
                    "The AI model returned invalid JSON "
                    "for the interview question."
                )

            json_text = content[start:end + 1]

            try:
                question_data = json.loads(json_text)

            except json.JSONDecodeError as exc:
                raise RuntimeError(
                    "The AI model returned invalid JSON "
                    "for the interview question."
                ) from exc

        # ---------------------------------------------------------
        # Validate JSON with Pydantic
        # ---------------------------------------------------------

        try:
            result = GeneratedQuestion.model_validate(
                question_data
            )

        except Exception as exc:
            raise RuntimeError(
                "The AI model returned JSON, but it did not match "
                "the expected interview question structure."
            ) from exc

        # ---------------------------------------------------------
        # Final safety check
        # ---------------------------------------------------------

        if not result.question.strip():
            raise RuntimeError(
                "The AI model generated an empty interview question."
            )

        return result