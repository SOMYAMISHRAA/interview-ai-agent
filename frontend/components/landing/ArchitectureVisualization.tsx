"use client";

import { motion } from "framer-motion";
import {
  UserRound,
  BookOpenText,
  Bot,
  ClipboardCheck,
  Waypoints,
  ArrowRight,
} from "lucide-react";

const nodes = [
  { icon: UserRound, label: "Candidate Profile", note: "learning history" },
  { icon: BookOpenText, label: "Curriculum Context", note: "retrieved topics" },
  { icon: Bot, label: "Interview Agent", note: "generates question" },
  { icon: ClipboardCheck, label: "Answer Evaluation", note: "scored & rationale" },
  { icon: Waypoints, label: "Adaptive Decision", note: "difficulty + follow-up" },
];

export function ArchitectureVisualization() {
  return (
    <section className="border-b border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-wider text-accent">
            Under the hood
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
            One decision loop, running every turn.
          </h2>
          <p className="mt-4 text-secondary">
            Each answer feeds the same pipeline that generated the question —
            that&apos;s what makes the interview adaptive instead of scripted.
          </p>
        </div>

        <div className="relative mt-16 rounded-2xl border border-border bg-surface p-6 sm:p-10">
          <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:justify-between">
            {nodes.map((node, i) => (
              <div key={node.label} className="flex items-center lg:contents">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex w-full flex-1 flex-col items-center gap-2 rounded-xl border border-border bg-elevated px-4 py-5 text-center lg:w-auto"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
                    <node.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {node.label}
                  </span>
                  <span className="font-mono text-[11px] text-tertiary">
                    {node.note}
                  </span>
                </motion.div>
                {i < nodes.length - 1 && (
                  <ArrowRight
                    className="mx-2 hidden h-4 w-4 shrink-0 text-tertiary lg:block"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 border-t border-dashed border-border pt-8 text-center">
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-2 rounded-full border border-border bg-elevated px-4 py-2"
            >
              <span className="font-mono text-xs text-secondary">
                → Next Question
              </span>
            </motion.div>
            <p className="max-w-md text-xs text-tertiary">
              Adaptive Decision feeds directly back into the Interview Agent,
              so difficulty and follow-ups update before the candidate sees
              anything.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
