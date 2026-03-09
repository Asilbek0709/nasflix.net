"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth.context";
import { movies } from "@/data/movies";
import { getMovieTitle, canWatchMovie } from "@/lib/utils";
import { getProgress, setProgress } from "@/services/watch-progress.service";

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const { user, planTier } = useAuth();
  const slug = params.slug as string;
  const movie = movies.find((m) => m.slug === slug);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [resumed, setResumed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canWatch = !user || canWatchMovie(planTier, movie?.subscription ?? "basic");

  useEffect(() => {
    if (!movie || !canWatch) return;
    getProgress(movie.id).then((sec) => {
      if (sec > 0 && videoRef.current) {
        videoRef.current.currentTime = sec;
        setCurrentTime(sec);
        setResumed(true);
      }
    }).catch(() => {});
  }, [movie?.id, canWatch]);

  const saveProgress = useCallback(() => {
    if (!user || !movie || !videoRef.current) return;
    const sec = Math.floor(videoRef.current.currentTime);
    setProgress(movie.id, sec).catch(() => {});
  }, [user, movie]);

  useEffect(() => {
    if (!user || !movie) return;
    const video = videoRef.current;
    if (!video) return;
    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(saveProgress, 2000);
    };
    const onLoadedMetadata = () => setDuration(video.duration);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [user, movie, saveProgress]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Movie not found.</p>
        <Link href="/" className="ml-2 text-red-500">Home</Link>
      </div>
    );
  }

  if (!canWatch) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-xl mb-4">This title requires a {movie.subscription} plan.</p>
          <Link href={`/movie/${movie.slug}`} className="text-red-500 hover:underline">
            Back to movie
          </Link>
        </div>
      </div>
    );
  }

  const title = getMovieTitle(movie);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (!document.fullscreenElement) {
      v.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    v.currentTime = x * duration;
    setCurrentTime(v.currentTime);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="relative flex-1 flex items-center justify-center group">
        <video
          ref={videoRef}
          src={movie.video}
          className="max-w-full max-h-full w-full h-full object-contain"
          onClick={togglePlay}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          playsInline
          controls={false}
        />
        {!playing && (
          <button
            type="button"
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Play"
          >
            <span className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white text-4xl pl-1">
              ▶
            </span>
          </button>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/90 to-transparent">
        <div
          className="h-1.5 bg-zinc-700 rounded-full cursor-pointer mb-4"
          onClick={seek}
          role="progressbar"
          aria-valuenow={currentTime}
          aria-valuemin={0}
          aria-valuemax={duration}
        >
          <div
            className="h-full bg-red-600 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={togglePlay}
              className="text-white hover:text-red-500 transition"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? "⏸" : "▶"}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={volume * 100}
              onChange={(e) => {
                const val = Number(e.target.value) / 100;
                setVolume(val);
                if (videoRef.current) videoRef.current.volume = val;
              }}
              className="w-24 h-2 accent-red-600"
              title="Volume"
            />
            <span className="text-zinc-400 text-sm">
              {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, "0")} / {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, "0")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white text-sm truncate max-w-[200px]">{title}</span>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="text-white hover:text-red-500 transition p-2"
              aria-label="Fullscreen"
            >
              ⛶
            </button>
            <Link
              href={`/movie/${movie.slug}`}
              className="text-zinc-400 hover:text-white text-sm p-2"
            >
              ✕
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
