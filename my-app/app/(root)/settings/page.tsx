"use client";

import { useAuth } from "@/context/auth.context";
import Link from "next/link";

export default function SettingsPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Please log in to access settings.</p>
        <Link href="/auth/login" className="ml-2 text-red-500">Login</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <p className="text-zinc-400">Account and playback settings will appear here.</p>
        <Link href="/" className="inline-block mt-6 text-red-500 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
