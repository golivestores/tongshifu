"use client";

import { useRef, useState, useEffect } from "react";

/**
 * Full-screen grain/noise overlay — pixel-perfect match of original function s (module 87844).
 * Uses Canvas 2D to draw random grayscale noise at 12fps, opacity 0.04.
 */
export function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    /* Resize canvas to window */
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    /* Draw noise at ~12fps */
    let lastTime = 0;
    const interval = 1000 / 12;

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      if (time - lastTime < interval) return;
      lastTime = time;

      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.createImageData(w, h);
      const pixels = new Uint32Array(imageData.data.buffer);

      for (let i = 0; i < pixels.length; i++) {
        const v = (255 * Math.random()) | 0;
        pixels[i] = 0xff000000 | (v << 16) | (v << 8) | v;
      }

      ctx.putImageData(imageData, 0, 0);
    };

    raf = requestAnimationFrame(draw);

    /* Delay visibility by 400ms (matches original) */
    const timer = setTimeout(() => setVisible(true), 400);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] h-full w-full"
      style={{
        opacity: visible ? 0.04 : 0,
        transition: "opacity 0.2s cubic-bezier(0.445, 0.05, 0.55, 0.95)",
      }}
    />
  );
}
