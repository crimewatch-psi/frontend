"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Brain,
  Shield,
  Eye,
  Users,
  ArrowRight,
  Zap,
  Clock,
  Globe,
  CheckCircle,
} from "lucide-react";

export function PublicAccessSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-green-100 text-green-800 border-green-200">
            <Globe className="w-4 h-4 mr-2" />
            No Login Required
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🌍 Explore Crime Data Publicly
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access real-time crime insights and AI-powered safety
            recommendations instantly. Perfect for tourists, travelers, and
            anyone planning to visit Yogyakarta.
          </p>
        </div>

        {/* Main CTA Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Public Heatmap Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full -translate-y-16 translate-x-16" />
            <CardHeader className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">
                  Interactive Crime Heatmap
                </CardTitle>
              </div>
              <p className="text-gray-600">
                Visualize crime patterns across Yogyakarta with our interactive
                map. Click on any location to get detailed safety information
                and tips.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Real-time data</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Risk indicators</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Safety tips</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">
                    Tourist-friendly
                  </span>
                </div>
              </div>

              <Button
                asChild
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 group-hover:scale-105 transition-transform"
              >
                <Link href="/public-heatmap">
                  <Eye className="w-5 h-5 mr-2" />
                  Explore Crime Heatmap
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Public AI Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full -translate-y-16 translate-x-16" />
            <CardHeader className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">AI Safety Assistant</CardTitle>
              </div>
              <p className="text-gray-600">
                Get personalized safety recommendations powered by AI. Ask
                questions about specific locations and travel situations.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Smart insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">
                    Natural language
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">24/7 available</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Travel-focused</span>
                </div>
              </div>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full border-purple-200 hover:bg-purple-50 group-hover:scale-105 transition-transform"
              >
                <Link href="/public-ai">
                  <Brain className="w-5 h-5 mr-2" />
                  Get AI Recommendations
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Access</h3>
            <p className="text-sm text-gray-600">
              No registration required. Start exploring safety data immediately.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Tourist-Safe</h3>
            <p className="text-sm text-gray-600">
              Designed specifically for visitors and travelers to Yogyakarta.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Real-Time Updates
            </h3>
            <p className="text-sm text-gray-600">
              Access the latest crime data and safety information continuously.
            </p>
          </div>
        </div>

        {/* Popular Queries Preview */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-orange-600" />
              Popular Safety Questions
            </CardTitle>
            <p className="text-gray-600">
              See what other travelers are asking about Yogyakarta
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Is Malioboro Street safe at night?",
                "Best time to visit Borobudur Temple?",
                "Safe transportation from airport?",
                "Food safety at street vendors?",
                "Solo female traveler tips?",
                "Emergency contacts in Yogyakarta?",
              ].map((question, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-sm"
                >
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <span className="text-gray-700">{question}</span>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Button asChild variant="outline">
                <Link href="/public-ai">
                  <Brain className="w-4 h-4 mr-2" />
                  Ask Your Own Question
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Ready to explore Yogyakarta safely? Start with our public tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/public-heatmap">
                <MapPin className="w-5 h-5 mr-2" />
                View Crime Heatmap
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-purple-200 hover:bg-purple-50"
            >
              <Link href="/public-ai">
                <Brain className="w-5 h-5 mr-2" />
                Get AI Safety Tips
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
