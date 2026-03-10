"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Movie = {
  id: number;
  title: string;
  poster: string;
  backdrop?: string;
  rating?: string;
  year?: string;
  desc?: string;
  isFavorite?: boolean;
};

export default function Home() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]); // список избранного
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const API_KEY = "9e5d3e2c9b3806d1805188f6d929d903"; // твой TMDb API key

  // Fetch популярные фильмы
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=uz-UZ&page=1`
        );
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data = await res.json();
        const moviesArray = Array.isArray(data.results) ? data.results : [];

        const formatted = moviesArray.map((m: any) => ({
          id: m.id,
          title: m.title || "No Title",
          poster: m.poster_path
            ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
            : "",
          backdrop: m.backdrop_path
            ? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
            : "",
          rating: m.vote_average ? String(m.vote_average) : "N/A",
          year: m.release_date ? m.release_date.split("-")[0] : "N/A",
          desc: m.overview || "",
          isFavorite: false,
        }));

        setMovies(formatted);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // HERO автопрокрутка (первые 5 фильмов)
  const HERO_MOVIES = movies.slice(0, 5);
  const current = HERO_MOVIES[activeIdx] || HERO_MOVIES[0];

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIdx((p) => (movies.length ? (p + 1) % Math.min(5, movies.length) : 0));
    }, 4000);
  };

  useEffect(() => {
    if (movies.length) startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [movies]);

  const handleSelect = (i: number) => {
    setActiveIdx(i);
    startTimer();
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  if (loading) return <p className="text-white p-6">Loading movies...</p>;
  if (!movies.length) return <p className="text-white p-6">No movies found</p>;

  const POPULAR_MOVIES = movies.filter((m) => parseFloat(m.rating || "0") >= 8.5);
  const OTHER_MOVIES = movies.slice(5); // остальные фильмы для списка

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <Image
              src={current.backdrop || current.poster}
              alt={current.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/30 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16 pt-32 pb-20 flex items-center gap-16">
          <div className="flex-1 min-w-0 max-w-lg">
            <h1 className="text-5xl lg:text-7xl font-black mb-2">{current.title}</h1>
            <p className="text-gray-400 text-sm mb-6">{current.desc}</p>
            <Button
              variant="contained"
              onClick={() => router.push(`/Movies/${current.id}`)}
              sx={{ background: "#e50914", "&:hover": { background: "#ff2030" } }}
            >
              ▶ Tomosha qilish
            </Button>
          </div>

          <div className="hidden lg:flex flex-col items-center gap-4 flex-shrink-0">
            <div className="flex gap-4 items-end">
              {HERO_MOVIES.map((m, i) => (
                <motion.button
                  key={m.id}
                  onClick={() => handleSelect(i)}
                  animate={{
                    width: activeIdx === i ? 140 : 90,
                    height: activeIdx === i ? 210 : 150,
                    opacity: activeIdx === i ? 1 : 0.45,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  className="relative rounded-2xl overflow-hidden border-0 p-0 cursor-pointer flex-shrink-0"
                >
                  <Image src={m.poster} alt={m.title} fill className="object-cover" sizes="140px" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ POPULAR MOVIES ══ */}
      <section className="py-14">
        <h2 className="text-2xl font-bold px-6 lg:px-16 mb-4">POPULAR MOVIES</h2>
        <Swiper
          modules={[FreeMode, Navigation, Pagination]}
          freeMode={{ enabled: true, momentum: true }}
          navigation
          pagination={{ clickable: true }}
          slidesPerView="auto"
          spaceBetween={14}
          slidesOffsetBefore={24}
          slidesOffsetAfter={24}
          grabCursor
        >
          {POPULAR_MOVIES.map((movie) => (
            <SwiperSlide key={movie.id} style={{ width: "160px" }}>
              <div className="movie-card cursor-pointer">
                <Image src={movie.poster} alt={movie.title} width={160} height={240} className="rounded-xl object-cover" />
                <h3 className="mt-2 text-sm font-semibold">{movie.title}</h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ══ OTHER MOVIES ══ */}
      <section className="py-14 px-6 lg:px-16">
        <h2 className="text-2xl font-bold mb-4">OTHER MOVIES</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {OTHER_MOVIES.map((movie) => (
            <div key={movie.id} className="bg-[#111] p-2 rounded-lg">
              <Image src={movie.poster} alt={movie.title} width={200} height={300} className="rounded-md object-cover" />
              <h3 className="mt-2 text-sm font-semibold">{movie.title}</h3>
              <Button
                variant={favorites.includes(movie.id) ? "contained" : "outlined"}
                size="small"
                fullWidth
                onClick={() => toggleFavorite(movie.id)}
                sx={{ mt: 1, fontSize: "0.7rem" }}
              >
                {favorites.includes(movie.id) ? "In Favorites" : "Add to Favorites"}
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}