"use client";

import { motion } from "framer-motion";
import { UserSearch, Library, MessagesSquare, ClipboardCheck, GitBranch, LineChart } from "lucide-react";

const steps = [
  {
    icon: UserSearch,
    title: "Analyze",
    description:
      "Reads the candidate's learning history to understand what's actually been covered.",
  },
  {
    icon: Library,
    title: "Retrieve",
    description:
      "Pulls the relevant curriculum context so questions map to real material, not guesses.",
  },
  {
    icon: MessagesSquare,
    title: "Ask",
    description:
      "Opens with a grounded technical question tailored to the candidate's track.",
  },
  {
    icon: ClipboardCheck,
    title: "Evaluate",
    description:
      "Scores each answer against defined dimensions — accuracy, reasoning, communication.",
  },
  {
    icon: GitBranch,
    title: "Adapt",
    description:
      "Raises or lowers difficulty and decides whether a follow-up is worth asking.",
  },
  {
    icon: LineChart,
    title: "Report",
    description:
      "Closes with a structured feedback report: strengths, gaps, and a recommended path.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-wider text-accent">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
            A closed loop, not a static quiz.
          </h2>
          <p className="mt-4 text-secondary">
            Each answer feeds back into the next question. The interview
            adjusts in real time — you only ever see what comes next.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group bg-surface p-6 transition-colors hover:bg-elevated"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-elevated text-accent">
                  <step.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="font-mono text-xs text-tertiary">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-4 text-base font-medium text-primary">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
