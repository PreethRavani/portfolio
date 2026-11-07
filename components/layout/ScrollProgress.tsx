"use client";

import React, { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${pct})`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateScrollProgress();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2px] z-[90] bg-border/20 pointer-events-none"
      aria-hidden="true"
    >
      <div
        ref={fillRef}
        className="h-full bg-gradient-to-r from-foreground via-nothing-red to-nothing-red origin-left"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
