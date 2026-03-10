"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { movies } from "@/data/movies";
import MovieCard from "../../../components/movies/Card";
import { getMyList, removeFromMyList, addToMyList } from "@/services/my-list.service";
import type { Movie } from "@/types";
import { title } from "process";

export default function MyListPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [myListIds, setMyListIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    getMyList()
      .then((ids) => setMyListIds(new Set(ids)))
      .catch(() => setMyListIds(new Set()))
      .finally(() => setLoading(false));
  }, [user, router]);

  const myListMovies = useMemo(
    () => movies.filter((m) => myListIds.has(String(m.id))),
    [myListIds]
  );

  const refreshMyList = useCallback(() => {
    if (!user) return;
    getMyList().then((ids) => setMyListIds(new Set(ids))).catch(() => {});
  }, [user]);

  const handleToggleMyList = useCallback(
    (movieId: number, inList: boolean) => {
      if (!user) return;
      if (inList) {
        removeFromMyList(movieId).then(refreshMyList).catch(() => {});
      } else {
        addToMyList(movieId).then(refreshMyList).catch(() => {});
      }
    },
    [user, refreshMyList]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="w-10 h-10 rounded-full border-2 border-red-600 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="w-1 h-8 bg-red-600 rounded-full inline-block" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">My List</h1>
          </div>
          <p className="text-zinc-500 ml-4 text-sm">
            {myListMovies.length > 0
              ? `${myListMovies.length} title${myListMovies.length !== 1 ? "s" : ""} saved`
              : "Your saved movies will appear here"}
          </p>
        </motion.div>

        {/* Empty state */}
        <AnimatePresence mode="wait">
          {myListMovies.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-5 border border-zinc-800">
                <svg
                  className="w-9 h-9 text-zinc-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-zinc-300 mb-2">Nothing saved yet</h2>
              <p className="text-zinc-600 max-w-xs text-sm mb-6">
                Browse movies and tap the bookmark icon to add them here.
              </p>
              <motion.a
                href="/movies"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition"
              >
                Browse Movies
              </motion.a>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
            >
              {myListMovies.map((movie, i) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}