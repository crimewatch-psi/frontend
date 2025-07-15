"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { CrimeCategory } from "@/types/crime";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
} from "recharts";

interface CrimeStatistic {
  category: CrimeCategory;
  count: number;
  trend: "up" | "down" | "stable";
  percentage: number;
}

interface LocationCrimeData {
  location: string;
  totalIncidents: number;
  riskLevel: "Low" | "Medium" | "High" | "Highest";
  lastUpdated: string;
  statistics: CrimeStatistic[];
  monthlyData: {
    month: string;
    count: number;
  }[];
}

function CrimeStatisticsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const location = searchParams.get("location") || "";
  const [crimeData, setCrimeData] = useState<LocationCrimeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateMockData = (locationName: string): LocationCrimeData => {
      const riskLevels: Array<"Low" | "Medium" | "High" | "Highest"> = [
        "Low",
        "Medium",
        "High",
        "Highest",
      ];
      const crimeCategories: CrimeCategory[] = [
        "Pencurian",
        "Pembunuhan",
        "Pembobolan mobil",
        "Penyerangan",
        "Narkoba",
      ];

      const statistics: CrimeStatistic[] = crimeCategories.map((category) => ({
        category,
        count: Math.floor(Math.random() * 50) + 5,
        trend:
          Math.random() > 0.5 ? "up" : Math.random() > 0.5 ? "down" : "stable",
        percentage: Math.floor(Math.random() * 20) + 5,
      }));

      const monthlyData = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ].map((month) => ({
        month,
        count: Math.floor(Math.random() * 30) + 10,
      }));

      return {
        location: locationName,
        totalIncidents: statistics.reduce((sum, stat) => sum + stat.count, 0),
        riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
        lastUpdated: new Date().toLocaleDateString("id-ID"),
        statistics,
        monthlyData,
      };
    };

    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCrimeData(generateMockData(location));
      setIsLoading(false);
    };

    if (location) {
      loadData();
    }
  }, [location]);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Highest":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-500">
              Memuat data statistik kriminalitas...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!crimeData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Data Tidak Ditemukan
            </h1>
            <p className="text-gray-600 mb-4">
              Tidak dapat menemukan data statistik untuk lokasi yang diminta.
            </p>
            <Button onClick={() => router.push("/map")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Peta
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/map")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Peta
          </Button>

          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Statistik Kriminalitas
            </h1>
          </div>

          <p className="text-gray-600 mb-4">{crimeData.location}</p>

          <div className="flex items-center gap-4">
            <Badge className={getRiskLevelColor(crimeData.riskLevel)}>
              Tingkat Risiko: {crimeData.riskLevel}
            </Badge>
            <span className="text-sm text-gray-500">
              Diperbarui: {crimeData.lastUpdated}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Kejadian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {crimeData.totalIncidents}
              </div>
              <p className="text-xs text-gray-500">Dalam 12 bulan terakhir</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Kategori Tertinggi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {
                  crimeData.statistics.sort((a, b) => b.count - a.count)[0]
                    ?.category
                }
              </div>
              <p className="text-xs text-gray-500">
                {
                  crimeData.statistics.sort((a, b) => b.count - a.count)[0]
                    ?.count
                }{" "}
                kejadian
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Rata-rata Bulanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(crimeData.totalIncidents / 12)}
              </div>
              <p className="text-xs text-gray-500">Kejadian per bulan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tingkat Risiko
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {crimeData.riskLevel}
              </div>
              <p className="text-xs text-gray-500">Berdasarkan data historis</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Distribusi Kejahatan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={crimeData.statistics}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ category, percentage }) =>
                    `${category}: ${percentage}%`
                  }
                  labelLine={false}
                >
                  {crimeData.statistics.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          "#ef4444",
                          "#f97316",
                          "#eab308",
                          "#22c55e",
                          "#3b82f6",
                          "#8b5cf6",
                          "#ec4899",
                        ][index % 7]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, "Jumlah Kejadian"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tren Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={crimeData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [value, "Jumlah Kejadian"]}
                  labelFormatter={(label) => `Bulan: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Detail Statistik per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {crimeData.statistics.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getTrendIcon(stat.trend)}
                      <span className="font-medium">{stat.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{stat.count}</div>
                    <div className="text-sm text-gray-500">
                      {stat.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2 text-lg">
                  Rekomendasi Keamanan
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Hindari area yang sepi terutama pada malam hari</li>
                  <li>• Selalu waspada terhadap lingkungan sekitar</li>
                  <li>• Simpan barang berharga di tempat yang aman</li>
                  <li>• Laporkan aktivitas mencurigakan ke pihak berwajib</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Loading fallback component
function CrimeStatisticsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat data statistik kriminalitas...</p>
        </div>
      </div>
    </div>
  );
}

export default function CrimeStatisticsPage() {
  return (
    <Suspense fallback={<CrimeStatisticsLoading />}>
      <CrimeStatisticsContent />
    </Suspense>
  );
}
