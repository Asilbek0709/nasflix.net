"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import MovieCard, { MovieCardType } from "../../components/movies/Card";
import { getMyList, removeFromMyList, addToMyList } from "@/services/my-list.service";
import type { Movie } from "@/types";

export default function MyListPage() {

  const { user } = useAuth();
  const router = useRouter();

  const [movies, setMovies] = useState<MovieCardType[]>([]);
  const [myListIds, setMyListIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const API_KEY = "9e5d3e2c9b3806d1805188f6d929d903";

  // загрузка id избранных
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

  // загрузка фильмов по id
  useEffect(() => {

    const fetchMovies = async () => {

      if (myListIds.size === 0) {
        setMovies([]);
        return;
      }

      try {

        const requests = Array.from(myListIds).map((id) =>
          fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
            .then((res) => res.json())
        );

        const results = await Promise.all(requests);

        

      } catch (e) {
        console.error(e);
      }

    };

    fetchMovies();

  }, [myListIds]);

  const refreshMyList = useCallback(() => {
    getMyList().then((ids) => setMyListIds(new Set(ids))).catch(() => {});
  }, []);

  const handleToggleMyList = useCallback(
    (movieId: number, inList: boolean) => {

      if (!user) return;

      if (inList) {
        removeFromMyList(movieId).then(refreshMyList);
      } else {
        addToMyList(movieId).then(refreshMyList);
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

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">My List</h1>
          <p className="text-zinc-500 text-sm mt-2">
            {movies.length} saved movies
          </p>
        </div>

        <AnimatePresence mode="wait">

          {movies.length === 0 ? (

            <div className="text-center py-24 text-zinc-500">
              Nothing saved yet
            </div>

          ) : (

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
            >


            </motion.div>

          )}

        </AnimatePresence>

      </div>

    </div>
  );
}