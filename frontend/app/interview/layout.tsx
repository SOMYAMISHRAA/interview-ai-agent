import { InterviewProvider } from "@/context/InterviewContext";

export default function InterviewSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <InterviewProvider>{children}</InterviewProvider>;
}
