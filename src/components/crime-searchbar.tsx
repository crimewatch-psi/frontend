"use client";
import { useState, useCallback, useEffect, useRef, KeyboardEvent } from "react";
import { Search, X } from "lucide-react";

interface SearchResult {
  place_id: number;
  lat: number;
  lon: number;
  display_name: string;
}

interface CenterSearchBarProps {
  onLocationSelected: (lat: number, lng: number, name: string) => void;
  onViewCrimeStatistic?: () => void;
}

export function CenterSearchBar({
  onLocationSelected,
  onViewCrimeStatistic,
}: CenterSearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (results.length > 0) {
        handleResultClick(results[0]);
      } else {
        handleSearch();
      }
    }
  };

  const handleResultClick = (result: SearchResult) => {
    onLocationSelected(result.lat, result.lon, result.display_name);
    setQuery(result.display_name);
    setResults([]);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsFocused(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        handleSearch();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-full max-w-md">
      <div className="relative mx-4">
        {/* Glassmorphism container with black text */}
        <div className="backdrop-blur-md bg-white/10 rounded-xl shadow-lg border border-white/20 overflow-hidden text-gray-900">
          {/* Search input with glass effect */}
          <div className="flex items-center bg-white/20 backdrop-blur-sm">
            <div className="pl-4 text-gray-700">
              <Search />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Search Location..."
              className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-gray-900 placeholder-gray-600"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="p-3 text-gray-700 hover:text-gray-900 transition-colors"
                aria-label="Clear search"
              >
                <X />
              </button>
            )}
          </div>

          {/* Results dropdown with glass effect */}
          {(isFocused || results.length > 0) && (
            <div className="backdrop-blur-md bg-white/30 border-t border-white/20">
              <ul className="max-h-60 overflow-auto">
                {isSearching ? (
                  <li className="p-3 text-center text-gray-700">Mencari...</li>
                ) : results.length > 0 ? (
                  results.map((result) => (
                    <li
                      key={result.place_id}
                      className="p-3 hover:bg-white/20 cursor-pointer border-b border-white/10 last:border-b-0 transition-colors"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {result.display_name}
                      </div>
                    </li>
                  ))
                ) : query && !isSearching ? (
                  <li className="p-3 text-center text-gray-700">
                    Tidak ada hasil
                  </li>
                ) : null}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
