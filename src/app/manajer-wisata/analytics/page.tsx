"use client";

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
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
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { managerApi, AnalyticsData } from "@/lib/api";
import { useManagerGuard } from "@/hooks/useManagerGuard";
import { Loading, useLoading } from "@/components/loading";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { ErrorBoundary } from "@/components/ErrorBoundary";
// Lazy load ChatbotInterface for better performance
const ChatbotInterface = lazy(() =>
  import("@/components/chatbot-interface").then((module) => ({
    default: module.ChatbotInterface,
  }))
);

interface CrimeData {
  id: string;
  category: string;
  date: string;
  description: string;
}

function CrimeDashboardContent() {
  const {
    isAuthenticated,
    user,
    isLoading: authLoading,
    isManager,
  } = useManagerGuard();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [quickStats, setQuickStats] = useState<any>(null);
  const [loadingStage, setLoadingStage] = useState<
    "quick" | "full" | "complete"
  >("quick");
  const {
    isLoading,
    startLoading,
    stopLoading,
    error,
    setError: handleError,
  } = useLoading();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
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

  // Debounce search term to avoid excessive re-renders
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const retryFetch = useCallback(() => {
    // Trigger a re-fetch by clearing error and reloading
    handleError("");
    setLoadingStage("quick");
    setQuickStats(null);
    setAnalyticsData(null);
  }, [handleError]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchQuickData = async () => {
      if (
        !authLoading &&
        isAuthenticated &&
        isManager &&
        loadingStage === "quick"
      ) {
        try {
          startLoading();
          if (process.env.NODE_ENV !== 'production') {
            console.log("Fetching quick analytics data...");
          }

          const response = await managerApi.getQuickAnalytics(
            abortController.signal
          );

          console.log("Quick analytics response:", response);

          if (response?.success && response?.data) {
            setQuickStats(response.data);
            setLoadingStage("full");
          } else {
            console.error("Quick analytics failed:", response);
            handleError(response?.error || "Gagal memuat data cepat");
          }
        } catch (err) {
          if (err instanceof Error && err.name !== "AbortError") {
            console.error("Error fetching quick analytics:", err);
            handleError(
              err instanceof Error
                ? err.message
                : "Terjadi kesalahan saat memuat data cepat"
            );
          }
        } finally {
          stopLoading();
        }
      }
    };

    const fetchFullData = async () => {
      if (
        !authLoading &&
        isAuthenticated &&
        isManager &&
        loadingStage === "full"
      ) {
        try {
          if (process.env.NODE_ENV !== 'production') {
            console.log("Fetching full analytics data...");
          }

          const response = await managerApi.getAnalytics(
            abortController.signal
          );

          console.log("Full analytics response:", response);

          if (response?.success && response?.data) {
            setAnalyticsData(response.data);
            setLoadingStage("complete");
          } else {
            console.error("Full analytics failed:", response);
            handleError(response?.error || "Gagal memuat data lengkap");
          }
        } catch (err) {
          if (err instanceof Error && err.name !== "AbortError") {
            console.error("Error fetching full analytics:", err);
            handleError(
              err instanceof Error
                ? err.message
                : "Terjadi kesalahan saat memuat data lengkap"
            );
          }
        }
      }
    };

    // Wrap async calls in try-catch to prevent unhandled promise rejections
    const executeFetch = async () => {
      try {
        if (loadingStage === "quick") {
          await fetchQuickData();
        } else if (loadingStage === "full") {
          // Delay full data fetch slightly to show quick stats first
          setTimeout(() => {
            fetchFullData().catch((err) => {
              console.error("Unexpected error in fetchFullData:", err);
              handleError("Terjadi kesalahan tak terduga");
            });
          }, 100);
        }
      } catch (err) {
        console.error("Unexpected error in data fetching:", err);
        handleError("Terjadi kesalahan tak terduga");
      }
    };

    executeFetch();

    return () => {
      abortController.abort();
    };
  }, [authLoading, isAuthenticated, isManager, loadingStage]);

  // Memoize expensive data transformations
  const crimeData = useMemo((): CrimeData[] => {
    if (!analyticsData?.crime_summary?.nearby_locations) return [];

    const crimesList: CrimeData[] = [];
    analyticsData.crime_summary.nearby_locations.forEach((location) => {
      if (location?.crimes && Array.isArray(location.crimes)) {
        location.crimes.forEach((crime) => {
          if (crime?.id && crime?.jenis_kejahatan && crime?.waktu) {
            crimesList.push({
              id: `#${crime.id}`,
              category: crime.jenis_kejahatan,
              date: new Date(crime.waktu).toLocaleDateString("id-ID"),
              description:
                crime.deskripsi && crime.deskripsi.length > 50
                  ? crime.deskripsi.substring(0, 50) + "..."
                  : crime.deskripsi || "",
            });
          }
        });
      }
    });

    return crimesList.slice(0, parseInt(entriesPerPage));
  }, [analyticsData, entriesPerPage]);

  const pieChartData = useMemo(() => {
    if (!analyticsData?.crime_summary?.crime_types) return [];

    const colors = [
      "#ef4444",
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ec4899",
      "#14b8a6",
      "#f97316",
      "#6366f1",
      "#84cc16",
      "#06b6d4",
      "#d946ef",
      "#64748b",
      "#eab308",
      "#0ea5e9",
    ];

    return Object.entries(analyticsData.crime_summary.crime_types).map(
      ([type, count], index) => ({
        name: type,
        value: count,
        color: colors[index % colors.length],
      })
    );
  }, [analyticsData]);

  const timeChartData = useMemo(() => {
    if (!analyticsData?.crime_summary?.time_analysis) return [];

    return Object.entries(analyticsData.crime_summary.time_analysis).map(
      ([month, count]) => ({
        month: month.split(" ")[0], // Get month name only
        count: count,
      })
    );
  }, [analyticsData]);

  // Optimized filtered crime data with debounced search
  const filteredCrimeData = useMemo(() => {
    return crimeData.filter(
      (row) =>
        row.category
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        row.description
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
    );
  }, [crimeData, debouncedSearchTerm]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <Loading message="Memeriksa autentikasi..." />
      </div>
    );
  }

  // Don't render anything if not authenticated or not a manager (useManagerGuard handles redirects)
  if (!isAuthenticated || !isManager) {
    return null;
  }

  if (isLoading && !quickStats) {
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

  // Show quick stats even while loading full data
  const displayData = analyticsData || quickStats;
  if (!displayData) return null;

  return (
    <div className="min-h-screen bg-white ">
      <Header />
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center gap-4 mb-8 mt-4 ">
          <div>
            <h1 className="text-4xl font-semibold text-black">
              {displayData?.manager_info?.organization || "Dashboard Analytics"}
            </h1>
            <p className="text-gray-600">
              Analisis Kriminalitas dalam Radius 20km
              {loadingStage !== "complete" && (
                <span className="ml-2 text-blue-500 text-sm">
                  Memuat data lengkap...
                </span>
              )}
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
                    {analyticsData?.crime_summary?.total_crimes ||
                     quickStats?.quick_stats?.estimated_crimes || 0}
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
                    {analyticsData?.crime_summary?.nearby_locations?.length ||
                     (loadingStage === "complete" ? 0 : "...")}
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
                    {analyticsData?.crime_summary?.radius_km ||
                      quickStats?.quick_stats?.radius_km ||
                      20}
                    km
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {analyticsData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Distribusi Kejahatan per Bulan
                </CardTitle>
                <div className="text-2xl font-bold mt-4">
                  {analyticsData.crime_summary.total_crimes} Total
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeChartData}>
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
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="w-full">
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
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                      labelLine={false}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [value, "Jumlah Kejadian"]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="w-full">
              <CardContent className="p-6 flex items-center justify-center h-[300px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-500">Memuat grafik...</p>
                </div>
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardContent className="p-6 flex items-center justify-center h-[300px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-500">Memuat grafik...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Analysis Section */}
        {analyticsData ? (
          <div>
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
                      {analyticsData?.ai_analysis?.ringkasan || "Tidak ada ringkasan tersedia."}
                    </p>
                  </div>

                  {/* Analisis Risiko */}
                  <div>
                    <h3 className="text-md font-semibold mb-2">
                      Analisis Risiko
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant={
                            analyticsData?.ai_analysis?.analisis_risiko?.tingkat_risiko?.toLowerCase() ===
                            "tinggi"
                              ? "destructive"
                              : analyticsData?.ai_analysis?.analisis_risiko?.tingkat_risiko?.toLowerCase() ===
                                "sedang"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          Tingkat Risiko:{" "}
                          {analyticsData?.ai_analysis?.analisis_risiko?.tingkat_risiko || "Tidak diketahui"}
                        </Badge>
                      </div>
                      <p className="text-gray-700">
                        {analyticsData?.ai_analysis?.analisis_risiko?.detail || "Tidak ada detail risiko tersedia."}
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
                          {analyticsData?.ai_analysis?.pola_kriminalitas?.tren || "Tidak ada data tren."}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Waktu Rawan</h4>
                        <p className="text-gray-700">
                          {analyticsData?.ai_analysis?.pola_kriminalitas?.waktu_rawan || "Tidak ada data waktu rawan."}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Area Rawan</h4>
                        <p className="text-gray-700">
                          {analyticsData?.ai_analysis?.pola_kriminalitas?.area_rawan || "Tidak ada data area rawan."}
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
                          {analyticsData?.ai_analysis?.dampak_bisnis?.langsung || "Tidak ada data dampak langsung."}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">
                          Dampak Tidak Langsung
                        </h4>
                        <p className="text-gray-700">
                          {analyticsData?.ai_analysis?.dampak_bisnis?.tidak_langsung || "Tidak ada data dampak tidak langsung."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Kesimpulan */}
                  <div>
                    <h3 className="text-md font-semibold mb-2">Kesimpulan</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">
                        {analyticsData?.ai_analysis?.kesimpulan || "Tidak ada kesimpulan tersedia."}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Rekomendasi Keamanan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analyticsData?.recommendations && Array.isArray(analyticsData.recommendations) 
                    ? analyticsData.recommendations.map(
                        (recommendation, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700">{recommendation}</span>
                          </li>
                        )
                      )
                    : (
                        <li className="text-gray-500 italic">
                          Tidak ada rekomendasi tersedia.
                        </li>
                      )}
                </ul>
              </CardContent>
            </Card>

            <div className="mb-8">
              <Suspense
                fallback={
                  <Card>
                    <CardContent className="p-6 flex items-center justify-center h-[500px]">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                        <p className="text-gray-500">Memuat chatbot...</p>
                      </div>
                    </CardContent>
                  </Card>
                }
              >
                <ChatbotInterface
                  mapid={analyticsData?.manager_info?.mapid}
                  locationName={analyticsData?.manager_info?.organization}
                  className="h-full min-h-[500px]"
                />
              </Suspense>
            </div>
          </div>
        ) : (
          <div className="space-y-6 mb-8">
            <Card>
              <CardContent className="p-6 flex items-center justify-center h-[200px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-500">Memuat analisis AI...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
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
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari kejahatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
        </div>

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
              {filteredCrimeData.map((row, index) => (
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
      </div>
    </div>
  );
}

export default function CrimeDashboard() {
  return (
    <ErrorBoundary>
      <CrimeDashboardContent />
    </ErrorBoundary>
  );
}
