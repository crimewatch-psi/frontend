"use client";

import { useState } from "react";
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
  Brain,
  Shield,
  Clock,
  Navigation,
  Info,
  Lightbulb,
  Route,
  AlertTriangle,
  CheckCircle,
  Star,
  Users,
  Calendar,
  Zap,
  Send,
  RefreshCw,
} from "lucide-react";

interface AIRecommendation {
  id: string;
  query: string;
  location: string;
  travelType: string;
  timeOfDay: string;
  recommendations: {
    safetyTips: string[];
    routeAdvice: string[];
    localInsights: string[];
    emergencyInfo: string[];
  };
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  timestamp: string;
}

export default function PublicAI() {
  const [currentQuery, setCurrentQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [travelType, setTravelType] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock AI recommendations data
  const mockRecommendations: Record<string, AIRecommendation> = {
    "malioboro-evening": {
      id: "1",
      query: "Visiting Malioboro Street in the evening",
      location: "Malioboro Street",
      travelType: "tourism",
      timeOfDay: "evening",
      recommendations: {
        safetyTips: [
          "Keep valuables secure and avoid displaying expensive items",
          "Stay in well-lit areas with good foot traffic",
          "Use official vendors and avoid street touts",
          "Keep emergency contacts readily available"
        ],
        routeAdvice: [
          "Start from Tugu Station and walk towards Kraton",
          "Use main pedestrian areas rather than side streets",
          "Consider using Transjogja bus for longer distances",
          "Exit before 10 PM when foot traffic decreases"
        ],
        localInsights: [
          "Malioboro is generally safe but pickpocketing can occur",
          "Street food is usually safe from established vendors",
          "Bargaining is expected at souvenir shops",
          "Free WiFi available at many cafes and restaurants"
        ],
        emergencyInfo: [
          "Police post located near Sosrowijayan area",
          "Tourist information center: +62 274 566000",
          "Nearest hospital: RS Bethesda (5 minutes by taxi)",
          "Emergency number: 112 (Police, Fire, Medical)"
        ]
      },
      riskLevel: "medium",
      confidence: 87,
      timestamp: new Date().toISOString()
    },
    "borobudur-morning": {
      id: "2",
      query: "Visiting Borobudur Temple in the morning",
      location: "Borobudur Temple",
      travelType: "tourism",
      timeOfDay: "morning",
      recommendations: {
        safetyTips: [
          "Book tickets in advance to avoid scams",
          "Use official tour guides only",
          "Wear comfortable walking shoes and sun protection",
          "Bring sufficient water and snacks"
        ],
        routeAdvice: [
          "Start early (6 AM) to avoid crowds and heat",
          "Use official transport from Yogyakarta (1-2 hours)",
          "Park in designated areas only",
          "Follow temple rules and designated pathways"
        ],
        localInsights: [
          "Sunrise viewing requires separate tickets",
          "Local guides are knowledgeable about temple history",
          "Photography is allowed but respect other visitors",
          "Souvenir shops have fixed and negotiable prices"
        ],
        emergencyInfo: [
          "Temple security available throughout grounds",
          "First aid post located at visitor center",
          "Nearest clinic: Puskesmas Borobudur",
          "Temple contact: +62 293 788266"
        ]
      },
      riskLevel: "low",
      confidence: 94,
      timestamp: new Date().toISOString()
    }
  };

  const handleSubmitQuery = async () => {
    if (!currentQuery.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock recommendation based on query
    const queryKey = `${selectedLocation.toLowerCase()}-${timeOfDay}`.replace(/\s+/g, '-');
    const mockRec = mockRecommendations[queryKey] || {
      id: Date.now().toString(),
      query: currentQuery,
      location: selectedLocation || "General Area",
      travelType: travelType || "tourism",
      timeOfDay: timeOfDay || "any time",
      recommendations: {
        safetyTips: [
          "Stay aware of your surroundings at all times",
          "Keep important documents in a secure location",
          "Inform someone of your travel plans",
          "Use reputable transportation services"
        ],
        routeAdvice: [
          "Plan your route in advance using reliable maps",
          "Stick to main roads and well-traveled paths",
          "Allow extra time for unexpected delays",
          "Have backup transportation options ready"
        ],
        localInsights: [
          "Local customs and etiquette vary by area",
          "Language barriers can be overcome with translation apps",
          "Tipping practices differ from Western countries",
          "Weather conditions can change quickly"
        ],
        emergencyInfo: [
          "Download offline maps before traveling",
          "Keep emergency numbers in local language",
          "Know location of nearest embassy/consulate",
          "Have travel insurance contact information ready"
        ]
      },
      riskLevel: "medium",
      confidence: 75,
      timestamp: new Date().toISOString()
    };

    setRecommendations(prev => [mockRec, ...prev.slice(0, 4)]);
    setIsLoading(false);
    setCurrentQuery("");
  };

  const popularQueries = [
    "Visiting Malioboro Street in the evening",
    "Solo female traveler safety tips",
    "Best time to visit Kraton Palace",
    "Transportation from airport to city center",
    "Food safety at street vendors",
    "Borobudur temple sunrise tour safety"
  ];

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "high": return "destructive" as const;
      case "medium": return "secondary" as const;
      case "low": return "default" as const;
      default: return "outline" as const;
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "high": return <AlertTriangle className="w-4 h-4" />;
      case "medium": return <Info className="w-4 h-4" />;
      case "low": return <CheckCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🤖 AI Travel Safety Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get personalized safety recommendations and travel insights powered by AI.
            Ask questions about specific locations, travel times, or situations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Query Interface */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Ask AI for Safety Advice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Your Question
                    </label>
                    <Input
                      placeholder="e.g., 'Is it safe to visit Malioboro Street at night?'"
                      value={currentQuery}
                      onChange={(e) => setCurrentQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmitQuery()}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Location (Optional)
                      </label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="malioboro">Malioboro Street</SelectItem>
                          <SelectItem value="borobudur">Borobudur Temple</SelectItem>
                          <SelectItem value="kraton">Kraton Palace</SelectItem>
                          <SelectItem value="parangtritis">Parangtritis Beach</SelectItem>
                          <SelectItem value="sleman">Sleman District</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Travel Type
                      </label>
                      <Select value={travelType} onValueChange={setTravelType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Travel type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tourism">Tourism</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="solo">Solo Travel</SelectItem>
                          <SelectItem value="family">Family</SelectItem>
                          <SelectItem value="group">Group</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Time of Day
                      </label>
                      <Select value={timeOfDay} onValueChange={setTimeOfDay}>
                        <SelectTrigger>
                          <SelectValue placeholder="Time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning</SelectItem>
                          <SelectItem value="afternoon">Afternoon</SelectItem>
                          <SelectItem value="evening">Evening</SelectItem>
                          <SelectItem value="night">Night</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSubmitQuery} 
                  disabled={!currentQuery.trim() || isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? "AI is thinking..." : "Get AI Recommendations"}
                </Button>
              </CardContent>
            </Card>

            {/* AI Recommendations Results */}
            {recommendations.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">AI Recommendations</h2>
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{rec.query}</CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={getRiskBadgeVariant(rec.riskLevel)}>
                              {getRiskIcon(rec.riskLevel)}
                              {rec.riskLevel.toUpperCase()} RISK
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-gray-600">
                                {rec.confidence}% confidence
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div>{rec.location}</div>
                          <div>{new Date(rec.timestamp).toLocaleTimeString()}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-600" />
                            Safety Tips
                          </h4>
                          <ul className="space-y-2">
                            {rec.recommendations.safetyTips.map((tip, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Route className="w-4 h-4 text-blue-600" />
                            Route Advice
                          </h4>
                          <ul className="space-y-2">
                            {rec.recommendations.routeAdvice.map((advice, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                {advice}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-orange-600" />
                            Local Insights
                          </h4>
                          <ul className="space-y-2">
                            {rec.recommendations.localInsights.map((insight, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                {insight}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            Emergency Info
                          </h4>
                          <ul className="space-y-2">
                            {rec.recommendations.emergencyInfo.map((info, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                {info}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Queries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Popular Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {popularQueries.map((query, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full text-left justify-start h-auto p-2 whitespace-normal"
                      onClick={() => setCurrentQuery(query)}
                    >
                      <span className="text-sm">{query}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  AI Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">97%</p>
                    <p className="text-sm text-gray-600">Accuracy</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">2.3s</p>
                    <p className="text-sm text-gray-600">Response</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">150+</p>
                    <p className="text-sm text-gray-600">Locations</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-600">24/7</p>
                    <p className="text-sm text-gray-600">Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Ask Your Question</p>
                      <p className="text-sm text-gray-600">
                        Type your safety or travel question
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">AI Analysis</p>
                      <p className="text-sm text-gray-600">
                        Our AI analyzes crime data and patterns
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Get Recommendations</p>
                      <p className="text-sm text-gray-600">
                        Receive personalized safety advice
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold mb-4">Want Visual Crime Data?</h3>
              <p className="text-gray-600 mb-6">
                Explore our interactive heatmap to see crime patterns and statistics by location.
              </p>
              <Button size="lg" asChild>
                <a href="/public-heatmap">
                  <MapPin className="w-5 h-5 mr-2" />
                  View Crime Heatmap
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