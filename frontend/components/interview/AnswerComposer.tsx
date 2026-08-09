"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { CornerDownLeft, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AnswerComposerProps {
  onSubmit: (answer: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function AnswerComposer({ onSubmit, disabled, autoFocus }: AnswerComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && !disabled) {
      textareaRef.current?.focus();
    }
  }, [autoFocus, disabled]);

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="border-t border-border bg-background px-4 py-4 sm:px-6">
      <Label htmlFor="answer" className="sr-only">
        Your answer
      </Label>
      <div className="mx-auto max-w-3xl">
        <div className="rounded-xl border border-border bg-elevated focus-within:ring-2 focus-within:ring-accent">
          <Textarea
            id="answer"
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={3}
            placeholder="Type your answer…"
            className="border-0 bg-transparent focus-visible:ring-0"
            aria-describedby="answer-hint"
          />
          <div className="flex items-center justify-between px-4 pb-3">
            <p id="answer-hint" className="flex items-center gap-1 text-xs text-tertiary">
              <CornerDownLeft className="h-3 w-3" aria-hidden="true" />
              <span className="font-mono">⌘/Ctrl + Enter</span> to submit
            </p>
            <Button
              onClick={handleSubmit}
              disabled={disabled || !value.trim()}
              isLoading={disabled}
              size="sm"
            >
              {!disabled && <SendHorizontal className="h-3.5 w-3.5" />}
              {disabled ? "Submitting…" : "Submit answer"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
