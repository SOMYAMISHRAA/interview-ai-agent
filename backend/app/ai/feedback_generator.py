from pydantic import BaseModel, Field
from openai import OpenAI

from app.core.config import settings


class FinalFeedback(BaseModel):
    """
    Structured final feedback generated after the interview.
    """

    summary: str = Field(
        description="A concise overall assessment of the candidate."
    )

    strengths: list[str] = Field(
        description="The candidate's strongest technical areas."
    )

    gaps: list[str] = Field(
        description="Important technical areas the candidate should improve."
    )

    next: list[str] = Field(
        description=(
            "Concrete recommendations for the candidate's "
            "next learning steps."
        )
    )


class FeedbackGenerator:
    """
    Generates the final structured interview feedback.

    This class does NOT:
    - decide when the interview ends
    - manage session state
    - decide the interview plan

    Those responsibilities belong to the orchestrator and policy.
    """

    def __init__(self):

        self.client = OpenAI(
            api_key=settings.OPENROUTER_API_KEY,
            base_url="https://openrouter.ai/api/v1",
        )

        self.model = settings.MODEL_NAME

    def generate_feedback(
        self,
        candidate_profile: dict,
        evaluation_history: list[dict],
        covered_topics: set[str],
    ) -> FinalFeedback:

        system_prompt = """
You are a senior AI engineering interviewer providing final interview feedback.

Your feedback must be:

- technically grounded
- concise
- actionable
- constructive
- based only on the supplied interview evaluations
- useful for the candidate's next learning steps

Do not invent weaknesses that were not demonstrated.

Do not expose hidden reasoning or chain-of-thought.

Do not give generic advice such as "practice more".

Instead, connect recommendations to the candidate's demonstrated performance.

The feedback should contain:

1. An overall summary.
2. The strongest demonstrated technical areas.
3. The most important knowledge gaps.
4. Concrete next learning steps.
"""

        user_prompt = f"""
CANDIDATE PROFILE:

{candidate_profile}

EVALUATION HISTORY:

{evaluation_history}

CURRICULUM TOPICS COVERED:

{list(covered_topics)}

Generate the final interview feedback.
"""

        response = self.client.responses.parse(
            model=self.model,
            input=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],
            text_format=FinalFeedback,
            max_output_tokens=400,
        )

        if response.output_parsed is None:
            raise RuntimeError(
                "The AI model returned no structured final feedback."
            )

        return response.output_parsed