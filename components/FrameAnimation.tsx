"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const TOTAL_FRAMES = 120;
const FRAME_PREFIX = "/tongshifu/frames/frame_";
const FRAME_EXT = ".png";

/**
 * FrameAnimation — scroll-driven 120-frame Monkey King rotation.
 * Replaces the 3D Bottle (R3F/Three.js) with a simple img-swap approach.
 *
 * Visible during: Hero → PowerPillars sections.
 * Frame index: mapped from scroll position (0–100% of active range → frame 1–120).
 */

interface FrameAnimationProps {
  onFramesLoaded?: () => void;
}

export default function FrameAnimation({ onFramesLoaded }: FrameAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const frameIndexRef = useRef(0);
  const [isVisible, setIsVisible] = useState(true);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedCountRef = useRef(0);

  // Preload all frames
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const num = String(i).padStart(3, "0");
      img.src = `${FRAME_PREFIX}${num}${FRAME_EXT}`;
      img.onload = () => {
        loaded++;
        loadedCountRef.current = loaded;
        // Signal loaded when 30% of frames are ready (fast initial display)
        if (loaded === Math.ceil(TOTAL_FRAMES * 0.3)) {
          onFramesLoaded?.();
        }
      };
      img.onerror = () => {
        loaded++;
        loadedCountRef.current = loaded;
      };
      images.push(img);
    }
    imagesRef.current = images;

    // Fallback: signal loaded after 3s even if images aren't done
    const fallback = setTimeout(() => {
      if (loadedCountRef.current < Math.ceil(TOTAL_FRAMES * 0.3)) {
        onFramesLoaded?.();
      }
    }, 3000);

    return () => clearTimeout(fallback);
  }, [onFramesLoaded]);

  // Scroll handler — map scroll to frame index
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // Active range: from hero start to end of power-pillars section
      const heroEl = document.getElementById("hero");
      const pillarsEl = document.getElementById("power-pillars-scroll");

      if (!heroEl) return;

      const activeStart = heroEl.offsetTop;
      const activeEnd = pillarsEl
        ? pillarsEl.offsetTop + pillarsEl.offsetHeight
        : heroEl.offsetTop + heroEl.offsetHeight;

      // Hide when outside active range
      if (scrollY + vh < activeStart || scrollY > activeEnd) {
        setIsVisible(false);
        return;
      }
      setIsVisible(true);

      // Map scroll position to frame index
      const scrollRange = activeEnd - activeStart - vh;
      const scrolled = Math.max(0, scrollY - activeStart);
      const progress = Math.min(1, scrolled / Math.max(1, scrollRange));
      const frameIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(progress * TOTAL_FRAMES)
      );

      if (frameIdx !== frameIndexRef.current && imgRef.current && imagesRef.current[frameIdx]) {
        frameIndexRef.current = frameIdx;
        imgRef.current.src = imagesRef.current[frameIdx].src;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial call
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[25] flex items-center justify-center"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      <img
        ref={imgRef}
        src={`${FRAME_PREFIX}001${FRAME_EXT}`}
        alt="Tongshifu Monkey King Bronze Sculpture"
        style={{ height: "42vh", width: "auto", maxWidth: "45vw", objectFit: "contain", filter: "drop-shadow(0 25px 25px rgba(0,0,0,0.5))" }}
      />
    </div>
  );
}
