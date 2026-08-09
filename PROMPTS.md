# PROMPTS.md

# AI Development Log — Interview AI Agent

This file records the AI prompts and conversations used during the development of the Interview AI Agent.

The prompts below reflect the actual development process, including architecture, implementation, debugging, testing, model changes, documentation, and deployment preparation.

---

## 1. Initial Project Planning

### Prompt

I have to build an AI technical interviewer for the ABTalks AI Cohort. It should be adaptive and should ask questions based on what the candidate has actually studied.

I want this to be a proper project and not just a chatbot. It should have a backend, frontend, candidate context, curriculum retrieval, interview planning, question generation, answer evaluation, follow-up questions and final feedback.

How should I structure the project?

### Follow-up

I want the architecture to be clean and production-oriented because I also have to deploy it and submit a public GitHub repository.

---

## 2. Interview Architecture

### Prompt

How should I divide the responsibilities between the AI question generator, evaluator, candidate service, curriculum retriever and interview orchestration?

I don't want everything inside one file or one AI class.

### Follow-up

Which parts should actually be controlled by the AI and which parts should be deterministic application logic?

---

## 3. AI Interview Question Generator

### Prompt

I have an interview agent that needs to generate the next technical question.

It should receive curriculum context, interview plan, recent conversation history, current plan item and whether the question is a follow-up.

Can you design the Python class and structured output for this?

### Follow-up

I want the model to return structured JSON with question, topic, difficulty, question type and whether it is a follow-up.

---

## 4. OpenRouter Integration

### Prompt

I am using OpenRouter instead of directly calling an OpenAI model.

My client currently uses:

`https://openrouter.ai/api/v1`

How should I modify the OpenAI Python client configuration so I can use an OpenRouter model?

### Follow-up

I want the model name to come from the `.env` file so that I can change models without changing the Python code.

---

## 5. Structured Question Generation Error

### Problem

The `/interview/start` endpoint is returning a 500 error:

`The AI model returned an empty interview question.`

The request itself reaches the backend successfully.

### Prompt

What could cause the OpenRouter response to have no usable message content even though the API request succeeds?

Help me add proper validation and debugging around the response.

---

## 6. Switching From Responses API

### Prompt

I am using OpenRouter and structured output is not behaving reliably with the current implementation.

Would it be safer to use `chat.completions.create()` instead of `responses.parse()`?

If yes, rewrite the interview question generation code using chat completions and JSON output.

---

## 7. Interview Question JSON Validation

### Prompt

Sometimes the model returns JSON inside markdown code fences or returns additional text around the JSON.

Can you make the interview question generator robust enough to:

- remove markdown fences
- extract JSON if extra text exists
- parse the JSON
- validate it using Pydantic
- give a useful error if validation fails?

---

## 8. First Successful Interview Test

### Prompt

The interview now starts successfully and I can see the first question in the frontend.

The question is being generated from the curriculum and the progress shows Question 1 / 8.

What should I test next to make sure the complete interview flow works?

---

## 9. Answer Evaluation

### Prompt

Now the candidate can submit an answer.

I need an evaluator that receives the question, candidate answer and relevant curriculum context and determines whether the answer is correct, incomplete or needs a follow-up.

It should return structured evaluation data instead of only free-form text.

---

## 10. Evaluation Error

### Problem

After submitting an answer, the frontend shows:

`The AI model returned no structured answer evaluation and no text fallback.`

### Prompt

Why would the evaluator return an empty structured response even though the model is responding?

Help me make the evaluator handle empty content, invalid JSON and malformed structured output safely.

---

## 11. Invalid Evaluation JSON

### Problem

The backend returned an error similar to:

`The AI model returned invalid evaluation JSON`

and the frontend displayed the full model-generated evaluation text inside the error message.

### Prompt

The evaluator is clearly generating useful evaluation text, but it is not returning the JSON structure my code expects.

How should I modify the evaluator so that the model reliably returns the required JSON fields and the backend validates them correctly?

---

## 12. Follow-up Questions

### Prompt

The interview should not just move to the next planned question every time.

If the candidate gives an incomplete answer, the system should be able to ask a relevant follow-up question based on what they just said.

How should I implement this without putting the entire interview decision logic inside the LLM?

### Follow-up

I want the follow-up question to directly reference the candidate's previous answer and stay within the curriculum.

---

## 13. Testing Follow-up Behaviour

### Prompt

