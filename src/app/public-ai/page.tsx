"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Brain,
  Shield,
  Clock,
  Navigation,
  Info,
  Lightbulb,
  Route,
  AlertTriangle,
  CheckCircle,
  Star,
  Users,
  Calendar,
  Zap,
  Send,
  RefreshCw,
} from "lucide-react";

interface AIRecommendation {
  id: string;
  query: string;
  location: string;
  travelType: string;
  timeOfDay: string;
  recommendations: {
    safetyTips: string[];
    routeAdvice: string[];
    localInsights: string[];
    emergencyInfo: string[];
  };
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  timestamp: string;
}

export default function PublicAI() {
  const [currentQuery, setCurrentQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [travelType, setTravelType] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const mockRecommendations: Record<string, AIRecommendation> = {
    "malioboro-evening": {
      id: "1",
      query: "Mengunjungi Jalan Malioboro di malam hari",
      location: "Jalan Malioboro",
      travelType: "tourism",
      timeOfDay: "evening",
      recommendations: {
        safetyTips: [
          "Simpan barang berharga dengan aman dan hindari memamerkan barang mahal",
          "Tetap berada di area yang terang dengan lalu lalang orang",
          "Gunakan pedagang resmi dan hindari calo",
          "Siapkan kontak darurat",
        ],
        routeAdvice: [
          "Mulai dari Stasiun Tugu dan jalan menuju Keraton",
          "Gunakan area pejalan kaki utama daripada jalan samping",
          "Pertimbangkan menggunakan bus Transjogja untuk jarak jauh",
          "Keluar sebelum jam 22:00 ketika lalu lalang mulai sepi",
        ],
        localInsights: [
          "Malioboro umumnya aman tapi tetap waspada pencopetan",
          "Makanan jalanan aman dari pedagang yang sudah established",
          "Tawar-menawar wajar di toko souvenir",
          "WiFi gratis tersedia di banyak kafe dan restoran",
        ],
        emergencyInfo: [
          "Pos polisi terletak di dekat area Sosrowijayan",
          "Pusat informasi wisata: +62 274 566000",
          "Rumah sakit terdekat: RS Bethesda (5 menit dengan taksi)",
          "Nomor darurat: 112 (Polisi, Pemadam, Medis)",
        ],
      },
      riskLevel: "medium",
      confidence: 87,
      timestamp: new Date().toISOString(),
    },
    "borobudur-morning": {
      id: "2",
      query: "Mengunjungi Candi Borobudur di pagi hari",
      location: "Candi Borobudur",
      travelType: "tourism",
      timeOfDay: "morning",
      recommendations: {
        safetyTips: [
          "Pesan tiket di awal untuk menghindari penipuan",
          "Gunakan pemandu wisata resmi saja",
          "Pakai sepatu nyaman dan perlindungan matahari",
          "Bawa air dan makanan ringan yang cukup",
        ],
        routeAdvice: [
          "Mulai pagi-pagi (06:00) untuk menghindari keramaian dan panas",
          "Gunakan transportasi resmi dari Yogyakarta (1-2 jam)",
          "Parkir hanya di area yang ditentukan",
          "Ikuti aturan candi dan jalur yang ditentukan",
        ],
        localInsights: [
          "Melihat matahari terbit memerlukan tiket khusus",
          "Pemandu lokal sangat paham sejarah candi",
          "Fotografi diperbolehkan tapi hormati pengunjung lain",
          "Toko souvenir ada yang harga pas dan bisa ditawar",
        ],
        emergencyInfo: [
          "Petugas keamanan tersedia di seluruh area",
          "Pos P3K tersedia di pusat pengunjung",
          "Klinik terdekat: Puskesmas Borobudur",
          "Kontak candi: +62 293 788266",
        ],
      },
      riskLevel: "low",
      confidence: 94,
      timestamp: new Date().toISOString(),
    },
  };

  const handleSubmitQuery = async () => {
    if (!currentQuery.trim()) return;

    setIsLoading(true);

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate mock recommendation based on query
    const queryKey = `${selectedLocation.toLowerCase()}-${timeOfDay}`.replace(
      /\s+/g,
      "-"
    );
    const mockRec = mockRecommendations[queryKey] || {
      id: Date.now().toString(),
      query: currentQuery,
      location: selectedLocation || "General Area",
      travelType: travelType || "tourism",
      timeOfDay: timeOfDay || "any time",
      recommendations: {
        safetyTips: [
          "Stay aware of your surroundings at all times",
          "Keep important documents in a secure location",
          "Inform someone of your travel plans",
          "Use reputable transportation services",
        ],
        routeAdvice: [
          "Plan your route in advance using reliable maps",
          "Stick to main roads and well-traveled paths",
          "Allow extra time for unexpected delays",
          "Have backup transportation options ready",
        ],
        localInsights: [
          "Local customs and etiquette vary by area",
          "Language barriers can be overcome with translation apps",
          "Tipping practices differ from Western countries",
          "Weather conditions can change quickly",
        ],
        emergencyInfo: [
          "Download offline maps before traveling",
          "Keep emergency numbers in local language",
          "Know location of nearest embassy/consulate",
          "Have travel insurance contact information ready",
        ],
      },
      riskLevel: "medium",
      confidence: 75,
      timestamp: new Date().toISOString(),
    };

    setRecommendations((prev) => [mockRec, ...prev.slice(0, 4)]);
    setIsLoading(false);
    setCurrentQuery("");
  };

  const popularQueries = [
    "Mengunjungi Jalan Malioboro di malam hari",
    "Tips keamanan untuk wisatawan wanita solo",
    "Waktu terbaik mengunjungi Keraton",
    "Transportasi dari bandara ke pusat kota",
    "Keamanan makanan di pedagang kaki lima",
    "Keamanan tur matahari terbit di Candi Borobudur",
  ];

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "high":
        return "destructive" as const;
      case "medium":
        return "secondary" as const;
      case "low":
        return "default" as const;
      default:
        return "outline" as const;
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "high":
        return <AlertTriangle className="w-4 h-4" />;
      case "medium":
        return <Info className="w-4 h-4" />;
      case "low":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Asisten AI Keamanan Wisata
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dapatkan rekomendasi keamanan dan wawasan perjalanan yang
            dipersonalisasi dengan AI. Ajukan pertanyaan tentang lokasi, waktu
            perjalanan, atau situasi tertentu.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
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
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSubmitQuery()
                      }
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
                          <SelectItem value="sleman">
                            Kabupaten Sleman
                          </SelectItem>
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
              </CardContent>
            </Card>

            {recommendations.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Rekomendasi AI</h2>
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{rec.query}</CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={getRiskBadgeVariant(rec.riskLevel)}>
                              {getRiskIcon(rec.riskLevel)}
                              RISIKO{" "}
                              {rec.riskLevel === "high"
                                ? "TINGGI"
                                : rec.riskLevel === "medium"
                                ? "SEDANG"
                                : "RENDAH"}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-gray-600">
                                {rec.confidence}% akurat
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div>{rec.location}</div>
                          <div>
                            {new Date(rec.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-600" />
                            Tips Keamanan
                          </h4>
                          <ul className="space-y-2">
                            {rec.recommendations.safetyTips.map(
                              (tip, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-700 flex items-start gap-2"
                                >
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                  {tip}
                                </li>
                              )
                            )}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Route className="w-4 h-4 text-blue-600" />
                            Saran Rute
                          </h4>
                          <ul className="space-y-2">
                            {rec.recommendations.routeAdvice.map(
                              (advice, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-700 flex items-start gap-2"
                                >
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  {advice}
                                </li>
                              )
                            )}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-orange-600" />
                            Wawasan Lokal
                          </h4>
                          <ul className="space-y-2">
                            {rec.recommendations.localInsights.map(
                              (insight, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-700 flex items-start gap-2"
                                >
                                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                  {insight}
                                </li>
                              )
                            )}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            Info Darurat
                          </h4>
                          <ul className="space-y-2">
                            {rec.recommendations.emergencyInfo.map(
                              (info, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-700 flex items-start gap-2"
                                >
                                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                  {info}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Pertanyaan Populer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {popularQueries.map((query, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full text-left justify-start h-auto p-2 whitespace-normal"
                      onClick={() => setCurrentQuery(query)}
                    >
                      <span className="text-sm">{query}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Statistik AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">97%</p>
                    <p className="text-sm text-gray-600">Akurasi</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">2.3s</p>
                    <p className="text-sm text-gray-600">Respons</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">150+</p>
                    <p className="text-sm text-gray-600">Lokasi</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-600">24/7</p>
                    <p className="text-sm text-gray-600">Tersedia</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Cara Kerja
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Ajukan Pertanyaan</p>
                      <p className="text-sm text-gray-600">
                        Ketik pertanyaan tentang keamanan atau perjalanan Anda
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Analisis AI</p>
                      <p className="text-sm text-gray-600">
                        AI kami menganalisis data dan pola kejahatan
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Dapatkan Rekomendasi</p>
                      <p className="text-sm text-gray-600">
                        Terima saran keamanan yang dipersonalisasi
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold mb-4">
                Ingin Melihat Data Kejahatan Visual?
              </h3>
              <p className="text-gray-600 mb-6">
                Jelajahi heatmap interaktif kami untuk melihat pola dan
                statistik kejahatan berdasarkan lokasi.
              </p>
              <Button size="lg" asChild>
                <a href="/map">
                  <MapPin className="w-5 h-5 mr-2" />
                  Lihat Heatmap Kejahatan
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
