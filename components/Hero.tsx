"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

/* ─── animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
const ease = [0.25, 0.1, 0.25, 1] as const;

interface HeroProps {
  holdAnimation?: boolean;
}

/* ─── Inner hero content ─── */
function HeroContent({ holdAnimation = false }: HeroProps) {
  const animState = holdAnimation ? "hidden" : "visible";

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      data-section="hero"
    >
      {/* Decorative radial glow — copper tone */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 w-[300px] -translate-x-1/2 -translate-y-1/2 sm:top-[170px] sm:translate-y-0 sm:w-[420px] lg:top-[170px] lg:w-[42.8125rem]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at center, rgba(200,149,108,0.2) 0%, rgba(200,149,108,0) 75%)",
          aspectRatio: "685 / 848",
        }}
      />

      {/* Text annotations */}
      <div className="relative z-10 h-full">
        {/* Left text */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={animState}
          transition={{ duration: 0.8, delay: 0.6, ease }}
          className="absolute left-[8%] top-[26%] max-w-[260px] text-left font-diatype-mono text-[12px] uppercase leading-[1.14] text-white sm:max-w-[320px] lg:left-[25%] lg:top-[418px] lg:max-w-[228px] lg:text-[14px] lg:font-medium [@media(min-width:1024px)_and_(max-height:900px)]:top-[360px] [@media(min-width:1024px)_and_(max-height:800px)]:top-[330px]"
        >
          <span className="block lg:hidden">INHERITING 5000 YEARS</span>
          <span className="block lg:hidden">OF BRONZE CRAFTSMANSHIP</span>
          <span className="block lg:hidden">THROUGH LOST-WAX CASTING</span>
          <span className="hidden lg:block">INHERITING 5000 YEARS</span>
          <span className="hidden lg:block">OF BRONZE CRAFTSMANSHIP</span>
          <span className="hidden lg:block">THROUGH LOST-WAX CASTING</span>
        </motion.p>

        {/* Right text */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={animState}
          transition={{ duration: 0.8, delay: 0.35, ease }}
          className="absolute right-[8%] top-1/2 max-w-[260px] -translate-y-1/2 text-right font-diatype-mono text-[12px] uppercase leading-[1.14] text-white sm:max-w-[320px] lg:left-[62%] lg:top-[653px] lg:right-auto lg:translate-y-0 lg:max-w-[228px] lg:text-[14px] lg:font-medium [@media(min-width:1024px)_and_(max-height:900px)]:top-[560px] [@media(min-width:1024px)_and_(max-height:800px)]:top-[520px]"
        >
          <span className="block lg:hidden">SCULPTING · CASTING</span>
          <span className="block lg:hidden">POLISHING · PAINTING</span>
          <span className="block lg:hidden">EVERY STEP IS HERITAGE</span>
          <span className="hidden lg:block">SCULPTING · CASTING</span>
          <span className="hidden lg:block">POLISHING · PAINTING</span>
          <span className="hidden lg:block">EVERY STEP IS HERITAGE</span>
        </motion.p>

        {/* Bottom center text */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={animState}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="absolute bottom-[22%] left-1/2 -translate-x-1/2 text-center lg:bottom-[70px]"
        >
          <p className="max-w-[360px] font-diatype-mono text-[12px] uppercase leading-[1.14] text-[var(--color-som-orange-light)] lg:text-[14px] lg:font-medium">
            BRONZE HERITAGE REFINED INTO CONTEMPORARY ART
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Hero section ─── */
export function Hero({ holdAnimation = false }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative h-[160vh] sm:h-[200vh] lg:h-auto"
    >
      {/* Background video */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[180vh] overflow-hidden sm:h-[200vh] lg:inset-0 lg:h-full">
        <video
          src="/images/tongshifu/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "50% 30%" }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Top gradient (mobile only) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 lg:hidden"
        style={{
          height: "6rem",
          background:
            "linear-gradient(to bottom, rgb(10, 10, 10) 0%, rgba(10, 10, 10, 0.6) 40%, rgba(10, 10, 10, 0) 100%)",
        }}
      />

      {/* Bottom gradient (mobile) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[35vh] bg-gradient-to-b from-transparent via-[#C8956C]/30 to-[#0A0A0A] md:h-[45vh] md:via-[#C8956C]/40 lg:hidden" />

      {/* Bottom gradient (desktop) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 hidden h-[40vh] bg-gradient-to-b from-transparent via-[#C8956C]/25 to-[#0A0A0A] lg:block" />

      {/* Main content (h-screen viewport) */}
      <div className="relative h-screen">
        <HeroContent holdAnimation={holdAnimation} />
      </div>

      {/* Mobile: large text + tagline paragraph (below fold) */}
      <div className="lg:hidden" style={{ paddingBottom: "3rem" }}>
        <div className="flex flex-col items-center px-4" style={{ margin: "64px auto 0" }}>
          <p className="font-druk text-[2.5rem] uppercase leading-[0.85] text-[#C8956C] text-center sm:text-[3rem]">
            BRONZE
          </p>
          <p className="font-druk-wide text-[2.5rem] uppercase leading-[0.85] text-[#C8956C] text-center sm:text-[3rem]">
            HERITAGE
          </p>
        </div>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="max-w-[25rem] px-4 text-center font-diatype text-[1rem] font-medium leading-[1.14] tracking-[-0.4px] text-[#F5E6D3] sm:max-w-[28rem] sm:text-[1.25rem]"
          style={{ margin: "96px auto 0" }}
        >
          {["Lost-wax bronze casting, preserving 5,000 years", "of artisan heritage and craftsmanship."].map((line) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                variants={{
                  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
                }}
                transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.p>
      </div>

      {/* Desktop: large text + tagline paragraph (below fold) */}
      <div className="hidden lg:flex lg:flex-col lg:items-center" style={{ paddingBottom: "3rem" }}>
        <div className="flex flex-col items-center" style={{ marginTop: "64px" }}>
          <p className="font-druk text-[4rem] uppercase leading-[0.85] text-[#C8956C] text-center xl:text-[5rem]">
            BRONZE
          </p>
          <p className="font-druk-wide text-[4rem] uppercase leading-[0.85] text-[#C8956C] text-center xl:text-[5rem]">
            HERITAGE
          </p>
        </div>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="max-w-[25rem] px-4 text-center font-diatype text-[1rem] font-medium leading-[1.14] tracking-[-0.4px] text-white sm:max-w-[28rem] sm:text-[1.25rem] lg:text-[1.25rem]"
          style={{ margin: "96px auto 0" }}
        >
          {["Lost-wax bronze casting, preserving 5,000 years", "of artisan heritage and craftsmanship."].map((line) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                variants={{
                  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
                }}
                transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.p>
      </div>
    </section>
  );
}
