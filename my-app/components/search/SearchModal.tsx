"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Dialog, IconButton, TextField } from "@mui/material";
import { MdClose } from "react-icons/md";

type Movie = {
  id: number;
  slug: string;
  title: string;
  year: string;
  poster: string;
};

type SearchModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = "9e5d3e2c9b3806d1805188f6d929d903";

  // ─── LOAD MANY PAGES ─────────────────────

  useEffect(() => {
    if (!open) return;

    const fetchMovies = async () => {
      setLoading(true);

      try {
        const pages = 3;
        const requests = [];

        for (let i = 1; i <= pages; i++) {
          requests.push(
            fetch(
              `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${i}`
            ).then((res) => res.json())
          );
        }

        const results = await Promise.all(requests);

        const movies = results.flatMap((page) =>
          page.results.map((m: any) => ({
            id: m.id,
            slug: String(m.id),
            title: m.title,
            year: m.release_date?.split("-")[0] || "",
            poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
          }))
        );

        // удаляем дубликаты
        const uniqueMovies = Array.from(
          new Map(movies.map((m) => [m.id, m])).values()
        );

        setAllMovies(uniqueMovies);

        setAllMovies(movies);
      } catch (e) {
        console.error(e);
      }

      setLoading(false);
    };

    fetchMovies();
  }, [open]);

  // ─── SEARCH FILTER ─────────────────────

  const results = useMemo(() => {
    if (!query.trim()) return allMovies;

    const q = query.toLowerCase();

    return allMovies.filter((m) =>
      m.title.toLowerCase().includes(q)
    );
  }, [query, allMovies]);

  // ─── SELECT MOVIE ─────────────────────

  const handleSelect = (id: string) => {
    onClose();
    setQuery("");
    router.push(`/movies/${id}`);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          bgcolor: "#0a0a0a",
          color: "#fff",
          maxHeight: "80vh",
          borderRadius: 2,
          border: "1px solid #27272a",
        },
      }}
    >
      <div className="p-4">

        {/* SEARCH INPUT */}

        <div className="flex items-center gap-2 mb-4">
          <TextField
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": { borderColor: "#3f3f46" },
              },
            }}
          />

          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <MdClose size={22} />
          </IconButton>
        </div>

        {/* RESULTS */}

        <div className="overflow-y-auto max-h-[60vh] space-y-2">

          <AnimatePresence mode="wait">

            {loading ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-zinc-500 py-4"
              >
                Loading movies...
              </motion.p>
            ) : (
              results.map((movie, i) => (
                <motion.button
                  key={movie.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.01 }}
                  onClick={() => handleSelect(movie.slug)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition"
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-14 h-20 object-cover rounded"
                  />

                  <div className="text-left">
                    <p className="font-medium text-white">
                      {movie.title}
                    </p>

                    <p className="text-sm text-zinc-500">
                      {movie.year}
                    </p>
                  </div>

                </motion.button>
              ))
            )}

          </AnimatePresence>

        </div>
      </div>
    </Dialog>
  );
}