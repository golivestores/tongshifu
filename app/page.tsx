"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader } from "@/components/Loader";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { PowerPillars } from "@/components/PowerPillars";
import { Origin } from "@/components/Origin";
import { JoinDrop } from "@/components/JoinDrop";
import { Artisans } from "@/components/Artisans";
import { Showcase } from "@/components/Showcase";
import { Heritage } from "@/components/Heritage";
import { Footer } from "@/components/Footer";
import { GrainOverlay } from "@/components/GrainOverlay";

/* FrameAnimation replaces Bottle3D — no Three.js needed */
const FrameAnimation = dynamic(() => import("@/components/FrameAnimation"), { ssr: false });

export default function Home() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isFramesLoaded, setIsFramesLoaded] = useState(false);

  const handleFramesLoaded = useCallback(() => {
    setIsFramesLoaded(true);
  }, []);

  const handleExitStart = useCallback(() => {
    setShowContent(true);
  }, []);

  const handleComplete = useCallback(() => {
    setLoaderDone(true);
  }, []);

  return (
    <>
      {/* Grain/noise texture overlay — always visible */}
      <GrainOverlay />

      {!loaderDone && (
        <Loader
          isModelLoaded={isFramesLoaded}
          onExitStart={handleExitStart}
          onComplete={handleComplete}
        />
      )}

      <Nav visible={showContent} />

      {/* Frame Animation — fixed overlay, replaces 3D bottle */}
      <FrameAnimation onFramesLoaded={handleFramesLoaded} />

      {/* Main content */}
      <main
        className="overflow-x-clip"
        style={{ opacity: showContent ? 1 : 0, transition: "opacity 0.5s ease" }}
      >
        {/* Hero + PowerPillars wrapper */}
        <div id="power-pillars" className="relative overflow-x-clip">
          <Hero holdAnimation={!showContent} />
          <PowerPillars id="power-pillars-scroll" />
        </div>

        {/* Origin — image grid zoom */}
        <section className="relative min-h-screen">
          <Origin id="origin" />
        </section>

        {/* Master Artisans — stats + intro */}
        <Artisans />

        {/* Craft Gallery — horizontal scroll showcase */}
        <Showcase />

        {/* Heritage Story — timeline + brand story */}
        <Heritage />

        {/* CTA — final call to action */}
        <JoinDrop />

        {/* Footer */}
        <div
          id="footer"
          className="relative"
          style={{
            background: "#0A0A0A",
          }}
        >
          <Footer />
        </div>

        {/* Infinite scroll bridge — seamless loop back to hero */}
        <section
          id="infinite-hero"
          className="relative h-[100vh] w-full overflow-hidden"
          style={{ marginTop: "-4px", backgroundColor: "#0A0A0A" }}
        >
          <video
            src="/images/tongshifu/hero-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-50"
            style={{ objectPosition: "50% 30%" }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%]"
            style={{
              background: "linear-gradient(to top, #0A0A0A 0%, transparent 100%)",
            }}
          />
        </section>
      </main>
    </>
  );
}
