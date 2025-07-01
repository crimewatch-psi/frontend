"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Brain,
  MapPin,
  Upload,
  TrendingUp,
  TrendingDown,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Clock,
  FileText,
  Download,
  Eye,
  Settings,
  LogOut,
  Home,
  Activity,
  Target,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organization?: string;
}

interface DashboardStats {
  totalLocations: number;
  totalIncidents: number;
  highRiskAreas: number;
  trendDirection: "up" | "down" | "stable";
  lastUpdated: string;
}

interface RecentActivity {
  id: string;
  type: "upload" | "analysis" | "query" | "report";
  description: string;
  timestamp: string;
  user: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    loadDashboardData();
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

    // Mock user data - in real app, would decode JWT
    const mockUser = {
      id: "1",
      email: "tourism@example.com",
      name: "Tourism Manager",
      role: "manajer_wisata",
      organization: "Yogyakarta Tourism Board",
    };
    setUser(mockUser);
  };

  const loadDashboardData = async () => {
    // Mock API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock dashboard data
    setStats({
      totalLocations: 25,
      totalIncidents: 164,
      highRiskAreas: 3,
      trendDirection: "down",
      lastUpdated: new Date().toISOString(),
    });

    setRecentActivity([
      {
        id: "1",
        type: "analysis",
        description: "AI analysis completed for Malioboro Street area",
        timestamp: "2024-01-22T10:30:00Z",
        user: "Tourism Manager",
      },
      {
        id: "2",
        type: "query",
        description: "Tourist safety query: 'Evening visit recommendations'",
        timestamp: "2024-01-22T09:15:00Z",
        user: "Public User",
      },
      {
        id: "3",
        type: "upload",
        description: "Crime data uploaded for January 2024",
        timestamp: "2024-01-22T08:45:00Z",
        user: "Police Officer",
      },
      {
        id: "4",
        type: "report",
        description: "Monthly safety report generated",
        timestamp: "2024-01-21T16:20:00Z",
        user: "Tourism Manager",
      },
    ]);

    setIsLoading(false);
  };

  const handleLogout = () => {
    document.cookie =
      "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/");
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "manajer_wisata":
        return { label: "Tourism Manager", color: "bg-blue-100 text-blue-800" };
      case "pemerintah":
        return { label: "Government", color: "bg-green-100 text-green-800" };
      case "polri":
        return { label: "Police", color: "bg-red-100 text-red-800" };
      case "admin":
        return {
          label: "Administrator",
          color: "bg-purple-100 text-purple-800",
        };
      default:
        return { label: "User", color: "bg-gray-100 text-gray-800" };
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upload":
        return <Upload className="w-4 h-4" />;
      case "analysis":
        return <Brain className="w-4 h-4" />;
      case "query":
        return <Zap className="w-4 h-4" />;
      case "report":
        return <FileText className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "upload":
        return "text-blue-600 bg-blue-50";
      case "analysis":
        return "text-purple-600 bg-purple-50";
      case "query":
        return "text-orange-600 bg-orange-50";
      case "report":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                  C
                </div>
                <span className="text-xl font-bold text-gray-900">
                  CrimeWatch
                </span>
              </Link>
              <div className="hidden md:flex items-center space-x-4">
                <Badge className={getRoleDisplay(user?.role || "").color}>
                  {getRoleDisplay(user?.role || "").label}
                </Badge>
                <span className="text-gray-600">|</span>
                <span className="text-gray-900">{user?.name}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Home
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-600">
            Monitor crime trends, access AI insights, and manage tourism safety
            data.
          </p>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Locations</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalLocations}
                    </p>
                  </div>
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Incidents</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalIncidents}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">High Risk Areas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.highRiskAreas}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Trend</p>
                    <div className="flex items-center gap-2">
                      {stats.trendDirection === "down" ? (
                        <TrendingDown className="w-5 h-5 text-green-600" />
                      ) : stats.trendDirection === "up" ? (
                        <TrendingUp className="w-5 h-5 text-red-600" />
                      ) : (
                        <div className="w-5 h-5 bg-gray-400 rounded-full" />
                      )}
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {stats.trendDirection === "down"
                          ? "Improving"
                          : stats.trendDirection === "up"
                          ? "Increasing"
                          : "Stable"}
                      </span>
                    </div>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="h-20 flex-col space-y-2" asChild>
                    <Link href="/analytics">
                      <Brain className="w-6 h-6" />
                      <span>AI Analytics Hub</span>
                      <span className="text-xs opacity-75">
                        Get AI insights and predictions
                      </span>
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    asChild
                  >
                    <Link href="/public-heatmap">
                      <MapPin className="w-6 h-6" />
                      <span>Crime Heatmap</span>
                      <span className="text-xs opacity-75">
                        View interactive crime data
                      </span>
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    asChild
                  >
                    <Link href="/charts">
                      <BarChart3 className="w-6 h-6" />
                      <span>Data Visualization</span>
                      <span className="text-xs opacity-75">
                        Charts and analytics
                      </span>
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    asChild
                  >
                    <Link href="/reports">
                      <FileText className="w-6 h-6" />
                      <span>Generate Reports</span>
                      <span className="text-xs opacity-75">
                        Custom safety reports
                      </span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Role-specific Content */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>System Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Data Collection</span>
                        <Badge variant="default">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">AI Analysis</span>
                        <Badge variant="default">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Online
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Last Data Update</span>
                        <span className="text-sm text-gray-600">
                          {new Date(stats?.lastUpdated || "").toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Recent AI Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-l-4 border-l-blue-500 pl-4">
                        <h4 className="font-semibold">
                          Malioboro Street Analysis
                        </h4>
                        <p className="text-sm text-gray-600">
                          Crime incidents decreased by 15% this month. Peak risk
                          hours: 8-10 PM.
                        </p>
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto"
                          asChild
                        >
                          <Link href="/analytics">View full analysis →</Link>
                        </Button>
                      </div>
                      <div className="border-l-4 border-l-green-500 pl-4">
                        <h4 className="font-semibold">
                          Tourist Safety Prediction
                        </h4>
                        <p className="text-sm text-gray-600">
                          High confidence prediction: Low risk weekend for major
                          tourist areas.
                        </p>
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto"
                          asChild
                        >
                          <Link href="/analytics">Get recommendations →</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Quick Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href="/reports/weekly">
                          <Calendar className="w-4 h-4 mr-2" />
                          Weekly Safety Summary
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href="/reports/locations">
                          <MapPin className="w-4 h-4 mr-2" />
                          Location Risk Assessment
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href="/reports/trends">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Crime Trend Analysis
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-full ${getActivityColor(
                          activity.type
                        )}`}
                      >
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()} •{" "}
                          {activity.user}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card>
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/analytics">
                      <Brain className="w-4 h-4 mr-2" />
                      AI Analytics
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/public-heatmap">
                      <MapPin className="w-4 h-4 mr-2" />
                      Heatmap
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/charts">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Charts
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/data">
                      <Eye className="w-4 h-4 mr-2" />
                      Data Explorer
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/reports">
                      <FileText className="w-4 h-4 mr-2" />
                      Reports
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Access documentation, tutorials, and support resources.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    View Documentation
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
