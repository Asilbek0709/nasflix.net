"use client";

import React from "react";
import type { Movie } from "@/types";
import { motion } from "motion/react";
import { MdBookmark, MdBookmarkBorder } from "react-icons/md";

type Props = {
  movie: Movie;
  index?: number;
  myList?: boolean;               // <- boolean, optional
  onToggleMyList?: () => void;    // <- функция для добавления/удаления
};

export default function MovieCard({ movie, index = 0, myList = false, onToggleMyList }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="relative group"
    >
      <img
        src={movie.poster}
        alt={movie.title.uz}
        className="w-full h-[280px] object-cover rounded-lg shadow-lg bg-zinc-800"
      />
      <div className="mt-2 flex justify-between items-center">
        <p className="text-white font-medium truncate">{movie.title.uz}</p>
        <button
          onClick={onToggleMyList}
          className="text-red-600 text-xl hover:text-red-400 transition"
        >
          {myList ? <MdBookmark /> : <MdBookmarkBorder />}
        </button>
      </div>
      <p className="text-zinc-400 text-sm">{movie.year}</p>
    </motion.div>
  );
}

export type { Props as MovieCardProps };