"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Button } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import React from "react";

type ButtonSize = "sm" | "md" | "lg";

interface RedButtonProps {
  label: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  size?: ButtonSize;
  sx?: SxProps<Theme>;
  variants?: Variants;
  className?: string;
}

export default function RedButton({
  label,
  href,
  onClick,
  size = "md",
  sx = {},
  variants,
  className = "",
}: RedButtonProps) {
  const sizeMap: Record<ButtonSize, any> = {
    sm: { px: "14px", py: "6px", fontSize: "0.78rem", borderRadius: "8px" },
    md: { px: "20px", py: "8.5px", fontSize: "0.82rem", borderRadius: "10px" },
    lg: { px: "32px", py: "14px", fontSize: "1rem", borderRadius: "14px" },
  };

  const s = sizeMap[size] || sizeMap.md;

  const btn = (
    <motion.div
      whileHover={{ scale: 1.06, y: -1 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className={className}
    >
      <Button
        variant="contained"
        disableElevation
        onClick={onClick}
        sx={{
          background: "linear-gradient(135deg,#e50914,#b81010)",
          color: "#fff",
          fontFamily: "'Outfit','Nunito',sans-serif",
          fontWeight: 700,
          textTransform: "none",
          letterSpacing: "0.03em",
          whiteSpace: "nowrap",
          boxShadow: "0 0 22px rgba(229,9,20,0.4)",
          border: "1px solid rgba(255,255,255,0.09)",
          "&:hover": {
            background: "linear-gradient(135deg,#ff2030,#cc1010)",
            boxShadow: "0 0 36px rgba(229,9,20,0.65)",
          },
          ...s,
          ...sx,
        }}
      >
        {label}
      </Button>
    </motion.div>
  );

  const wrapped = href ? (
    <Link href={href} className="no-underline">
      {btn}
    </Link>
  ) : (
    btn
  );

  if (variants) {
    return <motion.div variants={variants}>{wrapped}</motion.div>;
  }

  return wrapped;
}