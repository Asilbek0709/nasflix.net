"use client";

import { useState } from "react";

interface AvatarProps {
  avatar?: string | null;
  size?: number;
}

export const Avatar = ({ avatar, size = 40 }: AvatarProps) => {
  const [src, setSrc] = useState(avatar || "/default-user-profile.png");

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt="profile avatar"
      className="rounded-full object-cover cursor-pointer"
      onError={() => setSrc("/default-user-profile.png")}
    />
  );
};