"use client";

import { motion, AnimatePresence } from "motion/react";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";

interface Suggestion {
  id: string | number;
  title: string;
  originalTitle?: string;
  poster?: string | null;
  year?: string;
  type?: string;
  rating?: string | null;
}

interface SearchProps {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  selectedGenres: string[];
  setSelectedGenres: Dispatch<SetStateAction<string[]>>;
  selectedLang: string;
  setSelectedLang: Dispatch<SetStateAction<string>>;
  selectedType: string;
  setSelectedType: Dispatch<SetStateAction<string>>;
  selectedYear: string;
  setSelectedYear: Dispatch<SetStateAction<string>>;
  getSuggestions: (query: string) => Suggestion[];
}

interface AutocompleteProps {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  getSuggestions: (query: string) => Suggestion[];
}

interface HighlightedProps {
  text: string;
  query: string;
}

function useDebounce<T>(value: T, delay = 150): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

function HighlightedText({ text, query }: HighlightedProps) {
  if (!query || !text) return <span>{text}</span>;

  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;

  return (
    <span>
      {text.slice(0, idx)}
      <span style={{ color: "red", fontWeight: 700 }}>
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </span>
  );
}

function SearchWithAutocomplete({
  query,
  setQuery,
  getSuggestions,
}: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const debouncedQuery = useDebounce(query);

  const suggestions = useMemo(() => {
    if (!getSuggestions || debouncedQuery.trim().length < 2) return [];
    return getSuggestions(debouncedQuery);
  }, [debouncedQuery, getSuggestions]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (title: string) => {
      setQuery(title);
      setOpen(false);
    },
    [setQuery]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex].title);
    }

    if (e.key === "Escape") setOpen(false);
  };

  const isDropdownOpen =
    debouncedQuery.trim().length >= 2 && suggestions.length > 0;

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "min(900px, 90vw)" }}>
      <TextField
        label="Qidirish..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        fullWidth
      />

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            {suggestions.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item.title)}
                onMouseEnter={() => setActiveIndex(idx)}
                style={{
                  padding: "10px 16px",
                  cursor: "pointer",
                  background:
                    activeIndex === idx ? "rgba(255,0,0,0.1)" : "transparent",
                }}
              >
                <HighlightedText text={item.title} query={query} />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GenreSelect({
  selectedGenres,
  setSelectedGenres,
}: {
  selectedGenres: string[];
  setSelectedGenres: Dispatch<SetStateAction<string[]>>;
}) {
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    setSelectedGenres(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <FormControl size="small">
      <InputLabel>Janr</InputLabel>

      <Select
        multiple
        value={selectedGenres}
        onChange={handleChange}
        input={<OutlinedInput label="Janr" />}
      >
        {["action", "comedy", "drama", "horror"].map((g) => (
          <MenuItem key={g} value={g}>
            <ListItemText primary={g} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

const Search = ({
  query,
  setQuery,
  selectedGenres,
  setSelectedGenres,
  selectedLang,
  setSelectedLang,
  selectedType,
  setSelectedType,
  selectedYear,
  setSelectedYear,
  getSuggestions,
}: SearchProps) => {
  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <SearchWithAutocomplete
          query={query}
          setQuery={setQuery}
          getSuggestions={getSuggestions}
        />
      </motion.div>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          p: "16px 0",
          flexWrap: "wrap",
          width: "min(900px, 90vw)",
          margin: "0 auto",
        }}
      >
        <GenreSelect
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
        />
      </Box>
    </div>
  );
};

export default Search;