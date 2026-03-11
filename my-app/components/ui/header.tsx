"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  Variants,
} from "motion/react";
import { CiSearch } from "react-icons/ci";
import { IoMdMenu, IoMdClose } from "react-icons/io";

// ─── Types ────────────────────────────────────────────────────────────────────

type User = {
  name?: string;
  nickname?: string;
  avatarSrc?: string | null;
};

type HeaderProps = {
  user: User | null;
  avatarSrc?: string | null;
  onLogout: () => void;
  onSearchClick: () => void;
};

// ─── Nav links ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Bosh sahifa", href: "/" },
  { label: "Biz haqimizda", href: "/about" },
  { label: "Kinolar", href: "/movie" },
  { label: "Aloqa", href: "/contact" },
];

const DROPDOWN_ITEMS = [
  { label: "Profile", href: "/profile" },
  { label: "Settings", href: "/settings" },
  { label: "Tanlangan filmlar", href: "/mylist" },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: -8, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.95,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

const mobileMenuVariants: Variants = {
  hidden: { opacity: 0, scaleY: 0.92, y: -10 },
  visible: {
    opacity: 1,
    scaleY: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    scaleY: 0.94,
    y: -8,
    transition: {
      duration: 0.22,
      ease: [0.4, 0, 1, 1] as [number, number, number, number],
    },
  },
};

const mobileLinkVariants: Variants = {
  hidden: { opacity: 0, x: -14 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.07, duration: 0.28, ease: "easeOut" },
  }),
};
// ─── NavLink ──────────────────────────────────────────────────────────────────

function NavLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={href} className="no-underline">
      <motion.span
        className="relative block px-4 py-2 text-sm font-medium text-gray-300 rounded-full cursor-pointer select-none"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{
          color: "#fff",
          backgroundColor: "rgba(255,255,255,0.07)",
        }}
        whileTap={{ scale: 0.93 }}
        transition={{ duration: 0.18 }}
      >
        {label}
        <motion.span
          className="absolute bottom-1.5 left-4 right-4 h-px bg-red-500 rounded-full origin-left"
          animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        />
      </motion.span>
    </Link>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ src, size = 40 }: { src?: string | null; size?: number }) {
  return src ? (
    <Image
      src={src}
      alt="avatar"
      width={size}
      height={size}
      className="rounded-full object-cover border border-zinc-700"
    />
  ) : (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-zinc-700 flex items-center justify-center text-white text-sm font-bold"
    >
      U
    </div>
  );
}

// ─── Main Header ──────────────────────────────────────────────────────────────

