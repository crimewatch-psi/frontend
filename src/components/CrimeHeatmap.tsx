'use client'
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import type { Map } from 'leaflet'
import { Marker, Popup } from 'react-leaflet'
import { useRouter } from 'next/navigation'

export type CrimeRateLevel = "Highest" | "High" | "Medium" | "Low" | "Lowest"

export interface CrimeData {
  id: number
  name: string
  lat: number
  lng: number
  crimeRate: CrimeRateLevel
  category?: string
  date?: Date
}

interface CrimeHeatmapProps {
  crimeData: CrimeData[]
  centerPoint?: { lat: number; lng: number }
  selectedLocation?: { lat: number; lng: number; name: string } | null
}

interface CrimeHeatmapHandle {
  flyTo: (lat: number, lng: number, zoom?: number) => void
  getMap: () => Map | null
}

const crimeRateToIntensity = (level: CrimeRateLevel): number => {
  const intensityMap: Record<CrimeRateLevel, number> = {
    'Highest': 1.0,
    'High': 0.75,
    'Medium': 0.5,
    'Low': 0.25,
    'Lowest': 0.1
  }
  return intensityMap[level]
}

const HeatmapLayer = ({ 
  data, 
  centerPoint 
}: { 
  data: CrimeData[]; 
  centerPoint?: { lat: number; lng: number } 
}) => {
  const map = useMap()
  const heatLayerRef = useRef<L.HeatLayer | null>(null)

  useEffect(() => {
    if (!map || data.length === 0) return

    const processedData = data.map(point => {
      const intensity = crimeRateToIntensity(point.crimeRate)
      
      if (centerPoint) {
        const distance = Math.sqrt(
          Math.pow(point.lat - centerPoint.lat, 2) + 
          Math.pow(point.lng - centerPoint.lng, 2)
        ) * 100
        return [point.lat, point.lng, Math.max(0.1, intensity * (1 - distance * 0.05))]
      }
      
      return [point.lat, point.lng, intensity] as [number, number, number]
    })

    if (heatLayerRef.current) {
      heatLayerRef.current.remove()
    }

    heatLayerRef.current = (L as any).heatLayer(processedData, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      minOpacity: 0.5,
      gradient: {
        0.1: 'blue',
        0.3: 'green',
        0.5: 'yellow',
        0.7: 'orange',
        1.0: 'red'
      }
    }).addTo(map)

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current)
      }
    }
  }, [map, data, centerPoint])

  return null
}

const CrimeHeatmap = forwardRef<CrimeHeatmapHandle, CrimeHeatmapProps>(
  ({ crimeData, centerPoint, selectedLocation }, ref) => {
    const [mapReady, setMapReady] = useState(false)
    const mapRef = useRef<Map | null>(null)
    const markerRef = useRef<any>(null)
    const router = useRouter()

    useImperativeHandle(ref, () => ({
      flyTo: (lat: number, lng: number, zoom = 15) => {
        mapRef.current?.flyTo([lat, lng], zoom)
      },
      getMap: () => mapRef.current
    }))

    const handleViewCrimeStatistic = (locationName: string) => {
      router.push(`/crime-statistics?location=${encodeURIComponent(locationName)}`)
    }

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const customIcon = L.divIcon({
          html: `
            <div class="bounce-marker" style="
              transform: translateY(-50%);
              animation: bounce 1s infinite alternate;
            ">
              <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <style>
              @keyframes bounce {
                from { transform: translateY(0); }
                to { transform: translateY(-10px); }
              }
            </style>
          `,
          className: 'custom-marker-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 24]
        })
    
        L.Marker.prototype.options.icon = customIcon
        setMapReady(true)
      }
    }, [])

    useEffect(() => {
      if (selectedLocation && markerRef.current) {
        markerRef.current.openPopup()
      }
    }, [selectedLocation])

    const center = centerPoint || 
      crimeData.find(p => p.lat && p.lng) || 
      { lat: -7.795, lng: 110.369 }

    if (!mapReady) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-gray-900 animate-bounce"></div>
            <div className="w-3 h-3 rounded-full bg-gray-900 animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-3 h-3 rounded-full bg-gray-900 animate-bounce [animation-delay:-0.5s]"></div>
          </div>
        </div>
      )
    }

    return (
      <div className="relative h-full w-full">
        <style jsx global>{`
          .bounce-marker {
            animation: bounce 0.5s infinite alternate ease-in-out;
          }
          @keyframes bounce {
            from { transform: translateY(0); }
            to { transform: translateY(-10px); }
          }
        `}</style>

        <MapContainer 
          center={center} 
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          preferCanvas={true}
          ref={(map) => {
            mapRef.current = map
          }}
          whenReady={() => setMapReady(true)}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <ZoomControl position="topright" />
          <HeatmapLayer data={crimeData} centerPoint={centerPoint} />

          {selectedLocation && (
            <Marker
              position={[selectedLocation.lat, selectedLocation.lng]}
              ref={markerRef}
              eventHandlers={{
                click: () => {
                  if (markerRef.current) {
                    markerRef.current.openPopup()
                  }
                }
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold mb-2">{selectedLocation.name}</h3>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewCrimeStatistic(selectedLocation.name)
                    }}
                    className="w-full bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
                  >
                    View Crime Statistic
                  </button>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    )
  }
)

CrimeHeatmap.displayName = 'CrimeHeatmap'

export default CrimeHeatmap