"use client";

import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ProblemStatement } from "@/components/ProblemStatement";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <ProblemStatement />
      <FeaturesSection />
    </div>
  );
}
