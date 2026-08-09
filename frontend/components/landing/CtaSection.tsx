"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-surface p-10 text-center sm:p-16"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-grid-fade"
            aria-hidden="true"
          />
          <h2 className="relative text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
            Ready to see what it asks you?
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-secondary">
            Ten questions. One adaptive conversation. A report you can
            actually act on.
          </p>
          <Link href="/interview/setup" className="relative mt-8 inline-block">
            <Button size="lg" className="group">
              Start Interview
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
