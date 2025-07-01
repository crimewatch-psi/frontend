"use client";

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ProblemStatement } from "@/components/ProblemStatement";
import { Footer } from "@/components/Footer";
import { PublicAccessHeatmapSection } from "@/components/PublicAccessHeatmapSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white mt-4">
      <Header />
      <HeroSection />

      <PublicAccessHeatmapSection />

      <ProblemStatement />
      <FeaturesSection />

      <Footer />
    </div>
  );
}
