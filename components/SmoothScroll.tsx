"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import gsap from "gsap";

/**
 * GSAP-driven Lenis tick — matches original function S.
 * Disables GSAP's lagSmoothing and drives Lenis via GSAP ticker.
 */
function GsapLenisTick() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    gsap.ticker.lagSmoothing(0);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, [lenis]);

  return null;
}

/**
 * LenisProvider — matches original function g (module 10764).
 * Options: infinite, syncTouch, lerp:0.14, autoRaf:false (GSAP driven).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        infinite: true,
        syncTouch: true,
        syncTouchLerp: 0.1,
        touchMultiplier: 1,
        lerp: 0.14,
        autoRaf: false,
        overscroll: true,
      }}
    >
      <GsapLenisTick />
      {children}
    </ReactLenis>
  );
}
