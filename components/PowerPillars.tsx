"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

/* ─── helpers (exact from original) ─── */
const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, val));
const easeOutQuint = (x: number) => 1 - Math.pow(1 - x, 5);

/* split text into animated lines */
function splitLines(text: string) {
  return text.split("\n").map((line, i) => (
    <span key={`${line}-${i}`} className="block overflow-hidden">
      <span className="anim-line block">{line}</span>
    </span>
  ));
}

/* split text into animated words */
function splitWords(text: string) {
  return text.split(" ").map((word, i) => (
    <span key={`${word}-${i}`} className="inline-block overflow-hidden mr-[0.3em]">
      <span className="anim-word inline-block">{word}</span>
    </span>
  ));
}

/* ─── 铜师傅四大工艺环节 ─── */
const CARDS = [
  {
    id: "01",
    label: "SCULPTING",
    title: ["SCULPT", "FORM"],
    description:
      "Beginning with clay, master artisans channel decades of expertise to capture the spirit and grandeur of mythical figures — every stroke a tribute to tradition.",
    tagline: "CLAY SCULPTING & MODELING\nTHE FOUNDATION OF BRONZE ART",
    background: "/tongshifu/images/tongshifu/craft-sculpting.jpg",
  },
  {
    id: "02",
    label: "LOST-WAX",
    title: ["LOST", "WAX"],
    description:
      "Following the ancient lost-wax method through dozens of steps — molding, shell-building, firing, and pouring — wax transforms into bronze, forged eternal by fire and metal.",
    tagline: "LOST-WAX CASTING PROCESS\nANCIENT TECHNIQUE, TIMELESS CRAFT",
    background: "/tongshifu/images/tongshifu/craft-casting.jpg",
  },
  {
    id: "03",
    label: "POLISHING",
    title: ["REFINE", "POLISH"],
    description:
      "After casting, artisans hand-finish every detail — removing burrs, smoothing seams, refining textures — until the surface gleams like a mirror, warm to the touch.",
    tagline: "HAND FINISHING & POLISHING\nPERFECTION IN EVERY DETAIL",
    background: "/tongshifu/images/tongshifu/craft-polishing.jpg",
  },
  {
    id: "04",
    label: "PAINTING",
    title: ["COLOR", "PAINT"],
    description:
      "Mineral pigments and specialized techniques breathe life into bronze — layer upon layer of color transforms cold metal into warm, magnificent art.",
    tagline: "MINERAL PIGMENT PAINTING\nBRINGING BRONZE TO LIFE",
    background: "/tongshifu/images/tongshifu/craft-painting.jpg",
  },
];

/* ─── PowerPillars — 匠心工艺 ─── */
interface PowerPillarsProps {
  id: string;
}

