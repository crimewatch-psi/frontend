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
      category: "Kota Yogyakarta",
      title: "Penipuan Urban di Kota Yogyakarta",
      src: "/yogyakarta.jpeg",
      content: (
        <CriminalData
          type="Kota Yogyakarta"
          stats="38 kejahatan terhadap wisatawan dilaporkan di Q4 2024"
          description="hanya di kawasan Jalan Malioboro. Insiden terbaru termasuk pencopetan di sekitar Stasiun Tugu, penipuan pemandu wisata palsu di sekitar Keraton, dan pembengkakan harga di pasar tradisional. Polisi telah meningkatkan patroli di sekitar objek wisata utama."
        />
      ),
    },
    {
      category: "Kabupaten Sleman",
      title: "Pencurian di Area Candi Kabupaten Sleman",
      src: "/sleman.jpg",
      content: (
        <CriminalData
          type="Kabupaten Sleman"
          stats="15 kasus pencurian terhadap wisatawan di Nov 2024"
          description="dilaporkan di sekitar Candi Prambanan dan kawasan Kaliurang. Pencurian sepeda motor yang menargetkan kendaraan sewaan, insiden penjambretan tas di dekat kompleks candi, dan penipuan juru parkir palsu menjadi hal yang umum. Pihak berwenang setempat telah mengerahkan personel keamanan tambahan."
        />
      ),
    },
    {
      category: "Kabupaten Bantul",
      title: "Penipuan di Pantai Kabupaten Bantul",
      src: "/bantul.jpg",
      content: (
        <CriminalData
          type="Kabupaten Bantul"
          stats="22 insiden yang mempengaruhi wisatawan di Des 2024"
          description="terutama di Pantai Parangtritis dan kawasan Imogiri. Pembengkakan harga pedagang pantai, aktivitas pemandu wisata tidak resmi, dan pembobolan kendaraan di area parkir telah dilaporkan. Upaya koordinasi terbaru antara polisi dan petugas pariwisata bertujuan untuk mengatasi masalah ini."
        />
      ),
    },
    {
      category: "Kabupaten Kulon Progo",
      title: "Eksploitasi Wisata di Kabupaten Kulon Progo",
      src: "/kulonprogo.jpg",
      content: (
        <CriminalData
          type="Kabupaten Kulon Progo"
          stats="8 kasus yang menargetkan wisatawan dilaporkan di Nov 2024"
          description="terutama di sekitar Kawasan Wisata Kalibiru dan Waduk Sermo. Masalah meliputi harga akomodasi yang melambung untuk wisatawan, layanan pemandu tidak resmi, dan insiden pencurian kecil di spot foto populer. Para pemangku kepentingan pariwisata sedang mengembangkan protokol keamanan pengunjung."
        />
      ),
    },
    {
      category: "Kabupaten Gunungkidul",
      title: "Kejahatan Pesisir di Kabupaten Gunungkidul",
      src: "/gunungkidul.jpg",
      content: (
        <CriminalData
          type="Kabupaten Gunungkidul"
          stats="12 insiden terkait wisatawan di Q4 2024"
          description="terkonsentrasi di sekitar Pantai Baron, Pantai Indrayanti, dan Gua Jomblang. Laporan terbaru termasuk penipuan penyewaan peralatan, aktivitas pemandu gua tidak resmi, dan pencurian kendaraan di area parkir pantai. Peningkatan koordinasi antara polisi pariwisata dan masyarakat setempat sedang berlangsung."
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
            Permasalahan
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Apa Sebenarnya Masalahnya?
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Berdasarkan data BPS (2021-2023), kasus kejahatan di area destinasi
            wisata telah meningkat sebesar 23%, menunjukkan kebutuhan mendesak
            akan sistem manajemen keamanan yang efektif. CrimeWatch mengatasi
            tantangan ini dengan menyediakan platform komprehensif untuk
            manajemen informasi keamanan dan pengambilan keputusan strategis.
          </p>

          <Carousel items={cards} initialScroll={1} />
        </div>
      </div>
    </div>
  );
}
