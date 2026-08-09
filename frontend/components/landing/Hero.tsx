"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-grid-fade" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 pb-24 pt-28 md:pt-36 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-secondary">
            <CircleDot className="h-3 w-3 text-accent" aria-hidden="true" />
            Built for the ABTalks Vibe Coding Hackathon
          </div>
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-primary sm:text-5xl lg:text-6xl">
            Your AI technical interviewer.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-secondary">
            An adaptive technical interview built around what you actually
            learned — not a generic question bank. It reads your curriculum,
            asks real questions, and adjusts difficulty as you answer.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/interview/setup">
              <Button size="lg" className="group">
                Start Interview
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="ghost">
                See how it works
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-tertiary">
            No sign-up. Just a candidate ID and ten minutes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="relative"
        >
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-danger/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-gap/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-strength/60" />
              </div>
              <span className="font-mono text-xs text-tertiary">
                interview session
              </span>
            </div>
            <div className="space-y-4 p-5 font-mono text-[13px] leading-relaxed">
              <div className="flex items-center gap-2 text-tertiary">
                <span>Question 4 / 10</span>
                <span>·</span>
                <span>Day 11 · RAG</span>
                <Badge tone="accent" className="ml-auto font-sans">
                  Medium
                </Badge>
              </div>
              <p className="text-primary">
                How does chunk size affect retrieval quality in a RAG
                pipeline?
              </p>
              <div className="rounded-lg border border-border bg-elevated p-3 text-secondary">
                Smaller chunks improve precision but can lose context across
                boundaries. Larger chunks preserve context but dilute
                relevance scoring...
              </div>
              <div className="flex items-center gap-2 text-tertiary">
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-accent"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
                <span>Evaluating answer, preparing follow-up…</span>
              </div>
            </div>
          </div>
          <div
            className="absolute -bottom-6 -right-6 -z-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl"
            aria-hidden="true"
          />
        </motion.div>
      </div>
    </section>
  );
}
