from app.ai.feedback_generator import FeedbackGenerator


generator = FeedbackGenerator()


candidate_profile = {
    "candidate_id": "CAND-001",
    "candidate_name": "Test Candidate",
    "job_role": "AI Engineer",
    "years_experience": 2,
}


evaluation_history = [
    {
        "question": {
            "question": "What is the difference between zero-shot and few-shot prompting?",
            "topic": "Prompt Engineering Fundamentals",
            "difficulty": "easy",
        },
        "answer": (
            "Zero-shot prompting gives instructions without examples, "
            "while few-shot prompting provides examples of the expected "
            "input and output."
        ),
        "evaluation": {
            "score": 4,
            "verdict": "strong",
            "rationale": (
                "The candidate correctly explained the main distinction "
                "between zero-shot and few-shot prompting."
            ),
            "knowledge_gap": (
                "The answer did not discuss how to evaluate prompt "
                "variants systematically."
            ),
        },
    },
    {
        "question": {
            "question": "How would you evaluate different prompts in production?",
            "topic": "Monitoring, Logging & Observability",
            "difficulty": "medium",
        },
        "answer": (
            "I would compare accuracy and latency using test cases "
            "and monitor the API."
        ),
        "evaluation": {
            "score": 3,
            "verdict": "partial",
            "rationale": (
                "The candidate identified useful metrics but did not "
                "explain structured logging or production observability."
            ),
            "knowledge_gap": (
                "Structured production monitoring and observability."
            ),
        },
    },
]


covered_topics = {
    "Prompt Engineering Fundamentals",
    "Monitoring, Logging & Observability",
}


feedback = generator.generate_feedback(
    candidate_profile=candidate_profile,
    evaluation_history=evaluation_history,
    covered_topics=covered_topics,
)


print("\n========== FINAL FEEDBACK ==========\n")

print("SUMMARY:")
print(feedback.summary)

print("\nSTRENGTHS:")
for strength in feedback.strengths:
    print(f"- {strength}")

print("\nGAPS:")
for gap in feedback.gaps:
    print(f"- {gap}")

print("\nNEXT STEPS:")
for step in feedback.next:
    print(f"- {step}")

print("\n====================================\n")