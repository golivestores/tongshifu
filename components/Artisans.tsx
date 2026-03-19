"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

const ARTISAN_STATS = [
  { value: "200+", label: "MASTER ARTISANS" },
  { value: "36", label: "CRAFT STEPS" },
  { value: "5000", label: "YEARS OF HERITAGE" },
  { value: "100%", label: "HANDCRAFTED" },
];

export function Artisans() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRevealed) {
          setHasRevealed(true);
          if (statsRef.current) {
            const items = statsRef.current.querySelectorAll(".stat-item");
            gsap.fromTo(
              items,
              { opacity: 0, y: 40, filter: "blur(6px)" },
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.12,
              }
            );
          }
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasRevealed]);

  return (
    <section
      ref={sectionRef}
      id="artisans"
      className="relative min-h-screen w-full bg-[#0A0A0A] overflow-hidden"
    >
      {/* Copper accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C8956C]/30 to-transparent" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24 lg:py-32">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16 lg:mb-24"
        >
          <p className="font-diatype-mono text-[12px] uppercase tracking-[0.2em] text-[#C8956C]/60 mb-6 lg:text-[14px]">
            THE PEOPLE BEHIND THE CRAFT
          </p>
          <h2 className="font-druk text-[2.5rem] uppercase leading-[0.85] text-white sm:text-[3.5rem] lg:text-[5rem]">
            MASTER
          </h2>
          <h2 className="font-druk-wide text-[2.5rem] uppercase leading-[0.85] text-[#C8956C] sm:text-[3.5rem] lg:text-[5rem]">
            ARTISANS
          </h2>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-[600px] text-center font-diatype text-[1rem] leading-[1.5] text-[#F5E6D3]/70 mb-20 lg:text-[1.125rem] lg:mb-28"
        >
          Each Tongshifu masterpiece passes through the hands of over 200 artisans.
          From the initial clay sculpture to the final brushstroke of mineral pigment,
          every step demands decades of accumulated skill and unwavering dedication.
        </motion.p>

        {/* Stats grid */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 gap-8 w-full max-w-[800px] lg:grid-cols-4 lg:gap-12"
        >
          {ARTISAN_STATS.map((stat) => (
            <div
              key={stat.label}
              className="stat-item flex flex-col items-center text-center opacity-0"
            >
              <span className="font-druk text-[2.5rem] leading-none text-[#C8956C] lg:text-[3.5rem]">
                {stat.value}
              </span>
              <div className="mt-3 h-[1px] w-12 bg-[#C8956C]/30" />
              <span className="mt-3 font-diatype-mono text-[10px] uppercase tracking-[0.15em] text-[#F5E6D3]/50 lg:text-[12px]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
