"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/header";
import SearchModal from "@/components/search/SearchModal";
import { useAuth } from "@/context/auth.context";
import { movies } from "@/data/movies";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function RootShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  // const avatarSrc =
  //   user?.profiles?.[0]?.avatar?.startsWith("/uploads")
  //     ? `${API_URL}${user.profiles[0].avatar}`
  //     : user?.profiles?.[0]?.avatar ?? null;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <>
      <Header
        user={user}
        onLogout={handleLogout}
        onSearchClick={() => setSearchOpen(true)}
      />
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        movies={movies}
      />
      {children}
    </>
  );
}
