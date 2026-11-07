// Timeline with Vector Lottie & Fixed-Scroll Responsive Engine
"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LottieAnimation from "@/components/ui/LottieAnimation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type TimelineNodeItem = {
  id: string;
  year: string;
  title: string;
  institution: string;
  badge: string;
  status?: "done" | "current";
  side: "top" | "bottom";
  description?: string;
};

export type TimelineProps = {
  id?: string;
  title?: string;
  periodLabel?: string;
  birthDate?: string;
  textColor?: string;
  mutedTextColor?: string;
  activeColor?: string;
  backgroundColor?: string;
  lottieUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  duration?: number;
  scrollDuration?: number;
  nodes?: TimelineNodeItem[];
};

export const defaultTimelineNodes: TimelineNodeItem[] = [
  {
    id: "icse-vidya-vikasini",
    year: "2011 — 2023",
    title: "ICSE Class 10th",
    institution: "Vidya Vikasini School",
    badge: "95%",
    status: "done",
    side: "bottom",
    description: "Graduated with 95% distinction and highest honors in computer science fundamentals.",
  },
  {
    id: "cbse-rahul-international",
    year: "2023 — 2025",
    title: "CBSE Class 12th",
    institution: "Rahul International School",
    badge: "87%",
    status: "done",
    side: "top",
    description: "Specialized in Computer Science, Mathematics, Physics, and analytical problem solving.",
  },
  {
    id: "btech-dj-sanghvi",
    year: "2025 — 2029 · PRESENT",
    title: "B.Tech Information Technology",
    institution: "DJ Sanghvi College of Engineering",
    badge: "CGPA = 9.33",
    status: "current",
    side: "bottom",
    description: "Specializing in Advanced Data Structures, System Design, Algorithms, and Modern Web Systems.",
  },
];

