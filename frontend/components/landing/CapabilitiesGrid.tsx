"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Layers,
  Target,
  MessageCircleQuestion,
  ShieldCheck,
  Compass,
} from "lucide-react";

const capabilities = [
  {
    icon: Sparkles,
    title: "Personalized by design",
    description:
      "Every interview starts from the candidate's own learning journey, not a generic template.",
  },
  {
    icon: Layers,
    title: "Curriculum-grounded questions",
    description:
      "Questions are retrieved from real curriculum context, so they map to material actually taught.",
  },
  {
    icon: Target,
    title: "Adaptive difficulty",
    description:
      "A deterministic policy raises or lowers difficulty based on how well each answer holds up.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Natural follow-ups",
    description:
      "When an answer leaves something unresolved, the agent asks a targeted follow-up — not a script.",
  },
  {
    icon: ShieldCheck,
    title: "Structured evaluation",
    description:
      "Answers are scored against explicit dimensions, with rationale you can actually read.",
  },
  {
    icon: Compass,
    title: "A path forward",
    description:
      "The final report recommends what to study next, grounded in curriculum coverage.",
  },
];

export function CapabilitiesGrid() {
  return (
    <section className="border-b border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-wider text-accent">
            Capabilities
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
            Built like an engineering system, not a chatbot wrapper.
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <cap.icon className="h-5 w-5 text-accent" aria-hidden="true" />
              <h3 className="mt-4 text-base font-medium text-primary">
                {cap.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary">
                {cap.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
