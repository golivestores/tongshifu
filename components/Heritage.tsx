"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

const MILESTONES = [
  { year: "3000 BC", event: "Bronze casting origins in ancient China" },
  { year: "500 BC", event: "Lost-wax technique perfected" },
  { year: "2002", event: "Tongshifu founded" },
  { year: "2015", event: "IPO on Shanghai Stock Exchange" },
  { year: "TODAY", event: "200+ artisans, millions of collectors worldwide" },
];

export function Heritage() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRevealed) {
          setHasRevealed(true);

          // Animate timeline line
          if (lineRef.current) {
            gsap.fromTo(
              lineRef.current,
              { scaleY: 0 },
              { scaleY: 1, duration: 1.2, ease: "power2.out" }
            );
          }

          // Animate milestones
          if (timelineRef.current) {
            const items = timelineRef.current.querySelectorAll(".milestone");
            gsap.fromTo(
              items,
              { opacity: 0, x: -30, filter: "blur(4px)" },
              {
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                duration: 0.6,
                ease: "power2.out",
                stagger: 0.15,
                delay: 0.3,
              }
            );
          }
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasRevealed]);

  return (
    <section
      ref={sectionRef}
      id="heritage"
      className="relative w-full bg-[#0A0A0A] overflow-hidden"
    >
      {/* Copper accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C8956C]/30 to-transparent" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-16 px-6 py-24 lg:px-16 lg:py-32 max-w-[1400px] mx-auto">
        {/* Left: Big text */}
        <div className="flex-1 text-center lg:text-left lg:sticky lg:top-[20vh]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-diatype-mono text-[12px] uppercase tracking-[0.2em] text-[#C8956C]/60 mb-6 lg:text-[14px]">
              OUR STORY
            </p>
            <h2 className="font-druk text-[2.5rem] uppercase leading-[0.85] text-white sm:text-[3.5rem] lg:text-[4.5rem]">
              FIVE
            </h2>
            <h2 className="font-druk-wide text-[2.5rem] uppercase leading-[0.85] text-[#C8956C] sm:text-[3.5rem] lg:text-[4.5rem]">
              THOUSAND
            </h2>
            <h2 className="font-druk text-[2.5rem] uppercase leading-[0.85] text-white sm:text-[3.5rem] lg:text-[4.5rem]">
              YEARS
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 max-w-[500px] font-diatype text-[1rem] leading-[1.5] text-[#F5E6D3]/60 lg:text-[1.125rem] mx-auto lg:mx-0"
          >
            From the ritual bronze vessels of the Shang Dynasty to the contemporary
            art sculptures of today, Tongshifu carries forward an unbroken lineage of
            metalworking mastery — bridging millennia through the timeless language of bronze.
          </motion.p>
        </div>

        {/* Right: Timeline */}
        <div className="relative flex-1 w-full max-w-[500px]" ref={timelineRef}>
          {/* Vertical line */}
          <div
            ref={lineRef}
            className="absolute left-[18px] top-0 bottom-0 w-[1px] bg-[#C8956C]/30 origin-top"
            style={{ transform: "scaleY(0)" }}
          />

          <div className="flex flex-col gap-10 lg:gap-14">
            {MILESTONES.map((m) => (
              <div key={m.year} className="milestone flex items-start gap-6 opacity-0">
                {/* Dot */}
                <div className="relative flex-shrink-0 mt-1">
                  <div className="h-[10px] w-[10px] rounded-full bg-[#C8956C]" style={{ marginLeft: 13 }} />
                </div>
                {/* Content */}
                <div>
                  <span className="font-druk text-[1.5rem] leading-none text-[#C8956C] lg:text-[2rem]">
                    {m.year}
                  </span>
                  <p className="mt-2 font-diatype text-[0.875rem] leading-[1.4] text-[#F5E6D3]/70 lg:text-[1rem]">
                    {m.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
