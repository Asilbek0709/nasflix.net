const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function fetchApi(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

export interface WatchProgressItem {
  movieId: string;
  progress: number;
}

export async function getAllProgress(): Promise<WatchProgressItem[]> {
  return fetchApi("/watch-progress");
}

export async function setProgress(
  movieId: string | number,
  progress: number
): Promise<void> {
  await fetchApi("/watch-progress", {
    method: "POST",
    body: JSON.stringify({ movieId: String(movieId), progress }),
  });
}

export async function getProgress(movieId: string | number): Promise<number> {
  const data = await fetchApi(`/watch-progress/${movieId}`);
  return data?.progress ?? 0;
}
