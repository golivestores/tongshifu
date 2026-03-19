"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";

/* ─── helpers ─── */
const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, val));

function splitWords(text: string) {
  return text.split(" ").map((word, i) => (
    <span key={`${word}-${i}`} className="inline-block overflow-hidden" style={{ marginRight: "0.3em" }}>
      <span className="anim-word inline-block">{word}</span>
    </span>
  ));
}

/* ─── component ─── */
export function Origin({ id }: { id: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const gradientOverlayRef = useRef<HTMLDivElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);
  const currentScale = useRef(1);
  const gridCellsRef = useRef<HTMLElement[] | null>(null);
  const desktopDescRef = useRef<HTMLParagraphElement>(null);     // x — desktop description
  const desktopCultureRef = useRef<HTMLParagraphElement>(null);  // b — desktop "Performance is Culture" (actually desktop bottom-left desc)
  const mobileTopTextRef = useRef<HTMLParagraphElement>(null);   // v — mobile "Performance is Culture"
  const desktopBottomRightRef = useRef<HTMLParagraphElement>(null); // w — desktop bottom-right "Performance is Culture"
  const hasAnimated = useRef(false);
  const [stickyHeight, setStickyHeight] = useState("100svh");

  const configRef = useRef({
    lerpFactor: 0.1,
    phase1End: 0.45,
    phase2End: 0.92,
    zoomSubtleFraction: 0.15,
  });
  const rawProgress = useRef(0);
  const smoothProgress = useRef(0);
  const rafId = useRef<number | null>(null);
  const zoomParams = useRef({
    baseScale: 1,
    targetScale: 3,
    originX: "50%",
    originY: "50%",
    centerOffsetY: 0,
  });

  /* ─── layout calculation ─── */
  const calculateLayout = useCallback(() => {
    if (!videoContainerRef.current || !gridWrapperRef.current || !stickyContainerRef.current) return;

    const videoRect = videoContainerRef.current.getBoundingClientRect();
    const wrapperRect = gridWrapperRef.current.getBoundingClientRect();
    const vv = window.visualViewport;
    const vw = vv?.width ?? window.innerWidth;
    const vh = vv?.height ?? window.innerHeight;
    const scale = currentScale.current || 1;
    const isMobile = vw < 768;

    setStickyHeight(`${vh}px`);

    configRef.current = isMobile
      ? { lerpFactor: 0.22, phase1End: 0.28, phase2End: 0.78, zoomSubtleFraction: 0.26 }
      : { lerpFactor: 0.1, phase1End: 0.45, phase2End: 0.92, zoomSubtleFraction: 0.15 };

    const realW = videoRect.width / scale;
    const realH = videoRect.height / scale;
    if (!realW || !realH) return;

    const targetScale = Math.max(vw / realW, vh / realH);
    const offsetX = (videoRect.left - wrapperRect.left) / scale;
    const offsetY = (videoRect.top - wrapperRect.top) / scale + realH / 2;

    zoomParams.current = {
      baseScale: isMobile ? 1.4 : 1,
      targetScale,
      originX: `${offsetX + realW / 2}px`,
      originY: `${offsetY}px`,
      centerOffsetY: offsetY - vh / 2,
    };
  }, []);

  /* ─── resize listeners ─── */
  useEffect(() => {
    calculateLayout();
    const t1 = setTimeout(calculateLayout, 100);
    const t2 = setTimeout(calculateLayout, 500);
    const vv = window.visualViewport;

    window.addEventListener("resize", calculateLayout);
    window.addEventListener("orientationchange", calculateLayout);
    vv?.addEventListener("resize", calculateLayout);
    vv?.addEventListener("scroll", calculateLayout);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", calculateLayout);
      window.removeEventListener("orientationchange", calculateLayout);
      vv?.removeEventListener("resize", calculateLayout);
      vv?.removeEventListener("scroll", calculateLayout);
    };
  }, [calculateLayout]);

  /* ─── ResizeObserver on video container ─── */
  useEffect(() => {
    if (!videoContainerRef.current) return;
    let pending = false;
    const ro = new ResizeObserver(() => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        calculateLayout();
      });
    });
    ro.observe(videoContainerRef.current);
    return () => ro.disconnect();
  }, [calculateLayout]);

  /* ─── scroll tracking ─── */
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.visualViewport?.height ?? window.innerHeight;
      const scrollable = rect.height - vh;
      const top = clamp(-rect.top, 0, scrollable);
      rawProgress.current = scrollable > 0 ? top / scrollable : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* ─── init GSAP word positions ─── */
  useEffect(() => {
    [mobileTopTextRef, desktopBottomRightRef, desktopDescRef, desktopCultureRef].forEach((ref) => {
      if (!ref.current) return;
      const words = ref.current.querySelectorAll(".anim-word");
      gsap.set(words, { y: "110%" });
    });
  }, []);

  /* ─── rAF animation loop ─── */
  useEffect(() => {
    const tick = () => {
      const target = rawProgress.current;
      const current = smoothProgress.current;
      const delta = target - current;

      if (Math.abs(delta) > 1e-4) {
        smoothProgress.current = current + delta * configRef.current.lerpFactor;
      } else {
        smoothProgress.current = target;
      }

      applyTransform(smoothProgress.current);
      rafId.current = requestAnimationFrame(tick);
    };

    const applyTransform = (progress: number) => {
      const { phase1End, phase2End, zoomSubtleFraction } = configRef.current;
      const { baseScale, targetScale, originX, originY, centerOffsetY } = zoomParams.current;

      // Smooth step for translateY (0→0.35 range)
      const smoothStep = clamp(progress / 0.35, 0, 1);
      const translateFactor = smoothStep * smoothStep * (3 - 2 * smoothStep);

      // Zoom fraction with two phases
      let zoomFraction: number;
      if (progress <= phase1End) {
        const t = progress / phase1End;
        zoomFraction = t * t * t * zoomSubtleFraction; // cubic ease-in
      } else {
        const t = clamp((progress - phase1End) / (phase2End - phase1End), 0, 1);
        zoomFraction = zoomSubtleFraction + (1 - zoomSubtleFraction) * (1 - Math.pow(1 - t, 3)); // ease-out cubic
      }

      const scale = baseScale + (targetScale - baseScale) * zoomFraction;
      const inverseFraction = 1 - zoomFraction;
      const overlayOpacity = clamp((progress - 0.7) / 0.15, 0, 1);

      currentScale.current = scale;

      // Transform grid wrapper
      const wrapper = gridWrapperRef.current;
      if (wrapper) {
        wrapper.style.transform = `translateY(${-centerOffsetY * translateFactor}px) scale(${scale})`;
        wrapper.style.transformOrigin = `${originX} ${originY}`;
      }

      // Shrink gap/padding/borderRadius
      const grid = gridRef.current;
      if (grid) {
        const gap = `${0.5 * inverseFraction}rem`;
        grid.style.gap = gap;
        grid.style.padding = gap;
        grid.style.top = gap;
        const rows = grid.children;
        for (let i = 0; i < rows.length; i++) {
          (rows[i] as HTMLElement).style.gap = gap;
        }
      }

      // Gradient overlay
      const gradient = gradientOverlayRef.current;
      if (gradient) {
        gradient.style.opacity = String(overlayOpacity);
      }

      // Text overlay
      const textOverlay = textOverlayRef.current;
      if (textOverlay) {
        textOverlay.style.opacity = String(overlayOpacity);
      }

      // GSAP word reveal at 70% threshold
      const rawOpacity = clamp((rawProgress.current - 0.7) / 0.15, 0, 1);

      if (rawOpacity > 0.05 && !hasAnimated.current) {
        hasAnimated.current = true;
        const animateWords = (el: HTMLElement | null, delay: number) => {
          if (!el) return;
          const words = el.querySelectorAll(".anim-word");
          if (words.length === 0) return;
          gsap.to(words, {
            y: "0%",
            duration: 0.5,
            ease: "expo.out",
            stagger: 0.03,
            delay,
          });
        };
        animateWords(mobileTopTextRef.current, 0);
        animateWords(desktopBottomRightRef.current, 0);
        animateWords(desktopDescRef.current, 0.15);
        animateWords(desktopCultureRef.current, 0.15);
      }

      if (rawOpacity === 0 && hasAnimated.current) {
        hasAnimated.current = false;
        const resetWords = (el: HTMLElement | null) => {
          if (!el) return;
          const words = el.querySelectorAll(".anim-word");
          gsap.set(words, { y: "110%" });
        };
        resetWords(mobileTopTextRef.current);
        resetWords(desktopBottomRightRef.current);
        resetWords(desktopDescRef.current);
        resetWords(desktopCultureRef.current);
      }

      // Border radius on grid cells
      if (!gridCellsRef.current && grid) {
        gridCellsRef.current = Array.from(grid.querySelectorAll(":scope > * > *")) as HTMLElement[];
      }
      if (gridCellsRef.current) {
        const radius = `${8 * (1 - zoomFraction)}px`;
        for (const cell of gridCellsRef.current) {
          cell.style.borderRadius = radius;
        }
      }
    };

    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  /* ─── JSX ─── */
  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative z-[40] h-[200vh] w-full lg:h-[280vh]"
    >
      <div
        ref={stickyContainerRef}
        className="sticky top-0 w-full overflow-hidden bg-black"
        style={{ height: stickyHeight }}
      >
        {/* Grid wrapper (scaled) */}
        <div
          ref={gridWrapperRef}
          className="absolute inset-0"
          style={{ willChange: "transform" }}
        >
          <div className="absolute inset-0 bg-black" />

          {/* 3-row grid */}
          <div ref={gridRef} className="absolute inset-x-0 flex flex-col">
            {/* Row 1: 2 images */}
            <div className="flex">
              <div className="relative flex-1 overflow-hidden rounded-lg aspect-[2/3] md:aspect-[981/551]">
                <img
                  src="/images/tongshifu/craft-sculpting.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover md:hidden"
                />
                <img
                  src="/images/tongshifu/craft-sculpting.jpg"
                  alt=""
                  className="absolute inset-0 hidden h-full w-full object-cover md:block"
                />
              </div>
              <div className="relative flex-1 overflow-hidden rounded-lg aspect-[2/3] md:aspect-[981/551]">
                <img
                  src="/images/tongshifu/craft-casting.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover md:hidden"
                />
                <img
                  src="/images/tongshifu/craft-casting.jpg"
                  alt=""
                  className="absolute inset-0 hidden h-full w-full object-cover md:block"
                />
              </div>
            </div>

            {/* Row 2: small | video(large) | small */}
            <div ref={row2Ref} className="flex">
              <div className="relative flex-1 overflow-hidden rounded-lg aspect-[2/3] md:aspect-[481/551]">
                <img
                  src="/images/tongshifu/craft-polishing.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="relative flex-[2] overflow-hidden rounded-lg aspect-[2/3] md:aspect-[981/551]">
                <div
                  ref={videoContainerRef}
                  className="relative h-full w-full"
                >
                  <img
                    src="/images/tongshifu/hero-bg.jpg"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="relative flex-1 overflow-hidden rounded-lg aspect-[2/3] md:aspect-[481/551]">
                <img
                  src="/images/tongshifu/craft-painting.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Row 3: 2 images */}
            <div className="flex">
              <div className="relative flex-1 overflow-hidden rounded-lg aspect-[2/3] md:aspect-[981/551]">
                <img
                  src="/images/tongshifu/craft-sculpting.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              </div>
              <div className="relative flex-1 overflow-hidden rounded-lg aspect-[2/3] md:aspect-[981/551]">
                <img
                  src="/images/tongshifu/craft-casting.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gradient overlay (desktop) */}
        <div
          ref={gradientOverlayRef}
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40"
          style={{ opacity: 0 }}
        />

        {/* Gradient overlay (mobile) */}
        <div
          className="pointer-events-none absolute inset-0 z-10 lg:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(14, 15, 17, 0.2) 0%, rgba(14, 15, 17, 0.2) 15.4%, rgba(14, 15, 17, 0.5) 40.2%, rgba(14, 15, 17, 0.8) 100%)",
          }}
        />

        {/* Text overlay */}
        <div
          ref={textOverlayRef}
          className="pointer-events-none absolute inset-0 z-20 text-white"
          style={{ opacity: 0 }}
        >
          {/* Mobile: "Performance is Culture" top */}
          <div className="absolute left-0 right-0 top-[7.5rem] text-center lg:hidden">
            <p
              ref={mobileTopTextRef}
              className="font-diatype-mono text-[12px] uppercase tracking-[-0.32px] text-white/60"
            >
              {splitWords("Craftsmanship is Heritage")}
            </p>
          </div>

          {/* Mobile: "BRONZE HERITAGE" + description bottom */}
          <div className="absolute bottom-[10rem] left-5 right-5 lg:hidden">
            <div className="flex flex-col gap-[40px]">
              <div className="flex items-baseline gap-2 text-[32px] uppercase leading-none">
                <span className="font-druk">BRONZE</span>
                <span className="font-druk-wide">HERITAGE</span>
              </div>
              <p
                ref={desktopDescRef}
                className="font-diatype text-[16px] leading-[1.2] text-white"
              >
                {splitWords(
                  "Tongshifu preserves 5,000 years of lost-wax bronze casting. From clay sculpting to final painting, every piece embodies the dedication of dozens of master artisans, forging ancient bronze heritage into tangible contemporary art."
                )}
              </p>
            </div>
          </div>

          {/* Desktop: bottom text area */}
          <div className="absolute bottom-[1.75rem] left-[1.25rem] right-[1.25rem] hidden lg:flex lg:flex-col lg:gap-[9rem]">
            <div className="flex items-center gap-2 text-[40px] uppercase leading-none sm:text-[48px] lg:text-[60px]">
              <span className="font-druk">BRONZE</span>
              <span className="font-druk-wide">HERITAGE</span>
            </div>
            <div className="flex items-end justify-between">
              <p
                ref={desktopCultureRef}
                className="max-w-[1100px] font-diatype text-[2rem] font-medium leading-none text-white"
              >
                {splitWords(
                  "Tongshifu preserves 5,000 years of lost-wax bronze casting. From clay sculpting to final painting, every piece embodies the dedication of dozens of master artisans, forging ancient bronze heritage into tangible contemporary art."
                )}
              </p>
              <p
                ref={desktopBottomRightRef}
                className="shrink-0 font-diatype-mono text-[12px] uppercase tracking-[-0.32px] text-white/60 sm:text-[14px] lg:text-[16px]"
              >
                {splitWords("Craftsmanship is Heritage")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
