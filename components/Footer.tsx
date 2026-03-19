"use client";

export function Footer() {
  const footerVars = {
    "--watermark-size": "clamp(7rem, 11vw, 13rem)",
    "--watermark-top": "clamp(22rem, 28vw, 42rem)",
    "--watermark-offset": "clamp(6rem, 12vw, 16.5rem)",
    "--watermark-gap": "0rem",
    "--watermark-bar-gap": "clamp(2rem, 4vw, 5rem)",
    "--watermark-block-height":
      "calc(var(--watermark-size) + var(--watermark-size) + var(--watermark-size) + var(--watermark-gap) + var(--watermark-gap))",
    "--bar-height": "3.625rem",
    "--bar-bottom": "clamp(1.5rem, 3vw, 3rem)",
    "--consistency-section-height": "clamp(20rem, 33.54vw, 644px)",
  } as React.CSSProperties;

  const mobileBottomOffset = "calc(20rem + clamp(1.5rem, 4vw, 2.5rem))";

  return (
    <footer
      className="relative m-0 w-full overflow-clip bg-[#0A0A0A] p-0"
      role="contentinfo"
    >
      <style>{`
        .contacts-trigger:hover .contacts-popup {
          opacity: 1;
          pointer-events: auto;
        }
      `}</style>

      {/* ==================== DESKTOP FOOTER ==================== */}
      <div
        className="relative hidden w-full md:block"
        style={{
          ...footerVars,
          minHeight:
            "calc(var(--watermark-top) + var(--watermark-block-height) + var(--watermark-bar-gap) + var(--bar-height) + var(--bar-bottom) + var(--consistency-section-height))",
        }}
      >
        {/* Decorative glow */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              width: "140%",
              maxWidth: "none",
              height: "250%",
              top: "-13%",
              background: "radial-gradient(ellipse at center, rgba(200,149,108,0.08) 0%, transparent 60%)",
            }}
          />
        </div>

        {/* "铜师傅" watermark */}
        <div
          className="absolute left-0 w-full z-[1] pointer-events-none flex justify-center"
          style={{ top: "var(--watermark-top)" }}
        >
          <p className="font-druk text-[8rem] uppercase leading-none text-[#C8956C]/10 xl:text-[12rem]">
            TONGSHIFU
          </p>
        </div>

        {/* Glassmorphism nav bar */}
        <div
          className="absolute left-0 right-0 z-10 flex items-center justify-between px-8"
          style={{
            height: "var(--bar-height)",
            bottom:
              "calc(var(--bar-bottom) + var(--consistency-section-height))",
            borderTop: "1px solid rgba(200,149,108,0.16)",
            borderBottom: "1px solid rgba(200,149,108,0.16)",
            background: "rgba(200,149,108,0.06)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
        >
          {/* Left: Contacts */}
          <div className="contacts-trigger relative cursor-pointer">
            <span className="text-[#F5E6D3]/70 text-xs tracking-widest uppercase font-light">
              Contact
            </span>
            <div
              className="contacts-popup absolute bottom-full left-0 mb-2 opacity-0 pointer-events-none transition-opacity duration-300 z-50"
              style={{
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: "0.75rem",
                padding: "1.25rem 1.5rem",
                minWidth: "14rem",
              }}
            >
              <p className="text-white/60 text-[0.65rem] uppercase tracking-widest mb-1">
                Inquiries
              </p>
              <a
                href="https://www.tongshifu.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-sm hover:underline block mb-3"
              >
                www.tongshifu.com
              </a>
            </div>
          </div>

          {/* Center: Brand */}
          <div className="flex gap-6">
            <span className="text-[#F5E6D3]/70 text-xs tracking-widest uppercase font-light">
              TONGSHIFU · MASTER BRONZE CRAFT
            </span>
          </div>

          {/* Right: Credit */}
          <span className="text-[#F5E6D3]/70 text-xs tracking-widest uppercase font-light">
            © TONGSHIFU
          </span>
        </div>

        {/* Bottom gradient section */}
        <div
          className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-10 z-10"
          style={{
            height: "var(--consistency-section-height)",
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(10,10,10,1) 100%)",
          }}
        >
          {/* Tagline */}
          <p className="text-[#F5E6D3]/60 text-center text-sm tracking-widest uppercase font-light leading-relaxed">
            Heritage is belief.
            <br />
            Craftsmanship is Tongshifu.
          </p>
        </div>
      </div>

      {/* ==================== MOBILE FOOTER ==================== */}
      <div
        className="relative block md:hidden w-full overflow-hidden"
        style={{
          height: "96rem",
          ...footerVars,
        }}
      >
        {/* Decorative glow (mobile) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: "300%",
            bottom: "-10rem",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "600px",
              background: "radial-gradient(ellipse at center, rgba(200,149,108,0.08) 0%, transparent 60%)",
            }}
          />
        </div>

        {/* "铜师傅" text (mobile) */}
        <div className="absolute left-1/2 -translate-x-1/2 w-[90%] z-[1] pointer-events-none text-center"
          style={{ top: "var(--watermark-top)" }}
        >
          <p className="font-druk text-[4rem] uppercase leading-none text-[#C8956C]/10">
            TONGSHIFU
          </p>
        </div>

        {/* Glassmorphism bar (mobile) */}
        <div
          className="absolute left-0 right-0 z-10 flex px-5"
          style={{
            height: "8rem",
            bottom: mobileBottomOffset,
            borderTop: "1px solid rgba(200,149,108,0.16)",
            borderBottom: "1px solid rgba(200,149,108,0.16)",
            background: "rgba(200,149,108,0.06)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
        >
          {/* Left: Brand info */}
          <div className="flex flex-col justify-center gap-1.5 flex-1">
            <span className="text-[#F5E6D3]/70 text-[0.6rem] tracking-widest uppercase font-light">
              TONGSHIFU
            </span>
            <span className="text-[#F5E6D3]/70 text-[0.6rem] tracking-widest uppercase font-light">
              MASTER BRONZE CRAFT · EST. 2002
            </span>
          </div>

          {/* Right: Copyright */}
          <div className="flex flex-col justify-center items-end gap-1.5">
            <span className="text-[#F5E6D3]/70 text-[0.6rem] tracking-widest uppercase font-light">
              © TONGSHIFU
            </span>
            <span className="text-[#F5E6D3]/70 text-[0.6rem] tracking-widest uppercase font-light">
              EST. 2002
            </span>
          </div>
        </div>

        {/* Bottom gradient section (mobile) */}
        <div
          className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-8 z-10"
          style={{
            height: "20rem",
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(10,10,10,1) 100%)",
          }}
        >
          {/* Tagline (mobile) */}
          <p className="text-[#F5E6D3]/60 text-center text-[0.65rem] tracking-widest uppercase font-light leading-relaxed">
            Heritage is belief.
            <br />
            Craftsmanship is Tongshifu.
          </p>
        </div>
      </div>
    </footer>
  );
}
