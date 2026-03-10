"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Dialog, IconButton, TextField } from "@mui/material";
import { MdClose } from "react-icons/md";
import type { Movie } from "@/types";
import { getMovieTitle } from "@/lib/utils";

type SearchModalProps = {
  open: boolean;
  onClose: () => void;
  movies: Movie[];
};

export default function SearchModal({ open, onClose, movies }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return movies;
    const q = query.toLowerCase();
    return movies.filter((m) => getMovieTitle(m).toLowerCase().includes(q));
  }, [movies, query]);

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
        <div className="flex items-center justify-between gap-2 mb-4">
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
                "&:hover fieldset": { borderColor: "#52525b" },
              },
            }}
          />
          <IconButton onClick={onClose} sx={{ color: "#fff" }} size="small">
            <MdClose size={24} />
          </IconButton>
        </div>
        <div className="overflow-y-auto max-h-[60vh] space-y-2">
          <AnimatePresence mode="wait">
            {results.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-zinc-500 py-4 text-center"
              >
                No movies found
              </motion.p>
            ) : (
              results.map((movie, i) => (
                <motion.button
                  key={movie.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  type="button"
                  onClick={() => handleSelect(movie.slug)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/80 text-left transition"
                >
                  <img
                    src={movie.poster}
                    alt=""
                    className="w-14 h-20 object-cover rounded shrink-0 bg-zinc-800"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white truncate">
                      {movie.originalTitle}
                    </p>
                    <p className="text-sm text-zinc-500">{movie.year}</p>
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
