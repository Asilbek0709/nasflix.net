"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import MovieCard from "./cards/cards";
import Search from "../../search/page";
import { movies } from "../../../lib/movies";

interface MovieTranslation {
  title?: string;
}

interface MovieGenre {
  name?: string;
}

interface Movie {
  id: string | number;
  originalTitle?: string;
  translations?: {
    uz?: MovieTranslation;
  };
  genres: string[];
  availableLanguages: string[];
  year?: number;
  type?: string;
  poster?: string | null;
  rating?: number;
}

interface Suggestion {
  id: string | number;
  title: string;
  originalTitle?: string;
  year?: string;
  type?: string;
  poster?: string | null;
  rating?: string | null;
}

const Movies: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLang, setSelectedLang] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  const getSuggestions = useCallback((searchQuery: string): Suggestion[] => {
    if (!searchQuery || searchQuery.trim().length < 2) return [];

    const q = searchQuery.toLowerCase().trim();

    return (movies as Movie[])
      .filter((m) => {
        const uzTitle = m.translations?.uz?.title?.toLowerCase() || "";
        const original = m.originalTitle?.toLowerCase() || "";
        return uzTitle.includes(q) || original.includes(q);
      })
      .slice(0, 7)
      .map((m) => ({
        id: m.id,
        title: m.translations?.uz?.title || m.originalTitle || "Unknown",
        originalTitle: m.originalTitle,
        year: String(m.year || ""),
        type: m.type === "serial" ? "Serial" : "Film",
        poster: m.poster || null,
        rating: m.rating ? String(m.rating) : null,
      }));
  }, []);

  const filtered = useMemo(() => {
    return (movies as Movie[]).filter((m) => {
      const title = m.translations?.uz?.title?.toLowerCase() || "";
      const original = m.originalTitle?.toLowerCase() || "";

      if (
        query &&
        !title.includes(query.toLowerCase()) &&
        !original.includes(query.toLowerCase())
      ) {
        return false;
      }

      if (selectedGenres.length > 0) {
        const movieGenres = m.genres.map((g) => g.toLowerCase());
        const match = selectedGenres.some((g) =>
          movieGenres.includes(g.toLowerCase())
        );
        if (!match) return false;
      }

      if (selectedLang && !m.availableLanguages.includes(selectedLang)) {
        return false;
      }

      if (selectedYear && String(m.year) !== selectedYear) {
        return false;
      }

      if (selectedType && selectedType !== "movies") {
        return false;
      }

      return true;
    });
  }, [query, selectedGenres, selectedLang, selectedType, selectedYear]);

  const displayMovies = filtered.map((m) => ({
    id: m.id,
    title: m.translations?.uz?.title || m.originalTitle || "Unknown",
    year: String(m.year || ""),
    rating: m.rating ? String(m.rating) : "N/A",
    poster: m.poster || null,
  }));

  return (
    <div className="bg-black min-h-screen w-full">
      <Search
        query={query}
        setQuery={setQuery}
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        selectedLang={selectedLang}
        setSelectedLang={setSelectedLang}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        getSuggestions={getSuggestions}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="px-6 pb-10 mt-10"
      >
        <p
          className="text-gray-500 text-sm mb-4"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {displayMovies.length} ta film topildi
        </p>

        {displayMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <span className="text-5xl">🎬</span>
            <p
              className="text-white text-lg font-bold"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Film topilmadi
            </p>
            <p
              className="text-gray-500 text-sm"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Boshqa kalit so'z yoki filtr bilan qidiring
            </p>
          </div>
        ) : (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            }}
          >
            {displayMovies.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Movies;