import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CapabilitiesGrid } from "@/components/landing/CapabilitiesGrid";
import { ArchitectureVisualization } from "@/components/landing/ArchitectureVisualization";
import { CtaSection } from "@/components/landing/CtaSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <CapabilitiesGrid />
      <ArchitectureVisualization />
      <CtaSection />
      <Footer />
    </main>
  );
}
