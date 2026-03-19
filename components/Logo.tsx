"use client";

interface LogoProps {
  className?: string;
  variant?: "gold" | "black";
  isDark?: boolean;
}

export function Logo({
  className = "",
  variant,
  isDark = true,
}: LogoProps) {
  const src = variant === "black"
    ? "/tongshifu/branding/tongshifu-logo-black.png"
    : variant === "gold"
    ? "/tongshifu/branding/tongshifu-logo-gold.png"
    : isDark
    ? "/tongshifu/branding/tongshifu-logo-gold.png"
    : "/tongshifu/branding/tongshifu-logo-black.png";

  return (
    <div
      className={`relative flex items-center overflow-hidden ${className}`}
      style={{ height: 40, maxWidth: 150 }}
    >
      <img
        src={src}
        alt="Tongshifu"
        style={{ height: 36, width: "auto", maxWidth: 150, objectFit: "contain" }}
      />
    </div>
  );
}
