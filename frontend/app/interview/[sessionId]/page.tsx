"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { RotateCcw } from "lucide-react";

import { useInterview } from "@/context/InterviewContext";
import { ConversationThread } from "@/components/interview/ConversationThread";
import { AnswerComposer } from "@/components/interview/AnswerComposer";
import { ErrorBanner } from "@/components/ui/error-banner";
import { Button } from "@/components/ui/button";

export default function InterviewRoomPage() {
  const router = useRouter();

  const params = useParams<{
    sessionId: string;
  }>();

  const { state, answer, reset } = useInterview();

  const sessionId = params.sessionId;

  const isKnownSession = state.sessionId === sessionId;

  const hasActiveSession = Boolean(
    isKnownSession && state.sessionId
  );

  // -------------------------------------------------------------------------
  // Redirect to results when interview is complete
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (
      hasActiveSession &&
      state.isComplete &&
      state.sessionId
    ) {
      router.push(
        `/interview/${state.sessionId}/results`
      );
    }
  }, [
    hasActiveSession,
    state.isComplete,
    state.sessionId,
    router,
  ]);

  // -------------------------------------------------------------------------
  // No active session
  // -------------------------------------------------------------------------

  if (!hasActiveSession) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-primary">
            No active interview
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-secondary">
            This session isn&apos;t active in your browser
            right now. This can happen after a page refresh,
            since interview progress is currently stored in
            memory.
          </p>

          <Button
            className="mt-6"
            onClick={() => {
              reset();
              router.push("/interview/setup");
            }}
          >
            Start a new interview
          </Button>
        </div>
      </main>
    );
  }

  // -------------------------------------------------------------------------
  // Loading / submitting state
  // -------------------------------------------------------------------------

  const isThinking =
    state.status === "starting" ||
    state.status === "submitting";

  // -------------------------------------------------------------------------
  // Interview room
  // -------------------------------------------------------------------------

  return (
    <main className="flex min-h-screen flex-col">
      {/* Header / progress area */}

      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-tertiary">
              AI Technical Interview
            </p>

            <h1 className="mt-1 text-lg font-semibold text-primary">
              Interview Session
            </h1>
          </div>

          {state.progress && (
            <div className="text-right">
              <p className="text-sm font-medium text-primary">
                Question{" "}
                {state.progress.currentQuestion}
                {" / "}
                {state.progress.minimumQuestions}
              </p>

              <p className="mt-1 text-xs text-tertiary">
                {state.progress.percentComplete}% complete
              </p>
            </div>
          )}
        </div>

        {state.progress && (
          <div className="h-1 w-full bg-border">
            <div
              className="h-1 bg-accent transition-all duration-500"
              style={{
                width: `${Math.min(
                  state.progress.percentComplete,
                  100
                )}%`,
              }}
            />
          </div>
        )}
      </header>

      {/* Conversation */}

      <div className="flex-1">
        <ConversationThread
          messages={state.messages}
          isThinking={isThinking}
        />
      </div>

      {/* Error */}

      {state.status === "error" &&
        state.error && (
          <div className="mx-auto w-full max-w-3xl px-4 pb-4 sm:px-6">
            <ErrorBanner
              title="Something interrupted the interview"
              message={state.error}
              onRetry={() => {
                reset();
                router.push("/interview/setup");
              }}
            />
          </div>
        )}

      {/* Answer composer */}

      {!state.isComplete && (
        <AnswerComposer
          onSubmit={answer}
          disabled={isThinking}
          autoFocus
        />
      )}

      {/* Restart */}

      <div className="border-t border-border px-4 py-3 text-center sm:px-6">
        <button
          type="button"
          onClick={() => {
            reset();
            router.push("/interview/setup");
          }}
          className="inline-flex items-center gap-1.5 text-xs text-tertiary transition-colors hover:text-secondary"
        >
          <RotateCcw
            className="h-3 w-3"
            aria-hidden="true"
          />

          Restart interview
        </button>
      </div>
    </main>
  );
}