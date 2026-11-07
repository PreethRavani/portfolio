"use client";

import React, { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch devices or reduced motion
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || prefersReducedMotion) return;

    document.body.classList.add("custom-cursor-active");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;
    let rafId: number | null = null;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx}px, ${my}px)`;
      }

      if (!rafId) {
        rafId = requestAnimationFrame(loop);
      }
    };

    function loop() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${cx}px, ${cy}px)`;
      }

      if (Math.abs(mx - cx) > 0.3 || Math.abs(my - cy) > 0.3) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = null;
      }
    }

    const interactiveSelector = "a, button, .magnetic, input, textarea, .interactive, [role='button'], .project-card, .cert-card";

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest(interactiveSelector)) {
        cursorRef.current?.classList.add("is-active");
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest(interactiveSelector)) {
        cursorRef.current?.classList.remove("is-active");
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={cursorRef} className="cursor-wrapper pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      {/* Small center dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-foreground transition-opacity duration-200"
      />
      {/* Outer tracking ring */}
      <div
        ref={ringRef}
        className="cursor-ring pointer-events-none fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border border-foreground/40 transition-[width,height,border-color,background-color] duration-200 ease-out"
      />
    </div>
  );
}
