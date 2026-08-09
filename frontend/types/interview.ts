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

  // Fields used by the frontend interview header.
  currentIndex?: number;
  totalQuestions?: number;
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

// ---------------------------------------------------------------------------
// Feedback types
// ---------------------------------------------------------------------------

export interface DimensionScore {
  name: string;
  score?: number;
  maxScore?: number;
  summary?: string;
}

export interface CurriculumCoverageItem {
  topic: string;
  covered: boolean;
}

/**
 * Feedback actually returned by the backend.
 *
 * The backend currently generates:
 * - summary
 * - strengths
 * - gaps
 * - next
 *
 * The additional fields are optional so the frontend can support
 * richer feedback later without breaking the current backend contract.
 */
export interface InterviewFeedback {
  summary: string;
  strengths: string[];
  gaps: string[];
  next: string[];

  overallScore?: number;
  maxScore?: number;
  dimensions?: DimensionScore[];
  rationale?: string;
  recommendedPath?: string[];
  curriculumCoverage?: CurriculumCoverageItem[];
}

/**
 * Final feedback report used by the results page.
 *
 * It extends the actual backend feedback contract instead of requiring
 * fields that the current backend does not return.
 */
export interface FeedbackReport extends InterviewFeedback {}

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

  // Used by the interview header for question numbering.
  index?: number;
  total?: number;
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