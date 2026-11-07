"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    document.documentElement.classList.add("motion-ready");

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scanAndObserve = () => {
      const targets = document.querySelectorAll<HTMLElement>(
        ".reveal-line, .reveal-fade, .reveal-up, .about-grid, .stat-grid, .skills-groups, .project-card, .cert-card-grid, .achieve-card, .social-grid, .contact-grid"
      );

      if (prefersReducedMotion) {
        targets.forEach((t) => t.classList.add("is-visible"));
        return;
      }

      const viewportH = window.innerHeight;

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const target = entry.target as HTMLElement;
            if (entry.isIntersecting) {
              target.classList.add("is-visible");
              io.unobserve(target);
            }
          });
        },
        {
          threshold: 0.05,
          rootMargin: "80px 0px 80px 0px",
        }
      );

      targets.forEach((t) => {
        const rect = t.getBoundingClientRect();
        // If the element is within or above the viewport, reveal immediately
        if (rect.top <= viewportH + 60) {
          t.classList.add("is-visible");
        } else {
          io.observe(t);
        }
      });
    };

    // Run scan immediately and after a short tick for layout completion
    scanAndObserve();
    const timer1 = window.setTimeout(scanAndObserve, 100);
    const timer2 = window.setTimeout(scanAndObserve, 400);

    // If navigating back with a hash like #projects, scroll smoothly to target
    if (window.location.hash) {
      const hashId = window.location.hash.replace("#", "");
      const timerHash = window.setTimeout(() => {
        const el = document.getElementById(hashId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          scanAndObserve();
        }
      }, 150);
      return () => {
        window.clearTimeout(timer1);
        window.clearTimeout(timer2);
        window.clearTimeout(timerHash);
      };
    }

    return () => {
      window.clearTimeout(timer1);
      window.clearTimeout(timer2);
    };
  }, [pathname]);

  return null;
}
