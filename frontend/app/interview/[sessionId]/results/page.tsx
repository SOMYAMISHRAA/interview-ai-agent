"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { RotateCcw, ArrowLeft } from "lucide-react";
import { useInterview } from "@/context/InterviewContext";
import { getFeedback } from "@/services/interview";
import { ApiError, type FeedbackReport } from "@/types/interview";
import { ScoreSummaryCard } from "@/components/feedback/ScoreSummaryCard";
import { DimensionBreakdown } from "@/components/feedback/DimensionBreakdown";
import { StrengthsAndGaps } from "@/components/feedback/StrengthsAndGaps";
import { EvaluationRationale } from "@/components/feedback/EvaluationRationale";
import { RecommendedPath } from "@/components/feedback/RecommendedPath";
import { CurriculumCoverage } from "@/components/feedback/CurriculumCoverage";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResultsPage() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  const { state, reset } = useInterview();

  const isKnownSession = state.sessionId === params.sessionId;

  const [fetchedFeedback, setFetchedFeedback] = useState<FeedbackReport | null>(
    null
  );
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const feedback = (isKnownSession ? state.feedback : null) ?? fetchedFeedback;

  useEffect(() => {
    // If the interview finished without an inline feedback payload, try the
    // dedicated feedback endpoint. This is best-effort: the endpoint may not
    // exist yet on the current backend contract.
    if (!isKnownSession || state.feedback || feedback) return;
    let cancelled = false;
    setIsFetching(true);
    getFeedback(params.sessionId)
      .then((res) => {
        if (!cancelled) setFetchedFeedback(res);
      })
      .catch((err) => {
        if (!cancelled) {
          setFetchError(
            err instanceof ApiError
              ? err.message
              : "Feedback isn't available for this session yet."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsFetching(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isKnownSession, params.sessionId]);

  if (!isKnownSession) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-sm">
          <h1 className="text-xl font-semibold text-primary">
            No feedback to show
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-secondary">
            This session isn&apos;t active in your browser. Start a new
            interview to get a feedback report.
          </p>
          <Link href="/interview/setup" className="mt-6 inline-block">
            <Button>Start a new interview</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-tertiary transition-colors hover:text-secondary"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to home
        </Link>

        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wider text-accent">
            Interview complete
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-primary">
            Your feedback report
          </h1>
        </div>

        {isFetching && (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}

        {!isFetching && fetchError && !feedback && (
          <ErrorBanner
            title="Feedback isn't available"
            message={fetchError}
          />
        )}

        {!isFetching && feedback && (
          <div className="space-y-6">
            <ScoreSummaryCard
              overallScore={feedback.overallScore}
              maxScore={feedback.maxScore}
              summary={feedback.summary}
            />
            <DimensionBreakdown dimensions={feedback.dimensions} />
            <StrengthsAndGaps strengths={feedback.strengths} gaps={feedback.gaps} />
            <EvaluationRationale rationale={feedback.rationale} />
            <RecommendedPath recommendedPath={feedback.recommendedPath} />
            <CurriculumCoverage coverage={feedback.curriculumCoverage} />
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Button
            variant="secondary"
            onClick={() => {
              reset();
              router.push("/interview/setup");
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Start new interview
          </Button>
        </div>
      </div>
    </main>
  );
}