export function PowerPillars({ id }: PowerPillarsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollTabsRef = useRef<HTMLDivElement>(null);
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const leftTitleRef = useRef<HTMLDivElement>(null);
  const rightBlockRef = useRef<HTMLDivElement>(null);
  const mobileDescRef = useRef<HTMLParagraphElement>(null);
  const desktopDescRef = useRef<HTMLParagraphElement>(null);
  const mobileTaglineRef = useRef<HTMLParagraphElement>(null);
  const desktopTaglineRef = useRef<HTMLDivElement>(null);
  const hasEnteredRef = useRef(false);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [enterProgress, setEnterProgress] = useState(0);
  const prevCardRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const animCallRef = useRef<gsap.core.Tween | null>(null);
  const prevCardIndexRef = useRef(0);
  const justSwappedRef = useRef(false);

  /* scroll tracking */
  useEffect(() => {
    let raf: number | null = null;
    const update = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      setEnterProgress(clamp((vh - rect.top) / vh, 0, 1));
      const scrollable = rect.height - vh;
      const scrolled = clamp(-rect.top, 0, scrollable);
      setScrollProgress(scrollable > 0 ? scrolled / scrollable : 0);
    };
    const onScroll = () => {
      if (raf === null) {
        raf = window.requestAnimationFrame(() => {
          raf = null;
          update();
        });
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf !== null) window.cancelAnimationFrame(raf);
    };
  }, []);

  /* media query */
  useEffect(() => {
    const check = () =>
      setIsMobile(window.matchMedia("(max-width: 1023px)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ─── derived values ─── */
  const zoomEased = enterProgress >= 1 ? 1 : 1 - Math.pow(2, -10 * enterProgress);
  const cardProgress = clamp((scrollProgress - 0.3) / 0.7, 0, 1);
  const rawIndex =
    (cardProgress <= 0.1
      ? (cardProgress / 0.1) * 0.25
      : 0.25 + ((cardProgress - 0.1) / 0.9) * 0.75) * CARDS.length;
  const activeCard = Math.min(CARDS.length - 1, Math.floor(rawIndex));

  /* cross-fade between cards */
  const rawBlend = clamp((rawIndex - activeCard - 0.65) / 0.35, 0, 1);
  const blendEased =
    rawBlend < 0.5
      ? 4 * rawBlend * rawBlend * rawBlend
      : 1 - Math.pow(-2 * rawBlend + 2, 3) / 2;

  function getCardOpacity(index: number) {
    const last = CARDS.length - 1;
    if (activeCard === last) return +(index === last);
    if (index === activeCard) return 1 - blendEased;
    if (index === activeCard + 1) return blendEased;
    return 0;
  }

  /* card change animation (GSAP text swap) */
  useEffect(() => {
    if (prevCardRef.current === activeCard) return;
    prevCardRef.current = activeCard;
    window.dispatchEvent(
      new CustomEvent("som:pillar-change", { detail: { index: activeCard } })
    );

    if (!hasEnteredRef.current) {
      setDisplayIndex(activeCard);
      prevCardIndexRef.current = activeCard;
      return;
    }

    if (animCallRef.current) {
      animCallRef.current.kill();
      animCallRef.current = null;
    }

    /* animate out existing text */
    const targets = [
      { el: desktopDescRef.current, delay: 0 },
      { el: mobileDescRef.current, delay: 0 },
      { el: mobileTaglineRef.current, delay: 0 },
      { el: desktopTaglineRef.current, delay: 0.06 },
    ];
    let maxDuration = 0;
    targets.forEach(({ el, delay }) => {
      if (!el) return;
      const words = el.querySelectorAll(".anim-word, .anim-line");
      if (words.length === 0) return;
      gsap.killTweensOf(words);
      const dur = delay + 0.25 + 0.015 * Math.max(0, words.length - 1);
      if (dur > maxDuration) maxDuration = dur;
      gsap.to(words, {
        y: "-110%",
        duration: 0.25,
        ease: "power2.in",
        stagger: 0.015,
        delay,
      });
    });

    /* animate left title */
    if (leftTitleRef.current) {
      const lines = leftTitleRef.current.querySelectorAll(".left-title-line");
      if (lines.length > 0) {
        gsap.killTweensOf(lines);
        gsap.fromTo(
          lines,
          { opacity: 0, y: 14, filter: "blur(4px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.55,
            ease: "power2.out",
            stagger: 0.07,
          }
        );
      }
    }

    animCallRef.current = gsap.delayedCall(maxDuration, () => {
      animCallRef.current = null;
      justSwappedRef.current = true;
      setDisplayIndex(activeCard);
    });
    prevCardIndexRef.current = activeCard;
  }, [activeCard]);

  /* animate in new text after swap */
  useEffect(() => {
    if (!justSwappedRef.current) return;
    justSwappedRef.current = false;
    requestAnimationFrame(() => {
      const animateIn = (el: HTMLElement | null) => {
        if (!el) return;
        const words = el.querySelectorAll(".anim-word, .anim-line");
        if (words.length === 0) return;
        gsap.set(words, { y: "110%" });
        gsap.to(words, {
          y: "0%",
          duration: 0.5,
          ease: "expo.out",
          stagger: 0.03,
        });
      };
      animateIn(desktopDescRef.current);
      animateIn(mobileDescRef.current);
      animateIn(mobileTaglineRef.current);
      animateIn(desktopTaglineRef.current);
    });
  }, [displayIndex]);

  /* enter / exit animations */
  const isVisible = enterProgress >= 1;
  useEffect(() => {
    const wasVisible = hasEnteredRef.current;
    if (isVisible && !wasVisible) {
      hasEnteredRef.current = true;
      gsap.killTweensOf(
        [
          tabContainerRef.current?.querySelectorAll("button"),
          leftTitleRef.current,
          rightBlockRef.current,
          desktopTaglineRef.current,
        ].filter(Boolean)
      );
      const tl = gsap.timeline();
      if (tabContainerRef.current) {
        const buttons = tabContainerRef.current.querySelectorAll("button");
        gsap.set(buttons, { opacity: 0, y: 20, scale: 1, filter: "blur(8px)" });
        tl.to(buttons, {
          opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
          duration: 0.7, ease: "power2.out",
          stagger: { each: 0.06, ease: "power2.in" },
        }, 0.1);
      }
      if (leftTitleRef.current) {
        gsap.set(leftTitleRef.current, { opacity: 0, y: 30, scale: 1, filter: "blur(6px)" });
        tl.to(leftTitleRef.current, {
          opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
          duration: 0.9, ease: "power3.out",
        }, 0.25);
      }
      if (rightBlockRef.current) {
        gsap.set(rightBlockRef.current, { opacity: 0, y: 25, scale: 1, filter: "blur(4px)" });
        tl.to(rightBlockRef.current, {
          opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
          duration: 0.8, ease: "power2.out",
        }, 0.4);
      }
      if (desktopTaglineRef.current) {
        gsap.set(desktopTaglineRef.current, { opacity: 0, y: 15, scale: 1, filter: "blur(0px)" });
        tl.to(desktopTaglineRef.current, {
          opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
          duration: 0.7, ease: "power2.out",
        }, 0.55);
      }
    }
    if (!isVisible && wasVisible) {
      hasEnteredRef.current = false;
      gsap.killTweensOf(
        [
          tabContainerRef.current?.querySelectorAll("button"),
          leftTitleRef.current,
          rightBlockRef.current,
          desktopTaglineRef.current,
        ].filter(Boolean)
      );
      const tl = gsap.timeline();
      if (tabContainerRef.current) {
        const buttons = tabContainerRef.current.querySelectorAll("button");
        tl.to(buttons, {
          opacity: 0, scale: 0.92, filter: "blur(10px)",
          duration: 0.35, ease: "power2.out",
          stagger: { each: 0.015, from: "center" },
        }, 0);
      }
      if (leftTitleRef.current)
        tl.to(leftTitleRef.current, {
          opacity: 0, scale: 0.96, y: -6, filter: "blur(8px)",
          duration: 0.3, ease: "power2.out",
        }, 0);
      if (rightBlockRef.current)
        tl.to(rightBlockRef.current, {
          opacity: 0, scale: 0.96, y: -6, filter: "blur(8px)",
          duration: 0.3, ease: "power2.out",
        }, 0);
      if (desktopTaglineRef.current)
        tl.to(desktopTaglineRef.current, {
          opacity: 0, scale: 0.92, filter: "blur(6px)",
          duration: 0.28, ease: "power2.out",
        }, 0);
    }
  }, [isVisible]);

  const contentStyle = {
    opacity: +(enterProgress >= 1),
    transition: enterProgress < 1 ? "opacity 0.4s ease-out" : "none",
  };

  /* mobile scroll tabs sync */
  useEffect(() => {
    if (!isMobile || !scrollTabsRef.current) return;
    const el = scrollTabsRef.current;
    const scrollLeft = (el.scrollWidth - el.clientWidth) * cardProgress;
    el.scrollTo({ left: scrollLeft, behavior: "auto" });
  }, [isMobile, cardProgress]);

  /* click → scroll to card */
  const scrollToCard = (index: number) => {
    if (!sectionRef.current) return;
    const scrollable = sectionRef.current.offsetHeight - window.innerHeight;
    const pct = (index + 0.05) / CARDS.length;
    const top = sectionRef.current.offsetTop + scrollable * (0.3 + 0.7 * pct);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative h-[220vh] w-full -mt-[20vh] pt-[20vh] lg:-mt-[15vh] lg:h-[320vh] lg:pt-[15vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Copper → dark gradient transition */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity:
              enterProgress < 1
                ? 1
                : 1 - easeOutQuint(clamp((scrollProgress - 0.08) / 0.25, 0, 1)),
            background:
              "linear-gradient(180deg, #C8956C 0%, #A0724D 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[var(--color-som-black)]"
          style={{
            opacity:
              enterProgress < 1
                ? 0
                : easeOutQuint(clamp((scrollProgress - 0.08) / 0.25, 0, 1)),
          }}
        />

        {/* Decorative circles (desktop only, copper phase) */}
        <div
          className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
          style={{
            opacity:
              enterProgress < 1
                ? 1
                : 1 - easeOutQuint(clamp((scrollProgress - 0.08) / 0.25, 0, 1)),
          }}
        >
          <div className="absolute left-1/2 top-1/2 h-[90vh] w-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-som-orange-light)]/20" />
          <div className="absolute left-[-20%] top-1/2 h-[90vh] w-[90vh] -translate-y-1/2 rounded-full border border-[var(--color-som-orange-light)]/15" />
          <div className="absolute right-[-20%] top-1/2 h-[90vh] w-[90vh] -translate-y-1/2 rounded-full border border-[var(--color-som-orange-light)]/15" />
          <div className="absolute left-1/2 top-[75%] flex -translate-x-1/2 items-center gap-2">
            <div className="h-[80px] w-[30px] rounded-full border border-[var(--color-som-orange-light)]/15" />
            <div className="h-[80px] w-[30px] rounded-full border border-[var(--color-som-orange-light)]/15" />
            <div className="h-[80px] w-[30px] rounded-full border border-[var(--color-som-orange-light)]/15" />
          </div>
        </div>

        {/* Main card viewport */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div
            className="relative h-screen w-full overflow-hidden will-change-transform"
            style={{
              transform: `scale(${0.08 + 0.92 * zoomEased})`,
              opacity: 1,
              transformOrigin: "center",
              borderRadius: `${32 * (1 - clamp((zoomEased - 0.5) / 0.5, 0, 1))}px`,
            }}
          >
            {/* Base background (first card) */}
            <div className="absolute inset-0">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${CARDS[0].background})` }}
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Crossfading backgrounds */}
            {CARDS.slice(1).map((card, i) => (
              <div
                key={card.id}
                className="pointer-events-none absolute inset-0"
                style={{ opacity: getCardOpacity(i + 1) }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${card.background})` }}
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
            ))}

            {/* Tab buttons */}
            <div
              ref={tabContainerRef}
              className="absolute left-1/2 top-[calc(14%+1rem)] z-[60] w-full -translate-x-1/2 lg:top-[15.5%] [@media(min-width:1024px)_and_(max-height:900px)]:top-[20%] [@media(min-width:1024px)_and_(max-height:800px)]:top-[24%]"
              style={contentStyle}
            >
              <div
                ref={scrollTabsRef}
                className="pointer-events-auto flex w-full flex-nowrap items-center gap-0 overflow-x-auto text-center [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:gap-3 lg:justify-center lg:overflow-visible lg:flex-wrap lg:gap-0 lg:px-4"
                style={{ paddingLeft: 20, paddingRight: 16 }}
              >
                {CARDS.map((card, i) => {
                  const isActive = i === activeCard;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => scrollToCard(i)}
                      className="pointer-events-auto flex shrink-0 cursor-pointer items-center justify-center rounded-[100px] font-diatype-mono text-[16px] uppercase tracking-[-0.02em] leading-[1.2] whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                      style={{
                        paddingTop: 14,
                        paddingBottom: 10,
                        paddingLeft: 24,
                        paddingRight: 24,
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: isActive ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)",
                        color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.6)",
                        background: isActive ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.01)",
                        backdropFilter: "blur(36px)",
                        WebkitBackdropFilter: "blur(36px)",
                      }}
                    >
                      {card.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Left info block */}
            <div
              ref={leftTitleRef}
              className="absolute left-1/2 top-[calc(14%+1rem+78px)] z-30 w-full max-w-[350px] -translate-x-1/2 text-center text-white lg:left-[14%] lg:top-[calc(50%+1.5rem)] lg:w-auto lg:max-w-none lg:-translate-x-0 lg:-translate-y-1/2 lg:text-left"
              style={contentStyle}
            >
              {/* Mobile: id + description */}
              <div className="lg:hidden">
                <p className="font-diatype-mono text-[1rem] uppercase tracking-[-0.32px] text-white/60">
                  <span className="text-white">{CARDS[displayIndex].id}</span>
                  <span className="text-white/60">/04</span>
                </p>
                <p
                  ref={mobileDescRef}
                  className="mt-[16px] font-diatype text-[1rem] leading-[1.14]"
                >
                  {splitWords(CARDS[displayIndex].description)}
                </p>
              </div>

              {/* Desktop: big title */}
              <div className="hidden lg:block">
                <p className="left-title-line font-druk text-[32px] uppercase leading-[0.9] sm:text-[40px] lg:text-[42px]">
                  {CARDS[activeCard].title[0]}
                </p>
                <p className="left-title-line font-druk-wide text-[32px] uppercase leading-[0.9] sm:text-[40px] lg:text-[42px]">
                  {CARDS[activeCard].title[1]}
                </p>
              </div>
            </div>

            {/* Right info block */}
            <div
              ref={rightBlockRef}
              className={`absolute left-1/2 top-auto z-30 w-[min(320px,80vw)] -translate-x-1/2 text-center text-white lg:left-auto lg:right-[12%] lg:top-1/2 lg:w-[404px] lg:-translate-x-0 lg:-translate-y-[0.6rem] lg:text-left ${
                isMobile ? "bottom-[30%]" : "bottom-[18%]"
              } lg:bottom-auto`}
              style={contentStyle}
            >
              {/* Mobile: tagline */}
              <div className="lg:hidden">
                <p
                  ref={mobileTaglineRef}
                  className="mt-[12px] font-diatype-mono text-[0.75rem] uppercase tracking-[-0.32px] text-white/60"
                >
                  {splitLines(CARDS[displayIndex].tagline)}
                </p>
              </div>

              {/* Desktop: id + description */}
              <div className="hidden lg:block">
                <p className="text-[12px] uppercase tracking-[-0.32px] lg:text-[16px]">
                  <span className="font-diatype-mono text-white">
                    {CARDS[displayIndex].id}
                  </span>
                  <span className="font-diatype-mono text-white/60">
                    /04
                  </span>
                </p>
                <p
                  ref={desktopDescRef}
                  className="mt-[1rem] font-diatype text-[14px] leading-[1.14] lg:text-[20px]"
                >
                  {splitWords(CARDS[displayIndex].description)}
                </p>
              </div>
            </div>

            {/* Desktop tagline (bottom) */}
            <div
              ref={desktopTaglineRef}
              className="absolute bottom-[7%] left-1/2 z-30 hidden w-full max-w-[360px] -translate-x-1/2 px-6 text-center font-diatype-mono text-[10px] uppercase tracking-[-0.32px] text-white/60 sm:text-[12px] lg:block lg:max-w-[404px] lg:text-[16px]"
              style={contentStyle}
            >
              {splitLines(CARDS[displayIndex].tagline)}
            </div>

            {/* Mobile bottom gradient */}
            <div
              className="pointer-events-none absolute inset-0 z-20 lg:hidden"
              style={{
                background:
                  "linear-gradient(180deg, rgba(14, 15, 17, 0) 0%, rgba(14, 15, 17, 0) 15.4%, rgba(14, 15, 17, 0.7) 60%, rgba(14, 15, 17, 0.8) 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
