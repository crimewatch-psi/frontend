"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeatmapPointer } from "@/components/ui/heatmap-pointer";
import { MapPin, Globe, RefreshCw, Send, Brain } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

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

const mockRegionData: Record<string, RegionData> = {
  yogyakarta: {
    name: "Kota Yogyakarta",
    totalCrimes: 47,
    riskLevel: "high",
    crimeData: [
      {
        x: 200,
        y: 150,
        intensity: 0.9,
        type: "Pencurian",
        location: "Jalan Malioboro",
      },
      {
        x: 180,
        y: 180,
        intensity: 0.7,
        type: "Penipuan",
        location: "Stasiun Tugu",
      },
      {
        x: 220,
        y: 120,
        intensity: 0.8,
        type: "Copet",
        location: "Alun-alun Kidul",
      },
      {
        x: 160,
        y: 200,
        intensity: 0.6,
        type: "Penipuan",
        location: "Jalan Sosio",
      },
      {
        x: 240,
        y: 160,
        intensity: 0.5,
        type: "Pencurian Kendaraan",
        location: "Kawasan Keraton",
      },
    ],
  },
  bantul: {
    name: "Kabupaten Bantul",
    totalCrimes: 23,
    riskLevel: "medium",
    crimeData: [
      {
        x: 120,
        y: 280,
        intensity: 0.6,
        type: "Penipuan",
        location: "Pantai Parangtritis",
      },
      {
        x: 140,
        y: 260,
        intensity: 0.4,
        type: "Pencurian",
        location: "Bantul Square",
      },
      {
        x: 100,
        y: 300,
        intensity: 0.5,
        type: "Penipuan",
        location: "Area Pantai",
      },
      {
        x: 160,
        y: 240,
        intensity: 0.3,
        type: "Pencurian Kendaraan",
        location: "Pasar Bantul",
      },
    ],
  },
  sleman: {
    name: "Kabupaten Sleman",
    totalCrimes: 31,
    riskLevel: "medium",
    crimeData: [
      {
        x: 180,
        y: 80,
        intensity: 0.7,
        type: "Penipuan Wisata",
        location: "Candi Prambanan",
      },
      {
        x: 220,
        y: 60,
        intensity: 0.5,
        type: "Pencurian",
        location: "Kawasan UGM",
      },
      {
        x: 160,
        y: 100,
        intensity: 0.6,
        type: "Penipuan",
        location: "Kaliurang",
      },
      {
        x: 200,
        y: 40,
        intensity: 0.4,
        type: "Copet",
        location: "Kota Sleman",
      },
      {
        x: 240,
        y: 80,
        intensity: 0.3,
        type: "Pencurian Kendaraan",
        location: "Godean",
      },
    ],
  },
  kulonprogo: {
    name: "Kabupaten Kulon Progo",
    totalCrimes: 18,
    riskLevel: "low",
    crimeData: [
      {
        x: 80,
        y: 180,
        intensity: 0.4,
        type: "Pencurian",
        location: "Kota Wates",
      },
      {
        x: 60,
        y: 200,
        intensity: 0.3,
        type: "Penipuan",
        location: "Pantai Kulon Progo",
      },
      {
        x: 100,
        y: 160,
        intensity: 0.2,
        type: "Penipuan",
        location: "Pasar Tradisional",
      },
      {
        x: 40,
        y: 220,
        intensity: 0.3,
        type: "Pencurian Kendaraan",
        location: "Area Wisata",
      },
    ],
  },
  gunungkidul: {
    name: "Kabupaten Gunung Kidul",
    totalCrimes: 15,
    riskLevel: "low",
    crimeData: [
      {
        x: 280,
        y: 240,
        intensity: 0.3,
        type: "Pencurian",
        location: "Kota Wonosari",
      },
      {
        x: 300,
        y: 220,
        intensity: 0.4,
        type: "Penipuan Wisata",
        location: "Pantai Baron",
      },
      {
        x: 260,
        y: 260,
        intensity: 0.2,
        type: "Penipuan",
        location: "Alun-alun Gunung Kidul",
      },
      {
        x: 320,
        y: 200,
        intensity: 0.3,
        type: "Pencurian Kendaraan",
        location: "Area Pantai",
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
        <div className="font-semibold">{regionData.totalCrimes} Kasus</div>
        <div className="text-gray-600">30 Hari Terakhir</div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-2 rounded-lg text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Risiko Tinggi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Risiko Sedang</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Risiko Rendah</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PublicAccessHeatmapSection() {
  const [currentQuery, setCurrentQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [travelType, setTravelType] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState("yogyakarta");
  const handleSubmitQuery = async () => {
    if (!currentQuery.trim()) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setAiResponse(
      `Saran AI untuk '${currentQuery}' di ${
        selectedLocation || "(lokasi tidak dipilih)"
      } pada ${timeOfDay || "(waktu tidak dipilih)"}. Jenis perjalanan: ${
        travelType || "(tidak dipilih)"
      }.`
    );
    setIsLoading(false);
    setCurrentQuery("");
  };

  return (
    <section className="pt-8 pb-16 bg-transparent relative overflow-hidden">
      <HeatmapPointer />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-green-100 text-green-700 border-green-200">
            <Globe className="w-4 h-4 mr-2" />
            Tanpa Perlu Login
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Jelajahi Data Keamanan Publik
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Akses informasi kriminalitas dan rekomendasi AI secara instan. Cocok
            untuk wisatawan yang berkunjung ke Yogyakarta.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="w-full max-w-xs">
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yogyakarta">Kota Yogyakarta</SelectItem>
                <SelectItem value="bantul">Kabupaten Bantul</SelectItem>
                <SelectItem value="sleman">Kabupaten Sleman</SelectItem>
                <SelectItem value="kulonprogo">
                  Kabupaten Kulon Progo
                </SelectItem>
                <SelectItem value="gunungkidul">
                  Kabupaten Gunung Kidul
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl">
            <CrimeHeatmap region={selectedRegion} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="default">
            <Link href="/map">
              <MapPin className="w-5 h-5 mr-2" />
              Lihat Peta Detail
            </Link>
          </Button>
        </div>

        {/* AI Query Card Section */}
        <div className="flex justify-center my-8">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Tanyakan AI untuk Saran Keamanan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Pertanyaan Anda
                  </label>
                  <Input
                    placeholder="contoh: 'Apakah aman mengunjungi Malioboro di malam hari?'"
                    value={currentQuery}
                    onChange={(e) => setCurrentQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSubmitQuery()}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Lokasi (Opsional)
                    </label>
                    <Select
                      value={selectedLocation}
                      onValueChange={setSelectedLocation}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih lokasi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="malioboro">
                          Jalan Malioboro
                        </SelectItem>
                        <SelectItem value="borobudur">
                          Candi Borobudur
                        </SelectItem>
                        <SelectItem value="kraton">Keraton</SelectItem>
                        <SelectItem value="parangtritis">
                          Pantai Parangtritis
                        </SelectItem>
                        <SelectItem value="sleman">Kabupaten Sleman</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Jenis Perjalanan
                    </label>
                    <Select value={travelType} onValueChange={setTravelType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Jenis perjalanan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tourism">Wisata</SelectItem>
                        <SelectItem value="business">Bisnis</SelectItem>
                        <SelectItem value="solo">Perjalanan Solo</SelectItem>
                        <SelectItem value="family">Keluarga</SelectItem>
                        <SelectItem value="group">Grup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Waktu
                    </label>
                    <Select value={timeOfDay} onValueChange={setTimeOfDay}>
                      <SelectTrigger>
                        <SelectValue placeholder="Waktu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Pagi</SelectItem>
                        <SelectItem value="afternoon">Siang</SelectItem>
                        <SelectItem value="evening">Sore</SelectItem>
                        <SelectItem value="night">Malam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleSubmitQuery}
                disabled={!currentQuery.trim() || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {isLoading
                  ? "AI sedang berpikir..."
                  : "Dapatkan Rekomendasi AI"}
              </Button>
              {aiResponse && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded text-green-800">
                  {aiResponse}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
