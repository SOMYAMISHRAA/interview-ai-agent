export function TypingIndicator() {
  return (
    <div
      className="flex items-center gap-1.5 rounded-2xl border border-border bg-elevated px-4 py-3"
      role="status"
      aria-label="Interviewer is preparing the next question"
    >
      <span className="h-1.5 w-1.5 animate-blink rounded-full bg-tertiary [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-blink rounded-full bg-tertiary [animation-delay:200ms]" />
      <span className="h-1.5 w-1.5 animate-blink rounded-full bg-tertiary [animation-delay:400ms]" />
    </div>
  );
}
