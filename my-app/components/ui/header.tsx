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
} from "framer-motion";
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
  { label: "Home",    href: "/" },
  { label: "About",   href: "/about" },
  { label: "Movies",  href: "/movie" },
  { label: "Trending",href: "/trending" },
  { label: "My List", href: "/mylist" },
  { label: "Contact", href: "/contact" },
];

const DROPDOWN_ITEMS = [
  { label: "Profile",  href: "/profile" },
  { label: "Settings", href: "/settings" },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const navVariants = {
  hidden: { opacity: 0, y: -48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const childVariants = {
  hidden:   { opacity: 0, y: -12 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const logoVariants = {
  hidden:  { opacity: 0, scale: 0.6, rotate: -12 },
  visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const dropdownVariants = {
  hidden:  { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.15 } },
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
        whileHover={{ color: "#fff", backgroundColor: "rgba(255,255,255,0.07)" }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.18 }}
      >
        {label}
        <motion.span
          className="absolute bottom-1.5 left-4 right-4 h-px bg-red-600 rounded-full origin-left"
          animate={{ scaleX: hovered ? 1 : 0 }}
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

  // Spring-based scroll transforms (same as Navbar 2)
  const { scrollY } = useScroll();
  const spring = useSpring(scrollY, { stiffness: 80, damping: 22, mass: 0.4 });

  const outerPX     = useTransform(spring, [0, 100], [0, 20]);
  const outerPY     = useTransform(spring, [0, 100], [0, 10]);
  const navPX       = useTransform(spring, [0, 100], [48, 24]);
  const navPY       = useTransform(spring, [0, 100], [20, 10]);
  const navWidth    = useTransform(spring, [0, 100], ["100%", "80%"]);
  const borderRadius= useTransform(spring, [0, 100], [0, 9999]);
  const bgColor     = useTransform(spring, [0, 100], ["rgba(6,6,6,0)", "rgba(6,6,6,0.92)"]);
  const borderColor = useTransform(spring, [0, 100], ["rgba(255,255,255,0)", "rgba(255,255,255,0.10)"]);
  const boxShadow   = useTransform(spring, [0, 100], ["0 4px 40px rgba(0,0,0,0)", "0 4px 40px rgba(0,0,0,0.85)"]);
  const gradientOp  = useTransform(spring, [0, 100], [1, 0]);
  const blurVal     = useTransform(spring, [0, 100], ["blur(0px)", "blur(22px)"]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      {/* Top gradient overlay */}
      <motion.div
        style={{ opacity: gradientOp }}
        className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/90 via-black/40 to-transparent"
      />

      {/* Outer padding wrapper */}
      <motion.div
        className="pointer-events-auto"
        style={{ paddingLeft: outerPX, paddingRight: outerPX, paddingTop: outerPY, paddingBottom: outerPY }}
      >
        {/* Nav bar */}
        <motion.nav
          initial="hidden"
          animate="visible"
          style={{
            borderRadius,
            backgroundColor: bgColor,
            borderColor,
            boxShadow,
            backdropFilter: blurVal,
            WebkitBackdropFilter: blurVal,
            paddingLeft: navPX,
            paddingRight: navPX,
            paddingTop: navPY,
            paddingBottom: navPY,
            width: navWidth,
            marginLeft: "auto",
            marginRight: "auto",
          }}
          className="flex items-center justify-between border"
        >
          {/* ── Logo ── */}
          <motion.div>
            <Link href="/" className="no-underline select-none">
              <motion.div
                className="relative flex items-center"
                whileHover={{ scale: 1.07, rotate: -3 }}
                whileTap={{ scale: 0.93 }}
                transition={{ type: "spring", stiffness: 280, damping: 16 }}
              >
                <span className="absolute -inset-3 rounded-xl blur-2xl bg-red-600/20 pointer-events-none" />
                <div className="relative w-14 h-14 flex-shrink-0">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    sizes="56px"
                    className="object-contain drop-shadow-[0_0_8px_rgba(229,9,20,0.6)]"
                  />
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* ── Desktop nav links ── */}
          <motion.ul
            className="hidden md:flex items-center gap-0.5 list-none m-0 p-0"
            variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.28 } } }}
          >
            {NAV_LINKS.map(({ label, href }) => (
              <motion.li key={href} >
                <NavLink href={href} label={label} />
              </motion.li>
            ))}
          </motion.ul>

          {/* ── Right side ── */}
          <div className="flex items-center gap-2" ref={dropdownRef}>
            {/* Search */}
            <motion.button
              type="button"
              onClick={onSearchClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-red-500 hover:text-red-400"
              aria-label="Search"
            >
              <CiSearch size={26} />
            </motion.button>

            {/* Mobile menu toggle */}
            <motion.button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="md:hidden p-2 text-white"
              aria-label="Menu"
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? <IoMdClose size={22} /> : <IoMdMenu size={22} />}
            </motion.button>

            {/* User section */}
            {user ? (
              <div className="relative">
                <motion.button
                  type="button"
                  onClick={() => setDropdownOpen((o) => !o)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="focus:outline-none"
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
                      className="absolute right-0 top-full mt-3 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-3">
                        <Avatar src={user.avatarSrc} size={36} />
                        <p className="text-sm font-semibold truncate text-white">
                          {user.name || user.nickname || "User"}
                        </p>
                      </div>

                      {DROPDOWN_ITEMS.map((item) => (
                        <button
                          key={item.href}
                          type="button"
                          onClick={() => { router.push(item.href); setDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
                        >
                          {item.label}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => { onLogout(); setDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-600/20 transition"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="block px-4 py-1.5 text-sm text-white border border-zinc-600 rounded-full hover:bg-zinc-800 transition cursor-pointer"
                  >
                    Login
                  </motion.span>
                </Link>
                <Link href="/auth/register">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="block px-4 py-1.5 text-sm text-white bg-red-600 rounded-full hover:bg-red-500 transition cursor-pointer shadow-[0_0_12px_rgba(229,9,20,0.4)]"
                  >
                    Register
                  </motion.span>
                </Link>
              </div>
            )}
          </div>
        </motion.nav>

        {/* ── Mobile dropdown menu ── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ width: navWidth, marginLeft: "auto", marginRight: "auto" }}
              className="md:hidden mt-2 flex flex-col bg-zinc-900/95 border border-zinc-800 rounded-2xl overflow-hidden"
            >
              {NAV_LINKS.map(({ label, href }) => (
                <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)}>
                  <motion.span
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.07)", color: "#fff" }}
                    className="block px-5 py-3 text-sm text-zinc-300 transition cursor-pointer"
                  >
                    {label}
                  </motion.span>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}