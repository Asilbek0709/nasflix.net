"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import MovieCard from "../../Movies/Cards";
import { movies } from "../../../lib/movies";

// Hero uchun dastlabki 5 ta film
const HERO_MOVIES = movies.slice(0, 5).map((m) => ({
  id: m.id,
  title: m.translations.uz.title,
  originalTitle: m.originalTitle,
  genre: m.genres.slice(0, 2).join(" • "),
  rating: String(m.rating),
  year: String(m.year),
  desc: m.translations.uz.description,
  poster: m.poster,
  backdrop: m.backdrop,
  isPremium: m.isPremium,
}));

const POPULAR_MOVIES = movies
  .filter((m) => m.rating >= 8.5)
  .map((m) => ({
    id: m.id,
    title: m.translations.uz.title,
    year: String(m.year),
    rating: String(m.rating),
    poster: m.poster,
  }));

export default function Home() {
  const router = useRouter();
  const [activeIdx, setActiveIdx] = useState(0);
  const timerRef = useRef(null);
  const current = HERO_MOVIES[activeIdx];

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIdx((p) => (p + 1) % HERO_MOVIES.length);
    }, 4000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const handleSelect = (i) => {
    setActiveIdx(i);
    startTimer();
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Backdrop */}
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
              src={current.backdrop}
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
          {/* Left: text */}
          <div className="flex-1 min-w-0 max-w-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id + "a"}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600/20 border border-red-600/40 text-xs font-bold text-red-400 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {current.genre}
                </span>
                <span className="text-gray-400 text-sm">★ {current.rating}</span>
                <span className="text-gray-500 text-sm">{current.year}</span>
                {current.isPremium && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: "rgba(229,9,20,0.2)", color: "#ff6b6b", border: "1px solid rgba(229,9,20,0.35)" }}>
                    PREMIUM
                  </span>
                )}
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.h1
                key={current.id + "b"}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, delay: 0.06 }}
                className="text-5xl lg:text-7xl font-black leading-none mb-1 text-white"
                style={{
                  fontFamily: "'Bebas Neue', Impact, sans-serif",
                  letterSpacing: "0.03em",
                }}
              >
                {current.title}
              </motion.h1>
            </AnimatePresence>

            {/* Original title */}
            <AnimatePresence mode="wait">
              <motion.p
                key={current.id + "orig"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.08 }}
                className="text-gray-600 text-sm mb-4"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {current.originalTitle}
              </motion.p>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={current.id + "c"}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="text-gray-400 text-sm leading-relaxed mb-7"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {current.desc}
              </motion.p>
            </AnimatePresence>

            <div className="flex gap-3 flex-wrap">
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
                <Button
                  variant="contained"
                  disableElevation
                  onClick={() => router.push(`/Movies/${current.id}`)}
                  sx={{
                    background: "linear-gradient(135deg,#e50914,#b81010)",
                    color: "#fff",
                    fontFamily: "'Outfit',sans-serif",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    textTransform: "none",
                    borderRadius: "10px",
                    px: "26px",
                    py: "11px",
                    boxShadow: "0 0 28px rgba(229,9,20,0.45)",
                    "&:hover": {
                      background: "linear-gradient(135deg,#ff2030,#cc1010)",
                    },
                  }}
                >
                  ▶ Tomosha qilish
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button
                  variant="outlined"
                  onClick={() => router.push(`/Movies/${current.id}`)}
                  sx={{
                    color: "#fff",
                    fontFamily: "'Outfit',sans-serif",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    textTransform: "none",
                    borderRadius: "10px",
                    px: "22px",
                    py: "11px",
                    borderColor: "rgba(255,255,255,0.22)",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.55)",
                      backgroundColor: "rgba(255,255,255,0.06)",
                    },
                  }}
                >
                  Batafsil
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Right: poster cards */}
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
                  whileHover={{ opacity: activeIdx === i ? 1 : 0.75, y: -4 }}
                  className="relative rounded-2xl overflow-hidden border-0 p-0 cursor-pointer flex-shrink-0"
                  style={{
                    boxShadow:
                      activeIdx === i
                        ? "0 0 0 2.5px #e50914, 0 0 30px rgba(229,9,20,0.5)"
                        : "0 4px 16px rgba(0,0,0,0.5)",
                  }}
                >
                  <Image
                    src={m.poster}
                    alt={m.title}
                    fill
                    className="object-cover"
                    sizes="140px"
                  />
                  {activeIdx === i && (
                    <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/80 to-transparent flex items-end px-2 pb-1.5">
                      <span
                        className="text-white text-[10px] font-bold line-clamp-2"
                        style={{ fontFamily: "'Outfit',sans-serif" }}
                      >
                        {m.title}
                      </span>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Progress dots */}
            <div className="flex gap-2 items-center">
              {HERO_MOVIES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className="relative h-1.5 rounded-full overflow-hidden border-0 p-0 cursor-pointer bg-white/20"
                  style={{
                    width: activeIdx === i ? 48 : 12,
                    transition: "width 0.35s ease",
                  }}
                >
                  {activeIdx === i && (
                    <motion.span
                      key={activeIdx}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 4, ease: "linear" }}
                      className="absolute inset-0 bg-red-500 rounded-full origin-left"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ POPULAR MOVIES ══ */}
      <section className="py-14">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 px-6 lg:px-16 mb-7"
        >
          <span className="w-1 h-7 rounded-full bg-red-600 flex-shrink-0" />
          <h2
            className="text-2xl font-black tracking-widest text-white"
            style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
          >
            POPULAR MOVIES
          </h2>
        </motion.div>

        <div className="ml-10">
          <Swiper
            modules={[FreeMode]}
            freeMode={{ enabled: true, momentum: true }}
            slidesPerView="auto"
            spaceBetween={14}
            slidesOffsetBefore={24}
            slidesOffsetAfter={24}
            grabCursor
          >
            {POPULAR_MOVIES.map((movie, i) => (
              <SwiperSlide key={movie.id} style={{ width: "160px" }}>
                <MovieCard movie={movie} index={i} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
}