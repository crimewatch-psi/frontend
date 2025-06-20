"use client";

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ProblemStatement } from "@/components/ProblemStatement";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white mt-4">
      <Header />
      <HeroSection />
      <ProblemStatement />
      <FeaturesSection />

      <Footer />
    </div>
  );
}
