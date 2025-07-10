"use client";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { CrimeWatchSidebar } from "@/components/crimewatch-sidebar";
import { CenterSearchBar } from "@/components/crime-searchbar";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import type { CrimeRateLevel, CrimeCategory, CrimeData } from "@/types/crime";
import { crimeCategories } from "@/types/crime";
import type { Map } from "leaflet";
import { Menu, Filter, X } from "lucide-react";

interface MapHandle {
  flyTo: (lat: number, lng: number, zoom?: number) => void;
  getMap: () => Map | null;
}

const CrimeHeatmap = dynamic(
  () => import("@/components/crime-heatmap").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        Loading map...
      </div>
    ),
  }
);

export default function MapPage() {
  const crimeCenter = useMemo(() => ({ lat: -7.7925, lng: 110.3658 }), []);
  const [dateRange, setDateRange] = useState<[number, number]>([0, 11]);
  const [selectedCategories, setSelectedCategories] = useState<CrimeCategory[]>(
    []
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const mapRef = useRef<MapHandle>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    lat: number;
    lng: number;
  } | null>(null);

  const handleLocationSelected = (lat: number, lng: number, name: string) => {
    setSelectedLocation({ lat, lng, name });
    mapRef.current?.flyTo(lat, lng, 15);
  };

  const handleViewCrimeStatistic = () => {
    console.log("Viewing crime stats for:", selectedLocation);
    // Implement your crime statistics logic here
  };

  const handleFlyTo = useCallback((lat: number, lng: number) => {
    mapRef.current?.flyTo(lat, lng, 15);
  }, []);

  const handleDateRangeChange = useCallback((newRange: [number, number]) => {
    setDateRange(newRange);
  }, []);

  const handleCategoryChange = useCallback((categories: CrimeCategory[]) => {
    setSelectedCategories(categories);
  }, []);

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const [crimeData, setCrimeData] = useState<CrimeData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadMockData = async () => {
      setIsLoadingData(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCrimeData(generateMockData());
      setIsLoadingData(false);
    };

    loadMockData();
  }, []);

  const generateMockData = (): CrimeData[] => {
    const data: CrimeData[] = [];

    data.push({
      id: 1,
      name: "Central Area",
      lat: crimeCenter.lat,
      lng: crimeCenter.lng,
      crimeRate: "Highest",
      category: "Pencurian",
      date: new Date(2024, 6, 15),
    });

    for (let i = 0; i < 50; i++) {
      const distance = Math.random() * 0.03;
      const angle = Math.random() * Math.PI * 2;

      data.push({
        id: i + 2,
        name: `Crime Spot ${i}`,
        lat: crimeCenter.lat + Math.cos(angle) * distance,
        lng: crimeCenter.lng + Math.sin(angle) * distance,
        crimeRate: ["High", "Medium"][
          Math.floor(Math.random() * 2)
        ] as CrimeRateLevel,
        category:
          crimeCategories[Math.floor(Math.random() * crimeCategories.length)],
        date: new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ),
      });
    }

    for (let i = 0; i < 30; i++) {
      data.push({
        id: 100 + i,
        name: `Random Spot ${i}`,
        lat: -7.79 + (Math.random() * 0.1 - 0.05),
        lng: 110.36 + (Math.random() * 0.1 - 0.05),
        crimeRate: "Low",
        category:
          crimeCategories[Math.floor(Math.random() * crimeCategories.length)],
        date: new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ),
      });
    }

    return data;
  };

  const filteredData = useMemo(() => {
    const [start, end] = dateRange;
    const startYear = 2024 + Math.floor(start / 12);
    const endYear = 2024 + Math.floor(end / 12);
    const startDate = new Date(startYear, start % 12, 1);
    const endDate = new Date(endYear, (end % 12) + 1, 0);

    return crimeData.filter((point) => {
      if (!point.date || !point.category) return false;

      const dateMatch = point.date >= startDate && point.date <= endDate;
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(point.category);

      return dateMatch && categoryMatch;
    });
  }, [crimeData, dateRange, selectedCategories]);

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex h-[calc(100vh-64px)] items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">Memuat data heatmap...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Heatmap Kriminalitas
              </h1>
              <p className="text-gray-600 mb-6">
                Visualisasi data kriminalitas Daerah Istimewa Yogyakarta
              </p>
            </div>

            <Button
              onClick={handleSidebarToggle}
              variant={sidebarOpen ? "secondary" : "outline"}
              size="sm"
              className="flex items-center gap-2"
            >
              {sidebarOpen ? (
                <>
                  <X className="w-4 h-4" />
                  Hide Filters
                </>
              ) : (
                <>
                  <Filter className="w-4 h-4" />
                  Show Filters
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-128px)] relative">
        <CrimeWatchSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onDateRangeChange={handleDateRangeChange}
          onCategoryChange={handleCategoryChange}
          initialIncidents={filteredData.length}
        />

        <div className="flex-1 relative">
          <CrimeHeatmap
            crimeData={filteredData}
            centerPoint={crimeCenter}
            selectedLocation={selectedLocation}
            ref={mapRef}
          />

          <CenterSearchBar
            onLocationSelected={handleLocationSelected}
            onViewCrimeStatistic={handleViewCrimeStatistic}
          />

          {!sidebarOpen && (
            <Button
              onClick={handleSidebarToggle}
              size="sm"
              className="absolute top-4 left-4 z-[1000] md:hidden bg-white text-gray-900 border border-gray-300 shadow-lg hover:bg-gray-50"
            >
              <Menu className="w-4 h-4 mr-2" />
              Filters
            </Button>
          )}

          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg z-[1000] w-48 border border-gray-200">
            <div className="mb-2">
              <h3 className="font-semibold text-gray-900 text-sm">
                Crime Intensity:
              </h3>
            </div>

            <div className="bg-gray-100 p-1 rounded-full mb-2">
              <div className="h-2 w-full rounded-full bg-gradient-to-r from-green-500 via-yellow-400 to-red-600"></div>
            </div>

            <div className="flex justify-between text-xs text-gray-700">
              <span className="font-medium">Low</span>
              <span className="font-medium">High</span>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-600">
                <div className="font-medium mb-1">
                  Total Kejadian: {filteredData.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
