"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import MagneticWrapper from "@/components/ui/MagneticWrapper";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveredTop, setIsHoveredTop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleScroll = () => {
      const aboutSection = document.getElementById("about");
      // Starts appearing as user scrolls into the About Me section
      const threshold = aboutSection ? aboutSection.offsetTop - 120 : window.innerHeight * 0.65;
      const nextVisible = window.scrollY >= threshold;
      setIsVisible((current) => current === nextVisible ? current : nextVisible);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // If in Hero section and mouse hovers near the very top (within 35px), peek navbar
      if (e.clientY <= 35) {
        setIsHoveredTop(true);
      } else if (e.clientY > 95) {
        setIsHoveredTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const showNavbar = isVisible || isHoveredTop || menuOpen || isMobile;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[960] flex items-center justify-between px-6 md:px-12 py-3.5 md:py-4 transition-all duration-500 ease-out ${
          showNavbar
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-full opacity-0 pointer-events-none"
        } ${
          menuOpen
            ? "bg-transparent border-b border-transparent shadow-none"
            : "bg-background/80 backdrop-blur-md border-b border-border/20 shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
        }`}
      >
        {/* Logo */}
        <MagneticWrapper strength={0.2}>
          <Link
            href="/#hero"
            className="logo flex items-center gap-2.5 font-mono text-xs md:text-[13px] tracking-[0.14em] uppercase text-foreground hover:text-nothing-red transition-colors focus-visible:outline-none"
            aria-label="Preeth Portfolio Home"
            onClick={() => {
              if (menuOpen) setMenuOpen(false);
            }}
          >
            <span className="text-nothing-red text-sm font-bold animate-pulse-glow">◆</span>
            <span className="font-semibold text-white">
              PREETH <span className="text-muted-foreground font-normal">/ PORTFOLIO</span>
            </span>
          </Link>
        </MagneticWrapper>

        {/* Header Right: Menu Button / Close Button Toggle */}
        <div className="flex items-center gap-4">
          <MagneticWrapper strength={0.3}>
            <button
              type="button"
              id="menuBtn"
              onClick={() => setMenuOpen(!menuOpen)}
              className={`flex items-center gap-2.5 px-4 py-1.5 rounded-full border transition-all duration-300 ${
                menuOpen
                  ? "border-nothing-red bg-nothing-red/10 text-nothing-red shadow-[0_0_12px_rgba(255,59,48,0.25)]"
                  : "border-border/60 hover:border-nothing-red bg-card/60 text-foreground"
              }`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="menuOverlay"
            >
              {/* 4-dot grid icon */}
              <span className="grid grid-cols-2 gap-1 w-2.5 h-2.5">
                <i className={`w-1 h-1 rounded-[0.5px] transition-colors ${menuOpen ? "bg-nothing-red" : "bg-foreground"}`} />
                <i className={`w-1 h-1 rounded-[0.5px] transition-colors ${menuOpen ? "bg-nothing-red" : "bg-foreground"}`} />
                <i className={`w-1 h-1 rounded-[0.5px] transition-colors ${menuOpen ? "bg-nothing-red" : "bg-foreground"}`} />
                <i className={`w-1 h-1 rounded-[0.5px] transition-colors ${menuOpen ? "bg-nothing-red" : "bg-foreground"}`} />
              </span>
              <span className="font-mono text-[11px] tracking-widest uppercase">
                {menuOpen ? "CLOSE" : "MENU"}
              </span>
            </button>
          </MagneticWrapper>
        </div>
      </header>

      {/* Full-screen menu overlay */}
      <MobileMenu isOpen={menuOpen} onClose={closeMenu} />
    </>
  );
}
