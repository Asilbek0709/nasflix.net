"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "motion/react";

type Movie = {
  id: number;
  title: string;
  poster: string;
  backdrop?: string;
  rating?: string;
  year?: string;
  desc?: string;
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

// ─── Reusable badge ───────────────────────────────────────────────────────────

const RatingBadge = ({ rating }: { rating: string }) => (
  <span className="inline-flex items-center gap-1 bg-[rgba(229,9,20,0.13)] border border-[rgba(229,9,20,0.3)] text-[#ff7070] px-2 py-[3px] rounded-md text-[11px] font-bold font-['Barlow'] tracking-[0.05em]">
    <StarIcon /> {rating}
  </span>
);

// ─── Floating Particle ────────────────────────────────────────────────────────

const Particle = ({
  delay,
  x,
  size,
}: {
  delay: number;
  x: number;
  size: number;
}) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      background:
        "radial-gradient(circle, rgba(229,9,20,0.55) 0%, rgba(229,9,20,0) 70%)",
      filter: "blur(1px)",
    }}
    initial={{ y: "108vh", opacity: 0 }}
    animate={{ y: "-8vh", opacity: [0, 0.72, 0.72, 0] }}
    transition={{
      duration: 7 + Math.random() * 4,
      delay,
      repeat: Infinity,
      repeatDelay: 3 + Math.random() * 6,
      ease: "easeOut",
    }}
  />
);

// ─── Animation Variants ───────────────────────────────────────────────────────

const heroContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.25 },
  },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const titleV: Variants = {
  initial: { opacity: 0, y: 44, filter: "blur(12px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -28,
    filter: "blur(10px)",
    transition: { duration: 0.38, ease: [0.55, 0, 1, 0.45] },
  },
};

const descV: Variants = {
  initial: { opacity: 0, x: -18 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    x: 18,
    transition: { duration: 0.28, ease: [0.55, 0, 1, 0.45] },
  },
};

const gridV: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: 0.05 },
  },
};

