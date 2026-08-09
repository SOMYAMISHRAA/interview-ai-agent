"use client";

import { NotebookText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface EvaluationRationaleProps {
  rationale?: string;
}

/**
 * Displays only the safe, structured rationale returned by the backend.
 * This intentionally never renders raw model reasoning or a step-by-step
 * "thinking trace" — only a short human-readable explanation.
 */
export function EvaluationRationale({ rationale }: EvaluationRationaleProps) {
  if (!rationale) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <NotebookText className="h-4 w-4 text-accent" aria-hidden="true" />
          Evaluation rationale
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-secondary">{rationale}</p>
      </CardContent>
    </Card>
  );
}
