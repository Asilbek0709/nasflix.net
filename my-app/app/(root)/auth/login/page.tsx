"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { login, getMe } from "@/services/auth/auth.service";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getMe();
        router.push("/");
      } catch {}
    };

    checkAuth();
  }, [router]);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        return setError("Fill all fields");
      }

      setLoading(true);
      setError("");

      await login(email, password);

      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">

      <Image
        src="https://img.freepik.com/free-photo/assortment-cinema-elements-red-background-with-copy-space_23-2148457848.jpg"
        alt="bg"
        fill
        priority
        className="object-cover scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-red-900/40" />

      <div
        className="relative w-[420px] bg-black/80 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-red-500/20"
      >

        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Welcome Back
        </h1>

        <div className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email"
            className="h-12 px-4 rounded-lg bg-white/10 text-white outline-none focus:ring-2 focus:ring-red-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          <input
            type="password"
            placeholder="Password"
            className="h-12 px-4 rounded-lg bg-white/10 text-white outline-none focus:ring-2 focus:ring-red-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="h-12 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            {loading ? "Loading..." : "Login"}
          </button>

        </div>

        {/* Divider */}

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/20" />
          <span className="text-white/60 text-sm">OR CONTINUE WITH</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        {/* OAuth */}

        <div className="flex flex-col gap-4">

          <button
            onClick={() => (window.location.href = `${API}/auth/github`)}
            className="h-12 flex items-center justify-center gap-3 rounded-lg bg-white text-black font-medium hover:shadow-lg transition"
          >
            <FaGithub size={20} />
            Continue with GitHub
          </button>

          <button
            onClick={() => (window.location.href = `${API}/auth/google`)}
            className="h-12 flex items-center justify-center gap-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
          >
            <FaGoogle size={18} />
            Continue with Google
          </button>

        </div>

        <div className="text-center text-white/60 text-sm mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/auth/register")}
            className="text-red-500 cursor-pointer hover:underline"
          >
            Register
          </span>
        </div>

      </div>
    </div>
  );
}