"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  MapPin,
  AlertTriangle,
  Shield,
  Clock,
  Search,
  Navigation,
  Info,
  TrendingDown,
  TrendingUp,
  Eye,
  Users,
  Calendar,
} from "lucide-react";
import { LocationPoint } from "@/components/ui/location-point";

interface CrimeData {
  id: string;
  location: string;
  coordinates: [number, number];
  crimeType: string;
  severity: "low" | "medium" | "high";
  count: number;
  lastIncident: string;
  trend: "up" | "down" | "stable";
  safetyTips: string[];
}

export default function PublicHeatmap() {
  const [selectedLocation, setSelectedLocation] = useState<CrimeData | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("last_month");
  const [severityFilter, setSeverityFilter] = useState("all");

  // Mock data for demonstration
  const crimeData: CrimeData[] = [
    {
      id: "1",
      location: "Malioboro Street",
      coordinates: [-7.7956, 110.3695],
      crimeType: "Petty Theft",
      severity: "medium",
      count: 15,
      lastIncident: "2024-01-20",
      trend: "down",
      safetyTips: [
        "Keep valuables in front pockets",
        "Stay in well-lit areas",
        "Travel in groups when possible",
        "Be aware of pickpockets in crowded areas",
      ],
    },
    {
      id: "2",
      location: "Borobudur Temple Area",
      coordinates: [-7.6079, 110.2038],
      crimeType: "Tourist Scams",
      severity: "low",
      count: 8,
      lastIncident: "2024-01-18",
      trend: "stable",
      safetyTips: [
        "Use official tour guides only",
        "Agree on prices beforehand",
        "Keep tickets and receipts",
        "Report suspicious activities to temple staff",
      ],
    },
    {
      id: "3",
      location: "Yogyakarta Railway Station",
      coordinates: [-7.7893, 110.3644],
      crimeType: "Bag Snatching",
      severity: "high",
      count: 23,
      lastIncident: "2024-01-22",
      trend: "up",
      safetyTips: [
        "Secure bags with zippers",
        "Don't display expensive items",
        "Use taxi or rideshare for transport",
        "Stay alert in crowded areas",
      ],
    },
    {
      id: "4",
      location: "Parangtritis Beach",
      coordinates: [-8.0092, 110.3307],
      crimeType: "Vehicle Theft",
      severity: "medium",
      count: 12,
      lastIncident: "2024-01-19",
      trend: "down",
      safetyTips: [
        "Use secured parking areas",
        "Don't leave valuables in vehicles",
        "Park in well-lit areas",
        "Use reputable rental services",
      ],
    },
    {
      id: "5",
      location: "Sleman District",
      coordinates: [-7.7326, 110.3467],
      crimeType: "Fraud",
      severity: "low",
      count: 6,
      lastIncident: "2024-01-17",
      trend: "stable",
      safetyTips: [
        "Verify business credentials",
        "Use official payment methods",
        "Keep transaction receipts",
        "Report suspicious offers",
      ],
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive" as const;
      case "medium":
        return "secondary" as const;
      case "low":
        return "default" as const;
      default:
        return "outline" as const;
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

  const filteredData = crimeData.filter((item) => {
    const matchesSearch =
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.crimeType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity =
      severityFilter === "all" || item.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🗺️ Crime Safety Heatmap
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore real-time crime data and safety information for Yogyakarta
            tourist areas. Click on any location below to view detailed safety
            insights.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search locations or crime types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_week">Last Week</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="last_3months">Last 3 Months</SelectItem>
              <SelectItem value="last_year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder="Severity Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interactive Map Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Interactive Crime Heatmap
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[500px] relative overflow-hidden">
                {/* Mock Map Interface */}
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative">
                  <div className="absolute inset-0 bg-[url('/yogyakarta.jpeg')] bg-cover bg-center opacity-20"></div>

                  {/* Location Points */}
                  {filteredData.map((location, index) => (
                    <LocationPoint
                      key={location.id}
                      x={20 + ((index * 140) % 500)}
                      y={100 + ((index * 80) % 350)}
                      severity={location.severity}
                      label={location.location}
                      count={location.count}
                      onClick={() => setSelectedLocation(location)}
                      className="cursor-pointer"
                    />
                  ))}

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg">
                    <h4 className="font-semibold mb-2">Risk Levels</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">High Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-sm">Medium Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Low Risk</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location Details Sidebar */}
          <div className="space-y-6">
            {selectedLocation ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      {selectedLocation.location}
                    </span>
                    {getTrendIcon(selectedLocation.trend)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Crime Type</p>
                      <p className="font-semibold">
                        {selectedLocation.crimeType}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Incidents</p>
                      <p className="font-semibold">
                        {selectedLocation.count} cases
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Risk Level</p>
                    <Badge
                      variant={getSeverityBadgeVariant(
                        selectedLocation.severity
                      )}
                    >
                      {selectedLocation.severity.toUpperCase()} RISK
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Last Incident</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        {new Date(
                          selectedLocation.lastIncident
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Safety Tips
                    </h4>
                    <ul className="space-y-2">
                      {selectedLocation.safetyTips.map((tip, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 flex items-start gap-2"
                        >
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => window.open("/public-ai", "_blank")}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get AI Recommendations
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Select a Location
                  </h3>
                  <p className="text-gray-600">
                    Click on any point on the map to view detailed crime
                    statistics and safety information.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {filteredData.length}
                    </p>
                    <p className="text-sm text-gray-600">Locations</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {filteredData.reduce((sum, item) => sum + item.count, 0)}
                    </p>
                    <p className="text-sm text-gray-600">Total Cases</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {
                        filteredData.filter((item) => item.severity === "high")
                          .length
                      }
                    </p>
                    <p className="text-sm text-gray-600">High Risk</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-600">
                      {
                        filteredData.filter((item) => item.trend === "down")
                          .length
                      }
                    </p>
                    <p className="text-sm text-gray-600">Improving</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Location List */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">All Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((location) => (
              <Card
                key={location.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedLocation?.id === location.id
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
                onClick={() => setSelectedLocation(location)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">
                      {location.location}
                    </h3>
                    {getTrendIcon(location.trend)}
                  </div>
                  <p className="text-gray-600 mb-3">{location.crimeType}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant={getSeverityBadgeVariant(location.severity)}>
                      {location.severity.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {location.count} incidents
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold mb-4">
                Need Personalized Safety Advice?
              </h3>
              <p className="text-gray-600 mb-6">
                Get AI-powered recommendations tailored to your specific travel
                plans and destinations.
              </p>
              <Button size="lg" asChild>
                <a href="/public-ai">
                  <Navigation className="w-5 h-5 mr-2" />
                  Get AI Travel Safety Tips
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
