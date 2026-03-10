"use client";

import { useState, useEffect, FC } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import RedButton from "@/app/ui/button";
import { movies } from "../../../lib/movies";

// Типизация фильма
type Movie = {
  id: number;
  title: { uz: string; ru?: string };
  genres: string[];
  rating: number;
  year: number;
  duration?: number;
  ageLimit?: number;
  director?: { name: string };
  actors?: { name: string }[];
  poster?: string;
  backdrop?: string;
  trailer?: string;
  isPremium?: boolean;
};

const MoviePageSkeleton: FC = () => (
  <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center text-white">
    <p>Loading...</p>
  </div>
);

type RatingBadgeProps = { icon: string; score?: string };
const RatingBadge: FC<RatingBadgeProps> = ({ icon, score }) => (
  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
    <span className="text-base">{icon}</span>
    {score && <span className="text-white text-sm font-bold">{score}</span>}
  </div>
);

export default function MoviePage() {
  const { id } = useParams();
  const router = useRouter();
  const movieId = Number(id);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = movies.find((m) => m.id === movieId);
      if (found) {
        setMovie(found);
      }
      setLoading(false);
    }, 500); // эмуляция загрузки

    return () => clearTimeout(timer);
  }, [movieId]);

  if (loading) return <MoviePageSkeleton />;

  if (!movie)
    return (
      <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-6xl mb-4">🎬</p>
          <p className="text-xl font-bold mb-2">Film topilmadi</p>
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
    <div className="min-h-screen bg-[#0d0f14] text-white relative overflow-x-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Backdrop */}
      {movie.backdrop && (
        <div className="absolute inset-0 z-0">
          <Image src={movie.backdrop} alt={movie.title.uz} fill className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0f14] via-[#0d0f14]/85 to-[#0d0f14]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f14] via-transparent to-[#0d0f14]/60" />
        </div>
      )}

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => router.push("/Movies")}
        className="fixed top-5 left-5 md:top-8 md:left-10 z-50 flex items-center gap-2
                   bg-white/10 backdrop-blur-md text-white text-sm
                   px-4 py-2 rounded-full cursor-pointer
                   hover:bg-white/20 transition-all duration-200"
        style={{ border: "1px solid rgba(255,255,255,0.15)" }}
      >
        ← Orqaga
      </motion.button>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="w-full px-6 md:px-16 lg:px-24 py-24 md:py-0">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-lg lg:max-w-xl">
            {/* Premium badge */}
            {movie.isPremium && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-block mb-3 text-xs font-bold px-3 py-1 rounded-full"
                style={{
                  background: "rgba(229,9,20,0.25)",
                  color: "#ff6b6b",
                  border: "1px solid rgba(229,9,20,0.4)",
                }}
              >
                ★ PREMIUM
              </motion.span>
            )}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-1 text-white"
              style={{ letterSpacing: "-0.01em" }}
            >
              {movie.title.uz}
            </motion.h1>

            {/* Original title */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }} className="text-gray-500 text-sm mb-5">
              {movie.title.uz}
            </motion.p>

            {/* Ratings + meta */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap items-center gap-2 mb-3">
              <RatingBadge icon="⭐" score={String(movie.rating)} />
              <span className="text-gray-400 text-sm ml-1">{movie.year}</span>
              <span className="text-gray-500 text-sm">•</span>
              <span className="text-gray-400 text-sm">{movie.genres.join(" • ")}</span>
              {movie.duration && (
                <>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-400 text-sm">{movie.duration} min</span>
                </>
              )}
              {movie.ageLimit && (
                <span className="bg-white/15 text-white text-xs font-bold px-2 py-0.5 rounded">{movie.ageLimit}+</span>
              )}
            </motion.div>

            {/* Description + cast */}
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-gray-300 text-sm md:text-base leading-relaxed mb-7">
              {movie.title.uz}{" "}
              {movie.director && <span className="text-gray-500">Rejissyor: {movie.director.name}. </span>}
              {movie.actors && movie.actors.length > 0 && <span className="text-gray-500">Aktyorlar: {movie.actors.map((a) => a.name).join(", ")}.</span>}
            </motion.p>

            {/* Buttons */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex flex-wrap items-center gap-3">
              <RedButton label="▶ Tomosha qilish" size="lg" />

              {movie.trailer && (
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => window.open(movie.trailer, "_blank")}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}
                  title="Trailer ko'rish"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                  </svg>
                </motion.button>
              )}

              {/* Bookmark */}
              <motion.button
                onClick={() => setAdded((v) => !v)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-200"
                style={{
                  background: added ? "rgba(229,9,20,0.2)" : "rgba(255,255,255,0.12)",
                  border: added ? "1px solid rgba(229,9,20,0.5)" : "1px solid rgba(255,255,255,0.18)",
                }}
                title={added ? "Listdan olib tashlash" : "Listga qo'shish"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.svg
                    key={added ? "bookmarked" : "bookmark"}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill={added ? "#e50914" : "none"}
                    viewBox="0 0 24 24"
                    stroke={added ? "#e50914" : "white"}
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </motion.svg>
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}