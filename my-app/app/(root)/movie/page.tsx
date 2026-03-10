"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import MovieCard, { MovieCardType } from "../../../components/movies/Card";


export default function MoviesPage() {
  const [movies, setMovies] = useState<MovieCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const API_KEY = "9e5d3e2c9b3806d1805188f6d929d903";

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        // Только первая страница
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=uz-UZ&page=1`
        );
        const data = await res.json();
        const moviesArray = Array.isArray(data.results) ? data.results : [];

        const formatted: MovieCardType[] = moviesArray.map((m: any) => ({
          id: m.id,
          title: m.title,
          poster: m.poster_path
            ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
            : undefined,
          rating: m.vote_average,
          year: m.release_date ? m.release_date.split("-")[0] : undefined,
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

  if (loading) return <p className="text-white p-6">Kinolar yuklanmoqda....</p>;
  if (!movies.length) return <p className="text-white p-6">Kinolar topilmadi</p>;

  return (
    <div className="p-6">
      <h1 className="text-white text-3xl mb-6">Barcha kinolar</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie, i) => (
          <MovieCard key={movie.id} movie={movie} index={i} />
        ))}
      </div>
    </div>
  );
}