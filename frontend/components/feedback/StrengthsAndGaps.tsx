"use client";

import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StrengthsAndGapsProps {
  strengths?: string[];
  gaps?: string[];
}

export function StrengthsAndGaps({ strengths, gaps }: StrengthsAndGapsProps) {
  const hasStrengths = strengths && strengths.length > 0;
  const hasGaps = gaps && gaps.length > 0;

  if (!hasStrengths && !hasGaps) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-strength">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasStrengths ? (
            <ul className="space-y-2">
              {strengths!.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-secondary">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-strength" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-tertiary">No strengths were reported.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gap">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            Knowledge gaps
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasGaps ? (
            <ul className="space-y-2">
              {gaps!.map((g, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-secondary">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gap" aria-hidden="true" />
                  {g}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-tertiary">No gaps were reported.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
