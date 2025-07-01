"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  Send,
  Star,
  Clock,
  Users,
  Shield,
  Home,
  LogOut,
  FileText,
  Zap,
  ArrowRight,
  Info,
} from "lucide-react";
import Link from "next/link";

interface AIInsight {
  id: string;
  query: string;
  type: "trend" | "prediction" | "comparison" | "recommendation";
  title: string;
  summary: string;
  details: string[];
  confidence: number;
  riskLevel: "low" | "medium" | "high";
  timestamp: string;
  chartData?: any;
  recommendations?: string[];
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organization?: string;
}

export default function Analytics() {
  const [user, setUser] = useState<User | null>(null);
  const [currentQuery, setCurrentQuery] = useState("");
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState("last_month");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    loadDefaultInsights();
  }, []);

  const checkAuth = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="))
      ?.split("=")[1];

    if (!token) {
      router.push("/login");
      return;
    }

    const mockUser = {
      id: "1",
      email: "tourism@example.com",
      name: "Tourism Manager",
      role: "manajer_wisata",
      organization: "Yogyakarta Tourism Board",
    };
    setUser(mockUser);
  };

  const loadDefaultInsights = () => {
    const defaultInsights: AIInsight[] = [
      {
        id: "1",
        query: "Show me crime trends for the last month",
        type: "trend",
        title: "Monthly Crime Trend Analysis",
        summary: "Crime incidents decreased by 18% compared to previous month",
        details: [
          "Petty theft incidents reduced by 25% in tourist areas",
          "Vehicle theft cases down by 12% citywide",
          "Fraud cases increased by 8% but concentrated in specific areas",
          "Overall safety index improved by 15%",
        ],
        confidence: 89,
        riskLevel: "low",
        timestamp: new Date().toISOString(),
        recommendations: [
          "Continue current security measures in tourist areas",
          "Increase fraud awareness campaigns",
          "Maintain elevated patrols during peak hours",
        ],
      },
      {
        id: "2",
        query: "Which location has the highest crime trend?",
        type: "comparison",
        title: "High-Risk Location Analysis",
        summary:
          "Yogyakarta Railway Station shows highest incident concentration",
        details: [
          "Railway Station: 23 incidents (40% increase from last month)",
          "Malioboro Street: 15 incidents (20% decrease from last month)",
          "Borobudur Area: 8 incidents (stable trend)",
          "Primary risk factors: crowded areas, limited lighting, tourist traffic",
        ],
        confidence: 94,
        riskLevel: "high",
        timestamp: new Date().toISOString(),
        recommendations: [
          "Deploy additional security personnel at railway station",
          "Improve lighting and surveillance systems",
          "Implement targeted awareness campaigns for travelers",
        ],
      },
    ];
    setInsights(defaultInsights);
  };

  const handleSubmitQuery = async () => {
    if (!currentQuery.trim()) return;

    setIsLoading(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Generate mock AI response based on query
    const newInsight: AIInsight = {
      id: Date.now().toString(),
      query: currentQuery,
      type: "prediction",
      title: `AI Analysis: ${currentQuery}`,
      summary: "Based on current patterns and historical data analysis",
      details: [
        "Analysis completed using machine learning algorithms",
        "Pattern recognition identified key risk factors",
        "Predictive modeling shows potential future trends",
        "Correlation analysis reveals significant insights",
      ],
      confidence: Math.floor(Math.random() * 20) + 75, // 75-95%
      riskLevel: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as
        | "low"
        | "medium"
        | "high",
      timestamp: new Date().toISOString(),
      recommendations: [
        "Monitor identified risk patterns closely",
        "Implement preventive measures in high-risk areas",
        "Continue data collection for improved accuracy",
      ],
    };

    setInsights((prev) => [newInsight, ...prev.slice(0, 4)]);
    setIsLoading(false);
    setCurrentQuery("");
  };

  const handleLogout = () => {
    document.cookie =
      "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/");
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "trend":
        return <TrendingUp className="w-4 h-4" />;
      case "prediction":
        return <Brain className="w-4 h-4" />;
      case "comparison":
        return <BarChart3 className="w-4 h-4" />;
      case "recommendation":
        return <Lightbulb className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const suggestedQueries = [
    "Show crime patterns for weekend vs weekday",
    "Predict crime risk for next month",
    "Compare safety levels between different districts",
    "What are the peak crime hours in tourist areas?",
    "Analysis of seasonal crime trends",
    "Risk assessment for upcoming festival period",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                  C
                </div>
                <span className="text-xl font-bold text-gray-900">
                  CrimeWatch AI
                </span>
              </Link>
              <div className="hidden md:flex items-center space-x-2">
                <Badge className="bg-purple-100 text-purple-800">
                  AI Analytics
                </Badge>
                <span className="text-gray-600">|</span>
                <span className="text-gray-900">{user?.name}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧠 AI Analytics & Insights Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced crime analytics powered by artificial intelligence. Query
            data in natural language and get intelligent insights for tourism
            safety management.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* AI Query Interface */}
            <Card className="border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-600" />
                  AI Query Interface
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask AI anything about crime data... e.g., 'Which location has the highest crime trend?'"
                      value={currentQuery}
                      onChange={(e) => setCurrentQuery(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSubmitQuery()
                      }
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSubmitQuery}
                      disabled={!currentQuery.trim() || isLoading}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <div className="flex gap-4">
                    <Select
                      value={selectedTimeRange}
                      onValueChange={setSelectedTimeRange}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Time Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last_week">Last Week</SelectItem>
                        <SelectItem value="last_month">Last Month</SelectItem>
                        <SelectItem value="last_quarter">
                          Last Quarter
                        </SelectItem>
                        <SelectItem value="last_year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedLocation}
                      onValueChange={setSelectedLocation}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="malioboro">
                          Malioboro Street
                        </SelectItem>
                        <SelectItem value="borobudur">
                          Borobudur Area
                        </SelectItem>
                        <SelectItem value="railway">Railway Station</SelectItem>
                        <SelectItem value="kraton">Kraton Palace</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {isLoading && (
                  <div className="mt-6 p-6 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3">
                      <RefreshCw className="w-5 h-5 animate-spin text-purple-600" />
                      <div>
                        <p className="font-medium text-purple-900">
                          AI is analyzing your query...
                        </p>
                        <p className="text-sm text-purple-700">
                          Processing crime data patterns and generating insights
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Insights Results */}
            {insights.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  AI Insights & Analysis
                </h2>

                {insights.map((insight) => (
                  <Card
                    key={insight.id}
                    className="border-l-4 border-l-purple-500"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getTypeIcon(insight.type)}
                            <span className="text-sm font-medium text-gray-600 capitalize">
                              {insight.type} Analysis
                            </span>
                          </div>
                          <CardTitle className="text-xl mb-2">
                            {insight.title}
                          </CardTitle>
                          <p className="text-gray-600">{insight.summary}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge
                            variant={getRiskBadgeVariant(insight.riskLevel)}
                          >
                            {insight.riskLevel.toUpperCase()} RISK
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-600">
                              {insight.confidence}% confidence
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="details" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="details">Details</TabsTrigger>
                          <TabsTrigger value="recommendations">
                            Recommendations
                          </TabsTrigger>
                          <TabsTrigger value="actions">Actions</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="mt-4">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900">
                              Analysis Details:
                            </h4>
                            <ul className="space-y-2">
                              {insight.details.map((detail, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-700 flex items-start gap-2"
                                >
                                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </TabsContent>

                        <TabsContent value="recommendations" className="mt-4">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4 text-yellow-500" />
                              AI Recommendations:
                            </h4>
                            {insight.recommendations ? (
                              <ul className="space-y-2">
                                {insight.recommendations.map((rec, index) => (
                                  <li
                                    key={index}
                                    className="text-sm text-gray-700 flex items-start gap-2"
                                  >
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-600">
                                No specific recommendations available for this
                                analysis.
                              </p>
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="actions" className="mt-4">
                          <div className="flex gap-2 flex-wrap">
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Export Report
                            </Button>
                            <Button variant="outline" size="sm">
                              <MapPin className="w-4 h-4 mr-2" />
                              View on Map
                            </Button>
                            <Button variant="outline" size="sm">
                              <BarChart3 className="w-4 h-4 mr-2" />
                              Create Chart
                            </Button>
                            <Button variant="outline" size="sm">
                              <Users className="w-4 h-4 mr-2" />
                              Share Insight
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>

                      <div className="mt-4 pt-4 border-t text-sm text-gray-500 flex items-center justify-between">
                        <span>Query: "{insight.query}"</span>
                        <span>
                          {new Date(insight.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggested Queries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Suggested Queries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {suggestedQueries.map((query, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full text-left justify-start h-auto p-3 whitespace-normal"
                      onClick={() => setCurrentQuery(query)}
                    >
                      <ArrowRight className="w-3 h-3 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{query}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  AI Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">98%</p>
                    <p className="text-sm text-gray-600">Accuracy</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">1.8s</p>
                    <p className="text-sm text-gray-600">Response</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">24/7</p>
                    <p className="text-sm text-gray-600">Available</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">500+</p>
                    <p className="text-sm text-gray-600">Queries</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/public-heatmap">
                      <MapPin className="w-4 h-4 mr-2" />
                      View Heatmap
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/charts">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Data Charts
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/reports">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/data">
                      <Target className="w-4 h-4 mr-2" />
                      Raw Data
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  AI Query Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-900">Be Specific</p>
                    <p>
                      Include location, time period, or crime type for better
                      results
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Ask Comparisons</p>
                    <p>Compare different areas, time periods, or trends</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Request Predictions
                    </p>
                    <p>Ask about future trends or risk assessments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
