"use client";

import { motion } from "framer-motion";
import { Bot, User, CheckCircle2, AlertCircle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConversationMessage } from "@/types/interview";

interface MessageBubbleProps {
  message: ConversationMessage;
}

const verdictConfig: Record<
  string,
  { icon: typeof CheckCircle2; className: string; label: string }
> = {
  correct: { icon: CheckCircle2, className: "text-strength", label: "Strong answer" },
  partial: { icon: MinusCircle, className: "text-gap", label: "Partially addressed" },
  incorrect: { icon: AlertCircle, className: "text-danger", label: "Needs work" },
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isInterviewer = message.role === "interviewer";
  const verdict = message.evaluation?.verdict
    ? verdictConfig[message.evaluation.verdict.toLowerCase()]
    : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("flex gap-3", !isInterviewer && "flex-row-reverse")}
    >
      <span
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
          isInterviewer
            ? "border-accent/30 bg-accent/10 text-accent"
            : "border-border bg-elevated text-secondary"
        )}
        aria-hidden="true"
      >
        {isInterviewer ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </span>

      <div className={cn("max-w-[80%] space-y-2", !isInterviewer && "items-end")}>
        {message.isFollowUp && (
          <span className="text-xs font-medium text-tertiary">Follow-up</span>
        )}
        <div
          className={cn(
            "rounded-2xl border px-4 py-3 text-sm leading-relaxed",
            isInterviewer
              ? "border-border bg-surface text-primary"
              : "border-accent/20 bg-accent/10 text-primary"
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {message.evaluation?.rationale && (
          <div className="flex items-start gap-2 rounded-lg border border-border bg-elevated/60 px-3 py-2 text-xs text-secondary">
            {verdict && (
              <verdict.icon
                className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", verdict.className)}
                aria-hidden="true"
              />
            )}
            <span>{message.evaluation.rationale}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
