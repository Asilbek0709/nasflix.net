"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import RedButton from "../../ui/button";
import { movies } from "../../../lib/movies";

type SkeletonProps = {
  className?: string;
};

function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg bg-white/8 ${className}`}>
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </div>
  );
}

function MoviePageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0d0f14] text-white relative overflow-hidden">
      <Skeleton className="absolute inset-0 h-full w-full opacity-30" />

      <div className="absolute inset-0 bg-gradient-to-r from-[#0d0f14] via-[#0d0f14]/80 to-transparent" />

      <div className="relative z-10 min-h-screen flex items-center px-6 md:px-16 lg:px-24">
        <div className="max-w-xl space-y-5 pt-20">
          <Skeleton className="h-16 w-72 rounded-xl" />
          <Skeleton className="h-8 w-80 rounded-full" />
          <Skeleton className="h-6 w-64 rounded-full" />
          <Skeleton className="h-16 w-full rounded-xl" />

          <div className="flex gap-3 pt-2">
            <Skeleton className="h-14 w-52 rounded-2xl" />
            <Skeleton className="h-14 w-16 rounded-2xl" />
            <Skeleton className="h-14 w-16 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

type RatingBadgeProps = {
  icon: string;
  score: string;
};

function RatingBadge({ icon, score }: RatingBadgeProps) {
  return (
    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
      <span className="text-base">{icon}</span>
      <span className="text-white text-sm font-bold">{score}</span>
    </div>
  );
}

type InfoBadgeProps = {
  icon: string;
  text: string;
};

function InfoBadge({ icon, text }: InfoBadgeProps) {
  return (
    <div className="flex items-center gap-1.5 text-gray-300 text-sm">
      <span className="text-lg opacity-70">{icon}</span>
      <span style={{ fontFamily: "'Outfit',sans-serif" }}>{text}</span>
    </div>
  );
}

type MovieType = {
  id: number;
  title: string;
  originalTitle: string;
  genre: string;
  rating: {
    imdb: string;
    kp: string;
    rt: string;
  };
  year: string;
  duration: string;
  ageLimit: string;
  lang: string;
  subtitles: string;
  difficulty: string;
  director: string;
  cast: string[];
  desc: string;
  poster: string;
  backdrop: string;
  trailer: string;
  isPremium: boolean;
};

export default function MoviePage(): JSX.Element {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [movie, setMovie] = useState<MovieType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [added, setAdded] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = movies.find((m) => m.id === Number(id));

      if (found) {
        setMovie({
          id: found.id,
          title: found.translations.uz.title,
          originalTitle: found.originalTitle,
          genre: found.genres.join(" • "),
          rating: {
            imdb: String(found.rating),
            kp: String(found.rating),
            rt: "N/A",
          },
          year: String(found.year),
          duration: `${Math.floor(found.duration / 60)} s ${
            found.duration % 60
          } min`,
          ageLimit: `${found.ageLimit}+`,
          lang: found.defaultAudio === "uz" ? "O'zbek" : "Rus",
          subtitles: found.availableLanguages
            .map((l: string) => (l === "uz" ? "O'zb" : "Rus"))
            .join(", "),
          difficulty: "Leksika - o'rta",
          director: found.director.name,
          cast:
            found.actors.length > 0
              ? found.actors.map((a: any) => a.name)
              : ["Ma'lumot yo'q"],
          desc: found.translations.uz.description,
          poster: found.poster,
          backdrop: found.backdrop,
          trailer: found.trailer,
          isPremium: found.isPremium,
        });
      }

      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) return <MoviePageSkeleton />;

  if (!movie)
    return (
      <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🎬</p>
          <p className="text-white text-xl font-bold mb-2">Film topilmadi</p>

          <button
            onClick={() => router.push("/Movies")}
            className="text-blue-400 text-sm underline cursor-pointer bg-transparent border-0"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white relative overflow-x-hidden">

      <div className="absolute inset-0 z-0">
        <Image
          src={movie.backdrop}
          alt={movie.title}
          fill
          className="object-cover object-center"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0f14] via-[#0d0f14]/85 to-[#0d0f14]/20" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f14] via-transparent to-[#0d0f14]/60" />
      </div>

      <motion.button
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => router.push("/Movies")}
        className="fixed top-5 left-5 z-50 flex items-center gap-2 bg-white/10 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full"
      >
        ← Orqaga
      </motion.button>

      <div className="relative z-10 min-h-screen flex items-center">
        <div className="w-full px-6 md:px-16 lg:px-24 py-24 md:py-0">

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-2">
            {movie.title}
          </h1>

          <p className="text-gray-500 text-sm mb-5">
            {movie.originalTitle}
          </p>

          <div className="flex gap-2 mb-5">
            <RatingBadge icon="⭐" score={movie.rating.imdb} />
            <RatingBadge icon="🎬" score={movie.rating.kp} />
          </div>

          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-7">
            {movie.desc}
          </p>

          <div className="flex gap-3">
            <RedButton label="▶ Tomosha qilish" size="lg" />
          </div>

        </div>
      </div>

    </div>
  );
}