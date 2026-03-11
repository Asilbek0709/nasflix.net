const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://nasflix-net-krpr.vercel.app/";

async function fetchApi(
  path: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

export async function getMyList(): Promise<string[]> {
  return fetchApi("/my-list");
}

export async function addToMyList(movieId: string | number): Promise<void> {
  await fetchApi("/my-list", {
    method: "POST",
    body: JSON.stringify({ movieId: String(movieId) }),
  });
}

export async function removeFromMyList(movieId: string | number): Promise<void> {
  await fetchApi(`/my-list/${movieId}`, { method: "DELETE" });
}

export async function hasInMyList(movieId: string | number): Promise<boolean> {
  const data = await fetchApi(`/my-list/has/${movieId}`);
  return !!data?.inList;
}
