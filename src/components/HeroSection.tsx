"use client";

import { Button } from "@/components/ui/button";
import { HeatmapPointer } from "@/components/ui/heatmap-pointer";
import { TextGenerateEffect } from "@/components/ui/text-generate";
import { StickyBanner } from "./ui/sticky-banner";
import Image from "next/image";

export function HeroSection() {
  return (
    <div className="relative min-h-screen bg-white">
      <HeatmapPointer />
      <StickyBanner className="bg-gradient-to-b from-blue-500 to-blue-600 text-white text-center text-sm py-2">
        Developed for Information System Development subject, Informatics
        Universitas Islam Indonesia by Group 1
      </StickyBanner>

      <div className="relative z-10 container mx-auto px-4 pt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[80vh]">
          {/* Left Column - Text Content */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="flex justify-center lg:justify-start">
              <div className="bg-black text-white px-4 py-1 rounded-full shadow-lg font-medium text-sm md:text-base">
                AI-Powered Information System 💫
              </div>
            </div>

            <TextGenerateEffect
              words="Empowering tourist destinations with AI-driven security management and analytics"
              className="text-2xl md:text-4xl lg:text-5xl text-black max-w-full text-center lg:text-left font-bold leading-tight"
            />

            <p className="text-gray-600 text-lg max-w-xl text-center lg:text-left">
              Transform tourism security with intelligent crime mapping,
              predictive analytics, and real-time monitoring designed for
              destination managers and security agencies.
            </p>

            <div className="flex justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-black hover:bg-gray-800 text-white px-8"
              >
                Get Started
              </Button>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="w-full max-w-2xl">
              <Image
                src="/home.png"
                width={800}
                height={600}
                className="w-full h-auto "
                alt="CrimeWatch Dashboard"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
