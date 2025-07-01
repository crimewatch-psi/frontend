import React from "react";
import { cn } from "@/lib/utils";

interface LocationPointProps {
  x: number;
  y: number;
  severity: "low" | "medium" | "high";
  label: string;
  count: number;
  onClick?: () => void;
  className?: string;
}

export function LocationPoint({
  x,
  y,
  severity,
  label,
  count,
  onClick,
  className,
}: LocationPointProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500 border-red-600 shadow-red-200";
      case "medium":
        return "bg-orange-500 border-orange-600 shadow-orange-200";
      case "low":
        return "bg-green-500 border-green-600 shadow-green-200";
      default:
        return "bg-gray-500 border-gray-600 shadow-gray-200";
    }
  };

  const getSeveritySize = (severity: string) => {
    switch (severity) {
      case "high":
        return "w-6 h-6";
      case "medium":
        return "w-5 h-5";
      case "low":
        return "w-4 h-4";
      default:
        return "w-4 h-4";
    }
  };

  return (
    <div
      className={cn(
        "absolute transform -translate-x-1/2 -translate-y-1/2 group",
        className
      )}
      style={{ left: `${x}px`, top: `${y}px` }}
      onClick={onClick}
    >
      {/* Main Point */}
      <div
        className={cn(
          "rounded-full border-2 cursor-pointer transition-all duration-200 shadow-lg",
          getSeverityColor(severity),
          getSeveritySize(severity),
          "group-hover:scale-125 group-hover:shadow-xl"
        )}
      />

      {/* Pulse Effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-full animate-ping opacity-30",
          getSeverityColor(severity),
          getSeveritySize(severity)
        )}
      />

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          <div className="font-semibold">{label}</div>
          <div className="text-gray-300">{count} incidents</div>
          <div className="text-gray-300 capitalize">{severity} risk</div>
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-l-transparent border-r-transparent border-t-black" />
      </div>
    </div>
  );
}
