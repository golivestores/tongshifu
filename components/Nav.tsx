"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Logo } from "./Logo";

/* ─── section colour mapping ─── */
interface SectionMeta {
  id: string;
  label: string;
  dark: boolean;
}

const SECTIONS: SectionMeta[] = [
  { id: "hero", label: "The Heritage", dark: true },
  { id: "power-pillars", label: "The Heritage", dark: true },
  { id: "power-pillars-scroll", label: "The Craft", dark: true },
  { id: "origin", label: "The Workshop", dark: false },
  { id: "join-drop", label: "Explore", dark: false },
];

interface NavProps {
  visible?: boolean;
}

export function Nav({ visible = true }: NavProps) {
  const [isDark, setIsDark] = useState(true);
  const [scrollPct, setScrollPct] = useState(0);
  const [sectionLabel, setSectionLabel] = useState("The Heritage");
  const [ctaHover, setCtaHover] = useState(false);
  const [mobileCTAHover, setMobileCTAHover] = useState(false);
  const [labelKey, setLabelKey] = useState(0);

  /* scroll progress */
  useEffect(() => {
    const update = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollPct(Math.min(Math.max(window.scrollY / docHeight, 0), 1));
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  /* IntersectionObserver for section tracking */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            const meta = SECTIONS.find((s) => s.id === entry.target.id);
            if (meta) {
              setIsDark(meta.dark);
              if (meta.label !== sectionLabel) {
                setSectionLabel(meta.label);
                setLabelKey((k) => k + 1);
              }
            }
          }
        });
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: "-5% 0px -90% 0px",
      }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sectionLabel]);

  /* ─── derived styles ─── */
  const clipRight = Math.max(0, 100 - 100 * scrollPct);
  const progressBg = isDark ? "rgba(255,255,255,0.35)" : "rgba(200,149,108,0.3)";
  const progressFill = isDark ? "rgba(255,255,255,0.85)" : "rgba(200,149,108,0.85)";
  const textColor = isDark ? "text-white" : "text-[#0A0A0A]";
  const btnBg = isDark
    ? "bg-white text-[#0A0A0A]"
    : "bg-[#0A0A0A] text-white";

  return (
    <header
      className={`pointer-events-none fixed top-0 left-0 right-0 w-full z-50 transition-colors duration-300 ${textColor}`}
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? undefined : "none",
        transition: "opacity 0.4s ease",
      }}
    >
      {/* ─── Progress bar ─── */}
      <div className="absolute left-[20px] right-[20px] top-[12px]">
        <div className="relative h-4 w-full">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(to right, ${progressBg} 0, ${progressBg} 2px, transparent 2px, transparent 8px)`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              clipPath: `inset(0 ${clipRight}% 0 0)`,
              backgroundImage: `repeating-linear-gradient(to right, ${progressFill} 0, ${progressFill} 2px, transparent 2px, transparent 8px)`,
            }}
          />
        </div>
      </div>

      {/* ─── Desktop Logo (top-left) ─── */}
      <div className="absolute left-[20px] top-[49px] hidden lg:block">
        <a href="/#hero" className="pointer-events-auto block">
          <Logo isDark={isDark} />
        </a>
      </div>

      {/* ─── Desktop centre title (铜师傅 | Section Label) ─── */}
      <div className="absolute left-1/2 top-12 -translate-x-1/2 hidden lg:block">
        <div className="relative h-[97px] w-[336px]">
          {/* Section label (bottom) */}
          <p
            className={`absolute left-1/2 top-[62.87px] -translate-x-1/2 font-diatype-mono text-[14px] uppercase leading-[1.2] tracking-[-0.28px] transition-colors duration-300 whitespace-nowrap ${
              isDark ? "text-white" : "text-[#C8956C]"
            }`}
          >
            {sectionLabel}
          </p>

          {/* Brand name (top) */}
          <a
            href="/#hero"
            className="pointer-events-auto absolute left-1/2 top-0 -translate-x-1/2"
          >
            <span
              className={`font-druk text-[28px] uppercase leading-[normal] tracking-[0.08em] transition-colors duration-300 ${
                isDark ? "text-white" : "text-[#C8956C]"
              }`}
            >
              TONGSHIFU
            </span>
          </a>

          {/* Divider (middle) */}
          <div className="absolute left-1/2 top-[39px] h-[16px] w-[336px] -translate-x-1/2">
            <div
              className="absolute left-0 top-1/2 h-[1px] w-full -translate-y-1/2 transition-colors duration-300"
              style={{
                backgroundImage: `repeating-linear-gradient(to right, ${isDark ? "rgba(255,255,255,0.3)" : "rgba(200,149,108,0.4)"} 0, ${isDark ? "rgba(255,255,255,0.3)" : "rgba(200,149,108,0.4)"} 2px, transparent 2px, transparent 8px)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* ─── Mobile Logo + social placeholder ─── */}
      <div className="pointer-events-none fixed left-[20px] right-[20px] top-[49px] z-50 flex items-center justify-between lg:hidden">
        {/* Left spacer */}
        <div />

        {/* Mobile Logo (center) */}
        <a
          href="/#hero"
          className="pointer-events-auto absolute left-1/2 -translate-x-1/2"
        >
          <Logo isDark={isDark} />
        </a>

        {/* Right spacer */}
        <div />
      </div>

      {/* ─── Desktop CTA (top-right) ─── */}
      <div className="fixed right-[20px] top-[48px] hidden lg:block">
        <button
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={() => setCtaHover(false)}
          className={`pointer-events-auto group relative h-[58px] w-[150px] rounded-[4px] font-diatype-mono text-[14px] uppercase tracking-[-0.42px] transition-[background-color,color] duration-300 ease-out ${btnBg}`}
        >
          <span className="absolute inset-0 flex items-center justify-center gap-[6px]">
            <span>EXPLORE</span>
            <span
              aria-hidden="true"
              className={`inline-flex h-[1.16em] w-[1em] items-center justify-center will-change-transform ${
                isDark ? "text-[#0A0A0A]" : "text-white"
              }`}
              style={{
                transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                transform: ctaHover ? "rotate(-45deg)" : "rotate(0deg)",
              }}
            >
              →
            </span>
          </span>
        </button>
      </div>

      {/* ─── Mobile CTA (bottom floating) ─── */}
      <div
        className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 lg:hidden transition-opacity duration-300 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        <button
          onMouseEnter={() => setMobileCTAHover(true)}
          onMouseLeave={() => setMobileCTAHover(false)}
          className={`pointer-events-auto group flex h-[3.625rem] items-center justify-center gap-[0.375rem] rounded-[0.25rem] !px-[0.875rem] font-diatype-mono text-[0.875rem] uppercase tracking-[-0.02625rem] shadow-lg transition-[background-color,color] duration-300 ease-out ${btnBg}`}
        >
          <span>EXPLORE</span>
          <span
            aria-hidden="true"
            className="inline-flex h-[1.16em] w-[1em] items-center justify-center will-change-transform"
            style={{
              transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              transform: mobileCTAHover ? "rotate(-45deg)" : "rotate(0deg)",
            }}
          >
            →
          </span>
        </button>
      </div>
    </header>
  );
}