The first question works now.

Let's test the follow-up behaviour. Give me an example of a candidate answer that should cause the interviewer to ask a follow-up, and explain what should happen in the backend.

### Follow-up

I want the follow-up to appear as a separate question in the conversation rather than replacing the original question.

---

## 14. Frontend Interview Room

### Prompt

I have a Next.js interview page.

I need it to show:

- current interview question
- conversation history
- candidate answer box
- submitting/loading state
- errors
- progress
- restart interview button

Can you help structure the interview room component?

---

## 15. Session / 404 Problem

### Problem

When something goes wrong and I select "Try again" or start a new session, the browser sometimes goes to:

`/setup`

or an interview session URL and returns a 404.

### Prompt

The interview session is currently stored in browser memory.

How should the interview room handle a session ID that exists in the URL but no longer exists in the current client state?

I want the user to be able to restart the interview instead of seeing a broken page.

---

## 16. Candidate Service

### Prompt

I have a `candidate_service.py` inside the services directory.

I want candidate profile retrieval to stay separate from the interview orchestration and AI question generation.

What responsibilities should `candidate_service.py` have and how should the other components use it?

---

## 17. Curriculum Retrieval

### Prompt

The interviewer needs to ask questions based on the candidate's learning journey.

I already have a curriculum retriever.

How should the retrieved curriculum context flow into the interview plan and then into question generation?

---

## 18. Interview Policy

### Prompt

I don't want the LLM to decide everything.

I want deterministic rules for things like:

- minimum number of questions
- when the interview can end
- when a follow-up is allowed
- how interview progress is calculated

How should I separate this into an interview policy component?

---

## 19. Debugging Empty Question After Several Answers

### Problem

The interview works for several questions, but later the backend shows:

`The AI model returned an empty interview question.`

The server log shows:

`CONTENT: None`

### Prompt

The model is sometimes returning `message.content = None`.

How can I debug whether this is caused by the model, OpenRouter, response format, token limit or the way I am reading the response?

---

## 20. Model Configuration

### Problem

The project originally had:

`MODEL_NAME=openai/gpt-5.5`

in `.env.example`, but I am actually using an OpenRouter free model for development.

### Prompt

I am using:

`MODEL_NAME=openai/gpt-oss-20b:free`

in my `.env`.

Should `.env.example` contain the same model name, and what should I put there without exposing my API key?

---

## 21. OpenRouter Rate Limit

### Problem

The interview eventually returned:

`Rate limit exceeded: free-models-per-day`

### Prompt

OpenRouter is returning a 429 because I reached the free model daily limit.

Does this mean my application is broken, or is this only an API usage limitation?

How should I make the model configurable so I can switch to another model later without changing the application?

---

## 22. Testing the Complete Interview

### Prompt

The application is now able to:

- start an interview
- generate questions
- accept answers
- evaluate answers
- generate follow-ups
- continue to later questions
- show progress

What should I test before preparing the project for submission?

---

## 23. README Preparation

### Prompt

I need to prepare the README for submission.

The project needs a public GitHub repository and a live deployed URL.

Help me write a README that describes what the project actually does, its architecture, features, tech stack, local setup and deployment without claiming things that aren't implemented.

---

## 24. Submission Requirements

### Prompt

The submission requires:

1. A public GitHub repository with the complete source code.
2. A live deployed URL.
3. A `PROMPTS.md` file at the repository root containing the prompts and AI conversations used while building.

What exactly should I prepare before submitting?

---

## 25. PROMPTS.md

### Prompt

I need a `PROMPTS.md` file at the root of my repository.

It should document the AI prompts and conversations I actually used while building the project.

The log should look realistic and include the actual development process such as architecture questions, coding prompts, debugging, model switching, follow-up logic, testing and deployment preparation.

---

## 26. Deployment Preparation

### Prompt

The project has a Next.js frontend and FastAPI backend.

I need a public live URL for submission.

What is the simplest deployment architecture where the frontend and backend can communicate correctly, environment variables stay secret, and the evaluator can open and test the application?

### Follow-up

I need to deploy this quickly, so let's do it step by step and verify each part before moving to the next one.

---

# Development Notes

During development, different AI models and tools were used when necessary. Model/API limitations were handled by switching to another available model rather than changing the overall application architecture.

The final application was manually tested through the local frontend and backend, including interview creation, question generation, answer submission, evaluation, follow-up questions, progress tracking and error handling.