"use client";
import { Button } from "@/components/ui/button";
import { Card, Carousel } from "@/components/ui/cards-carousel";
import { HeatmapPointer } from "./ui/heatmap-pointer";
import Image from "next/image";
import { Badge } from "./ui/badge";

export function ProblemStatement() {
  const CriminalData = ({
    type,
    stats,
    description,
  }: {
    type: string;
    stats: string;
    description: string;
  }) => {
    return (
      <>
        {[...new Array(1).fill(1)].map((_, index) => {
          return (
            <div
              key={"criminal-data" + index}
              className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
            >
              <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
                <span className="font-bold text-neutral-700 dark:text-neutral-200">
                  {stats}
                </span>{" "}
                {description}
              </p>
            </div>
          );
        })}
      </>
    );
  };

  const data = [
    {
      category: "Yogyakarta City",
      title: "Urban Scams in Yogyakarta City",
      src: "/yogyakarta.jpeg",
      content: (
        <CriminalData
          type="Yogyakarta City"
          stats="38 tourist-targeted crimes reported in Q4 2024"
          description="in Malioboro Street area alone. Recent incidents include pickpocketing near Tugu Railway Station, fake tour guide scams around Kraton Palace, and overcharging at traditional markets. Police have increased patrols around major tourist attractions."
        />
      ),
    },
    {
      category: "Sleman Regency",
      title: "Temple Theft in Sleman Regency",
      src: "/sleman.jpg",
      content: (
        <CriminalData
          type="Sleman Regency"
          stats="15 cases of tourist-targeted theft in Nov 2024"
          description="reported around Candi Prambanan and Kaliurang area. Motorcycle theft targeting rental vehicles, bag snatching incidents near temple complexes, and fake parking attendant scams have become prevalent. Local authorities have deployed additional security personnel."
        />
      ),
    },
    {
      category: "Bantul Regency",
      title: "Beach Fraud in Bantul Regency",
      src: "/bantul.jpg",
      content: (
        <CriminalData
          type="Bantul Regency"
          stats="22 incidents affecting tourists in Dec 2024"
          description="primarily at Parangtritis Beach and Imogiri area. Beach vendor overcharging, unauthorized tour guide activities, and vehicle break-ins at parking areas have been reported. Recent coordinated efforts between police and tourism officials aim to address these issues."
        />
      ),
    },
    {
      category: "Kulon Progo Regency",
      title: "Tourism Exploitation in Kulon Progo Regency",
      src: "/kulonprogo.jpg",
      content: (
        <CriminalData
          type="Kulon Progo Regency"
          stats="8 reported cases targeting tourists in Nov 2024"
          description="mainly around Kalibiru Tourism Area and Waduk Sermo. Issues include inflated accommodation prices for tourists, unauthorized guide services, and minor theft incidents at popular photo spots. Tourism stakeholders are working on visitor safety protocols."
        />
      ),
    },
    {
      category: "Gunungkidul Regency",
      title: "Coastal Crime in Gunungkidul Regency",
      src: "/gunungkidul.jpg",
      content: (
        <CriminalData
          type="Gunungkidul Regency"
          stats="12 tourist-related incidents in Q4 2024"
          description="concentrated around Baron Beach, Indrayanti Beach, and Jomblang Cave. Recent reports include equipment rental fraud, unauthorized cave guide activities, and vehicle theft at beach parking areas. Enhanced coordination between tourism police and local communities is underway."
        />
      ),
    },
  ];

  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="relative z-10 bg-white overflow-hidden min-h-screen py-20">
      <HeatmapPointer />

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto text-center">
          <Badge variant="outline" className="mb-4 text-black border-black">
            Problem Statement
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            What Is Actually The Problem?
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Based on BPS data (2021-2023), crime cases in tourist destination
            areas have increased by 23%, highlighting the urgent need for an
            effective security management system. CrimeWatch addresses this
            challenge by providing a comprehensive platform for security
            information management and strategic decision-making.
          </p>

          <Carousel items={cards} initialScroll={1} />
        </div>
      </div>
    </div>
  );
}
