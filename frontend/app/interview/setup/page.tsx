import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { CandidateIdForm } from "@/components/setup/CandidateIdForm";

export default function SetupPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-tertiary transition-colors hover:text-secondary"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back
        </Link>

        <div className="mb-8">
          <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-primary">
            Set up your interview
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-secondary">
            Your candidate ID links this session to your learning profile —
            it&apos;s how the interview personalizes questions to what
            you&apos;ve actually studied.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <CandidateIdForm />
        </div>
      </div>
    </main>
  );
}
