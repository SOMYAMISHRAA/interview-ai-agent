"use client";

import { Bot } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { InterviewProgress, QuestionMetadata } from "@/types/interview";

interface InterviewHeaderProps {
  progress: InterviewProgress | null;
  metadata?: QuestionMetadata;
}

export function InterviewHeader({ progress, metadata }: InterviewHeaderProps) {
  const currentIndex = progress?.currentIndex ?? metadata?.index;
  const totalQuestions = progress?.totalQuestions ?? metadata?.total;
  const percent =
    progress?.percentComplete ??
    (currentIndex && totalQuestions
      ? (currentIndex / totalQuestions) * 100
      : undefined);

  const questionLabel =
    currentIndex && totalQuestions
      ? `Question ${currentIndex} / ${totalQuestions}`
      : currentIndex
      ? `Question ${currentIndex}`
      : "Interview in progress";

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
              <Bot className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-medium leading-none text-primary">
                AI Interview Agent
              </p>
              <p className="mt-1 text-xs text-tertiary">{questionLabel}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {metadata?.topic && (
              <Badge tone="neutral" className="hidden sm:inline-flex">
                {metadata.topic}
              </Badge>
            )}
            {metadata?.difficulty && (
              <Badge tone="accent">{metadata.difficulty}</Badge>
            )}
          </div>
        </div>

        <div className="mt-3">
          <Progress
            value={percent ?? 0}
            label={`Interview progress: ${questionLabel}`}
          />
        </div>
      </div>
    </header>
  );
}
