"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Movie } from "@/types";
import { getMovieTitle, getMovieDescription } from "@/lib/utils";
import Image from "next/image";

type MovieCardProps = {
  movie: Movie;
  progress?: number;
  duration?: number;
  inMyList?: boolean;
  onToggleMyList?: () => void;
};

export default function MovieCard({ movie, progress = 0, duration, inMyList, onToggleMyList }: MovieCardProps) {
  const title = getMovieTitle(movie);
  const desc = getMovieDescription(movie);
  const progressPercent = duration && duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="group relative aspect-[2/3] w-full rounded-lg overflow-hidden bg-zinc-900"
    >
      <Link href={`/movie/${movie.slug}`} className="block w-full h-full">
        <Image
          src={movie.poster}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="font-semibold text-white text-lg mb-1 line-clamp-2">{title}</h3>
          <p className="text-zinc-400 text-sm line-clamp-2 mb-3">{desc}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center justify-center py-2 px-4 rounded bg-red-600 text-white text-sm font-medium w-fit">
              Watch
            </span>
            {onToggleMyList && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleMyList();
                }}
                className="inline-flex items-center justify-center py-2 px-3 rounded border border-zinc-500 text-white text-sm hover:bg-zinc-700 transition"
              >
                {inMyList ? "In List" : "+ My List"}
              </button>
            )}
          </div>
        </div>
      </Link>
      {progressPercent > 0 && progressPercent < 100 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700">
          <motion.div
            className="h-full bg-red-600"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}
    </motion.div>
  );
}