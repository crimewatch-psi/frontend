// app/map/page.tsx
'use client'
import { useState, useCallback, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import { FaInfoCircle, FaFilter } from 'react-icons/fa'
import { CrimeWatchSidebar } from '@/components/CrimeWatchSidebar'
import { CenterSearchBar } from '@/components/CenterSearchBar'
import type { CrimeRateLevel, CrimeCategory, CrimeData } from '@/types/crime'
import { crimeCategories } from '@/types/crime'
import type { Map } from 'leaflet'

interface MapHandle {
  flyTo: (lat: number, lng: number, zoom?: number) => void
  getMap: () => Map | null
}

const CrimeHeatmap = dynamic(
  () => import('@/components/CrimeHeatmap').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full">Loading map...</div>
  }
)

export default function MapPage() {
  const crimeCenter = useMemo(() => ({ lat: -7.7925, lng: 110.3658 }), [])
  const [dateRange, setDateRange] = useState<[number, number]>([0, 11])
  const [selectedCategories, setSelectedCategories] = useState<CrimeCategory[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const mapRef = useRef<MapHandle>(null)
  const [selectedLocation, setSelectedLocation] = useState<{name: string, lat: number, lng: number} | null>(null);

  const handleLocationSelected = (lat: number, lng: number, name: string) => {
    setSelectedLocation({ lat, lng, name });
    mapRef.current?.flyTo(lat, lng, 15);
  };

  const handleViewCrimeStatistic = () => {
    console.log("Viewing crime stats for:", selectedLocation);
    // Implement your crime statistics logic here
  };

  const handleFlyTo = useCallback((lat: number, lng: number) => {
    mapRef.current?.flyTo(lat, lng, 15)
  }, [])

  const handleDateRangeChange = useCallback((newRange: [number, number]) => {
    setDateRange(newRange)
  }, [])

  const handleCategoryChange = useCallback((categories: CrimeCategory[]) => {
    setSelectedCategories(categories)
  }, [])

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  const [crimeData] = useState<CrimeData[]>(() => {
    const data: CrimeData[] = []
    
    // Center point
    data.push({
      id: 1,
      name: 'Central Area',
      lat: crimeCenter.lat,
      lng: crimeCenter.lng,
      crimeRate: 'Highest',
      category: 'Theft',
      date: new Date(2024, 6, 15)
    })

    // Surrounding points (50 points)
    for (let i = 0; i < 50; i++) {
      const distance = Math.random() * 0.03
      const angle = Math.random() * Math.PI * 2
      
      data.push({
        id: i + 2,
        name: `Crime Spot ${i}`,
        lat: crimeCenter.lat + Math.cos(angle) * distance,
        lng: crimeCenter.lng + Math.sin(angle) * distance,
        crimeRate: ['High', 'Medium'][Math.floor(Math.random() * 2)] as CrimeRateLevel,
        category: crimeCategories[Math.floor(Math.random() * crimeCategories.length)],
        date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      })
    }

    // Random points (30 points)
    for (let i = 0; i < 30; i++) {
      data.push({
        id: 100 + i,
        name: `Random Spot ${i}`,
        lat: -7.79 + (Math.random() * 0.1 - 0.05),
        lng: 110.36 + (Math.random() * 0.1 - 0.05),
        crimeRate: 'Low',
        category: crimeCategories[Math.floor(Math.random() * crimeCategories.length)],
        date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      })
    }

    return data
  })

  const filteredData = useMemo(() => {
    const [start, end] = dateRange
    const startYear = 2024 + Math.floor(start / 12)
    const endYear = 2024 + Math.floor(end / 12)
    const startDate = new Date(startYear, start % 12, 1)
    const endDate = new Date(endYear, end % 12 + 1, 0)

    return crimeData.filter(point => {
      if (!point.date || !point.category) return false
      
      const dateMatch = point.date >= startDate && point.date <= endDate
      const categoryMatch = selectedCategories.length === 0 || 
        selectedCategories.includes(point.category)
      
      return dateMatch && categoryMatch
    })
  }, [crimeData, dateRange, selectedCategories])

  return (
    <div className="flex h-screen relative">
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
  <button 
    onClick={handleSidebarToggle}
    className={`
      absolute top-3 left-5 z-[1000] 
      backdrop-blur-md bg-white/10 border border-white/20
      px-4 py-2 rounded-lg shadow-lg
      hover:bg-white/40 hover:shadow-xl
      transition-all duration-300
      group
    `}
    aria-label="Open filters"
  >
    <span className={`
      font-medium text-gray-800
      group-hover:text-gray-900
      flex items-center gap-2
    `}>
      {/* Optional: Add a menu icon */}
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className="opacity-80 group-hover:opacity-100"
      >
        <path d="M3 12h18M3 6h18M3 18h18"/>
      </svg>
      Menu
    </span>
  </button>
)}
<div className="absolute bottom-4 right-4 backdrop-blur-md bg-white/30 p-4 rounded-lg shadow-lg z-[1000] w-48 border border-white/20">
  <div className="mb-2">
    <h3 className="font-semibold text-gray-900">Crime Frequency:</h3>
  </div>
  
  {/* Gradient bar with blur effect */}
  <div className="backdrop-blur-sm bg-white/20 p-1 rounded-full mb-2">
    <div className="h-3 w-full rounded-full bg-gradient-to-r from-red-600 via-yellow-400 to-green-500"></div>
  </div>
  
  <div className="flex justify-between text-xs">
    <span className="text-gray-900 font-medium">Highest</span>
    <span className="text-gray-900 font-medium">Lowest</span>
  </div>
</div>
      </div>
    </div>
  )
}