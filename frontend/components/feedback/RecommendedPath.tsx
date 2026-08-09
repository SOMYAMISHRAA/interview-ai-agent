"use client";

import { Milestone } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface RecommendedPathProps {
  recommendedPath?: string[];
}

export function RecommendedPath({ recommendedPath }: RecommendedPathProps) {
  if (!recommendedPath || recommendedPath.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Milestone className="h-4 w-4 text-accent" aria-hidden="true" />
          Recommended next steps
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3">
          {recommendedPath.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-secondary">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 font-mono text-[11px] text-accent">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
