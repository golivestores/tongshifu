"use client";

import { useState } from "react";

/**
 * JoinDrop — CTA section for 铜师傅.
 * Converted from waitlist form to brand exploration CTA.
 */
export function JoinDrop() {
  const [hovered, setHovered] = useState(false);

  return (
    <section
      id="join-drop"
      className="relative w-full bg-[#0A0A0A] text-[#F5E6D3]"
    >
      <div className="relative flex min-h-screen w-full flex-col items-center px-[1rem] pb-[1.25rem] pt-0 md:px-[1.25rem] lg:h-[80rem] lg:min-h-0 lg:pb-0 lg:pt-0">
        <div className="relative mx-auto flex w-full flex-col items-center">
          {/* Spacer (mobile) */}
          <div
            className="h-[clamp(11.875rem,30vw,16.125rem)] w-full lg:hidden"
            aria-hidden="true"
          />

          {/* Title: 探索铜师傅 */}
          <div className="flex w-full max-w-[21.4375rem] flex-col items-center gap-0 text-center uppercase leading-none text-[#C8956C] lg:absolute lg:left-1/2 lg:top-[16.125rem] lg:max-w-[23.5625rem] lg:-translate-x-1/2">
            <p className="font-druk text-[3rem] leading-[0.76] max-[375px]:text-[2.5rem] lg:text-[4.5rem] lg:leading-[0.75]">
              EXPLORE
            </p>
            <div className="-mt-[1rem] flex items-baseline justify-center gap-[0.0625rem] text-[3rem] leading-[0.76] max-[375px]:text-[2.5rem] sm:-mt-[1.375rem] lg:text-[4.5rem] lg:leading-[0.75]">
              <span className="font-druk-wide">TONG</span>
              <span className="font-druk">SHIFU</span>
            </div>
            <p className="!pt-[0.125rem] font-druk text-[3rem] leading-[0.76] max-[375px]:text-[2.5rem] lg:text-[4.5rem] lg:leading-[0.75]">
              CRAFT
            </p>
          </div>

          {/* Subtitle */}
          <p
            className="max-w-[21.4375rem] text-center font-diatype-mono text-[0.875rem] font-medium uppercase leading-[1.3] text-[#F5E6D3]/60 lg:absolute lg:left-1/2 lg:top-[29rem] lg:mt-0 lg:max-w-[22.375rem] lg:leading-[1.14] lg:-translate-x-1/2"
            style={{ marginTop: "24px" }}
          >
            <span className="block">
              5,000 YEARS OF BRONZE HERITAGE,
            </span>
            <span className="block">
              CRAFTED WITH TIMELESS MASTERY.
            </span>
          </p>

          {/* CTA Button */}
          <div
            className="flex w-full max-w-[21.4375rem] flex-col lg:absolute lg:left-1/2 lg:top-[35.125rem] lg:mt-0 lg:max-w-[34.5rem] lg:-translate-x-1/2"
            style={{ marginTop: "32px" }}
          >
            <a
              href="https://www.tongshifu.com"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="group flex h-[3.625rem] w-full items-center justify-center gap-[0.375rem] rounded-[0.25rem] bg-[#C8956C] font-diatype-mono text-[0.875rem] font-normal uppercase tracking-[-0.02625rem] text-[#0A0A0A] shadow-none transition-[background-color,color] duration-300 hover:bg-[#D4A57C]"
              style={{ marginTop: "28px" }}
            >
              <span className="inline-flex items-center gap-[0.375rem]">
                <span>VISIT TONGSHIFU</span>
                <span
                  aria-hidden="true"
                  className="inline-flex h-[1.16em] w-[1em] items-center justify-center will-change-transform"
                  style={{
                    transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    transform: hovered ? "rotate(-45deg)" : "rotate(0deg)",
                  }}
                >
                  →
                </span>
              </span>
            </a>
          </div>
        </div>

        {/* Bottom footer text */}
        <div className="mt-auto w-full max-w-[21.4375rem] pb-[1.25rem] md:max-w-[22.375rem] xl:absolute xl:left-[1.25rem] xl:right-[1.25rem] xl:top-[63.875rem] xl:mt-0 xl:w-auto xl:max-w-none xl:pb-0">
          {/* Mobile: two columns */}
          <div className="flex w-full items-start justify-between text-[0.875rem] uppercase leading-[1.2] tracking-[-0.02rem] text-[#F5E6D3]/30 xl:hidden">
            <div className="text-left font-diatype-mono">
              <p>TONGSHIFU</p>
              <p>BRONZE ART</p>
            </div>
            <div className="text-right font-diatype-mono">
              <p>MASTER CRAFT</p>
              <p>SINCE 2002</p>
            </div>
          </div>
          {/* Desktop: 4 columns */}
          <div className="hidden w-full font-diatype-mono text-[1rem] uppercase leading-[1.2] tracking-[-0.02rem] text-[#F5E6D3]/30 xl:grid xl:grid-cols-4 xl:items-end">
            <div className="whitespace-nowrap">
              <p>MASTER CRAFT</p>
              <p>5000 YEARS //</p>
            </div>
            <p className="whitespace-nowrap text-center">TONGSHIFU</p>
            <p className="whitespace-nowrap text-center">BRONZE CRAFTSMANSHIP</p>
            <p className="whitespace-nowrap text-right">EST. 2002</p>
          </div>
        </div>
      </div>
    </section>
  );
}
