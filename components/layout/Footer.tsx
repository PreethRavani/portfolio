"use client";

import React from "react";
import { ArrowUp } from "lucide-react";
import { useLenis } from "@/components/providers/LenisProvider";
import MagneticWrapper from "@/components/ui/MagneticWrapper";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const lenis = useLenis();
  const currentYear = new Date().getFullYear();

  // On the home page, the docked footer slides in inside the pinned Connect section
  if (pathname === "/") {
    return null;
  }

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative border-t border-border/40 px-6 md:px-16 pt-16 pb-12 bg-background transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        {/* Footer Top Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-12 border-b border-border/30">
          <p className="font-mono text-xs tracking-[0.16em] uppercase text-muted-foreground">
            09 / FOOTER
          </p>

          <MagneticWrapper strength={0.3}>
            <button
              type="button"
              onClick={scrollToTop}
              className="group flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-border/60 hover:border-nothing-red bg-card/40 hover:bg-card text-foreground font-mono text-xs tracking-wider uppercase transition-all duration-300"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-nothing-red transition-transform duration-300 group-hover:-translate-y-1" />
            </button>
          </MagneticWrapper>
        </div>

        {/* Footer Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
          <p>© {currentYear} Preeth Ravani. Engineered with Next.js & TypeScript.</p>
          <p className="italic text-muted-foreground/80">Less screen time. More life.</p>
        </div>
      </div>
    </footer>
  );
}
