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
                Sistem Informasi Berbasis AI 💫
              </div>
            </div>

            <TextGenerateEffect
              words="Mengoptimalkan Keamanan Destinasi Wisata dengan Manajemen dan Analitik Berbasis AI"
              className="text-4xl md:text-4xl lg:text-5xl text-black max-w-full text-center lg:text-left font-bold leading-tight"
            />

            <p className="text-gray-600 text-lg max-w-xl text-center lg:text-left">
              Tingkatkan keamanan pariwisata dengan pemetaan kriminalitas
              cerdas, analisis prediktif, dan pemantauan real-time yang
              dirancang khusus untuk pengelola destinasi dan lembaga keamanan.
            </p>

            <div className="flex justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-black hover:bg-gray-800 text-white px-8"
              >
                Mulai Sekarang
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
