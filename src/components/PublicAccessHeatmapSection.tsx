"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeatmapPointer } from "@/components/ui/heatmap-pointer";
import { MapPin, Brain, Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

interface CrimeDataPoint {
  x: number;
  y: number;
  intensity: number;
  type: string;
  location: string;
}

interface RegionData {
  name: string;
  crimeData: CrimeDataPoint[];
  totalCrimes: number;
  riskLevel: "low" | "medium" | "high";
}

// Mock crime data for each region
const mockRegionData: Record<string, RegionData> = {
  yogyakarta: {
    name: "Yogyakarta City",
    totalCrimes: 47,
    riskLevel: "high",
    crimeData: [
      {
        x: 200,
        y: 150,
        intensity: 0.9,
        type: "Theft",
        location: "Malioboro Street",
      },
      {
        x: 180,
        y: 180,
        intensity: 0.7,
        type: "Fraud",
        location: "Tugu Station",
      },
      {
        x: 220,
        y: 120,
        intensity: 0.8,
        type: "Pickpocketing",
        location: "Alun-alun Kidul",
      },
      { x: 160, y: 200, intensity: 0.6, type: "Scam", location: "Jalan Sosio" },
      {
        x: 240,
        y: 160,
        intensity: 0.5,
        type: "Vehicle Theft",
        location: "Sultan Palace Area",
      },
    ],
  },
  bantul: {
    name: "Bantul Regency",
    totalCrimes: 23,
    riskLevel: "medium",
    crimeData: [
      {
        x: 120,
        y: 280,
        intensity: 0.6,
        type: "Fraud",
        location: "Parangtritis Beach",
      },
      {
        x: 140,
        y: 260,
        intensity: 0.4,
        type: "Theft",
        location: "Bantul Square",
      },
      { x: 100, y: 300, intensity: 0.5, type: "Scam", location: "Beach Area" },
      {
        x: 160,
        y: 240,
        intensity: 0.3,
        type: "Vehicle Theft",
        location: "Bantul Market",
      },
    ],
  },
  sleman: {
    name: "Sleman Regency",
    totalCrimes: 31,
    riskLevel: "medium",
    crimeData: [
      {
        x: 180,
        y: 80,
        intensity: 0.7,
        type: "Tourism Scam",
        location: "Candi Prambanan",
      },
      { x: 220, y: 60, intensity: 0.5, type: "Theft", location: "UGM Area" },
      { x: 160, y: 100, intensity: 0.6, type: "Fraud", location: "Kaliurang" },
      {
        x: 200,
        y: 40,
        intensity: 0.4,
        type: "Pickpocketing",
        location: "Sleman Town",
      },
      {
        x: 240,
        y: 80,
        intensity: 0.3,
        type: "Vehicle Theft",
        location: "Godean",
      },
    ],
  },
  kulonprogo: {
    name: "Kulon Progo Regency",
    totalCrimes: 18,
    riskLevel: "low",
    crimeData: [
      { x: 80, y: 180, intensity: 0.4, type: "Theft", location: "Wates Town" },
      {
        x: 60,
        y: 200,
        intensity: 0.3,
        type: "Fraud",
        location: "Kulon Progo Beach",
      },
      {
        x: 100,
        y: 160,
        intensity: 0.2,
        type: "Scam",
        location: "Traditional Market",
      },
      {
        x: 40,
        y: 220,
        intensity: 0.3,
        type: "Vehicle Theft",
        location: "Tourism Area",
      },
    ],
  },
  gunungkidul: {
    name: "Gunung Kidul Regency",
    totalCrimes: 15,
    riskLevel: "low",
    crimeData: [
      {
        x: 280,
        y: 240,
        intensity: 0.3,
        type: "Theft",
        location: "Wonosari Town",
      },
      {
        x: 300,
        y: 220,
        intensity: 0.4,
        type: "Tourism Scam",
        location: "Baron Beach",
      },
      {
        x: 260,
        y: 260,
        intensity: 0.2,
        type: "Fraud",
        location: "Gunung Kidul Square",
      },
      {
        x: 320,
        y: 200,
        intensity: 0.3,
        type: "Vehicle Theft",
        location: "Coastal Area",
      },
    ],
  },
};

function CrimeHeatmap({ region }: { region: string }) {
  const regionData = mockRegionData[region];

  if (!regionData) return null;

  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden border-2 border-gray-200">
      {/* Background map outline */}
      <div className="absolute inset-0 bg-gray-200/20"></div>

      {/* Region name overlay */}
      <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium">
        {regionData.name}
      </div>

      {/* Risk level indicator */}
      <div className="absolute top-4 right-4">
        <Badge
          variant={
            regionData.riskLevel === "high"
              ? "destructive"
              : regionData.riskLevel === "medium"
              ? "secondary"
              : "default"
          }
        >
          {regionData.riskLevel.toUpperCase()} RISK
        </Badge>
      </div>

      {/* Crime data points */}
      {regionData.crimeData.map((point, index) => (
        <div
          key={index}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
          style={{
            left: `${point.x}px`,
            top: `${point.y}px`,
            width: `${20 + point.intensity * 30}px`,
            height: `${20 + point.intensity * 30}px`,
          }}
        >
          {/* Heat point */}
          <div
            className="w-full h-full rounded-full opacity-70 animate-pulse"
            style={{
              backgroundColor:
                point.intensity > 0.7
                  ? "#ef4444"
                  : point.intensity > 0.4
                  ? "#f97316"
                  : "#22c55e",
              boxShadow: `0 0 ${point.intensity * 20}px ${
                point.intensity > 0.7
                  ? "#ef4444"
                  : point.intensity > 0.4
                  ? "#f97316"
                  : "#22c55e"
              }`,
            }}
          ></div>

          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {point.type} - {point.location}
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-2 rounded-lg text-sm">
        <div className="font-semibold">{regionData.totalCrimes} Cases</div>
        <div className="text-gray-600">Last 30 days</div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-2 rounded-lg text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Low Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PublicAccessHeatmapSection() {
  const [selectedRegion, setSelectedRegion] = useState("yogyakarta");

  return (
    <section className="py-16 bg-transparent relative overflow-hidden">
      <HeatmapPointer />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-green-100 text-green-700 border-green-200">
            <Globe className="w-4 h-4 mr-2" />
            No Login Required
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Public Safety Data
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Access real-time crime insights and AI recommendations instantly.
            Perfect for tourists and travelers visiting Yogyakarta.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="w-full max-w-xs">
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yogyakarta">Yogyakarta City</SelectItem>
                <SelectItem value="bantul">Bantul Regency</SelectItem>
                <SelectItem value="sleman">Sleman Regency</SelectItem>
                <SelectItem value="kulonprogo">Kulon Progo Regency</SelectItem>
                <SelectItem value="gunungkidul">
                  Gunung Kidul Regency
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Crime Heatmap */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl">
            <CrimeHeatmap region={selectedRegion} />
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="default">
            <Link href="/public-heatmap">
              <MapPin className="w-5 h-5 mr-2" />
              View Detailed Heatmap
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/public-ai">
              <Brain className="w-5 h-5 mr-2" />
              Get AI Safety Tips
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
