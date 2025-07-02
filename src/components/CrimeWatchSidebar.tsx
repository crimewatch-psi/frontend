'use client'
import { useState } from 'react'
import { LogOut, X } from 'lucide-react' // Import X icon for close button
import { Slider } from '@/components/Slider'
import { Button } from '@/components/ui/button'
import type { CrimeCategory } from '@/types/crime'
import { crimeCategories } from '@/types/crime'
import Image from 'next/image';

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

interface CrimeWatchSidebarProps {
  onDateRangeChange?: (range: [number, number]) => void
  onCategoryChange?: (categories: CrimeCategory[]) => void
  initialIncidents?: number
  isOpen: boolean
  onClose: () => void
}

export function CrimeWatchSidebar({
  onDateRangeChange,
  onCategoryChange,
  initialIncidents = 0,
  isOpen,
  onClose
}: CrimeWatchSidebarProps) {
  const [dateRange, setDateRange] = useState<[number, number]>([0, 11])
  const [selectedCategories, setSelectedCategories] = useState<CrimeCategory[]>([])

  const handleCategoryToggle = (category: CrimeCategory) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category]
    
    setSelectedCategories(newCategories)
    onCategoryChange?.(newCategories)
  }

  const handleDateRangeChange = (newRange: number[]) => {
    const range = newRange as [number, number]
    setDateRange(range)
    onDateRangeChange?.(range)
  }

  const formatDateRange = () => {
    const startYear = 2024 + Math.floor(dateRange[0] / 12)
    const endYear = 2024 + Math.floor(dateRange[1] / 12)
    return `${months[dateRange[0] % 12]} ${startYear} to ${months[dateRange[1] % 12]} ${endYear}`
  }

  return (
    <>
      {/* Glassmorphism Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-40
        backdrop-blur-lg bg-white/10 border-r border-white/20 shadow-lg
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        w-80
      `}>
        <div className="h-full p-6 flex flex-col overflow-y-auto">
          {/* Header with title and close button */}
<div className="flex justify-between items-center mb-6">
  <div className="relative w-40 h-10 -ml-12"> {/* Adjust width/height as needed */}
    <Image
      src="/logo.svg"
      alt="Crime Watch Logo"
      fill
      className="object-contain"
      priority
    />
  </div>
  <button 
    onClick={onClose}
    className="p-2 rounded-full hover:bg-white/20 transition-colors text-gray-900"
    aria-label="Close sidebar"
  >
    <X className="h-5 w-5" />
  </button>
</div>
          
          {/* Date Range Filter */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">{formatDateRange()}</h2>
            <div className="backdrop-blur-sm bg-white/20 p-4 rounded-lg">
              <Slider
                value={dateRange}
                onValueChange={handleDateRangeChange}
                min={0}
                max={23}
                step={1}
                minStepsBetweenThumbs={1}
              />
              <div className="flex justify-between text-sm text-gray-700 mt-1">
                <span>Jan 2024</span>
                <span>Dec 2025</span>
              </div>
            </div>
          </div>

          {/* Crime Categories */}
          <div className="mb-8">
  <h2 className="text-lg font-semibold mb-3 text-gray-900">Crime Categories</h2>
  <div className="grid grid-cols-2 gap-2">
    {crimeCategories.map(category => (
      <Button
        key={category}
        variant="outline"
        size="sm"
        onClick={() => handleCategoryToggle(category)}
        className={
          selectedCategories.includes(category)
            ? 'bg-gray-900 text-white hover:bg-gray-900 hover:text-white' // Selected state - no hover effect
            : 'backdrop-blur-sm bg-white/20 border-white/20 text-gray-900 hover:bg-gray-500 hover:text-black' // Unselected with hover
        }
      >
        {category}
      </Button>
    ))}
  </div>
</div>

          {/* Incident Count */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">Num. Incidents:</h2>
            <div className="text-3xl font-bold text-gray-900">
              {initialIncidents.toLocaleString()}
            </div>
          </div>

          {/* Logout Button */}
          <Button 
            variant="ghost" 
            className="w-full mt-auto backdrop-blur-sm bg-white/20 hover:bg-white/30 text-gray-900"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>

      {/* Overlay - only visible on mobile when sidebar is open */}
      <div 
        className={`
          fixed inset-0 z-30 bg-black/50 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? 'opacity-100 md:opacity-0' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />
    </>
  )
}