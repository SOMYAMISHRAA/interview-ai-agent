"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CurriculumCoverageItem } from "@/types/interview";

interface CurriculumCoverageProps {
  coverage?: CurriculumCoverageItem[];
}

export function CurriculumCoverage({ coverage }: CurriculumCoverageProps) {
  if (!coverage || coverage.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Curriculum coverage</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {coverage.map((item) => (
            <li
              key={item.topic}
              className="flex items-center gap-2 rounded-lg border border-border bg-elevated px-3 py-2 text-sm"
            >
              {item.covered ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-strength" aria-hidden="true" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-tertiary" aria-hidden="true" />
              )}
              <span
                className={cn(
                  "text-secondary",
                  item.covered && "text-primary"
                )}
              >
                {item.topic}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
