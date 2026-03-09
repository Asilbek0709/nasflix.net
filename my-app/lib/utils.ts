import type { Movie } from "@/types";

/** Single UI language: always use English for display. No language switcher. */
const DISPLAY_LANG = "en" as const;

export function getMovieTitle(movie: Movie): string {
  return movie.title[DISPLAY_LANG] ?? movie.title.en ?? "";
}

export function getMovieDescription(movie: Movie): string {
  return movie.description[DISPLAY_LANG] ?? movie.description.en ?? "";
}

const TIER_ORDER: Record<string, number> = { basic: 1, medium: 2, pro: 3 };

export function canWatchMovie(userTier: string, movieSubscription: string): boolean {
  return (TIER_ORDER[userTier] ?? 0) >= (TIER_ORDER[movieSubscription] ?? 0);
}

export function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId);
  el?.scrollIntoView({ behavior: "smooth" });
}
