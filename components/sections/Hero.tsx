"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight, Github } from "lucide-react";
import Button from "@/components/ui/Button";
import SquaresTerminal from "@/components/ui/squares-terminal";
import type { ContributionDay } from "@/components/ui/contribution-skyline";

// Dynamically import ContributionSkyline to prevent SSR canvas issues
const ContributionSkyline = dynamic(
  () => import("@/components/ui/contribution-skyline"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[320px] rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md flex items-center justify-center p-6 animate-pulse">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-nothing-red border-t-transparent animate-spin" />
          <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
            Synthesizing Skyline Grid...
          </span>
        </div>
      </div>
    ),
  }
);

interface HeroProps {
  contributions?: ContributionDay[];
}

export default function Hero({ contributions }: HeroProps) {
  const hasContributionData = Boolean(contributions?.length);
  const [portfolioReady, setPortfolioReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Start the hero and its canvas only after the boot overlay is fully gone.
  useEffect(() => {
    const startExperience = () => setPortfolioReady(true);
    if (document.documentElement.classList.contains("portfolio-ready")) startExperience();
    window.addEventListener("portfolio:loader-finished", startExperience);
    return () => window.removeEventListener("portfolio:loader-finished", startExperience);
  }, []);

  useEffect(() => {
    if (!portfolioReady) return;
    containerRef.current?.classList.add("is-loaded");
  }, [portfolioReady]);

  // Subtle interactive parallax effect
  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || prefersReducedMotion) return;

    const hero = containerRef.current;
    const visual = visualRef.current;
    const glow = glowRef.current;
    if (!hero) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      if (visual) visual.style.transform = `translate(${px * -16}px, ${py * -16}px)`;
      if (glow) glow.style.transform = `translate(${px * 32}px, ${py * 32}px)`;
    };

    hero.addEventListener("mousemove", handleMouseMove);
    return () => hero.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="hero relative min-h-[100svh] flex flex-col justify-between pt-10 md:pt-14 lg:pt-16 pb-8 md:pb-10 px-6 md:px-14 lg:px-20 overflow-hidden border-b border-border/30"
    >
      {/* Squares Terminal Background (React Bits Pro - Red Phosphor CRT Grid) */}
      <div
        aria-hidden="true"
        className="hero-grid absolute inset-0 pointer-events-none overflow-hidden z-0"
      >
        <SquaresTerminal
          color="#ff3b30"
          backgroundColor="transparent"
          columns={128}
          rows={128}
          speed={15}
          rowBias={0}
          fillThreshold={0.3}
          dashHead={0.1}
          dashTail={1}
          rowFloor={0.3}
          alternateRows={true}
          curvature={1}
          glow={0.25}
          vignette={0.6}
          opacity={0.4}
        />
      </div>

      {/* Red Ambient Glow behind visual */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute top-1/4 right-[5%] w-[420px] lg:w-[600px] h-[420px] lg:h-[600px] rounded-full bg-nothing-red/10 blur-[130px] -z-10 transition-transform duration-300 ease-out"
      />

      {/* Main Content Area (Shifted upwards cleanly into newly freed space) */}
      <div className="relative z-10 w-full flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8 xl:gap-8 flex-1 justify-center my-auto py-4">
        {/* Left: Typography & Call To Action (Exact Image 1 content: DESIGN. CODE. CREATE.) */}
        <div className="hero-inner flex flex-col max-w-4xl w-full">
          {/* Hero Main Heading (Clean Nothing OS Doto text with natural dot-matrix period) */}
          <h1 className="hero-title font-display text-4xl sm:text-6xl md:text-7xl lg:text-[7.2rem] xl:text-[8.2rem] font-bold tracking-tight uppercase leading-[0.92] text-foreground select-none">
            <span className="line block overflow-hidden" data-line="1">
              <span className="word inline-block">DESIGN.</span>
            </span>
            <span className="line block overflow-hidden" data-line="2">
              <span className="word inline-block">CODE.</span>
            </span>
            <span className="line block overflow-hidden" data-line="3">
              <span className="word inline-block outlined-doto">CREATE.</span>
            </span>
          </h1>

          {/* Subtitle & CTA Row */}
          <div className="hero-sub-row mt-6 sm:mt-8 flex flex-wrap items-end justify-between gap-6 sm:gap-8 max-w-2xl">
            <p className="hero-sub font-body text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md">
              Full-stack developer &amp; engineering student building clean, purposeful digital
              solutions — from scratch to deployed interfaces.
            </p>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Button
                href="#projects"
                variant="primary"
                size="lg"
                icon={<ArrowUpRight className="w-4 h-4" />}
              >
                Explore My Work
              </Button>

              <Button
                href="#contact"
                variant="outline"
                size="lg"
              >
                Get In Touch
              </Button>
            </div>
          </div>
        </div>

        {/* Right: 3D Contribution Skyline Component */}
        <div
          ref={visualRef}
          className="hero-visual w-full max-w-full sm:max-w-[480px] xl:max-w-[500px] transition-transform duration-300 ease-out flex-shrink-0 self-center xl:self-auto"
        >
          <div className="relative mx-auto w-full">
            {/* Corner Tech Badges */}
            <div className="absolute -top-3 -right-2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border/80 shadow-md font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-nothing-red animate-pulse-glow" />
              <span>3D ISOMETRIC</span>
            </div>

            {hasContributionData && portfolioReady ? (
              <ContributionSkyline
                data={contributions}
                defaultView="3d"
                orbit
                showStats
                showLegend
                showToggle
                heightScale={1.1}
                title="GITHUB TELEMETRY"
                className="shadow-2xl border-border/60 bg-card/80 backdrop-blur-xl"
              />
            ) : hasContributionData ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center gap-5 rounded-2xl border border-border/50 bg-card/60 p-6 sm:p-8">
                <span className="font-mono text-[10px] tracking-[.18em] text-muted-foreground">PROFILE / ACTIVITY</span>
                <div className="startup-loader__dots" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <span key={index} />)}</div>
                <span className="font-mono text-[10px] tracking-[.18em] text-muted-foreground">PREPARING TELEMETRY</span>
              </div>
            ) : (
              <div className="flex min-h-[320px] flex-col items-start justify-between gap-6 rounded-2xl border border-border/50 bg-card/60 p-6 sm:p-8">
                <div className="flex w-full items-center justify-between border-b border-border/40 pb-4 font-mono text-[10px] tracking-[.18em] text-muted-foreground">
                  <span>PROFILE / ACTIVITY</span><span className="text-nothing-red">PROFILE READY</span>
                </div>
                <div className="max-w-sm">
                  <Github className="mb-4 h-6 w-6 text-nothing-red" />
                  <h2 className="font-display text-2xl font-semibold text-foreground">GitHub activity, directly from the source.</h2>
                  <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">Live contribution data is temporarily unavailable. You can still explore my public work on GitHub.</p>
                </div>
                <Button href="https://github.com/PreethRavani" variant="outline" size="sm" icon={<ArrowUpRight className="h-4 w-4" />}>Open GitHub</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Bottom Metadata Row */}
      <div className="hero-meta relative z-10 pt-6 pb-1 flex flex-wrap items-center justify-between gap-4 font-mono text-xs tracking-widest uppercase text-muted-foreground border-t border-border/20">
        <div className="meta-item flex items-center gap-2.5">
          <span className="meta-dot meta-dot--live w-2 h-2 rounded-full bg-nothing-red animate-pulse-glow" />
          <span>AVAILABLE FOR SELECT PROJECTS &amp; INTERNSHIPS</span>
        </div>

        <div className="meta-item meta-item--right flex items-center gap-2.5">
          <span>BASED IN MUMBAI, INDIA</span>
          <span className="meta-dot meta-dot--red text-nothing-red font-bold">●</span>
        </div>
      </div>

      {/* Centered Scroll Down Hint */}
      <div
        className="scroll-indicator hidden md:flex absolute bottom-5 left-1/2 -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-muted-foreground pointer-events-none"
        aria-hidden="true"
      >
        <span>SCROLL</span>
        <div className="scroll-line w-[1px] h-8 bg-border/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-foreground animate-scroll-drop" />
        </div>
      </div>
    </section>
  );
}