export default function Header({ user, onLogout, onSearchClick }: HeaderProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Spring-based scroll
  const { scrollY } = useScroll();
  const spring = useSpring(scrollY, { stiffness: 80, damping: 22, mass: 0.4 });

  // ── Scroll-driven transforms ──
  const outerPX = useTransform(spring, [0, 120], [0, 20]);
  const outerPY = useTransform(spring, [0, 120], [0, 10]);
  const navPX = useTransform(spring, [0, 120], [48, 24]);
  const navPY = useTransform(spring, [0, 120], [20, 10]);
  const navWidth = useTransform(spring, [0, 120], ["100%", "82%"]);

  // borderRadius as a number (motion.nav accepts MotionValue<number> for CSS numeric props)
  const borderRadius = useTransform(spring, [0, 120], [0, 9999]);

  // bg / shadow as strings
  const bgColor = useTransform(
    spring,
    [0, 120],
    ["rgba(6,6,6,0.0)", "rgba(12,12,12,0.88)"],
  );
  const boxShadow = useTransform(
    spring,
    [0, 120],
    ["0 4px 40px rgba(0,0,0,0)", "0 8px 48px rgba(0,0,0,0.9)"],
  );
  // ✅ Fix: build backdropFilter as a MotionValue<string>
  const backdropFilter = useTransform(
    spring,
    [0, 120],
    ["blur(0px)", "blur(22px)"],
  );

  // border overlay opacity
  const borderOpacity = useTransform(spring, [0, 120], [0, 0.15]);

  // top gradient fade out
  const gradientOp = useTransform(spring, [0, 120], [1, 0]);

  // ── Close dropdown on outside click ──
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Close mobile menu on desktop resize ──
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      {/* Top gradient overlay */}
      <motion.div
        style={{ opacity: gradientOp }}
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/90 via-black/40 to-transparent"
      />

      {/* Outer padding wrapper */}
      <motion.div
        className="pointer-events-auto"
        style={{
          paddingLeft: outerPX,
          paddingRight: outerPX,
          paddingTop: outerPY,
          paddingBottom: outerPY,
        }}
      >
        {/* ── Nav bar ── */}
        <motion.nav
          initial={{ opacity: 0, y: -32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            // ✅ MotionValues passed directly — no casting needed
            borderRadius,
            backgroundColor: bgColor,
            boxShadow,
            // ✅ backdropFilter is now a proper MotionValue<string>
            backdropFilter,
            WebkitBackdropFilter: backdropFilter,
            paddingLeft: navPX,
            paddingRight: navPX,
            paddingTop: navPY,
            paddingBottom: navPY,
            width: navWidth,
            marginLeft: "auto",
            marginRight: "auto",
            // ✅ Removed conflicting borderWidth/borderStyle here
            position: "relative",
          }}
          className="flex items-center justify-between"
        >
          {/* ✅ Single border overlay — no double border */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius,
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,1)",
              opacity: borderOpacity,
            }}
          />

          {/* ── Logo ── */}
          <Link href="/" className="no-underline select-none flex-shrink-0">
            <motion.div
              className="relative flex items-center"
              initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ scale: 1.08, rotate: -4 }}
              whileTap={{ scale: 0.92 }}
            >
              <span className="absolute -inset-3 rounded-xl blur-2xl bg-red-600/20 pointer-events-none" />
              <div className="relative w-12 h-12 flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(229,9,20,0.6)]"
                />
              </div>
            </motion.div>
          </Link>

          {/* ── Desktop nav links ── */}
          <ul className="hidden md:flex items-center gap-0.5 list-none m-0 p-0">
            {NAV_LINKS.map(({ label, href }, i) => (
              <motion.li
                key={href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 + i * 0.08,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <NavLink href={href} label={label} />
              </motion.li>
            ))}
          </ul>

          {/* ── Right side ── */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Search button */}
            <motion.button
              type="button"
              onClick={onSearchClick}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.88 }}
              className="p-2 text-red-500 hover:text-red-400 transition-colors"
              aria-label="Search"
            >
              <CiSearch size={26} />
            </motion.button>

            {/* Mobile menu toggle */}
            <motion.button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="md:hidden p-2 text-white"
              aria-label={mobileMenuOpen ? "Menyuni yopish" : "Menyuni ochish"}
              whileTap={{ scale: 0.88 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="block"
                  >
                    <IoMdClose size={22} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="block"
                  >
                    <IoMdMenu size={22} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* User section */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  type="button"
                  onClick={() => setDropdownOpen((o) => !o)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-full"
                >
                  <Avatar src={user.avatarSrc} size={40} />
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 top-full mt-3 w-52 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                    >
                      {/* User info row */}
                      <div className="px-4 py-3 border-b border-zinc-800/70 flex items-center gap-3">
                        <Avatar src={user.avatarSrc} size={36} />
                        <p className="text-sm font-semibold truncate text-white">
                          {user.name || user.nickname || "User"}
                        </p>
                      </div>

                      {DROPDOWN_ITEMS.map((item, i) => (
                        <motion.button
                          key={item.href}
                          type="button"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.2 }}
                          onClick={() => {
                            router.push(item.href);
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                        >
                          {item.label}
                        </motion.button>
                      ))}

                      <div className="mx-3 my-1 h-px bg-zinc-800/70" />

                      <motion.button
                        type="button"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: DROPDOWN_ITEMS.length * 0.05,
                          duration: 0.2,
                        }}
                        onClick={() => {
                          onLogout();
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-600/15 hover:text-red-300 transition-colors"
                      >
                        Logout
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/auth/login">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="block px-4 py-1.5 text-sm text-white border border-zinc-600 rounded-full hover:bg-zinc-800 hover:border-zinc-500 transition cursor-pointer"
                  >
                    Login
                  </motion.span>
                </Link>
                <Link href="/auth/register">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="block px-4 py-1.5 text-sm text-white bg-red-600 rounded-full hover:bg-red-500 transition cursor-pointer shadow-[0_0_16px_rgba(229,9,20,0.45)]"
                  >
                    Register
                  </motion.span>
                </Link>
              </div>
            )}
          </motion.div>
        </motion.nav>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                width: navWidth,
                marginLeft: "auto",
                marginRight: "auto",
                transformOrigin: "top",
              }}
              className="md:hidden mt-2 flex flex-col bg-zinc-900/95 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-xl"
            >
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.div
                  key={href}
                  custom={i}
                  variants={mobileLinkVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="no-underline"
                  >
                    <motion.span
                      whileHover={{
                        backgroundColor: "rgba(255,255,255,0.06)",
                        color: "#fff",
                        x: 4,
                      }}
                      transition={{ duration: 0.15 }}
                      className="block px-5 py-3.5 text-sm text-zinc-300 cursor-pointer border-b border-zinc-800/50 last:border-0"
                    >
                      {label}
                    </motion.span>
                  </Link>
                </motion.div>
              ))}

              {!user && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: NAV_LINKS.length * 0.07 + 0.1 }}
                  className="flex gap-2 px-5 py-4 border-t border-zinc-800"
                >
                  <Link
                    href="/auth/login"
                    className="flex-1 no-underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="block text-center px-4 py-2 text-sm text-white border border-zinc-600 rounded-full hover:bg-zinc-800 transition cursor-pointer">
                      Login
                    </span>
                  </Link>
                  <Link
                    href="/auth/register"
                    className="flex-1 no-underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="block text-center px-4 py-2 text-sm text-white bg-red-600 rounded-full hover:bg-red-500 transition cursor-pointer shadow-[0_0_12px_rgba(229,9,20,0.4)]">
                      Register
                    </span>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
