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
      title: "Pemetaan Kriminalitas Interaktif",
      description:
        "Visualisasikan titik rawan dan pola kejahatan di destinasi wisata dengan pemetaan real-time",
      content:
        "Visualisasi geospasial canggih yang menampilkan distribusi kejahatan, jenis insiden, dan tingkat keparahan di berbagai zona wisata dengan integrasi data BPS.",
      badge: "Peta Panas",
      icon: "🗺️",
    },
    {
      title: "Analitik Prediktif AI",
      description:
        "Manfaatkan machine learning untuk memprediksi tren kejahatan dan mengidentifikasi area berisiko tinggi",
      content:
        "Algoritma canggih menganalisis data kejahatan historis (2021-2023) untuk meramalkan potensi ancaman keamanan dan mengoptimalkan tindakan pencegahan.",
      badge: "Berbasis AI",
      icon: "🧠",
    },
    {
      title: "Analitik Keamanan Wisata",
      description:
        "Analisis khusus yang berfokus pada keamanan wisatawan dan destinasi wisata",
      content:
        "Metrik keamanan khusus pariwisata yang melacak tren keamanan pengunjung, laporan insiden, dan efektivitas keamanan di berbagai zona destinasi.",
      badge: "Fokus Wisata",
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
            Solusi CrimeWatch
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Fitur Keamanan Pariwisata Canggih
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Perangkat manajemen keamanan komprehensif yang dirancang untuk
            mengatasi peningkatan 23% kasus kejahatan di destinasi wisata,
            memberdayakan pengelola destinasi dengan wawasan berbasis data
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
        <div className="mt-20 mb-16">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 md:p-12 text-center border-2 border-gray-200">
            <Badge variant="outline" className="mb-4 text-black border-black">
              Akses Terbatas
            </Badge>
            <h3 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Ajukan Akun Organisasi Anda
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
              CrimeWatch hanya tersedia untuk organisasi resmi. Ajukan akses
              jika Anda mewakili destinasi wisata, instansi pemerintah, atau
              kepolisian yang berkomitmen meningkatkan keamanan pengunjung.
            </p>

            <div className="flex justify-center items-center mb-8">
              <Button
                size="lg"
                className="bg-black text-white hover:bg-gray-800 px-8 w-full max-w-md"
                asChild
              >
                <Link
                  href="mailto:crimewatch0100@gmail.com?subject=Request%20Account%20Access&body=Halo%2C%20admin%20Crimewatch.%20Saya%20ingin%20membuat%20akun%20Crimewatch%20dengan%20format%3A%0A%0ANama%20pemilik%3A%20%0ANama%20organisasi%2Fbisnis%3A%20%0ALink%20Gmaps%3A%20%0A%0ATerima%20kasih"
                  target="_blank"
                >
                  Ajukan Akses Akun
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-black">Pariwisata</div>
                <div className="text-sm text-gray-600">
                  Pemilik & Pengelola Destinasi
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-black">Pemerintah</div>
                <div className="text-sm text-gray-600">
                  Instansi Regional & Lokal
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-black">Kepolisian</div>
                <div className="text-sm text-gray-600">Unit Penegak Hukum</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
