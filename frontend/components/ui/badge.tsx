import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "accent" | "strength" | "gap" | "danger";
}

const toneStyles: Record<NonNullable<BadgeProps["tone"]>, string> = {
  neutral: "bg-elevated text-secondary border-border",
  accent: "bg-accent/10 text-accent-bright border-accent/30",
  strength: "bg-strength/10 text-strength border-strength/30",
  gap: "bg-gap/10 text-gap border-gap/30",
  danger: "bg-danger/10 text-danger border-danger/30",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, tone = "neutral", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
        toneStyles[tone],
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";