const cardV: Variants = {
  hidden: { opacity: 0, y: 38, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [heroReady, setHeroReady] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const API_KEY = "9e5d3e2c9b3806d1805188f6d929d903";

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=uz-UZ&page=1`
        );
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setMovies(
          (Array.isArray(data.results) ? data.results : []).map((m: any) => ({
            id: m.id,
            title: m.title || "No Title",
            poster: m.poster_path
              ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
              : "",
            backdrop: m.backdrop_path
              ? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
              : "",
            rating: m.vote_average
              ? Number(m.vote_average).toFixed(1)
              : "N/A",
            year: m.release_date ? m.release_date.split("-")[0] : "N/A",
            desc: m.overview || "",
          }))
        );
        setTimeout(() => setHeroReady(true), 100);
      } catch (err) {
        console.error(err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const HERO = movies.slice(0, 5);
  const GRID = movies.slice(5);
  const current = HERO[activeIdx] ?? HERO[0];
  const isFavCurrent = !!(current && favorites.includes(current.id));

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setActiveIdx((p) => (HERO.length ? (p + 1) % HERO.length : 0)),
      5500
    );
  };

  useEffect(() => {
    if (movies.length) startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movies]);

  const handleSelect = (i: number) => {
    setActiveIdx(i);
    startTimer();
  };

  const toggleFav = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites((p) =>
      p.includes(id) ? p.filter((f) => f !== id) : [...p, id]
    );
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const r = heroRef.current?.getBoundingClientRect();
    if (r)
      setMousePos({
        x: ((e.clientX - r.left) / r.width - 0.5) * 16,
        y: ((e.clientY - r.top) / r.height - 0.5) * 8,
      });
  };

  const particles = Array.from({ length: 14 }, (_, i) => ({
    delay: i * 0.6,
    x: Math.random() * 100,
    size: 4 + Math.random() * 9,
  }));

  // ── Loading state ──
  if (loading)
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-5"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-[52px] h-[52px] rounded-full border-2 border-[#e50914] border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.85, ease: "linear" }}
          />
          <motion.p
            className="font-['Bebas_Neue'] text-[22px] tracking-[0.35em] text-[#e50914] m-0"
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
          >
            YUKLANMOQDA
          </motion.p>
        </motion.div>
      </div>
    );

  if (!movies.length)
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <p className="font-['Barlow'] text-white/[0.35]">Filmlar topilmadi</p>
      </div>
    );

  return (
    <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden">

      {/* ══ HERO ══ */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
          {particles.map((p, i) => (
            <Particle key={i} {...p} />
          ))}
        </div>

        {/* Background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${current?.id}`}
            className="absolute inset-0 z-0"
            style={{
              transform: `translate(${mousePos.x * 0.26}px,${mousePos.y * 0.26}px)`,
              transition: "transform 120ms ease-out",
            }}
            initial={{ opacity: 0, scale: 1.07 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {current?.backdrop && (
              <Image
                src={current.backdrop}
                alt={current.title}
                fill
                priority
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-[#050505]/[0.04]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(229,9,20,0.07)_0%,transparent_58%)]" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 lg:px-16 pt-28 lg:pt-[120px] pb-20 lg:pb-[100px] flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          <motion.div
            className="flex-1 min-w-0 w-full lg:max-w-[560px]"
            variants={heroContainer}
            initial="hidden"
            animate={heroReady ? "visible" : "hidden"}
          >
            <motion.div
              variants={heroItem}
              className="flex items-center gap-3 mb-4"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={`tr-${current?.id}`}
                  className="font-['Barlow'] text-[11px] font-bold tracking-[0.28em] uppercase text-[#e50914]"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.38 }}
                >
                  ● TREND
                </motion.span>
              </AnimatePresence>
              {current?.year && (
                <span className="font-['Barlow'] text-xs text-white/[0.28]">
                  {current.year}
                </span>
              )}
              {current?.rating && <RatingBadge rating={current.rating} />}
            </motion.div>

            {/* Title */}
            <motion.div
              variants={heroItem}
              className="overflow-hidden mb-4"
            >
              <AnimatePresence mode="wait">
                <motion.h1
                  key={`t-${current?.id}`}
                  className="font-['Bebas_Neue'] text-[clamp(2.4rem,7.5vw,6.4rem)] tracking-[0.03em] leading-[0.88] m-0 drop-shadow-[0_4px_28px_rgba(0,0,0,0.9)]"
                  variants={titleV}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {current?.title}
                </motion.h1>
              </AnimatePresence>
            </motion.div>

            {/* Description */}
            <motion.div variants={heroItem} className="mb-7">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`d-${current?.id}`}
                  className="font-['Barlow'] text-[13px] italic font-light text-white/[0.42] leading-[1.75] max-w-[420px] m-0 line-clamp-3"
                  variants={descV}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {current?.desc}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* CTA */}
            <motion.div
              variants={heroItem}
              className="flex gap-3 flex-wrap items-center mb-8"
            >
              <motion.button
                className="inline-flex items-center gap-2 bg-[#e50914] shadow-[0_0_26px_rgba(229,9,20,0.38),0_4px_18px_rgba(0,0,0,0.55)] font-['Barlow'] font-bold tracking-[0.13em] uppercase text-[13px] text-white border-0 px-6 py-3 rounded-[11px] cursor-pointer transition-[box-shadow,transform] duration-300 hover:shadow-[0_0_48px_rgba(229,9,20,0.38)] hover:-translate-y-[3px] hover:scale-[1.04] active:scale-[0.97]"
                onClick={() => router.push(`/Movies/${current?.id}`)}
                whileTap={{ scale: 0.96 }}
              >
                <PlayIcon /> TOMOSHA QILISH
              </motion.button>

              <motion.button
                className={`inline-flex items-center gap-2 font-['Barlow'] font-bold tracking-[0.1em] uppercase text-[13px] border px-5 py-3 rounded-[11px] cursor-pointer transition-all duration-[250ms] ${
                  isFavCurrent
                    ? "text-[#e50914] border-[rgba(229,9,20,0.42)] bg-[rgba(229,9,20,0.08)]"
                    : "text-white border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.28)]"
                }`}
                onClick={(e) => current && toggleFav(current.id, e)}
                whileTap={{ scale: 0.96 }}
              >
                <motion.span
                  animate={{ scale: isFavCurrent ? [1, 1.4, 1] : 1 }}
                  transition={{ duration: 0.28 }}
                >
                  <HeartIcon filled={isFavCurrent} />
                </motion.span>
                {isFavCurrent ? "Sevimlilar" : "Saqlash"}
              </motion.button>
            </motion.div>

            {/* Progress bars */}
            <motion.div
              variants={heroItem}
              className="flex gap-[9px] items-center"
            >
              {HERO.map((_, i) => (
                <div
                  key={i}
                  className="h-[2px] bg-white/10 rounded-sm overflow-hidden cursor-pointer flex-1 max-w-[54px]"
                  onClick={() => handleSelect(i)}
                >
                  <motion.div
                    className="h-full rounded-sm origin-left"
                    animate={{
                      scaleX: activeIdx === i ? 1 : activeIdx > i ? 1 : 0,
                    }}
                    transition={
                      activeIdx === i
                        ? { duration: 5.5, ease: "linear" }
                        : { duration: 0.22 }
                    }
                    style={{
                      background:
                        activeIdx === i
                          ? "#e50914"
                          : activeIdx > i
                          ? "rgba(255,255,255,0.32)"
                          : "rgba(255,255,255,0.1)",
                    }}
                  />
                </div>
              ))}
              <span className="font-['Bebas_Neue'] text-[15px] tracking-[0.12em] text-white/[0.24] ml-1">
                <span className="text-[#e50914]">0{activeIdx + 1}</span> / 0
                {HERO.length}
              </span>
            </motion.div>
          </motion.div>

          {/* Right — Thumbnail strip */}
          <motion.div
            className="hidden lg:flex flex-col items-center gap-[14px] flex-shrink-0"
            initial={{ opacity: 0, x: 55 }}
            animate={{ opacity: heroReady ? 1 : 0, x: heroReady ? 0 : 55 }}
            transition={{
              duration: 0.72,
              delay: 0.48,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="flex gap-[9px] items-end">
              {HERO.map((m, i) => (
                <motion.button
                  key={m.id}
                  className={`relative rounded-[12px] overflow-hidden border-2 cursor-pointer p-0 flex-shrink-0 transition-[border-color,box-shadow] duration-300 ${
                    activeIdx === i
                      ? "border-[#e50914] shadow-[0_0_20px_rgba(229,9,20,0.38)]"
                      : "border-transparent"
                  }`}
                  onClick={() => handleSelect(i)}
                  animate={{
                    width: activeIdx === i ? 126 : 78,
                    height: activeIdx === i ? 190 : 122,
                    opacity: activeIdx === i ? 1 : 0.36,
                  }}
                  transition={{ type: "spring", stiffness: 295, damping: 27 }}
                  whileHover={{ opacity: 0.8 }}
                >
                  {m.poster && (
                    <Image
                      src={m.poster}
                      alt={m.title}
                      fill
                      sizes="140px"
                      className="object-cover"
                    />
                  )}
                  {activeIdx === i && (
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/[0.08] to-transparent" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Mobile dots */}
          <div className="flex lg:hidden gap-2 mt-2">
            {HERO.map((_, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`rounded-full transition-all duration-300 ${
                  activeIdx === i
                    ? "bg-[#e50914] w-6 h-[6px]"
                    : "bg-white/30 w-[6px] h-[6px]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-[110px] bg-gradient-to-b from-transparent to-[#050505] pointer-events-none z-[2]" />
      </section>

      {/* ══ MOVIES GRID ══ */}
      <section className="py-14 lg:py-20 px-4 sm:px-6 lg:px-16">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ x: -38, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="inline-flex items-center gap-3 font-['Bebas_Neue'] text-[clamp(1.5rem,3.5vw,2.9rem)] tracking-[0.06em] m-0 before:content-[''] before:block before:w-1 before:h-7 before:bg-[#e50914] before:rounded-sm before:shadow-[0_0_12px_rgba(229,9,20,0.38)]">
            BARCHA FILMLAR
          </h2>
          <span className="font-['Barlow'] text-xs text-white/[0.28]">
            {GRID.length} ta film
          </span>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-[18px]"
          variants={gridV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {GRID.map((movie) => {
            const isFav = favorites.includes(movie.id);
            return (
              <motion.div
                key={movie.id}
                variants={cardV}
                className="group relative rounded-xl overflow-hidden cursor-pointer bg-[#0c0c0c] transition-[transform,box-shadow] duration-[420ms] hover:-translate-y-2 hover:scale-[1.025] hover:shadow-[0_28px_55px_rgba(0,0,0,0.85),0_0_0_1px_rgba(229,9,20,0.26)]"
                onClick={() => router.push(`/Movies/${movie.id}`)}
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden">
                  {movie.poster && (
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                    />
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <p className="font-['Bebas_Neue'] text-sm tracking-[0.04em] mb-1 leading-tight">
                      {movie.title}
                    </p>
                    <div className="flex items-center justify-between">
                      {movie.rating && <RatingBadge rating={movie.rating} />}
                      <span className="font-['Barlow'] text-[11px] text-white/[0.33]">
                        {movie.year}
                      </span>
                    </div>
                  </div>

                  {/* Play */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[rgba(229,9,20,0.88)] flex items-center justify-center scale-[0.55] opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-[transform,opacity] duration-300">
                    <PlayIcon />
                  </div>

                  {/* Heart */}
                  <button
                    className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-[8px] cursor-pointer transition-[opacity,transform,background] duration-300 ${
                      isFav
                        ? "bg-[rgba(229,9,20,0.88)] opacity-100 scale-100"
                        : "bg-[rgba(0,0,0,0.62)] scale-[0.7] opacity-0 group-hover:opacity-100 group-hover:scale-100"
                    }`}
                    onClick={(e) => toggleFav(movie.id, e)}
                  >
                    <HeartIcon filled={isFav} />
                  </button>
                </div>

                <div className="px-3 pt-2 pb-3">
                  <p className="font-['Barlow'] text-[13px] font-semibold m-0 truncate text-white/[0.88]">
                    {movie.title}
                  </p>
                  <p className="font-['Barlow'] text-[11px] text-white/[0.26] mt-0.5 mb-0">
                    {movie.year}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="px-4 sm:px-6 lg:px-16 py-10 border-t border-white/5 flex items-center justify-between flex-wrap gap-3">
        <span className="font-['Bebas_Neue'] text-2xl tracking-[0.18em] text-[#e50914]">
          CINEMAX
        </span>
        <p className="font-['Barlow'] text-xs text-white/[0.18] m-0">
          © 2025 Cinemax. Barcha huquqlar himoyalangan.
        </p>
      </footer>
    </div>
  );
}