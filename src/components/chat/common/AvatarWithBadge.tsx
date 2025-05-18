import React from "react";

interface AvatarWithBadgeProps {
  src: string;
  alt?: string;
  size?: number; // px, default 48
  unreadCount?: number;
  className?: string;
}

const AvatarWithBadge: React.FC<AvatarWithBadgeProps> = ({
  src,
  alt = "avatar",
  size = 48,
  unreadCount = 0,
  className = "",
}) => (
  <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
    <img
      src={src}
      alt={alt}
      className="rounded-full border object-cover"
      style={{ width: size, height: size }}
    />
    {unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow min-w-[20px] text-center">
        {unreadCount}
      </span>
    )}
  </div>
);

export default AvatarWithBadge;
