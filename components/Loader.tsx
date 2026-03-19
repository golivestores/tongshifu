"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";

const COUNTER_STOPS = [
  { value: 0, at: 0 },
  { value: 12, at: 0.12 },
  { value: 34, at: 0.34 },
  { value: 75, at: 0.75 },
  { value: 87, at: 0.87 },
];

interface LoaderProps {
  isModelLoaded: boolean;
  onExitStart?: () => void;
  onComplete?: () => void;
}

export function Loader({ isModelLoaded, onExitStart, onComplete }: LoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const brandNameRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const bottomTitleRef = useRef<HTMLParagraphElement>(null);
  const bottomDescRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const tensRef = useRef<HTMLDivElement>(null);
  const onesRef = useRef<HTMLDivElement>(null);
  const loadingTextRef = useRef<HTMLParagraphElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const isMobileRef = useRef(false);
  const [counterValue, setCounterValue] = useState(0);
  const [isMinTimeElapsed, setIsMinTimeElapsed] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const progressValueRef = useRef(0);
  const currentCounterRef = useRef(0);
  const prevTens = useRef(-1);
  const prevOnes = useRef(-1);
  const pulseTweenRef = useRef<gsap.core.Tween | null>(null);
  const progressTweenRef = useRef<gsap.core.Tween | null>(null);

  // Detect mobile
  useEffect(() => {
    const mobile = window.innerWidth < 1024;
    isMobileRef.current = mobile;
    setIsMobile(mobile);
  }, []);

  // Entrance animation timeline
  useEffect(() => {
    const isDesktop = !isMobileRef.current;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    const elements = [
      progressBarRef.current,
      logoRef.current,
      brandNameRef.current,
      dividerRef.current,
      subtitleRef.current,
      bottomTitleRef.current,
      bottomDescRef.current,
      loadingTextRef.current,
    ].filter(Boolean);

    gsap.set(elements, { opacity: 0 });

    if (isDesktop) {
      if (loadingTextRef.current) gsap.set(loadingTextRef.current, { yPercent: -50 });
    } else {
      if (counterRef.current) gsap.set(counterRef.current, { xPercent: -50 });
      if (loadingTextRef.current) gsap.set(loadingTextRef.current, { xPercent: -50 });
    }

    // 1. Progress bar
    tl.to(progressBarRef.current, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0);

    // 2. Logo image
    tl.fromTo(logoRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      0.3
    );

    // 3. Brand name
    tl.fromTo(brandNameRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" },
      0.6
    );

    // 4. Divider scales in
    if (dividerRef.current) {
      gsap.set(dividerRef.current, { scaleX: 0 });
      tl.fromTo(dividerRef.current,
        { opacity: 0, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 0.4, ease: "power2.out" },
        0.9
      );
    }

    // 5. Subtitle
    tl.fromTo(subtitleRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" },
      1.15
    );

    // 6. Bottom title
    tl.fromTo(bottomTitleRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.4, ease: "expo.out" },
      1.45
    );

    // 7. Bottom description
    tl.fromTo(bottomDescRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, ease: "expo.out" },
      1.7
    );

    // 8. Loading text + counter
    if (isDesktop) {
      tl.fromTo(loadingTextRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" },
        2.0
      );
    } else {
      tl.fromTo(loadingTextRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.5, ease: "expo.out" },
        2.0
      );
    }

    return () => { tl.kill(); };
  }, []);

  // Pulsing animation on loading text after 1.3s
  useEffect(() => {
    const delay = gsap.delayedCall(1.3, () => {
      if (loadingTextRef.current) {
        pulseTweenRef.current = gsap.to(loadingTextRef.current, {
          opacity: 0.35,
          duration: 1.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    });
    return () => {
      delay.kill();
      pulseTweenRef.current?.kill();
    };
  }, []);

  // Progress bar animation (0 → 87% over 2.8s)
  useEffect(() => {
    const obj = { value: 0 };
    progressValueRef.current = 0;

    progressTweenRef.current = gsap.to(obj, {
      value: 0.87,
      duration: 2.8,
      ease: "power1.out",
      onUpdate: () => {
        progressValueRef.current = obj.value;
        if (progressFillRef.current) {
          const pct = Math.max(0, 100 - obj.value * 100);
          progressFillRef.current.style.clipPath = `inset(0 ${pct}% 0 0)`;
        }
        let val = 0;
        for (const stop of COUNTER_STOPS) {
          if (obj.value >= stop.at) val = stop.value;
        }
        if (val !== currentCounterRef.current) {
          currentCounterRef.current = val;
          setCounterValue(val);
        }
      },
    });

    return () => { progressTweenRef.current?.kill(); };
  }, []);

  // Animate digit columns when counter changes
  useEffect(() => {
    const tens = Math.floor(counterValue / 10) % 10;
    const ones = counterValue % 10;

    if (prevTens.current === -1) {
      prevTens.current = tens;
      prevOnes.current = ones;
      return;
    }

    if (tens !== prevTens.current && tensRef.current) {
      gsap.to(tensRef.current, {
        yPercent: -(tens * 10),
        duration: 0.6,
        ease: "power2.out",
        overwrite: true,
      });
    }
    if (ones !== prevOnes.current && onesRef.current) {
      gsap.to(onesRef.current, {
        yPercent: -(ones * 10),
        duration: 0.6,
        ease: "power2.out",
        overwrite: true,
      });
    }
    prevTens.current = tens;
    prevOnes.current = ones;
  }, [counterValue]);

  // Timers
  useEffect(() => {
    const t1 = setTimeout(() => setIsMinTimeElapsed(true), 2800);
    const t2 = setTimeout(() => setIsTimedOut(true), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Exit logic
  const runExit = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);

    pulseTweenRef.current?.kill();
    if (loadingTextRef.current) gsap.set(loadingTextRef.current, { opacity: 1 });

    setCounterValue(99);

    progressTweenRef.current?.kill();
    const obj = { value: progressValueRef.current };
    gsap.to(obj, {
      value: 1,
      duration: 0.35,
      ease: "power2.inOut",
      onUpdate: () => {
        if (progressFillRef.current) {
          const pct = Math.max(0, 100 - obj.value * 100);
          progressFillRef.current.style.clipPath = `inset(0 ${pct}% 0 0)`;
        }
      },
      onComplete: () => {
        gsap.delayedCall(0.2, () => {
          const exitTL = gsap.timeline({ onComplete: () => onComplete?.() });

          exitTL.to(progressBarRef.current, { opacity: 0, y: -15, duration: 0.35, ease: "power2.in" }, 0);
          exitTL.to(counterRef.current, { opacity: 0, y: -50, duration: 0.5, ease: "power3.in" }, 0);

          const centerEls = [logoRef.current, brandNameRef.current, dividerRef.current, subtitleRef.current].filter(Boolean);
          exitTL.to(centerEls, { opacity: 0, y: -50, stagger: 0.03, duration: 0.55, ease: "power3.in" }, 0.05);

          const bottomEls = [bottomTitleRef.current, bottomDescRef.current, loadingTextRef.current].filter(Boolean);
          exitTL.to(bottomEls, { opacity: 0, y: -35, stagger: 0.025, duration: 0.5, ease: "power3.in" }, 0.08);

          exitTL.call(() => onExitStart?.(), undefined, 0.35);

          exitTL.to(containerRef.current, {
            yPercent: -100,
            duration: 1.1,
            ease: "power3.inOut",
          }, 0.4);
        });
      },
    });
  }, [isExiting, onExitStart, onComplete]);

  // Trigger exit when conditions met
  useEffect(() => {
    if ((isModelLoaded || isTimedOut) && isMinTimeElapsed && !isExiting) {
      runExit();
    }
  }, [isModelLoaded, isTimedOut, isMinTimeElapsed, isExiting, runExit]);

  const w = isMobile;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[60] bg-[#0A0A0A]"
      style={{ overflow: "hidden" }}
    >
      {/* Top: Progress bar */}
      <div
        ref={progressBarRef}
        style={{
          position: "absolute",
          top: w ? 12 : 28,
          left: w ? 16 : 20,
          right: w ? 16 : 20,
          opacity: 0,
        }}
      >
        <div style={{ position: "relative", height: w ? 12 : 16, width: "100%" }}>
          {/* Background ticks */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(to right, rgba(200,149,108,0.25) 0, rgba(200,149,108,0.25) 2px, transparent 2px, transparent 5px)",
            }}
          />
          {/* Fill ticks */}
          <div
            ref={progressFillRef}
            style={{
              position: "absolute",
              inset: 0,
              clipPath: "inset(0 100% 0 0)",
              backgroundImage:
                "repeating-linear-gradient(to right, #C8956C 0, #C8956C 2px, transparent 2px, transparent 5px)",
            }}
          />
        </div>
      </div>

      {/* Center: Brand lockup */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <div className="flex flex-col items-center">
          {/* Logo image (貔貅) */}
          <div
            ref={logoRef}
            style={{ opacity: 0 }}
          >
            <img
              src="/tongshifu/branding/tongshifu-logo-gold.png"
              alt="Tongshifu"
              style={{
                height: w ? 40 : 60,
                width: w ? 140 : 200,
                objectFit: "contain",
              }}
            />
          </div>

          {/* Brand name */}
          <div
            ref={brandNameRef}
            className="flex items-baseline"
            style={{ opacity: 0, marginTop: w ? 16 : 24 }}
          >
            <span
              className="font-druk font-[800] uppercase leading-normal text-[#C8956C]"
              style={{ fontSize: w ? "1.4rem" : "31.7px", letterSpacing: "0.1em" }}
            >
              TONGSHIFU
            </span>
          </div>

          {/* Tick divider */}
          <div
            ref={dividerRef}
            style={{
              width: w ? 232 : 327,
              height: w ? 11 : 9,
              opacity: 0,
              marginTop: w ? 18 : 26,
              backgroundImage:
                "repeating-linear-gradient(to right, rgba(200, 149, 108, 0.5) 0, rgba(200, 149, 108, 0.5) 2px, transparent 2px, transparent 5px)",
              transformOrigin: "center",
            }}
          />

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-center font-diatype-mono uppercase leading-[0.9] text-[#C8956C]"
            style={{
              opacity: 0,
              marginTop: w ? 22 : 31,
              fontSize: w ? 11.56 : 16.74,
              letterSpacing: w ? 0.12 : 0.17,
            }}
          >
            BRONZE CRAFTSMANSHIP
            <br />
            SINCE 5000 YEARS
          </p>
        </div>
      </div>

      {/* Bottom-left: Brand tagline */}
      <div style={{ position: "absolute", left: w ? 16 : 20, top: w ? "65.9%" : "47.5%" }}>
        <p
          ref={bottomTitleRef}
          className="mt-1 font-diatype font-normal leading-[0.92] tracking-[-0.02em] text-[#F5E6D3]"
          style={{ opacity: 0, fontSize: w ? 14 : "1rem" }}
        >
          Ancient bronze craft
          <br />
          Timeless heritage
        </p>
      </div>

      {/* Bottom-left: Description */}
      <div
        style={
          w
            ? { position: "absolute", left: 16, bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }
            : { position: "absolute", left: 20, bottom: 20 }
        }
      >
        <p
          ref={bottomDescRef}
          className="font-diatype font-normal leading-[0.92] tracking-[-0.02em] text-[#F5E6D3]/60"
          style={{ maxWidth: w ? 260 : 305, opacity: 0, fontSize: w ? 14 : "1rem" }}
        >
          Lost-wax bronze casting refined into contemporary art, preserving 5,000 years of heritage.
        </p>
      </div>

      {/* Bottom-right: Rolling counter */}
      <div
        ref={counterRef}
        className="pointer-events-none select-none"
        style={
          w
            ? {
                position: "absolute",
                top: 30,
                left: "50%",
                display: "flex",
                alignItems: "flex-end",
                overflow: "hidden",
                height: 100,
              }
            : {
                position: "absolute",
                right: 20,
                bottom: 0,
                display: "flex",
                overflow: "hidden",
                height: "clamp(6.5rem, 10vw, 9.5rem)",
              }
        }
      >
        {/* Tens digit */}
        <div
          style={{
            display: "inline-block",
            overflow: "hidden",
            width: "1ch",
            height: "0.85em",
            textAlign: "center",
            color: "#F5E6D3",
            opacity: 0.06,
            fontSize: w ? 116 : "clamp(8rem, 12vw, 11.25rem)",
            fontWeight: 800,
            lineHeight: 0.85,
            fontFamily: "var(--font-druk-wide)",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
          }}
        >
          <div ref={tensRef} style={{ willChange: "transform" }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
              <div key={d} style={{ height: "0.85em" }}>
                {d}
              </div>
            ))}
          </div>
        </div>
        {/* Ones digit */}
        <div
          style={{
            display: "inline-block",
            overflow: "hidden",
            width: "1ch",
            height: "0.85em",
            textAlign: "center",
            color: "#F5E6D3",
            opacity: 0.06,
            fontSize: w ? 116 : "clamp(8rem, 12vw, 11.25rem)",
            fontWeight: 800,
            lineHeight: 0.85,
            fontFamily: "var(--font-druk-wide)",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
          }}
        >
          <div ref={onesRef} style={{ willChange: "transform" }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
              <div key={d} style={{ height: "0.85em" }}>
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading text */}
      <p
        ref={loadingTextRef}
        className="font-diatype-mono uppercase text-[#C8956C]"
        style={
          w
            ? {
                position: "absolute",
                top: 146,
                left: "50%",
                textAlign: "center",
                fontSize: 12,
                lineHeight: 1.16,
                letterSpacing: -0.36,
                opacity: 0,
              }
            : {
                position: "absolute",
                right: 20,
                top: "49.5%",
                textAlign: "right",
                fontSize: 14,
                lineHeight: 1.16,
                letterSpacing: -0.42,
                opacity: 0,
              }
        }
      >
        LOADING TONGSHIFU
      </p>
    </div>
  );
}
