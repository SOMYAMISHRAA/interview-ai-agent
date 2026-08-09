"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ScoreSummaryCardProps {
  overallScore?: number;
  maxScore?: number;
  summary?: string;
}

export function ScoreSummaryCard({
  overallScore,
  maxScore = 100,
  summary,
}: ScoreSummaryCardProps) {
  const hasScore = overallScore !== undefined && overallScore !== null;
  const percent = hasScore ? Math.min(100, (overallScore! / maxScore) * 100) : 0;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:items-center">
        <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
          <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#27272A"
              strokeWidth="8"
            />
            {hasScore && (
              <motion.circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#818CF8"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            )}
          </svg>
          <div className="absolute flex flex-col items-center">
            <Trophy className="mb-1 h-4 w-4 text-accent" aria-hidden="true" />
            <span className="text-2xl font-semibold text-primary">
              {hasScore ? Math.round(overallScore!) : "—"}
            </span>
            <span className="text-xs text-tertiary">of {maxScore}</span>
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm font-medium uppercase tracking-wide text-tertiary">
            Overall score
          </p>
          <p className="mt-2 text-base leading-relaxed text-secondary">
            {summary ??
              "A detailed summary wasn't included with this report, but your dimension breakdown below reflects how each answer was scored."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
