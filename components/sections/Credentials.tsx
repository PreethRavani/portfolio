"use client";

import { Fragment, useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHead from "@/components/ui/SectionHead";
import AchievementCounter from "@/components/ui/AchievementCounter";
import { achievementsList, certificationsList } from "@/lib/data";

const MARQUEE_ITEMS = [
  "BUILD IN PUBLIC",
  "SHIP OFTEN",
  "DESIGN WITH INTENT",
  "MINIMALIST ENGINEERING",
  "PERFORMANCE FIRST",
];

export default function Credentials() {
  const [flipped, setFlipped] = useState<string | null>(null);

  // Mobile horizontal motion on vertical scroll (CodePen pattern)
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const mobileCardsRef = useRef<HTMLDivElement>(null);
  const [maxShift, setMaxShift] = useState(0);

  const { scrollYProgress } = useScroll({
    target: mobileTrackRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const calcShift = () => {
      if (mobileCardsRef.current) {
        const totalW = mobileCardsRef.current.scrollWidth;
        const viewportW = window.innerWidth;
        // Total horizontal shift so the 4th card stops cleanly in view
        const shift = Math.max(0, totalW - viewportW + 28);
        setMaxShift(shift);
      }
    };
    calcShift();
    window.addEventListener("resize", calcShift);
    return () => window.removeEventListener("resize", calcShift);
  }, []);

  const horizontalX = useTransform(scrollYProgress, [0, 1], [0, -maxShift]);

  return (
    <section
      id="certifications"
      data-story-steps="2"
      className="section credentials-section relative border-b border-border/30 !pt-12 md:!pt-28"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-14">
        {/* =========================================================
            DESKTOP VIEW: Static 4-Column Grid (Laptop Layout)
           ========================================================= */}
        <div className="hidden md:block">
          <SectionHead
            index="05"
            title="CERTIFICATIONS"
            subtitle="COURSES &amp; TECHNICAL LEARNING"
            align="left"
          />

          <div className="cert-card-grid mx-auto mt-8 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {certificationsList.map((cert, index) => (
              <button
                type="button"
                key={cert.title}
                className="cert-card group relative h-56 w-full cursor-pointer border-0 bg-transparent p-0 text-left [perspective:1200px] lg:h-64"
                aria-label={`${flipped === cert.title ? "Hide" : "Show"} details for ${cert.title}`}
                aria-pressed={flipped === cert.title}
                data-flipped={flipped === cert.title}
                onClick={() => setFlipped((current) => current === cert.title ? null : cert.title)}
              >
                <span className="sr-only">Activate to flip this card and read its details.</span>
                <span className="cert-card__inner relative block h-full w-full rounded-2xl border border-border/70 shadow-md transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-visible:[transform:rotateY(180deg)]">
                  <span className="absolute inset-0 flex h-full w-full flex-col justify-between rounded-2xl bg-card p-4 sm:p-5 [backface-visibility:hidden]">
                    <span className="flex items-center justify-between">
                      <span className="font-mono text-xl text-nothing-red" aria-hidden="true">⬡</span>
                      <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                        {cert.year} · 0{index + 1}
                      </span>
                    </span>
                    <span>
                      <span className="mb-1 block font-body text-sm font-semibold leading-snug text-foreground">
                        {cert.title}
                      </span>
                      <span className="block font-mono text-xs text-muted-foreground">
                        {cert.issuer}
                      </span>
                    </span>
                  </span>

                  <span className="absolute inset-0 flex h-full w-full flex-col justify-between rounded-2xl border border-nothing-red/50 bg-card p-4 sm:p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <span>
                      <span className="mb-2 flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-widest text-nothing-red">
                        <span aria-hidden="true">◈</span> CERTIFICATE
                      </span>
                      <span className="line-clamp-4 block font-body text-xs leading-relaxed text-muted-foreground">
                        {cert.description}
                      </span>
                    </span>
                    <span className="truncate border-t border-border/40 pt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      ISSUED BY {cert.issuer}
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================
            MOBILE VIEW: Vertical Scroll Pinned with Horizontal Motion
            (CodePen Concept: Vertical scroll drives horizontal cards)
           ========================================================= */}
        <div
          ref={mobileTrackRef}
          className="mobile-cert-track relative w-full md:hidden"
          style={{ height: "260svh" }}
        >
          <div className="sticky top-0 h-[100svh] w-full flex flex-col justify-center overflow-hidden py-4">
            <div className="mb-4">
              <SectionHead
                index="05"
                title="CERTIFICATIONS"
                subtitle="COURSES &amp; TECHNICAL LEARNING"
                align="left"
              />
            </div>

            {/* Horizontal Sliding Cards Track */}
            <div className="w-full overflow-hidden py-2">
              <motion.div
                ref={mobileCardsRef}
                style={{ x: horizontalX }}
                className="flex gap-4 items-stretch will-change-transform pl-1 pr-6"
              >
                {certificationsList.map((cert, index) => (
                  <div
                    key={cert.title}
                    className="w-[84vw] max-w-[320px] shrink-0 h-64 [perspective:1200px]"
                  >
                    <button
                      type="button"
                      className="cert-card group relative h-full w-full cursor-pointer border-0 bg-transparent p-0 text-left [perspective:1200px]"
                      aria-label={`${flipped === cert.title ? "Hide" : "Show"} details for ${cert.title}`}
                      aria-pressed={flipped === cert.title}
                      data-flipped={flipped === cert.title}
                      onClick={() => setFlipped((current) => current === cert.title ? null : cert.title)}
                    >
                      <span className="sr-only">Activate to flip this card and read its details.</span>
                      <span className={`cert-card__inner relative block h-full w-full rounded-2xl border border-border/80 shadow-lg transition-transform duration-500 [transform-style:preserve-3d] ${flipped === cert.title ? "[transform:rotateY(180deg)]" : ""}`}>
                        {/* Front Card */}
                        <span className="absolute inset-0 flex h-full w-full flex-col justify-between rounded-2xl bg-card p-5 [backface-visibility:hidden]">
                          <span className="flex items-center justify-between">
                            <span className="font-mono text-xl text-nothing-red" aria-hidden="true">⬡</span>
                            <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                              {cert.year} · 0{index + 1}
                            </span>
                          </span>
                          <span>
                            <span className="mb-1 block font-body text-base font-semibold leading-snug text-foreground">
                              {cert.title}
                            </span>
                            <span className="block font-mono text-xs text-muted-foreground">
                              {cert.issuer}
                            </span>
                          </span>
                          <span className="flex items-center justify-center gap-1.5 font-mono text-[10px] text-nothing-red uppercase tracking-widest pt-2 border-t border-border/40 w-full text-center">
                            <span>Tap</span>
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nothing-red opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-nothing-red"></span>
                            </span>
                          </span>
                        </span>

                        {/* Back Card */}
                        <span className="absolute inset-0 flex h-full w-full flex-col justify-between rounded-2xl border border-nothing-red/60 bg-card p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                          <span>
                            <span className="mb-2 flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-widest text-nothing-red">
                              <span aria-hidden="true">◈</span> CERTIFICATE
                            </span>
                            <span className="line-clamp-4 block font-body text-xs leading-relaxed text-muted-foreground">
                              {cert.description}
                            </span>
                          </span>
                          <span className="truncate border-t border-border/40 pt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                            ISSUED BY {cert.issuer}
                          </span>
                        </span>
                      </span>
                    </button>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Horizontal Progress Bar */}
            <div className="w-full mt-4 flex items-center justify-between gap-3 px-1">
              <span className="font-mono text-[9px] text-muted-foreground tracking-wider uppercase">
                04 CERTIFICATES
              </span>
              <div className="w-28 h-1 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                <motion.div
                  style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
                  className="h-full bg-nothing-red"
                />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            ACHIEVEMENTS (Section 06)
           ========================================================= */}
        <div id="achievements" className="mt-16 sm:mt-20 scroll-mt-24">
          <SectionHead
            index="06"
            title="ACHIEVEMENTS"
            subtitle="MILESTONES &amp; SELF-REPORTED RESULTS"
            align="left"
          />

          <div className="achieve-cards-grid mx-auto mb-20 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {achievementsList.map((item) => (
              <article
                key={item.label}
                className="achieve-card group flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-md transition-[border-color,transform] duration-300 hover:-translate-y-1.5 hover:border-nothing-red/60"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-nothing-red">
                    {item.glyph}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
                    HIGHLIGHT
                  </span>
                </div>

                <div className="my-2">
                  <AchievementCounter value={item.number} suffix={item.suffix} />
                  <h3 className="achieve-label mt-2 font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
                    {item.label}
                  </h3>
                </div>

                {item.description && (
                  <p className="mt-2 border-t border-border/30 pt-3 font-body text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="marquee-strip relative w-full overflow-hidden border-y border-border/40 bg-card/20 py-4 select-none"
      >
        <div className="marquee-track flex w-max gap-8 font-display text-base font-light uppercase tracking-wider text-muted-foreground/70 sm:text-xl lg:text-2xl">
          {Array.from({ length: 4 }).map((_, blockIndex) => (
            <Fragment key={blockIndex}>
              {MARQUEE_ITEMS.map((phrase) => (
                <span key={`${blockIndex}-${phrase}`} className="flex items-center gap-8">
                  <span>{phrase}</span>
                  <span className="font-bold text-nothing-red">·</span>
                </span>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
