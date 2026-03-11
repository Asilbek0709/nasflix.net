const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://nasflix-net-krpr.vercel.app/";

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) throw new Error("Login failed")

  return res.json()
}

export const register = async (
  name: string,
  email: string,
  password: string,
  nickname?: string
) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, ...(nickname && { nickname }) }),
  });

  if (!res.ok) throw new Error("Register failed")

  return res.json()
}

export const getMe = async () => {
  const res = await fetch(`${API_URL}/auth/me`, {
    credentials: "include",
  })

  if (!res.ok) throw new Error("Not authenticated")

  return res.json()
}

export const logout = async () => {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
};

export const getSubscription = async (): Promise<{ tier: string } | null> => {
  const res = await fetch(`${API_URL}/subscription`, {
    credentials: "include",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.plan ? { tier: data.plan.tier || "basic" } : { tier: "basic" };
}