// ---------------------------------------------------------------------------
// Backend API contract
// ---------------------------------------------------------------------------

export interface InterviewStartRequest {
  candidateId: string;
}

export interface InterviewQuestion {
  question: string;
  topic: string;
  difficulty: string;
  question_type: string;
  is_follow_up: boolean;
}

export interface InterviewProgress {
  currentQuestion: number;
  minimumQuestions: number;
  maximumQuestions: number;
  percentComplete: number;
  curriculumDaysCovered: number;
}

export interface InterviewStartResponse {
  sessionId: string;
  question: InterviewQuestion;
  progress: InterviewProgress;
  done: boolean;
}

export interface InterviewAnswerRequest {
  sessionId: string;
  answer: string;
}

export interface AnswerEvaluation {
  score: number;
  verdict: string;
  rationale: string;
  knowledge_gap: string;
}

export interface InterviewFeedback {
  summary: string;
  strengths: string[];
  gaps: string[];
  next: string[];
}

export interface InterviewAnswerResponse {
  sessionId: string;
  evaluation: AnswerEvaluation;
  question?: InterviewQuestion;
  progress?: InterviewProgress;
  done: boolean;
  feedback?: InterviewFeedback;
}

// ---------------------------------------------------------------------------
// UI-facing types
// ---------------------------------------------------------------------------

export type MessageRole = "interviewer" | "candidate";

export interface QuestionMetadata {
  topic?: string;
  difficulty?: string;
  questionType?: string;
}

export interface ConversationMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  metadata?: QuestionMetadata;
  evaluation?: AnswerEvaluation;
  isFollowUp?: boolean;
}

export interface InterviewUiState {
  candidateId: string | null;
  sessionId: string | null;

  messages: ConversationMessage[];

  progress: InterviewProgress | null;

  currentQuestion: InterviewQuestion | null;

  isComplete: boolean;

  feedback: InterviewFeedback | null;

  status:
    | "idle"
    | "starting"
    | "active"
    | "submitting"
    | "finished"
    | "error";

  error: string | null;
}

// ---------------------------------------------------------------------------
// API Error
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);

    this.name = "ApiError";

    this.status = status;
  }
}