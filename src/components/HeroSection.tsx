"use client";

import { Button } from "@/components/ui/button";
import { HeatmapPointer } from "@/components/ui/heatmap-pointer";
import { TextGenerateEffect } from "@/components/ui/text-generate";
import { StickyBanner } from "./ui/sticky-banner";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden h-screen md:bg-[url('/background.webp')] bg-cover bg-center bg-white">
      <HeatmapPointer />
      <div className="absolute inset-0 bg-black opacity-50 hidden md:block"></div>
      <StickyBanner className="bg-gradient-to-b from-blue-500 to-blue-600 text-white text-center text-sm py-2">
        Developed for Information System Development subject, Informatics
        Universitas Islam Indonesia by Group 1
      </StickyBanner>

      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center">
        <div className="flex flex-col items-center justify-center bg-black text-white px-4 py-1 mb-4 rounded-full shadow-lg font-medium text-sm md:text-base">
          AI-Powered Information System 💫
        </div>
        <h1 className="text-6xl md:text-9xl font-bold mb-2 md:mb-6 text-black">
          CrimeWatch
        </h1>
        <TextGenerateEffect
          words="Empowering tourist destinations with AI-driven security management and analytics"
          className="text-lg md:text-2xl text-black md:text-gray-600 max-w-2xl mb-8 text-center overflow-hidden font-semibold"
        />
        <Button size="lg">Get Started</Button>
      </div>
    </div>
  );
}
