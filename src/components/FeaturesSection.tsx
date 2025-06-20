"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeatmapPointer } from "@/components/ui/heatmap-pointer";
import { Button } from "@/components/ui/button";

export function FeaturesSection() {
  const features = [
    {
      title: "Interactive Crime Mapping",
      description:
        "Visualize crime hotspots and patterns across tourist destinations with real-time mapping",
      content:
        "Advanced geospatial visualization showing crime distribution, incident types, and severity levels across different tourist zones with BPS data integration.",
      badge: "Heatmap",
      icon: "🗺️",
    },
    {
      title: "AI Predictive Analytics",
      description:
        "Leverage machine learning to predict crime trends and identify high-risk areas",
      content:
        "Advanced algorithms analyze historical crime data (2021-2023) to forecast potential security threats and optimize preventive measures.",
      badge: "AI Powered",
      icon: "🧠",
    },
    {
      title: "Tourism Safety Analytics",
      description:
        "Specialized analytics focused on tourist safety and destination security",
      content:
        "Tourism-specific safety metrics that track visitor safety trends, incident reports, and security effectiveness across different destination zones.",
      badge: "Tourism Focus",
      icon: "🏖️",
    },
  ];

  return (
    <div className="min-h-screen   bg-white relative z-10">
      <HeatmapPointer />
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-black border-black">
            CrimeWatch Solutions
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Advanced Tourism Security Features
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Comprehensive security management tools designed to address the 23%
            increase in crime cases in tourist destinations, empowering
            destination managers with data-driven insights
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 border-gray-200 hover:border-black transition-all duration-300 bg-white shadow-none hover:shadow-xl group"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-3xl">{feature.icon}</div>
                  <Badge variant="secondary" className="bg-black text-white">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-black group-hover:text-gray-800 transition-colors">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-px bg-gray-200 mb-4"></div>
                <p className="text-gray-700 leading-relaxed">
                  {feature.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 md:p-12 text-center border-2 border-gray-200">
            <Badge variant="outline" className="mb-4 text-black border-black">
              Restricted Access
            </Badge>
            <h3 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Request Your Organization Account
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
              CrimeWatch is exclusively available to authorized organizations.
              Request access if you represent a tourist destination, government
              agency, or police force committed to enhancing visitor safety.
            </p>

            <div className="flex justify-center items-center mb-8">
              <Button
                size="lg"
                className="bg-black text-white hover:bg-gray-800 px-8 w-full max-w-md"
                asChild
              >
                <Link href="/register">Request Account Access</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-black">Tourism</div>
                <div className="text-sm text-gray-600">
                  Destination Owners & Managers
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-black">Government</div>
                <div className="text-sm text-gray-600">
                  Regional & Local Agencies
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-black">Police</div>
                <div className="text-sm text-gray-600">
                  Law Enforcement Units
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
