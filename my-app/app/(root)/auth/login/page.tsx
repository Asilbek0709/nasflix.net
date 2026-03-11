"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { motion, AnimatePresence, Variants } from "motion/react";
import { register } from "@/services/auth/auth.service";
import { addToMyList, removeFromMyList } from "@/services/my-list.service";
import { useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* ─────────────── variants ─────────────── */

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 44, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const fadeDown: Variants = {
  hidden: { opacity: 0, y: -14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

/* ─────────────── particles ─────────────── */

function Particles() {
  const list = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 3 + 1.5,
        duration: Math.random() * 14 + 10,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.35 + 0.08,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {list.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-red-400"
          style={{ left: `${p.x}%`, bottom: "-10px", width: p.size, height: p.size, opacity: p.opacity }}
          animate={{ y: [0, -2200] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

/* ─────────────── input field ─────────────── */

interface FieldProps {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
}

function Field({ label, type = "text", placeholder, value, onChange, onEnter }: FieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div variants={fadeUp} className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold tracking-[0.14em] text-white/40 uppercase">
        {label}
      </label>
      <motion.div
        animate={{
          boxShadow: focused
            ? "0 0 0 2px rgba(239,68,68,0.3), 0 0 16px rgba(239,68,68,0.08) inset"
            : "0 0 0 0px rgba(239,68,68,0)",
        }}
        transition={{ duration: 0.2 }}
        className="rounded-[10px]"
      >
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
          className={[
            "w-full h-12 px-4 rounded-[10px] text-sm text-white outline-none transition-colors duration-200",
            "placeholder:text-white/30",
            focused
              ? "bg-white/[0.10] border border-red-500/50"
              : "bg-white/[0.06] border border-white/10 hover:border-white/20",
          ].join(" ")}
        />
      </motion.div>
    </motion.div>
  );
}

/* ─────────────── page ─────────────── */

export default function RegisterPage() {

  const router = useRouter();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [errKey, setErrKey]     = useState(0);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Barcha maydonlarni to'ldiring");
      setErrKey((k) => k + 1);
      return;
    }
    try {

      setLoading(true);
      setError("");
      await register(name, email, password);
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Ro'yxatdan o'tish amalga oshmadi");
      setErrKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden px-4 py-10 mt-10"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* bg image with slow pan */}
      <motion.div
        className="absolute inset-0"
        animate={{ x: [0, -18, 0], scale: [1.07, 1.1, 1.07] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="https://img.freepik.com/free-photo/assortment-cinema-elements-red-background-with-copy-space_23-2148457848.jpg"
          alt="bg"
          fill
          priority
          className="object-cover"
        />
      </motion.div>

      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/85 to-red-950/55" />

      {/* scanline */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,#fff 2px,#fff 4px)" }}
      />

      {/* vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center,transparent 38%,rgba(0,0,0,0.78) 100%)" }}
      />

      {/* film strips */}
      <div
        className="absolute left-0 top-0 h-full w-7 pointer-events-none opacity-[0.07]"
        style={{ backgroundImage: "repeating-linear-gradient(to bottom,transparent 0,transparent 18px,#ef4444 18px,#ef4444 20px)" }}
      />
      <div
        className="absolute right-0 top-0 h-full w-7 pointer-events-none opacity-[0.07]"
        style={{ backgroundImage: "repeating-linear-gradient(to bottom,transparent 0,transparent 18px,#ef4444 18px,#ef4444 20px)" }}
      />

      {/* glow orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(239,68,68,0.1) 0%,transparent 70%)", filter: "blur(48px)" }}
      />

      {/* particles */}
      <Particles />

      {/* ── card ── */}
      <motion.div
        variants={cardVariant}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md rounded-2xl border border-red-500/15"
        style={{
          background: "linear-gradient(160deg,rgba(8,8,8,0.94) 0%,rgba(18,4,4,0.97) 100%)",
          backdropFilter: "blur(28px)",
          boxShadow:
            "0 0 0 1px rgba(239,68,68,0.10), 0 30px 70px rgba(0,0,0,0.65), inset 0 0 80px rgba(239,68,68,0.03)",
        }}
      >
        {/* top accent */}
        <div
          className="absolute top-0 left-10 right-10 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg,transparent,rgba(239,68,68,0.55),transparent)" }}
        />
        {/* bottom accent */}
        <div
          className="absolute bottom-0 left-10 right-10 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg,transparent,rgba(239,68,68,0.25),transparent)" }}
        />

        <div className="px-8 sm:px-10 py-10">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-0">

            {/* header */}
            <motion.div variants={fadeDown} className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <motion.span
                  className="w-2 h-2 rounded-sm bg-red-500"
                  animate={{ boxShadow: ["0 0 4px #ef4444", "0 0 14px #ef4444", "0 0 4px #ef4444"] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
                <span className="text-[10px] font-bold tracking-[0.32em] text-red-500/65">
                  CINEMA PLATFORM
                </span>
                <motion.span
                  className="w-2 h-2 rounded-sm bg-red-500"
                  animate={{ boxShadow: ["0 0 4px #ef4444", "0 0 14px #ef4444", "0 0 4px #ef4444"] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }}
                />
              </div>

              <h1
                className="text-white leading-none tracking-wide"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(34px,7vw,44px)" }}
              >
                Join Nasflix
              </h1>
              <p className="text-white/40 text-[13px] mt-1.5">Hisob yarating</p>
            </motion.div>

            {/* fields */}
            <div className="flex flex-col gap-3 mb-2">
              <Field
                label="Ism"
                placeholder="Ismingiz"
                value={name}
                onChange={setName}
                onEnter={handleRegister}
              />
              <Field
                label="Email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={setEmail}
                onEnter={handleRegister}
              />
              <Field
                label="Parol"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={setPassword}
                onEnter={handleRegister}
              />
            </div>

            {/* error */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  key={errKey}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: [0, -5, 5, -3, 3, 0] }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.38 }}
                  className="text-red-400 text-[13px] text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3 mt-2"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* register btn */}
            <motion.div variants={fadeUp} className="mt-4">
              <motion.button
                onClick={handleRegister}
                disabled={loading}
                whileHover={!loading ? { y: -2, boxShadow: "0 10px 28px rgba(239,68,68,0.42)" } : {}}
                whileTap={!loading ? { scale: 0.97 } : {}}
                className="w-full h-[50px] rounded-[10px] text-white font-semibold text-[15px] tracking-wide flex items-center justify-center gap-2 disabled:opacity-55 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(100deg,#b91c1c,#ef4444,#dc2626)" }}
              >
                {loading ? (
                  <>
                    <motion.span
                      className="w-[17px] h-[17px] rounded-full border-2 border-white/30 border-t-white"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.65, repeat: Infinity, ease: "linear" }}
                    />
                    Ro'yxatdan o'tilmoqda...
                  </>
                ) : (
                  <>Ro'yxatdan o'tish <span className="opacity-60">→</span></>
                )}
              </motion.button>
            </motion.div>

            {/* divider */}
            <motion.div variants={fadeUp} className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-[10px] tracking-[0.2em] font-bold">YOKI</span>
              <div className="flex-1 h-px bg-white/10" />
            </motion.div>

            {/* github */}
            <motion.div variants={fadeUp} className="mb-3">
              <motion.button
                onClick={() => (window.location.href = `${API}/auth/github`)}
                whileHover={{ y: -2, boxShadow: "0 8px 22px rgba(0,0,0,0.45)" }}
                whileTap={{ scale: 0.97 }}
                className="w-full h-12 flex items-center justify-center gap-2.5 rounded-[10px] bg-white/[0.07] border border-white/10 text-white font-medium text-sm hover:bg-white/[0.12] transition-colors duration-200"
              >
                <FaGithub size={18} />
                GitHub orqali ro'yxatdan o'tish
              </motion.button>
            </motion.div>

            {/* google */}
            <motion.div variants={fadeUp}>
              <motion.button
                onClick={() => (window.location.href = `${API}/auth/google`)}
                whileHover={{ y: -2, boxShadow: "0 8px 22px rgba(239,68,68,0.22)" }}
                whileTap={{ scale: 0.97 }}
                className="w-full h-12 flex items-center justify-center gap-2.5 rounded-[10px] bg-red-500/[0.10] border border-red-500/20 text-red-400 font-medium text-sm hover:bg-red-500/[0.17] transition-colors duration-200"
              >
                <FaGoogle size={16} />
                Google orqali ro'yxatdan o'tish
              </motion.button>
            </motion.div>

            {/* footer */}
            <motion.p variants={fadeUp} className="text-center text-white/35 text-[13px] mt-6">
              Allaqachon hisobingiz bormi?{" "}
              <motion.span
                onClick={() => router.push("/auth/login")}
                whileHover={{ color: "#fca5a5" }}
                className="text-red-500 cursor-pointer underline decoration-dotted underline-offset-2"
              >
                Kirish
              </motion.span>
            </motion.p>

          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}