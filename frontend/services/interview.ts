import { apiRequest } from "@/lib/api";

import type {
  InterviewStartRequest,
  InterviewStartResponse,
  InterviewAnswerRequest,
  InterviewAnswerResponse,
  FeedbackReport,
} from "@/types/interview";

/**
 * Start a new interview.
 */
export async function startInterview(
  request: InterviewStartRequest
): Promise<InterviewStartResponse> {
  return apiRequest<InterviewStartResponse>(
    "/interview/start",
    {
      method: "POST",
      body: request,
    }
  );
}

/**
 * Submit the candidate's answer.
 */
export async function submitAnswer(
  request: InterviewAnswerRequest
): Promise<InterviewAnswerResponse> {
  return apiRequest<InterviewAnswerResponse>(
    "/interview/answer",
    {
      method: "POST",
      body: request,
    }
  );
}

/**
 * Fetch the final feedback for a completed interview.
 */
export async function getFeedback(
  sessionId: string
): Promise<FeedbackReport> {
  const response = await apiRequest<{
    sessionId: string;
    feedback: FeedbackReport;
  }>(
    `/interview/${sessionId}/feedback`,
    {
      method: "GET",
    }
  );

  return {
    ...response.feedback,

    // The backend currently calls these "next".
    // The results UI calls them "recommendedPath".
    recommendedPath:
      response.feedback.recommendedPath ??
      response.feedback.next,
  };
}