"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const checkpointsRef = useRef<number[]>([]);

  useEffect(() => {
    if (!lenisRef.current) return;
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("portfolio:checkpoints-updated"));
      lenisRef.current?.resize();
    }, 120);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    // Global Checkpoint Manager: Maps all chapter boundaries and title morphs
    // to exact absolute page scroll coordinates in pixels.
    const updateCheckpoints = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("section[data-story-steps]"));
      const triggers = ScrollTrigger.getAll();
      const points: number[] = [0];

      sections.forEach((section) => {
        const trigger = triggers.find((t) => t.trigger === section);
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const start = trigger ? trigger.start : sectionTop;
        const end = trigger ? trigger.end : sectionTop + section.offsetHeight;
        const span = Math.max(0, end - start);

        // Section entrance boundary
        points.push(start);

        if (section.dataset.storyStops) {
          try {
            const stops = JSON.parse(section.dataset.storyStops) as number[];
            stops.forEach((stop) => {
              points.push(start + stop * span);
            });
          } catch {
            // fallback
          }
        }

        // Section exit boundary
        points.push(end);
      });

      const unique = Array.from(new Set(points.map((p) => Math.round(p))))
        .filter((p) => p >= 0 && Number.isFinite(p))
        .sort((a, b) => a - b);

      checkpointsRef.current = unique;
    };

    const instance = new Lenis({
      lerp: 0.09, // Continuous exponential damping: mathematically monotonic, zero oscillation
      smoothWheel: true,
      syncTouch: false, // Native 120Hz touch physics on mobile/trackpad gestures
      wheelMultiplier: 0.95,
      touchMultiplier: 1.0,
      autoRaf: false, // Driven strictly by GSAP ticker for perfect 60/120fps sync
      anchors: true,
      virtualScroll: (data) => {
        const event = data.event;
        if (event.type !== "wheel" || !data.deltaY) return true;
        const wheelEvent = event as WheelEvent;
        if (wheelEvent.ctrlKey || wheelEvent.shiftKey) return true;

        const portfolioMain = document.querySelector<HTMLElement>("main");
        if (!portfolioMain) return true;

        if (!checkpointsRef.current.length) {
          updateCheckpoints();
        }

        const direction = Math.sign(data.deltaY);
        const absDelta = Math.abs(data.deltaY);

        // Cap one wheel event to a comfortable amount, then discard only the
        // portion that would cross the next story checkpoint. A later wheel
        // event remains free to continue from that point; there is no gesture
        // lock, forced snap, or programmatic scroll reset.
        const maxDelta = Math.max(90, Math.min(130, window.innerHeight * 0.13));
        let allowedDelta = Math.min(absDelta, maxDelta);
        const destination = instance.targetScroll ?? instance.scroll ?? window.scrollY;
        const checkpoints = checkpointsRef.current;
        const nextCheckpoint = direction > 0
          ? checkpoints.find((checkpoint) => checkpoint > destination + 2)
          : [...checkpoints].reverse().find((checkpoint) => checkpoint < destination - 2);

        if (nextCheckpoint !== undefined) {
          const distance = Math.abs(nextCheckpoint - destination);
          if (distance > 2 && allowedDelta > distance) allowedDelta = distance;
        }

        data.deltaY = direction * allowedDelta;
        return true;
      },
    });

    lenisRef.current = instance;
    let disposed = false;
    queueMicrotask(() => {
      if (!disposed) setLenis(instance);
    });

    // Synchronize ScrollTrigger with Lenis via GSAP ticker
    const tick = (time: number) => {
      instance.raf(time * 1000);
    };
    const updateScrollTrigger = () => {
      ScrollTrigger.update();
    };

    instance.on("scroll", updateScrollTrigger);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Keep checkpoints freshly synchronized with layout and font metrics
    window.addEventListener("portfolio:checkpoints-updated", updateCheckpoints);
    window.addEventListener("resize", updateCheckpoints);
    window.addEventListener("load", updateCheckpoints);
    ScrollTrigger.addEventListener("refresh", updateCheckpoints);
    const timer = setTimeout(updateCheckpoints, 800);

    return () => {
      disposed = true;
      clearTimeout(timer);
      window.removeEventListener("portfolio:checkpoints-updated", updateCheckpoints);
      window.removeEventListener("resize", updateCheckpoints);
      window.removeEventListener("load", updateCheckpoints);
      ScrollTrigger.removeEventListener("refresh", updateCheckpoints);
      instance.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(tick);
      instance.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
