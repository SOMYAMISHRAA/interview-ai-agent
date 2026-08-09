import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value?: number): string {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  return `${Math.round(value)}%`;
}

export function safeScore(score?: number, max = 100): string {
  if (score === undefined || score === null || Number.isNaN(score)) return "—";
  return `${Math.round(score)}${max ? ` / ${max}` : ""}`;
}
