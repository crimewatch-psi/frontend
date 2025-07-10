"use client";
import { useState } from "react";
import { LogOut, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import type { CrimeCategory } from "@/types/crime";
import { crimeCategories } from "@/types/crime";
import Image from "next/image";

const months = [
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
];

interface CrimeWatchSidebarProps {
  onDateRangeChange?: (range: [number, number]) => void;
  onCategoryChange?: (categories: CrimeCategory[]) => void;
  initialIncidents?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function CrimeWatchSidebar({
  onDateRangeChange,
  onCategoryChange,
  initialIncidents = 0,
  isOpen,
  onClose,
}: CrimeWatchSidebarProps) {
  const [dateRange, setDateRange] = useState<[number, number]>([0, 11]);
  const [selectedCategories, setSelectedCategories] = useState<CrimeCategory[]>(
    []
  );

  const handleCategoryToggle = (category: CrimeCategory) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(newCategories);
    onCategoryChange?.(newCategories);
  };

  const handleDateRangeChange = (newRange: number[]) => {
    const range = newRange as [number, number];
    setDateRange(range);
    onDateRangeChange?.(range);
  };

  const formatDateRange = () => {
    const startYear = 2024 + Math.floor(dateRange[0] / 12);
    const endYear = 2024 + Math.floor(dateRange[1] / 12);
    return `${months[dateRange[0] % 12]} ${startYear} to ${
      months[dateRange[1] % 12]
    } ${endYear}`;
  };

  return (
    <>
      <div
        className={`
        fixed inset-y-0 left-0 z-40
        bg-white border-r border-gray-200 shadow-lg
        transform transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        w-80
      `}
      >
        <div className="h-full p-6 flex flex-col overflow-y-auto z-10">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-40 h-10 -ml-12">
              {" "}
              {/* Adjust width/height as needed */}
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
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">
              {formatDateRange()}
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <Slider
                value={dateRange}
                onValueChange={handleDateRangeChange}
                min={0}
                max={23}
                step={1}
                minStepsBetweenThumbs={1}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Jan 2024</span>
                <span>Dec 2025</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 text-gray-900">
              Kategori Kriminalitas
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {crimeCategories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  onClick={() => handleCategoryToggle(category)}
                  className={
                    selectedCategories.includes(category)
                      ? "bg-gray-900 text-white hover:bg-gray-800 border-gray-900"
                      : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">
              Jumlah Kejadian:
            </h2>
            <div className="text-3xl font-bold text-gray-900">
              {initialIncidents.toLocaleString()}
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full mt-auto backdrop-blur-sm bg-white/20 hover:bg-white/30 text-gray-900"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>

      <div
        className={`
          fixed inset-0 z-30 bg-black/50 backdrop-blur-sm
          transition-opacity duration-300
          ${
            isOpen
              ? "opacity-100 md:opacity-0"
              : "opacity-0 pointer-events-none"
          }
        `}
        onClick={onClose}
      />
    </>
  );
}
