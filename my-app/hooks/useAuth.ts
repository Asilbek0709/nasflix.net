"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/services/auth/auth.service";

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getMe();
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuth, loading };
};