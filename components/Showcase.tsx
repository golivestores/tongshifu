"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

const SHOWCASE_ITEMS = [
  {
    src: "/tongshifu/images/tongshifu/craft-sculpting.jpg",
    title: "CLAY SCULPTING",
    desc: "Where form meets spirit",
  },
  {
    src: "/tongshifu/images/tongshifu/craft-casting.jpg",
    title: "LOST-WAX CASTING",
    desc: "Fire transforms wax to bronze",
  },
  {
    src: "/tongshifu/images/tongshifu/craft-polishing.jpg",
    title: "HAND POLISHING",
    desc: "Perfection in every surface",
  },
  {
    src: "/tongshifu/images/tongshifu/craft-painting.jpg",
    title: "MINERAL PAINTING",
    desc: "Color breathes life into metal",
  },
  {
    src: "/tongshifu/images/tongshifu/hero-bg.jpg",
    title: "THE WORKSHOP",
    desc: "Where heritage comes alive",
  },
];

export function Showcase() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  /* Scroll-driven horizontal gallery */
  useEffect(() => {
    if (!sectionRef.current || !scrollContainerRef.current) return;

    const section = sectionRef.current;
    const container = scrollContainerRef.current;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = rect.height - vh;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / scrollable);

      const maxScroll = container.scrollWidth - container.clientWidth;
      container.scrollLeft = progress * maxScroll;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="showcase"
      className="relative h-[300vh] w-full bg-[#0A0A0A]"
    >
      {/* Copper accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C8956C]/30 to-transparent" />

      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        {/* Section header */}
        <div className="px-6 mb-8 lg:px-12 lg:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-end justify-between"
          >
            <div>
              <p className="font-diatype-mono text-[12px] uppercase tracking-[0.2em] text-[#C8956C]/60 mb-3 lg:text-[14px]">
                THE PROCESS
              </p>
              <h2 className="font-druk text-[2rem] uppercase leading-[0.85] text-white sm:text-[2.5rem] lg:text-[3.5rem]">
                CRAFT{" "}
                <span className="font-druk-wide text-[#C8956C]">GALLERY</span>
              </h2>
            </div>
            <p className="hidden font-diatype-mono text-[12px] uppercase tracking-[0.1em] text-[#F5E6D3]/40 lg:block">
              SCROLL TO EXPLORE →
            </p>
          </motion.div>
        </div>

        {/* Horizontal scroll gallery */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-hidden px-6 lg:gap-6 lg:px-12"
          style={{ scrollbarWidth: "none" }}
        >
          {SHOWCASE_ITEMS.map((item, i) => (
            <div
              key={item.title}
              className="relative flex-shrink-0 w-[75vw] sm:w-[50vw] lg:w-[35vw] overflow-hidden rounded-lg group"
              style={{ aspectRatio: "3/4" }}
            >
              <img
                src={item.src}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-8">
                <p className="font-diatype-mono text-[10px] uppercase tracking-[0.15em] text-[#C8956C] mb-2 lg:text-[12px]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-druk text-[1.25rem] uppercase leading-[0.9] text-white lg:text-[1.5rem]">
                  {item.title}
                </h3>
                <p className="mt-2 font-diatype text-[0.8rem] text-[#F5E6D3]/60 lg:text-[0.875rem]">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
