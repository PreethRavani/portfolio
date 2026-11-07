"use client";

import React, { useEffect, useRef } from "react";
import { useLenis } from "@/components/providers/LenisProvider";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { href: "#about", label: "About", index: "01" },
  { href: "#education", label: "Timeline", index: "02" },
  { href: "#skills", label: "Skills", index: "03" },
  { href: "#projects", label: "Projects", index: "04" },
  { href: "#certifications", label: "Certifications", index: "05" },
  { href: "#achievements", label: "Achievements", index: "06" },
  { href: "#social", label: "Social", index: "07" },
  { href: "#contact", label: "Contact", index: "08" },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const lenis = useLenis();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    if (isOpen) overlay.removeAttribute("inert");
    else overlay.setAttribute("inert", "");
  }, [isOpen]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (!isOpen) {
      lenis?.start();
      document.documentElement.classList.remove("menu-open");
      document.body.classList.remove("menu-open");
      return;
    }

    lenis?.stop();
    document.documentElement.classList.add("menu-open");
    document.body.classList.add("menu-open");
    const firstLink = overlay.querySelector<HTMLElement>("a");
    const focusTimer = window.setTimeout(() => firstLink?.focus(), 80);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(overlay.querySelectorAll<HTMLElement>("a[href]"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      lenis?.start();
      document.documentElement.classList.remove("menu-open");
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, lenis, onClose]);

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    onClose();
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    window.setTimeout(() => {
      const top = target.getBoundingClientRect().top + window.scrollY - 84;
      if (lenis) lenis.scrollTo(top, { duration: 0.75 });
      else window.scrollTo({ top, behavior: "smooth" });
    }, 220);
  };

  return (
    <div
      ref={overlayRef}
      id="menuOverlay"
      role="dialog"
      aria-modal={isOpen || undefined}
      aria-label="Portfolio navigation"
      aria-hidden={!isOpen}
      data-lenis-prevent="true"
      className={`menu-overlay ${isOpen ? "is-open" : ""}`}
    >
      <ul className="menu-list">
        {MENU_ITEMS.map((item) => (
          <li key={item.href}>
            <a href={item.href} data-index={item.index} onClick={(event) => handleLinkClick(event, item.href)}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="menu-footer">
        <span>BASED IN INDIA</span><span className="dot-live" />
      </div>
    </div>
  );
}
