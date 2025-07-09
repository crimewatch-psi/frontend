"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Shield,
  MapPin,
} from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { managerApi, AnalyticsData, authApi } from "@/lib/api";
import { Loading, useLoading } from "@/components/loading";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";

interface CrimeData {
  id: string;
  category: string;
  date: string;
  description: string;
}

export default function CrimeDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const {
    isLoading,
    startLoading,
    stopLoading,
    error,
    setError: handleError,
  } = useLoading();
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRowExpansion = (index: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        startLoading();

        console.log("Checking authentication status...");
        const sessionCheck = await authApi.checkSession();
        console.log("Session check result:", sessionCheck);

        if (
          !sessionCheck.isAuthenticated ||
          sessionCheck.user?.role !== "manager"
        ) {
          console.log("Not authenticated or not a manager, redirecting...");
          window.location.href = "/login";
          return;
        }

        console.log("User is authenticated, fetching analytics...");
        const response = await managerApi.getAnalytics();
        console.log("Analytics response:", response);

        if (response.success) {
          setAnalyticsData(response.data);
        } else {
          handleError(response.error || "Gagal memuat data");
        }
      } catch (err) {
        // Only set error if the request wasn't aborted
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Error fetching analytics:", err);
          handleError(
            err instanceof Error
              ? err.message
              : "Terjadi kesalahan saat memuat data"
          );
        }
      } finally {
        stopLoading();
      }
    };

    fetchData();

    return () => {
      abortController.abort(); // Cleanup on unmount
    };
  }, []);

  const formatCrimeDataForTable = (): CrimeData[] => {
    if (!analyticsData) return [];

    const crimesList: CrimeData[] = [];
    analyticsData.crime_summary.nearby_locations.forEach((location) => {
      location.crimes.forEach((crime) => {
        crimesList.push({
          id: `#${crime.id}`,
          category: crime.jenis_kejahatan,
          date: new Date(crime.waktu).toLocaleDateString("id-ID"),
          description:
            crime.deskripsi.length > 50
              ? crime.deskripsi.substring(0, 50) + "..."
              : crime.deskripsi,
        });
      });
    });

    return crimesList.slice(0, parseInt(entriesPerPage));
  };

  const generatePieChartData = () => {
    if (!analyticsData) return [];

    const colors = [
      "#ef4444", // red
      "#3b82f6", // blue
      "#10b981", // green
      "#f59e0b", // amber
      "#8b5cf6", // purple
      "#ec4899", // pink
      "#14b8a6", // teal
      "#f97316", // orange
      "#6366f1", // indigo
      "#84cc16", // lime
      "#06b6d4", // cyan
      "#d946ef", // fuchsia
      "#64748b", // slate
      "#eab308", // yellow
      "#0ea5e9", // sky
    ];

    return Object.entries(analyticsData.crime_summary.crime_types).map(
      ([type, count], index) => ({
        name: type,
        value: count,
        color: colors[index % colors.length],
      })
    );
  };

  const generateTimeChartData = () => {
    if (!analyticsData) return [];

    return Object.entries(analyticsData.crime_summary.time_analysis).map(
      ([month, count]) => ({
        month: month.split(" ")[0], // Get month name only
        count: count,
      })
    );
  };

  const retryFetch = async () => {
    try {
      startLoading();

      // First check if we're authenticated
      console.log("Checking authentication status...");
      const sessionCheck = await authApi.checkSession();
      console.log("Session check result:", sessionCheck);

      if (
        !sessionCheck.isAuthenticated ||
        sessionCheck.user?.role !== "manager"
      ) {
        console.log("Not authenticated or not a manager, redirecting...");
        window.location.href = "/login";
        return;
      }

      console.log("User is authenticated, fetching analytics...");
      const response = await managerApi.getAnalytics();
      console.log("Analytics response:", response);

      if (response.success) {
        setAnalyticsData(response.data);
      } else {
        handleError(response.error || "Gagal memuat data");
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
      handleError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memuat data"
      );
    } finally {
      stopLoading();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <Loading message="Memuat data analitik..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto" />
          <p className="mt-4 text-red-600">{error}</p>
          <Button onClick={retryFetch} className="mt-4">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  const crimeData = formatCrimeDataForTable();
  const pieChartData = generatePieChartData();
  const timeChartData = generateTimeChartData();

  return (
    <div className="min-h-screen bg-white ">
      <Header />
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center gap-4 mb-8 mt-4 ">
          <div>
            <h1 className="text-4xl font-semibold text-black">
              {analyticsData.manager_info.organization}
            </h1>
            <p className="text-gray-600">
              Analisis Kriminalitas dalam Radius 20km
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Kejahatan
                  </p>
                  <p className="text-2xl font-bold">
                    {analyticsData.crime_summary.total_crimes}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Lokasi Termonitoring
                  </p>
                  <p className="text-2xl font-bold">
                    {analyticsData.crime_summary.nearby_locations.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Radius Monitoring
                  </p>
                  <p className="text-2xl font-bold">
                    {analyticsData.crime_summary.radius_km}km
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Analysis Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Analisis AI Keamanan Wisata
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Ringkasan */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 italic">
                  {analyticsData.ai_analysis.ringkasan}
                </p>
              </div>

              {/* Analisis Risiko */}
              <div>
                <h3 className="text-md font-semibold mb-2">Analisis Risiko</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={
                        analyticsData.ai_analysis.analisis_risiko.tingkat_risiko.toLowerCase() ===
                        "tinggi"
                          ? "destructive"
                          : analyticsData.ai_analysis.analisis_risiko.tingkat_risiko.toLowerCase() ===
                            "sedang"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      Tingkat Risiko:{" "}
                      {analyticsData.ai_analysis.analisis_risiko.tingkat_risiko}
                    </Badge>
                  </div>
                  <p className="text-gray-700">
                    {analyticsData.ai_analysis.analisis_risiko.detail}
                  </p>
                </div>
              </div>

              {/* Pola Kriminalitas */}
              <div>
                <h3 className="text-md font-semibold mb-2">
                  Pola Kriminalitas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Tren</h4>
                    <p className="text-gray-700">
                      {analyticsData.ai_analysis.pola_kriminalitas.tren}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Waktu Rawan</h4>
                    <p className="text-gray-700">
                      {analyticsData.ai_analysis.pola_kriminalitas.waktu_rawan}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Area Rawan</h4>
                    <p className="text-gray-700">
                      {analyticsData.ai_analysis.pola_kriminalitas.area_rawan}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dampak Bisnis */}
              <div>
                <h3 className="text-md font-semibold mb-2">
                  Dampak Terhadap Bisnis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Dampak Langsung</h4>
                    <p className="text-gray-700">
                      {analyticsData.ai_analysis.dampak_bisnis.langsung}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Dampak Tidak Langsung</h4>
                    <p className="text-gray-700">
                      {analyticsData.ai_analysis.dampak_bisnis.tidak_langsung}
                    </p>
                  </div>
                </div>
              </div>

              {/* Kesimpulan */}
              <div>
                <h3 className="text-md font-semibold mb-2">Kesimpulan</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    {analyticsData.ai_analysis.kesimpulan}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Rekomendasi Keamanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analyticsData.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Table Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Tampilkan</span>
            <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">data</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari kejahatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        {/* Crime Data Table */}
        <div className="border rounded-lg mb-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-black">
                  Jenis Kejahatan
                </TableHead>
                <TableHead className="font-semibold text-black">
                  Tanggal
                </TableHead>
                <TableHead className="font-semibold text-black">
                  Deskripsi
                </TableHead>
                <TableHead className="font-semibold text-black w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crimeData
                .filter(
                  (row) =>
                    row.category
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    row.description
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )
                .map((row, index) => (
                  <>
                    <TableRow key={index}>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell className="max-w-md">
                        <div className="truncate">{row.description}</div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRowExpansion(index)}
                          className="h-8 w-8 p-0"
                        >
                          {expandedRows.has(index) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(index) && (
                      <TableRow>
                        <TableCell colSpan={4} className="bg-gray-50 p-4">
                          <div className="text-sm text-gray-700">
                            <strong>Deskripsi Lengkap:</strong>
                            <p className="mt-2 ">{row.description}</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Distribusi Kejahatan per Bulan
              </CardTitle>
              <div className="text-2xl font-bold mt-4">
                {analyticsData.crime_summary.total_crimes} Total
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  count: { label: "Jumlah Kejahatan", color: "#ef4444" },
                }}
                className="h-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeChartData}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Crime Types Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Distribusi Jenis Kejahatan
              </CardTitle>
              <div className="text-2xl font-bold mt-4">
                {Object.keys(analyticsData.crime_summary.crime_types).length}{" "}
                Jenis
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <ChartContainer config={{}} className="h-64 w-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="flex flex-col gap-3">
                  {pieChartData.map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span>
                        {entry.name} ({entry.value})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
