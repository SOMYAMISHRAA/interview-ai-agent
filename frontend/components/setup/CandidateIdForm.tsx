"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, IdCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorBanner } from "@/components/ui/error-banner";
import { useInterview } from "@/context/InterviewContext";

export function CandidateIdForm() {
  const router = useRouter();
  const { begin, state } = useInterview();
  const [candidateId, setCandidateId] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const isLoading = state.status === "starting";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = candidateId.trim();

    if (!trimmed) {
      setValidationError("Enter a candidate ID to continue.");
      return;
    }
    if (trimmed.length < 3) {
      setValidationError("Candidate ID must be at least 3 characters.");
      return;
    }
    setValidationError(null);

    const sessionId = await begin(trimmed);
    if (sessionId) {
      router.push(`/interview/${sessionId}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div>
        <Label htmlFor="candidateId">Candidate ID</Label>
        <div className="relative">
          <IdCard
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tertiary"
            aria-hidden="true"
          />
          <Input
            id="candidateId"
            name="candidateId"
            placeholder="e.g. cand_9F21A"
            value={candidateId}
            onChange={(e) => {
              setCandidateId(e.target.value);
              if (validationError) setValidationError(null);
            }}
            disabled={isLoading}
            aria-invalid={Boolean(validationError)}
            aria-describedby={validationError ? "candidateId-error" : undefined}
            className="pl-10"
            autoComplete="off"
          />
        </div>
        {validationError && (
          <p id="candidateId-error" role="alert" className="mt-2 text-sm text-danger">
            {validationError}
          </p>
        )}
      </div>

      {state.status === "error" && state.error && (
        <ErrorBanner
          title="Couldn't start the interview"
          message={state.error}
        />
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full group"
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? "Starting interview…" : "Start Interview"}
        {!isLoading && (
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        )}
      </Button>
    </form>
  );
}