export default function Timeline({
  id = "education-timeline",
  birthDate = "20th July, 2007",
  lottieUrl,
  videoUrl,
  imageUrl = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
  imageAlt = "Academic workspace",
  nodes = defaultTimelineNodes,
}: TimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);
  const mobileSliderRef = useRef<HTMLDivElement>(null);
  const mobileLineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    // =========================================================
    // 1. DESKTOP / TABLET HORIZONTAL TIMELINE (>= 768px)
    // =========================================================
    mm.add("(min-width: 768px)", () => {
      const slider = sliderRef.current;
      const activeLine = activeLineRef.current;
      if (!slider || !activeLine) return;

      const stops = [0, 0.30, 0.58, 0.82, 1.0];
      section.dataset.storyStops = JSON.stringify(stops);
      window.dispatchEvent(new CustomEvent("portfolio:checkpoints-updated"));

      // Initial idle states before user reaches the section
      gsap.set(activeLine, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".timeline-stem", { scaleY: 0 });
      gsap.set(".timeline-dot", { scale: 0 });
      gsap.set(".timeline-node-card", { autoAlpha: 0, y: 18 });
      gsap.set(".timeline-more-ahead", { autoAlpha: 0, y: 10 });
      gsap.set(".timeline-end-cap", { scale: 0 });
      gsap.set(slider, { xPercent: 0 });

      const targetScrollPercent = -46;

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
        defaults: {
          ease: "none",
        },
      });

      // A. Horizontal slider movement across the viewport
      masterTl.to(
        slider,
        {
          xPercent: targetScrollPercent,
          duration: 1.0,
        },
        0
      );

      // B. Horizontal active red line draws across from 0% to 100%
      masterTl.to(
        activeLine,
        {
          scaleX: 1,
          duration: 0.96,
        },
        0
      );

      // C. Sequential Node Reveals across the scroll journey:
      // Node 1 (Vidya Vikasini - 2011 to 2023 - Bottom): Window 0.12 -> 0.30
      masterTl.to(".stem-node-0", { scaleY: 1, duration: 0.08 }, 0.12);
      masterTl.to(".dot-node-0", { scale: 1, duration: 0.06 }, 0.12);
      masterTl.to(".card-node-0", { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.16);

      // Node 2 (Rahul International - 2023 to 2025 - Top): Window 0.38 -> 0.56
      masterTl.to(".stem-node-1", { scaleY: 1, duration: 0.08 }, 0.38);
      masterTl.to(".dot-node-1", { scale: 1, duration: 0.06 }, 0.38);
      masterTl.to(".card-node-1", { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.42);

      // Node 3 (DJ Sanghvi College - 2025 to 2029 - Bottom): Window 0.64 -> 0.82
      masterTl.to(".stem-node-2", { scaleY: 1, duration: 0.08 }, 0.64);
      masterTl.to(".dot-node-2", { scale: 1, duration: 0.06 }, 0.64);
      masterTl.to(".card-node-2", { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.68);

      // Plain Text "More Ahead..." Reveal over extending line: Window 0.82 -> 0.94
      masterTl.to(".timeline-more-ahead", { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.82);

      // Terminal End Cap: Window 0.92 -> 0.98
      masterTl.to(".timeline-end-cap", { scale: 1, duration: 0.05 }, 0.92);
    });

    // =========================================================
    // 2. MOBILE VERTICAL TIMELINE (< 768px - Pinned Fixed Scroll)
    // =========================================================
    mm.add("(max-width: 767px)", () => {
      const mobileSlider = mobileSliderRef.current;
      const line = mobileLineRef.current;
      if (!mobileSlider || !line) return;

      const stops = [0, 0.28, 0.55, 0.80, 1.0];
      section.dataset.storyStops = JSON.stringify(stops);
      window.dispatchEvent(new CustomEvent("portfolio:checkpoints-updated"));

      gsap.set(line, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(mobileSlider, { yPercent: 0 });
      nodes.forEach((_, i) => {
        gsap.set(`.timeline-v-dot-${i}`, { scale: 0, transformOrigin: "center center" });
        gsap.set(`.timeline-v-stem-${i}`, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(`.timeline-v-card-${i}`, { autoAlpha: 0, y: 20 });
      });
      gsap.set(".timeline-v-footer", { autoAlpha: 0, y: 12 });

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
        defaults: {
          ease: "none",
        },
      });

      // A. Smooth vertical glide across the pinned 100svh viewport
      masterTl.to(
        mobileSlider,
        {
          yPercent: -56,
          duration: 1.0,
        },
        0
      );

      // B. Vertical glowing active line draws down continuously
      masterTl.to(
        line,
        {
          scaleY: 1,
          duration: 0.96,
        },
        0
      );

      // C. Sequential node reveals as each milestone glides into view:
      // Node 1 (Vidya Vikasini - 2011 to 2023): Window 0.14 -> 0.32
      masterTl.to(".timeline-v-dot-0", { scale: 1, duration: 0.08, ease: "back.out(2)" }, 0.14);
      masterTl.to(".timeline-v-stem-0", { scaleX: 1, duration: 0.08, ease: "power1.out" }, 0.16);
      masterTl.to(".timeline-v-card-0", { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.18);

      // Node 2 (Rahul International - 2023 to 2025): Window 0.40 -> 0.58
      masterTl.to(".timeline-v-dot-1", { scale: 1, duration: 0.08, ease: "back.out(2)" }, 0.40);
      masterTl.to(".timeline-v-stem-1", { scaleX: 1, duration: 0.08, ease: "power1.out" }, 0.42);
      masterTl.to(".timeline-v-card-1", { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.44);

      // Node 3 (DJ Sanghvi College - 2025 to 2029 - CURRENT): Window 0.65 -> 0.84
      masterTl.to(".timeline-v-dot-2", { scale: 1, duration: 0.08, ease: "back.out(2)" }, 0.65);
      masterTl.to(".timeline-v-stem-2", { scaleX: 1, duration: 0.08, ease: "power1.out" }, 0.67);
      masterTl.to(".timeline-v-card-2", { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.69);

      // Terminal End Section: Window 0.88 -> 0.98
      masterTl.to(".timeline-v-footer", { autoAlpha: 1, y: 0, duration: 0.10, ease: "power2.out" }, 0.88);
    });

    return () => mm.revert();
  }, [nodes]);

  return (
    <section
      ref={sectionRef}
      id={id}
      data-story-steps="3"
      data-story-track="timeline"
      className="relative w-full bg-transparent select-none h-[280svh] md:h-[260svh]"
    >
      {/* ===================================================================
          DESKTOP / TABLET HORIZONTAL TIMELINE (Sticky Viewport >= 768px)
         =================================================================== */}
      <div className="hidden md:flex sticky top-0 w-full h-[100svh] overflow-hidden items-center justify-start bg-transparent">
        {/* Horizontal Slider Track */}
        <div
          ref={sliderRef}
          className="flex items-center will-change-transform pl-6 md:pl-12 pr-16 md:pr-24"
          style={{ width: "175vw" }}
        >
          {/* Left Origin Anchor & Birth Date Card */}
          <div className="flex flex-col gap-4 w-[340px] md:w-[400px] shrink-0 mr-8 md:mr-12">
            <div className="relative h-56 sm:h-64 w-full rounded-2xl border border-border/80 overflow-hidden shadow-2xl bg-[#08080a] backdrop-blur-xl">
              {lottieUrl ? (
                <div className="absolute inset-0 flex items-center justify-center p-3 overflow-hidden">
                  {/* Subtle ambient radial glow behind the illustration to illuminate dark books and laptop */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(ellipse_65%_65%_at_50%_38%,rgba(255,59,48,0.22)_0%,rgba(255,255,255,0.06)_38%,transparent_72%)] pointer-events-none"
                  />
                  {/* Vector Lottie Animation elevated slightly above bottom text */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center -translate-y-3 sm:-translate-y-4">
                    <LottieAnimation
                      src={lottieUrl}
                      preserveAspectRatio="xMidYMid meet"
                      className="w-full h-full max-w-[280px] max-h-[195px] filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] contrast-[1.1] brightness-[1.15]"
                    />
                  </div>
                </div>
              ) : videoUrl ? (
                <video
                  src={videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover filter brightness-[0.75] contrast-[1.1]"
                />
              ) : (
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  draggable={false}
                  className="h-full w-full object-cover filter brightness-[0.70] contrast-[1.1]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-5 flex flex-col justify-between pointer-events-none">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-widest text-nothing-red uppercase px-2.5 py-1 rounded-full bg-nothing-red/15 border border-nothing-red/40 font-semibold shadow-sm">
                    ORIGIN
                  </span>
                </div>
                <div>
                  <span className="font-mono text-[11px] text-nothing-red uppercase tracking-wider block font-semibold mb-0.5">
                    BORN
                  </span>
                  <h3 className="font-display text-2xl font-bold text-white tracking-tight leading-tight">
                    {birthDate}
                  </h3>
                  <p className="font-mono text-xs text-white/70 mt-1">
                    Mumbai, India · Academic Journey
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Central Horizontal Track with Connecting T-Branches */}
          <div className="relative h-[480px] w-[136vw] shrink-0">
            <div className="absolute left-0 w-[122vw] top-1/2 -translate-y-1/2 h-[2px] bg-white/10 rounded-full" />
            <div
              ref={activeLineRef}
              className="timeline-active-line absolute left-0 w-[122vw] top-1/2 -translate-y-1/2 h-[2px] bg-nothing-red rounded-full shadow-[0_0_12px_rgba(255,59,48,0.85)]"
            />

            {/* Start Origin Node Indicator */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center z-20">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nothing-red opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-nothing-red shadow-[0_0_10px_rgba(255,59,48,0.9)]"></span>
              </span>
            </div>

            {/* The 3 Branch Nodes */}
            {nodes.map((item, index) => {
              const horizontalOffsets = ["18vw", "52vw", "86vw"];
              const offsetLeft = horizontalOffsets[index] || `${(index + 1) * 30}vw`;
              const isTop = item.side === "top";

              return (
                <div
                  key={item.id}
                  className="absolute top-1/2"
                  style={{ left: offsetLeft }}
                >
                  <div
                    className={`dot-node-${index} timeline-dot absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-nothing-red ring-4 ring-nothing-red/25 shadow-[0_0_12px_rgba(255,59,48,0.9)] z-30`}
                  />

                  {isTop ? (
                    <div
                      className={`stem-node-${index} timeline-stem absolute left-0 -translate-x-1/2 bottom-0 w-[2px] h-[48px] bg-nothing-red shadow-[0_0_8px_rgba(255,59,48,0.7)] origin-bottom z-20`}
                      style={{ transformOrigin: "bottom center" }}
                    />
                  ) : (
                    <div
                      className={`stem-node-${index} timeline-stem absolute left-0 -translate-x-1/2 top-0 w-[2px] h-[48px] bg-nothing-red shadow-[0_0_8px_rgba(255,59,48,0.7)] origin-top z-20`}
                      style={{ transformOrigin: "top center" }}
                    />
                  )}

                  <div
                    className={`card-node-${index} timeline-node-card absolute -translate-x-1/2 w-[320px] sm:w-[360px] md:w-[380px] z-30 ${
                      isTop ? "bottom-[48px]" : "top-[48px]"
                    }`}
                  >
                    <div className="relative rounded-2xl border border-border/80 bg-card/75 p-5 shadow-2xl backdrop-blur-xl hover:border-nothing-red/50 transition-colors">
                      <span
                        className={`absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-nothing-red ring-2 ring-background z-40 ${
                          isTop ? "-bottom-1.5" : "-top-1.5"
                        }`}
                      />

                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                          {item.year}
                        </span>
                        {item.status === "current" && (
                          <span className="flex items-center gap-1.5 font-mono text-[10px] text-nothing-red uppercase tracking-widest font-semibold">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nothing-red opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-nothing-red"></span>
                            </span>
                            CURRENT
                          </span>
                        )}
                      </div>

                      <h4 className="font-display text-lg font-bold text-foreground tracking-tight leading-snug">
                        {item.title}
                      </h4>

                      <p className="font-body text-xs sm:text-sm text-muted-foreground mt-0.5 mb-3">
                        {item.institution}
                      </p>

                      <div className="flex items-center justify-between pt-2.5 border-t border-border/40">
                        <span className="font-mono text-xs px-3 py-1 rounded-full bg-card border border-border/70 text-foreground font-semibold shadow-sm">
                          {item.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* "More To Explore..." text over horizontal line */}
            <div
              className="timeline-more-ahead absolute top-1/2 -translate-y-full pb-3.5 select-none pointer-events-none z-20"
              style={{ left: "104vw" }}
            >
              <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-nothing-red drop-shadow-[0_0_14px_rgba(255,59,48,0.7)] whitespace-nowrap">
                More To Explore...
              </span>
            </div>

            {/* Glowing End Terminal Cap */}
            <div
              className="timeline-end-cap absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 origin-center"
              style={{ left: "122vw" }}
            >
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nothing-red opacity-60"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-nothing-red shadow-[0_0_12px_rgba(255,59,48,0.95)]"></span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          MOBILE DEDICATED VERTICAL TIMELINE (< 768px - Fixed Sticky Scroll)
         =================================================================== */}
      <div className="flex md:hidden sticky top-0 w-full h-[100svh] overflow-hidden flex-col items-center justify-start bg-transparent">
        {/* Sliding Vertical Track that moves upwards as user scrolls */}
        <div
          ref={mobileSliderRef}
          className="w-full max-w-sm flex flex-col will-change-transform px-4 pt-14 pb-20"
        >
          {/* Origin Card (Birth Date with Lottie animation) */}
          <div className="relative h-48 sm:h-56 w-full rounded-2xl border border-border/80 overflow-hidden shadow-xl bg-[#08080a] backdrop-blur-xl mb-4 shrink-0">
            {lottieUrl ? (
              <div className="absolute inset-0 flex items-center justify-center p-3 overflow-hidden">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(ellipse_65%_65%_at_50%_38%,rgba(255,59,48,0.22)_0%,rgba(255,255,255,0.06)_38%,transparent_72%)] pointer-events-none"
                />
                <div className="relative z-10 w-full h-full flex items-center justify-center -translate-y-3">
                  <LottieAnimation
                    src={lottieUrl}
                    preserveAspectRatio="xMidYMid meet"
                    className="w-full h-full max-w-[260px] max-h-[180px] filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] contrast-[1.1] brightness-[1.15]"
                  />
                </div>
              </div>
            ) : videoUrl ? (
              <video
                src={videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover filter brightness-[0.75] contrast-[1.1]"
              />
            ) : (
              <img
                src={imageUrl}
                alt={imageAlt}
                draggable={false}
                className="h-full w-full object-cover filter brightness-[0.70] contrast-[1.1]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-5 flex flex-col justify-between pointer-events-none z-20">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-widest text-nothing-red uppercase px-2.5 py-1 rounded-full bg-nothing-red/15 border border-nothing-red/40 font-semibold shadow-sm">
                  ORIGIN
                </span>
              </div>
              <div>
                <span className="font-mono text-[11px] text-nothing-red uppercase tracking-wider block font-semibold mb-0.5">
                  BORN
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
                  {birthDate}
                </h3>
                <p className="font-mono text-xs text-white/70 mt-1">
                  Mumbai, India · Academic Journey
                </p>
              </div>
            </div>
          </div>

          {/* Vertical Timeline Track with Central Spine */}
          <div className="relative w-full flex flex-col">
            {/* Background Vertical Guide Line: Spine axis at exactly 20px */}
            <div className="absolute left-[20px] -translate-x-1/2 top-0 bottom-6 w-[2px] bg-white/10 rounded-full" />

            {/* Animated Scrubbed Glowing Red Fill Line: Spine axis at exactly 20px */}
            <div
              ref={mobileLineRef}
              className="timeline-v-line absolute left-[20px] -translate-x-1/2 top-0 bottom-6 w-[2px] bg-nothing-red rounded-full shadow-[0_0_12px_rgba(255,59,48,0.85)] origin-top"
            />

            {/* Top Origin Pulse Pin on the vertical line: Spine axis at exactly 20px */}
            <div className="absolute left-[20px] top-0 -translate-x-1/2 -translate-y-1/2 flex items-center z-20">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nothing-red opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-nothing-red shadow-[0_0_8px_rgba(255,59,48,0.9)]"></span>
              </span>
            </div>

            {/* Vertical Nodes */}
            {nodes.map((item, index) => (
              <div key={item.id} className="relative w-full pl-[52px] my-3">
                {/* Junction Dot on Vertical Line: Centered precisely at 20px */}
                <div
                  className={`timeline-v-dot-${index} absolute left-[20px] top-6 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-nothing-red ring-4 ring-nothing-red/25 shadow-[0_0_10px_rgba(255,59,48,0.9)] z-20`}
                />

                {/* Horizontal Connecting Stem: Spans 20px to 52px */}
                <div
                  className={`timeline-v-stem-${index} absolute left-[20px] top-6 -translate-y-1/2 w-[32px] h-[2px] bg-nothing-red shadow-[0_0_6px_rgba(255,59,48,0.7)] origin-left z-10`}
                  style={{ transformOrigin: "left center" }}
                />

                {/* Card Container */}
                <div className={`timeline-v-card-${index} relative rounded-2xl border border-border/80 bg-card/85 p-4 shadow-xl backdrop-blur-xl hover:border-nothing-red/50 transition-colors`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                      {item.year}
                    </span>
                    {item.status === "current" && (
                      <span className="flex items-center gap-1.5 font-mono text-[10px] text-nothing-red uppercase tracking-widest font-semibold">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nothing-red opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-nothing-red"></span>
                        </span>
                        CURRENT
                      </span>
                    )}
                  </div>

                  <h4 className="font-display text-base font-bold text-foreground tracking-tight leading-snug">
                    {item.title}
                  </h4>

                  <p className="font-body text-xs text-muted-foreground mt-0.5 mb-2">
                    {item.institution}
                  </p>

                  {item.description && (
                    <p className="font-body text-[11px] text-muted-foreground/80 leading-relaxed mb-2.5">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-card border border-border/70 text-foreground font-semibold shadow-sm">
                      {item.badge}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Terminal End Section: "More To Explore..." */}
            <div className="timeline-v-footer relative w-full pl-[52px] pt-2 flex items-center">
              <div className="absolute left-[20px] top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nothing-red opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-nothing-red shadow-[0_0_10px_rgba(255,59,48,0.95)]"></span>
                </span>
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-nothing-red drop-shadow-[0_0_10px_rgba(255,59,48,0.6)]">
                More To Explore...
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
