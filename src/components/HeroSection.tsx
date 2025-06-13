"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const gradients = [
        {
          radius: 150,
          colors: [
            { stop: 0, color: "rgba(255, 0, 0, 0.3)" },
            { stop: 0.2, color: "rgba(255, 165, 0, 0.2)" },
            { stop: 0.4, color: "rgba(255, 255, 0, 0.15)" },
            { stop: 0.6, color: "rgba(0, 255, 0, 0.1)" },
            { stop: 0.8, color: "rgba(0, 0, 255, 0.05)" },
            { stop: 1, color: "rgba(0, 0, 0, 0)" },
          ],
        },
        {
          radius: 100,
          colors: [
            { stop: 0, color: "rgba(255, 0, 0, 0.2)" },
            { stop: 0.5, color: "rgba(255, 165, 0, 0.1)" },
            { stop: 1, color: "rgba(0, 0, 0, 0)" },
          ],
        },
      ];

      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      gradients.forEach(({ radius, colors }) => {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        colors.forEach(({ stop, color }) => {
          gradient.addColorStop(stop, color);
        });

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      ctx.filter = "blur(8px)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.filter = "none";
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">CrimeWatch</h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mb-8">
          Empowering tourist destinations with AI-driven security management and
          analytics
        </p>
        <Button size="lg" className="w-fit">
          Get Started
        </Button>
      </div>
    </div>
  );
}
