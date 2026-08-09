import json

from pydantic import BaseModel, Field
from openai import OpenAI

from app.core.config import settings


class AnswerEvaluation(BaseModel):
    """
    Structured evaluation of a candidate's answer.
    """

    score: float = Field(
        description="Score from 0 to 5."
    )

    verdict: str = Field(
        description="One of: excellent, strong, partial, weak, incorrect."
    )

    rationale: str = Field(
        description="Short explanation of the candidate's performance."
    )

    knowledge_gap: str = Field(
        description="Most important missing concept. Empty string if none."
    )


class InterviewEvaluator:
    """
    AI layer responsible for evaluating candidate answers.

    This class only evaluates the answer.

    InterviewPolicy is responsible for:
    - deciding whether the interview ends
    - deciding the next question
    - deciding difficulty
    - deciding whether a follow-up happens
    """

    def __init__(self):

        self.client = OpenAI(
            api_key=settings.OPENROUTER_API_KEY,
            base_url="https://openrouter.ai/api/v1",
        )

        self.model = settings.MODEL_NAME

    def evaluate_answer(
        self,
        question: dict,
        candidate_answer: str,
        curriculum_context: list[dict],
    ) -> AnswerEvaluation:

        system_prompt = """
You are an AI technical interviewer.

Evaluate the candidate's answer to the interview question.

Give a score from 0 to 5.

Scoring:

5 = Excellent
4 = Strong
3 = Partial
2 = Weak
1 = Very weak
0 = Incorrect

Evaluate only what the question asks.

Do not require unrelated information.

Do not reward technically incorrect statements.

Keep the explanation short.

Return ONLY one JSON object.

The JSON must contain exactly:

{
  "score": 4,
  "verdict": "strong",
  "rationale": "Short explanation.",
  "knowledge_gap": "Missing concept."
}

Allowed verdict values:

excellent
strong
partial
weak
incorrect

If there is no meaningful knowledge gap:

"knowledge_gap": ""
"""

        # Keep the curriculum small.
        relevant_curriculum = curriculum_context[:5]

        user_prompt = f"""
Interview question:

{question}

Candidate answer:

{candidate_answer}

Relevant curriculum:

{relevant_curriculum}

Evaluate the candidate answer.

IMPORTANT:
Return ONLY the JSON object.
Do not explain your reasoning.
Do not use markdown.
Do not write anything before or after the JSON.
"""

        # ---------------------------------------------------------
        # Call OpenRouter
        # ---------------------------------------------------------

        try:

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
                response_format={
                    "type": "json_object"
                },
                max_tokens=800,
                temperature=0.1,
            )

        except Exception as exc:

            raise RuntimeError(
                f"AI answer evaluation request failed: {exc}"
            ) from exc

        # ---------------------------------------------------------
        # Check choices
        # ---------------------------------------------------------

        if not response.choices:

            raise RuntimeError(
                "The AI model returned no choices while evaluating "
                "the candidate answer."
            )

        message = response.choices[0].message

        # ---------------------------------------------------------
        # Get normal model content
        # ---------------------------------------------------------

        content = message.content

        # Some OpenRouter models can return an empty content field.
        # Check whether another message field contains text.
        if not content:

            # Try reasoning_content if the provider exposes it.
            reasoning_content = getattr(
                message,
                "reasoning_content",
                None,
            )

            if reasoning_content:
                content = reasoning_content

        if not content:

            raise RuntimeError(
                "The AI model returned no evaluation content. "
                f"Model: {self.model}"
            )

        content = content.strip()

        # ---------------------------------------------------------
        # Remove markdown fences if present
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

            evaluation_data = json.loads(content)

        except json.JSONDecodeError:

            # Try to find a JSON object inside the response.

            start = content.find("{")
            end = content.rfind("}")

            if (
                start == -1
                or end == -1
                or end <= start
            ):

                raise RuntimeError(
                    "The AI model returned invalid evaluation JSON: "
                    + content
                )

            json_text = content[start : end + 1]

            try:

                evaluation_data = json.loads(
                    json_text
                )

            except json.JSONDecodeError as exc:

                raise RuntimeError(
                    "The AI model returned invalid JSON "
                    "for answer evaluation."
                ) from exc

        # ---------------------------------------------------------
        # Validate using Pydantic
        # ---------------------------------------------------------

        try:

            evaluation = AnswerEvaluation.model_validate(
                evaluation_data
            )

        except Exception as exc:

            raise RuntimeError(
                "The AI model returned JSON, but it did not match "
                "the expected evaluation structure."
            ) from exc

        # ---------------------------------------------------------
        # Validate score
        # ---------------------------------------------------------

        if not 0 <= evaluation.score <= 5:

            raise RuntimeError(
                "The AI model returned a score outside "
                "the valid 0-5 range."
            )

        # ---------------------------------------------------------
        # Validate verdict
        # ---------------------------------------------------------

        allowed_verdicts = {
            "excellent",
            "strong",
            "partial",
            "weak",
            "incorrect",
        }

        if evaluation.verdict not in allowed_verdicts:

            raise RuntimeError(
                "The AI model returned an invalid verdict."
            )

        return evaluation