"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { DimensionScore } from "@/types/interview";

interface DimensionBreakdownProps {
  dimensions?: DimensionScore[];
}

export function DimensionBreakdown({ dimensions }: DimensionBreakdownProps) {
  if (!dimensions || dimensions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dimension breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-tertiary">
            No per-dimension scoring was returned for this session.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dimension breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {dimensions.map((dim) => {
          const max = dim.maxScore ?? 100;
          const hasScore = dim.score !== undefined && dim.score !== null;
          const percent = hasScore ? (dim.score! / max) * 100 : 0;
          return (
            <div key={dim.name}>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-sm font-medium text-primary">
                  {dim.name}
                </span>
                <span className="font-mono text-xs text-secondary">
                  {hasScore ? `${Math.round(dim.score!)} / ${max}` : "—"}
                </span>
              </div>
              <Progress value={percent} label={`${dim.name} score`} />
              {dim.summary && (
                <p className="mt-2 text-sm leading-relaxed text-secondary">
                  {dim.summary}
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
