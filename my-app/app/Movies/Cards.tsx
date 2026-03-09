"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface Movie {
  id: string | number;
  title?: string;
  poster?: string;
  rating?: number | string;
  year?: number | string;
}

interface MovieCardProps {
  movie: Movie;
  index?: number;
}

export default function MovieCard({ movie, index = 0 }: MovieCardProps) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [added, setAdded] = useState<boolean>(false);

  if (!movie?.id) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="select-none"
    >
      <Link href={`/Movies/${movie.id}`} className="no-underline block">
        <motion.div
          animate={{ y: hovered ? -8 : 0, scale: hovered ? 1.03 : 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          className="relative rounded-2xl overflow-hidden mb-2"
          style={{
            height: 240,
            boxShadow: hovered
              ? "0 0 0 2px rgba(229,9,20,0.75), 0 16px 32px rgba(0,0,0,0.6)"
              : "0 4px 14px rgba(0,0,0,0.4)",
            transition: "box-shadow 0.2s",
          }}
        >
          {movie.poster ? (
            <Image
              src={movie.poster}
              alt={movie.title ?? "Movie"}
              fill
              sizes="160px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
              <span className="text-zinc-500 text-xs">No Image</span>
            </div>
          )}

          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"
          />

          <motion.div
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : -6 }}
            transition={{ duration: 0.2 }}
            className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1"
          >
            <span className="text-yellow-400 text-[11px]">★</span>
            <span className="text-white text-[11px] font-bold">
              {movie.rating ?? "N/A"}
            </span>
          </motion.div>

          <motion.span
            animate={{ opacity: hovered ? 1 : 0 }}
            className="absolute bottom-9 left-3 text-gray-400 text-[11px]"
          >
            {movie.year ?? ""}
          </motion.span>

          <motion.button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              e.stopPropagation();
              setAdded((v) => !v);
            }}
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.6 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full border-0 cursor-pointer flex items-center justify-center"
            style={{
              background: added ? "#e50914" : "rgba(255,255,255,0.15)",
              backdropFilter: "blur(6px)",
              boxShadow: added ? "0 0 14px rgba(229,9,20,0.55)" : "none",
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.svg
                key={added ? "check" : "plus"}
                initial={{ opacity: 0, rotate: added ? -30 : 30, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{ duration: 0.18 }}
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                {added ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                )}
              </motion.svg>
            </AnimatePresence>
          </motion.button>
        </motion.div>

        <motion.p
          animate={{ color: hovered ? "#fff" : "#9ca3af" }}
          transition={{ duration: 0.18 }}
          className="text-sm font-semibold text-center truncate px-1"
          style={{ fontFamily: "'Outfit',sans-serif" }}
        >
          {movie.title ?? "Unknown"}
        </motion.p>
      </Link>
    </motion.div>
  );
}