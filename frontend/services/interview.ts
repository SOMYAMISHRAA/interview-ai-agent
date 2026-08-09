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
  return apiRequest<InterviewStartResponse>("/interview/start", {
    method: "POST",
    body: request,
  });
}

/**
 * Submit the candidate's answer.
 */
export async function submitAnswer(
  request: InterviewAnswerRequest
): Promise<InterviewAnswerResponse> {
  return apiRequest<InterviewAnswerResponse>("/interview/answer", {
    method: "POST",
    body: request,
  });
}

/**
 * Get the final feedback for a completed interview.
 */
export async function getFeedback(
  sessionId: string
): Promise<FeedbackReport> {
  return apiRequest<FeedbackReport>(
    `/interview/${sessionId}/feedback`
  );
}