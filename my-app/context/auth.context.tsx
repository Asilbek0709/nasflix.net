"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getMe, getSubscription, logout as logoutApi } from "@/services/auth/auth.service";

export type PlanTier = "basic" | "medium" | "pro";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  profiles?: { id: string; name: string; avatar?: string }[];
}

interface AuthContextType {
  user: AuthUser | null;
  planTier: PlanTier;
  loading: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [planTier, setPlanTier] = useState<PlanTier>("basic");
  const [loading, setLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    try {
      const userData = await getMe();
      setUser(userData);
      try {
        const subData = await getSubscription();
        const tier = (subData?.tier ?? "basic") as PlanTier;
        setPlanTier(tier === "basic" || tier === "medium" || tier === "pro" ? tier : "basic");
      } catch {
        setPlanTier("basic");
      }
    } catch {
      setUser(null);
      setPlanTier("basic");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const logout = useCallback(async () => {
    await logoutApi();
    setUser(null);
    setPlanTier("basic");
  }, []);

  return (
    <AuthContext.Provider value={{ user, planTier, loading, refreshAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
