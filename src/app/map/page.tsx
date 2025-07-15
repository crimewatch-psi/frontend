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
import { ListFilter } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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
  };
  const handleLogin = () => {
    router.push("/login");
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

    // Known high-crime areas in DIY with realistic names
    const hotspots = [
      { name: "Malioboro Street", lat: -7.7925, lng: 110.3658, rate: "Highest" as CrimeRateLevel },
      { name: "Tugu Station Area", lat: -7.7889, lng: 110.3635, rate: "Highest" as CrimeRateLevel },
      { name: "Giwangan Terminal", lat: -7.8284, lng: 110.3973, rate: "High" as CrimeRateLevel },
      { name: "Jalan Kaliurang", lat: -7.7520, lng: 110.3853, rate: "High" as CrimeRateLevel },
      { name: "Bantul City Center", lat: -7.8807, lng: 110.3294, rate: "High" as CrimeRateLevel },
      { name: "Sleman Town Square", lat: -7.7325, lng: 110.3515, rate: "High" as CrimeRateLevel },
      { name: "Kulon Progo Center", lat: -7.8282, lng: 110.1614, rate: "Medium" as CrimeRateLevel },
      { name: "Gunung Kidul Center", lat: -7.9075, lng: 110.5939, rate: "Medium" as CrimeRateLevel },
    ];

    // Add hotspots
    hotspots.forEach((spot, index) => {
      data.push({
        id: index + 1,
        name: spot.name,
        lat: spot.lat,
        lng: spot.lng,
        crimeRate: spot.rate,
        category: crimeCategories[Math.floor(Math.random() * crimeCategories.length)],
        date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      });
    });

    let currentId = hotspots.length + 1;

    // Generate dense crime data around each hotspot
    hotspots.forEach((spot) => {
      const spotsAroundHotspot = spot.rate === "Highest" ? 40 : spot.rate === "High" ? 25 : 15;
      
      for (let i = 0; i < spotsAroundHotspot; i++) {
        const distance = Math.random() * 0.015; // Smaller radius for denser clustering
        const angle = Math.random() * Math.PI * 2;
        
        const crimeRates: CrimeRateLevel[] = spot.rate === "Highest" 
          ? ["Highest", "High", "High", "Medium"] 
          : spot.rate === "High" 
          ? ["High", "High", "Medium", "Medium"] 
          : ["Medium", "Medium", "Low", "Low"];

        data.push({
          id: currentId++,
          name: `${spot.name} Area ${i + 1}`,
          lat: spot.lat + Math.cos(angle) * distance,
          lng: spot.lng + Math.sin(angle) * distance,
          crimeRate: crimeRates[Math.floor(Math.random() * crimeRates.length)],
          category: crimeCategories[Math.floor(Math.random() * crimeCategories.length)],
          date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        });
      }
    });

    // Add scattered crime data across DIY region
    for (let i = 0; i < 200; i++) {
      // DIY region bounds: lat -7.5 to -8.2, lng 110.0 to 111.0
      const lat = -7.5 - (Math.random() * 0.7); // -7.5 to -8.2
      const lng = 110.0 + (Math.random() * 1.0); // 110.0 to 111.0
      
      const crimeRates: CrimeRateLevel[] = ["High", "Medium", "Medium", "Low", "Low", "Lowest"];
      
      data.push({
        id: currentId++,
        name: `DIY Region ${i + 1}`,
        lat: lat,
        lng: lng,
        crimeRate: crimeRates[Math.floor(Math.random() * crimeRates.length)],
        category: crimeCategories[Math.floor(Math.random() * crimeCategories.length)],
        date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      });
    }

    // Add additional high-density spots in urban areas
    const urbanAreas = [
      { lat: -7.8014, lng: 110.3645 }, // Yogyakarta city center
      { lat: -7.7751, lng: 110.3789 }, // UGM area
      { lat: -7.7477, lng: 110.3553 }, // North Yogya
      { lat: -7.8123, lng: 110.3598 }, // South Yogya
    ];

    urbanAreas.forEach((area, areaIndex) => {
      for (let i = 0; i < 30; i++) {
        const distance = Math.random() * 0.02;
        const angle = Math.random() * Math.PI * 2;
        
        data.push({
          id: currentId++,
          name: `Urban Area ${areaIndex + 1}-${i + 1}`,
          lat: area.lat + Math.cos(angle) * distance,
          lng: area.lng + Math.sin(angle) * distance,
          crimeRate: ["High", "Medium", "Medium", "Low"][Math.floor(Math.random() * 4)] as CrimeRateLevel,
          category: crimeCategories[Math.floor(Math.random() * crimeCategories.length)],
          date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        });
      }
    });

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
            <div className="flex items-center space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleSidebarToggle}
                className="flex items-center"
              >
                <ListFilter className="w-4 h-4 mr-2" />
                {sidebarOpen ? "Sembunyikan Filters" : "Tampilkan Filters"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogin}
                className="flex items-center"
              >
                Tampilkan Statistik
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-192px)] relative">
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
