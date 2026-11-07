"use client";

import { useEffect, useRef, useState } from "react";

export default function AchievementCounter({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasCounted = useRef(false);

  useEffect(() => {
    let animFrame = 0;

    const startCounting = () => {
      if (hasCounted.current) return;
      hasCounted.current = true;
      cancelAnimationFrame(animFrame);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setDisplay(value);
        return;
      }

      const start = performance.now();
      const duration = 1250;
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 4);
        setDisplay(value * eased);
        if (progress < 1) {
          animFrame = requestAnimationFrame(tick);
        } else {
          setDisplay(value);
        }
      };
      animFrame = requestAnimationFrame(tick);
    };

    // Listen for custom events dispatched by StoryMotion when Beat 3 reveals the cards
    // Count once when the card first enters view, at every viewport size.
    let observer: IntersectionObserver | null = null;
    const node = ref.current;
    if (node) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          startCounting();
          observer?.disconnect();
        }
      }, { threshold: 0.3 });
      observer.observe(node);
    }

    return () => {
      cancelAnimationFrame(animFrame);
      if (observer) observer.disconnect();
    };
  }, [value]);

  const formatted = Number.isInteger(value) ? Math.floor(display).toString() : display.toFixed(2);
  return (
    <span
      ref={ref}
      className="achieve-number font-display text-4xl sm:text-5xl font-semibold text-foreground tracking-tight block"
      aria-label={`${Number.isInteger(value) ? value : value.toFixed(2)}${suffix}`}
    >
      {formatted}{suffix}
    </span>
  );
}
