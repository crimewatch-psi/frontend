"use client";

import { useRef, useEffect } from "react";

export function HeatmapPointer() {
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
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-[-1]"
      style={{ zIndex: 1 }}
    />
  );
}
