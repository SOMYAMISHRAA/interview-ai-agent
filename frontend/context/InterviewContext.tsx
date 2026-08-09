"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

import {
  startInterview,
  submitAnswer as submitAnswerRequest,
} from "@/services/interview";

import type {
  AnswerEvaluation,
  ConversationMessage,
  InterviewAnswerResponse,
  InterviewFeedback,
  InterviewQuestion,
  InterviewProgress,
  InterviewUiState,
} from "@/types/interview";

import { ApiError } from "@/types/interview";

// ---------------------------------------------------------------------------
// Reducer actions
// ---------------------------------------------------------------------------

type Action =
  | {
      type: "START_REQUEST";
      candidateId: string;
    }
  | {
      type: "START_SUCCESS";
      sessionId: string;
      message: ConversationMessage | null;
      progress: InterviewProgress | null;
      currentQuestion: InterviewQuestion | null;
    }
  | {
      type: "START_FAILURE";
      error: string;
    }
  | {
      type: "SUBMIT_REQUEST";
      message: ConversationMessage;
    }
  | {
      type: "SUBMIT_SUCCESS";
      message: ConversationMessage | null;
      progress: InterviewProgress | null;
      currentQuestion: InterviewQuestion | null;
      isComplete: boolean;
      feedback: InterviewFeedback | null;
      evaluation: AnswerEvaluation | undefined;
    }
  | {
      type: "SUBMIT_FAILURE";
      error: string;
    }
  | {
      type: "SET_FEEDBACK";
      feedback: InterviewFeedback;
    }
  | {
      type: "RESET";
    }
  | {
      type: "HYDRATE_SESSION";
      sessionId: string;
    };

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const initialState: InterviewUiState = {
  candidateId: null,
  sessionId: null,
  messages: [],
  progress: null,
  currentQuestion: null,
  isComplete: false,
  feedback: null,
  status: "idle",
  error: null,
};

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function reducer(
  state: InterviewUiState,
  action: Action
): InterviewUiState {
  switch (action.type) {
    case "START_REQUEST":
      return {
        ...initialState,
        candidateId: action.candidateId,
        status: "starting",
      };

    case "START_SUCCESS":
      return {
        ...state,
        sessionId: action.sessionId,
        status: "active",
        error: null,
        progress: action.progress,
        currentQuestion: action.currentQuestion,
        messages: action.message
          ? [action.message]
          : [],
      };

    case "START_FAILURE":
      return {
        ...state,
        status: "error",
        error: action.error,
      };

    case "SUBMIT_REQUEST":
      return {
        ...state,
        status: "submitting",
        messages: [
          ...state.messages,
          action.message,
        ],
        error: null,
      };

    case "SUBMIT_SUCCESS": {
      const messagesWithEvaluation =
        action.evaluation
          ? attachEvaluationToLastCandidateMessage(
              state.messages,
              action.evaluation
            )
          : state.messages;

      return {
        ...state,

        status: action.isComplete
          ? "finished"
          : "active",

        messages: action.message
          ? [
              ...messagesWithEvaluation,
              action.message,
            ]
          : messagesWithEvaluation,

        progress:
          action.progress ?? state.progress,

        currentQuestion:
          action.currentQuestion ??
          state.currentQuestion,

        isComplete:
          action.isComplete,

        feedback:
          action.feedback ??
          state.feedback,

        error: null,
      };
    }

    case "SUBMIT_FAILURE":
      return {
        ...state,
        status: "error",
        error: action.error,
      };

    case "SET_FEEDBACK":
      return {
        ...state,
        feedback: action.feedback,
      };

    case "HYDRATE_SESSION":
      return {
        ...state,
        sessionId: action.sessionId,
      };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function attachEvaluationToLastCandidateMessage(
  messages: ConversationMessage[],
  evaluation: AnswerEvaluation
): ConversationMessage[] {
  const lastCandidateIndex = [...messages]
    .map((message, index) => ({
      message,
      index,
    }))
    .reverse()
    .find(
      ({ message }) =>
        message.role === "candidate"
    )?.index;

  if (lastCandidateIndex === undefined) {
    return messages;
  }

  return messages.map((message, index) =>
    index === lastCandidateIndex
      ? {
          ...message,
          evaluation,
        }
      : message
  );
}

function makeId(): string {
  return `msg_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface InterviewContextValue {
  state: InterviewUiState;

  begin: (
    candidateId: string
  ) => Promise<string | null>;

  answer: (
    answerText: string
  ) => Promise<void>;

  reset: () => void;

  hydrateSessionId: (
    sessionId: string
  ) => void;
}

const InterviewContext =
  createContext<InterviewContextValue | null>(
    null
  );

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function InterviewProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(
    reducer,
    initialState
  );

  // -------------------------------------------------------------------------
  // Start interview
  // -------------------------------------------------------------------------

  const begin = useCallback(
    async (candidateId: string) => {
      dispatch({
        type: "START_REQUEST",
        candidateId,
      });

      try {
        const response =
          await startInterview({
            candidateId,
          });

        const question =
          response.question;

        const message: ConversationMessage =
          {
            id: makeId(),

            role: "interviewer",

            content:
              question.question,

            timestamp:
              Date.now(),

            metadata: {
              topic:
                question.topic,

              difficulty:
                question.difficulty,

              questionType:
                question.question_type,
            },

            isFollowUp:
              question.is_follow_up,
          };

        dispatch({
          type: "START_SUCCESS",

          sessionId:
            response.sessionId,

          message,

          progress:
            response.progress ?? null,

          currentQuestion:
            response.question ?? null,
        });

        return response.sessionId;
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : "Something went wrong starting the interview. Please try again.";

        dispatch({
          type: "START_FAILURE",
          error: message,
        });

        return null;
      }
    },
    []
  );

  // -------------------------------------------------------------------------
  // Submit candidate answer
  // -------------------------------------------------------------------------

  const answer = useCallback(
    async (answerText: string) => {
      if (!state.sessionId) {
        dispatch({
          type: "SUBMIT_FAILURE",
          error:
            "There's no active interview session.",
        });

        return;
      }

      const trimmedAnswer =
        answerText.trim();

      if (!trimmedAnswer) {
        dispatch({
          type: "SUBMIT_FAILURE",
          error:
            "Please enter an answer before submitting.",
        });

        return;
      }

      const candidateMessage:
        ConversationMessage = {
          id: makeId(),

          role: "candidate",

          content: trimmedAnswer,

          timestamp: Date.now(),
        };

      dispatch({
        type: "SUBMIT_REQUEST",
        message: candidateMessage,
      });

      try {
        const response: InterviewAnswerResponse =
          await submitAnswerRequest({
            sessionId:
              state.sessionId,

            answer:
              trimmedAnswer,
          });

        const nextMessage:
          ConversationMessage | null =
          response.question
            ? {
                id: makeId(),

                role: "interviewer",

                content:
                  response.question.question,

                timestamp:
                  Date.now(),

                metadata: {
                  topic:
                    response.question.topic,

                  difficulty:
                    response.question.difficulty,

                  questionType:
                    response.question
                      .question_type,
                },

                isFollowUp:
                  response.question
                    .is_follow_up,
              }
            : null;

        dispatch({
          type: "SUBMIT_SUCCESS",

          message:
            nextMessage,

          progress:
            response.progress ??
            state.progress,

          currentQuestion:
            response.question ??
            null,

          isComplete:
            response.done,

          feedback:
            response.feedback ??
            null,

          evaluation:
            response.evaluation,
        });
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : "Something went wrong submitting your answer. Please try again.";

        dispatch({
          type: "SUBMIT_FAILURE",
          error: message,
        });
      }
    },
    [state.sessionId]
  );

  // -------------------------------------------------------------------------
  // Reset
  // -------------------------------------------------------------------------

  const reset = useCallback(() => {
    dispatch({
      type: "RESET",
    });
  }, []);

  // -------------------------------------------------------------------------
  // Hydrate session
  // -------------------------------------------------------------------------

  const hydrateSessionId =
    useCallback(
      (sessionId: string) => {
        dispatch({
          type: "HYDRATE_SESSION",
          sessionId,
        });
      },
      []
    );

  // -------------------------------------------------------------------------
  // Context value
  // -------------------------------------------------------------------------

  const value = useMemo(
    () => ({
      state,
      begin,
      answer,
      reset,
      hydrateSessionId,
    }),
    [
      state,
      begin,
      answer,
      reset,
      hydrateSessionId,
    ]
  );

  return (
    <InterviewContext.Provider
      value={value}
    >
      {children}
    </InterviewContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useInterview() {
  const context =
    useContext(InterviewContext);

  if (!context) {
    throw new Error(
      "useInterview must be used within an InterviewProvider"
    );
  }

  return context;
}