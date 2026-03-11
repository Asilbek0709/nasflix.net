"use client";

import { useState, useEffect } from "react";
import MovieCard, { MovieCardType } from "../../../components/movies/Card";
import { getMyList, addToMyList, removeFromMyList } from "@/services/my-list.service";
import { Movie } from "@/types";

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [myListIds, setMyListIds] = useState<Set<string>>(new Set());

  const API_KEY = "9e5d3e2c9b3806d1805188f6d929d903";

  // Загрузка всех фильмов
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const pages = 50; // количество страниц
        const requests = [];
        for (let i = 1; i <= pages; i++) {
          requests.push(
            fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${i}`).then(res => res.json())
          );
        }

        const results = await Promise.all(requests);

        const moviesData: MovieCardType[] = results.flatMap((page) =>
          page.results.map((m: any) => ({
            id: m.id,
            slug: String(m.id),
            title: m.title,
            year: m.release_date?.split("-")[0] || "",
            poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
          }))
        );

        // удаляем дубликаты по id
        const uniqueMovies = Array.from(new Map(moviesData.map(m => [m.id, m])).values());
        setMovies(uniqueMovies);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    fetchMovies();
  }, []);

  // Загрузка My List
  useEffect(() => {
    const loadMyList = async () => {
      try {
        const ids = await getMyList();
        setMyListIds(new Set(ids.map(id => String(id)))); // приведение к строкам
      } catch (e) {
        console.error(e);
      }
    };
    loadMyList();
  }, []);

  // Добавление/удаление из My List
  const toggleMyList = async (movieId: number) => {
    const strId = String(movieId);
    if (myListIds.has(strId)) {
      await removeFromMyList(movieId);
      setMyListIds(prev => {
        const copy = new Set(prev);
        copy.delete(strId);
        return copy;
      });
    } else {
      await addToMyList(movieId);
      setMyListIds(prev => new Set(prev).add(strId));
    }
  };

  if (loading) return <p className="text-white p-6">Kinolar yuklanmoqda...</p>;
  if (!movies.length) return <p className="text-white p-6">Kinolar topilmadi</p>;

  return (
    <div className="p-6">
      <h1 className="text-white text-3xl mb-6">Barcha kinolar</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie, i) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            index={i}
            myList={myListIds.has(String(movie.id))} 
            onToggleMyList={() => toggleMyList(movie.id)}
          />
        ))}
      </div>
    </div>
  );
}