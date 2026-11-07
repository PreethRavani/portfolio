"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import { useLenis } from "@/components/providers/LenisProvider";

interface FlowScrollRailProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

// Generate the cybernetic path data targeting the given docking point with seamless C1 continuous curvature
function getCanonicalPath(dockX: number, dockY: number): string {
  // Clamped docking coordinates in 1000x8000 SVG space
  const clampedDockX = Math.round(Math.max(400, Math.min(950, dockX)) * 10) / 10;
  const clampedDockY = Math.round(Math.max(6800, Math.min(7960, dockY)) * 10) / 10;

  // The rail swoops out to the right around the social cards (reaching ~895 to the right of Instagram),
  // then arches gracefully down along the right margin and sweeps inward into the top-right corner of the phone chassis
  const apexX = 895;
  const apexY = Math.min(clampedDockY - 520, 7020);
  const dyApex = clampedDockY - apexY;

  const cp1B_Y = apexY + dyApex * 0.42;
  const cp2B_X = clampedDockX + 28;
  const cp2B_Y = clampedDockY - dyApex * 0.35;

  return `
    M 160 80
    C 160 400, 840 550, 840 950
    C 840 1350, 180 1550, 180 1950
    C 180 2350, 840 2650, 840 3050
    C 840 3450, 180 3750, 180 4150
    C 180 4550, 840 4850, 840 5250
    C 840 5650, 180 5950, 180 6350
    C 180 6670, ${apexX} 6720, ${apexX} ${apexY}
    C ${apexX} ${cp1B_Y.toFixed(1)}, ${cp2B_X.toFixed(1)} ${cp2B_Y.toFixed(1)}, ${clampedDockX.toFixed(1)} ${clampedDockY.toFixed(1)}
  `;
}

export default function FlowScrollRail({ containerRef }: FlowScrollRailProps) {
  const prefersReducedMotion = useReducedMotion();
  const lenis = useLenis();
  const [isMobile, setIsMobile] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const auraRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGGElement>(null);

  // Cached geometry and physics state stored in refs to prevent React re-renders & frame drops
  const dockPointRef = useRef<{ x: number; y: number }>({ x: 770, y: 7550 });
  const dockPixelYRef = useRef<number>(7500);
  const wasConnectedRef = useRef(false);
  const totalLengthRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // High-performance metrics caching: avoids forced layout reflows (getBoundingClientRect) on every scroll frame
  const containerMetricsRef = useRef({
    top: 0,
    height: 8000,
    width: 1000,
    viewportHeight: 800,
  });

  const updateContainerMetrics = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const vpHeight = window.innerHeight || 800;
    const vpWidth = window.innerWidth || 1000;
    containerMetricsRef.current = {
      top: rect.top + scrollTop,
      height: rect.height || containerRef.current.offsetHeight || 8000,
      width: rect.width || vpWidth,
      viewportHeight: vpHeight,
    };
  }, [containerRef]);

  // Initialize SVG strokeDasharray once per geometry change
  const initDashArray = (length: number) => {
    if (length <= 0) return;
    const dashStr = `${length} ${length}`;
    if (pathRef.current) pathRef.current.style.strokeDasharray = dashStr;
    if (auraRef.current) auraRef.current.style.strokeDasharray = dashStr;
  };

  // Update SVG path `d` geometry directly on DOM without triggering component re-render
  const applyPathGeometry = useCallback((dockX: number, dockY: number) => {
    dockPointRef.current = { x: dockX, y: dockY };
    const newPathD = getCanonicalPath(dockX, dockY);

    if (pathRef.current) pathRef.current.setAttribute("d", newPathD);
    if (auraRef.current) auraRef.current.setAttribute("d", newPathD);

    if (pathRef.current) {
      try {
        const len = pathRef.current.getTotalLength();
        totalLengthRef.current = len;
        initDashArray(len);
      } catch {
        totalLengthRef.current = 0;
      }
    }
  }, []);

  // Measure dock target position on the 3D phone chassis (runs on mount and resize only)
  const updateDockGeometry = useCallback(() => {
    updateContainerMetrics();
    if (!containerRef.current) return;
    const target =
      document.getElementById("phone-dock-target") ||
      document.getElementById("portfolio-phone-chassis");
    if (!target) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    if (containerRect.width <= 0 || containerRect.height <= 0) return;

    let targetPxX = targetRect.left - containerRect.left;
    let targetPxY = targetRect.top - containerRect.top;

    if (target.id === "phone-dock-target") {
      targetPxX += targetRect.width / 2;
      targetPxY += targetRect.height / 2;
    } else {
      // Dock along top-right rim above battery icon
      targetPxX += targetRect.width * 0.86;
      targetPxY += 4;
    }

    dockPixelYRef.current = targetPxY;

    const svgX = (targetPxX / containerRect.width) * 1000;
    const svgY = (targetPxY / containerRect.height) * 8000;

    const clampedX = Math.round(Math.max(250, Math.min(950, svgX)) * 10) / 10;
    const clampedY = Math.round(Math.max(6800, Math.min(7960, svgY)) * 10) / 10;

    const current = dockPointRef.current;
    if (Math.abs(current.x - clampedX) > 2 || Math.abs(current.y - clampedY) > 2) {
      applyPathGeometry(clampedX, clampedY);
    }
  }, [containerRef, applyPathGeometry, updateContainerMetrics]);

  // Viewport-locked continuous scroll renderer:
  // - Computes position directly from live scroll offset using cached metrics (Zero layout reflows!)
  // - Spark head is physically welded to the drawn stroke tip on every frame with zero offset/gap
  // - Runs at smooth 60/120fps with zero mobile jank
  const updateScrollFlow = useCallback(() => {
    if (!containerRef.current || !pathRef.current) return;

    const metrics = containerMetricsRef.current;
    const currentScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const scrolledInside = currentScrollY - metrics.top;
    const viewportHeight = metrics.viewportHeight;
    const containerHeight = metrics.height;
    if (containerHeight <= 0) return;

    // Reduced motion: draw line at 100% full length
    if (prefersReducedMotion) {
      if (pathRef.current && totalLengthRef.current > 0) {
        pathRef.current.style.strokeDashoffset = "0px";
        if (auraRef.current) auraRef.current.style.strokeDashoffset = "0px";
      }
      return;
    }

    const isMob = window.innerWidth < 768;
    const leadFactor = isMob ? 0.78 : 0.74;
    const morphDistance = viewportHeight * 0.40;
    const startPixelY = (80 / 8000) * containerHeight;

    let targetPxY = 0;
    if (scrolledInside <= 0) {
      targetPxY = 0;
    } else if (scrolledInside < morphDistance) {
      // During About title morph, glide gently down from the top node (startPixelY)
      const morphP = scrolledInside / morphDistance;
      targetPxY = startPixelY + morphP * (morphDistance + viewportHeight * leadFactor - startPixelY);
    } else {
      // 1:1 scroll lock with the viewport: advances 1px for every 1px scrolled!
      targetPxY = scrolledInside + viewportHeight * leadFactor;
    }

    // Clamped target cannot overshoot the measured phone chassis docking rim
    const dockPixelY = dockPixelYRef.current || (containerHeight * 0.954);
    const clampedPxY = Math.min(dockPixelY, Math.max(0, targetPxY));

    // Convert pixel position to normalized progress (0 to 1) along the rail
    const railSpan = Math.max(100, dockPixelY - startPixelY);
    const progress = Math.max(0, Math.min(1, (clampedPxY - startPixelY) / railSpan));

    // Stable opacity: 0 during Hero, fades up smoothly to 1.0 within first 80px of About,
    // and stays locked at 1.0 throughout the entire site (zero blinking/flickering)
    const opacity = scrolledInside <= 0 ? 0 : Math.min(1, scrolledInside / 80);

    // Physical connection check: spark arrives within 18px of the top chassis rim
    const isNearDock = clampedPxY >= dockPixelY - 18;
    const isCurrentlyConnected = wasConnectedRef.current
      ? clampedPxY >= dockPixelY - 40 // hysteresis prevents flicker on micro-scrolls
      : isNearDock;

    if (isCurrentlyConnected !== wasConnectedRef.current) {
      wasConnectedRef.current = isCurrentlyConnected;
      if (typeof window !== "undefined") {
        (window as unknown as { __portfolioRailConnected?: boolean }).__portfolioRailConnected = isCurrentlyConnected;
        window.dispatchEvent(
          new CustomEvent("portfolio:rail-connection", {
            detail: { connected: isCurrentlyConnected },
          })
        );
      }
    }

    if (!totalLengthRef.current || totalLengthRef.current <= 0) {
      try {
        totalLengthRef.current = pathRef.current.getTotalLength();
        initDashArray(totalLengthRef.current);
      } catch {
        totalLengthRef.current = 0;
      }
    }
    const totalLength = totalLengthRef.current;
    if (totalLength <= 0) return;

    const strokeOffset = totalLength * (1 - progress);
    const offsetStr = `${strokeOffset.toFixed(2)}px`;
    const opacityStr = `${opacity.toFixed(2)}`;

    // Direct compositor-friendly dashoffset updates (Zero layout recalculation)
    pathRef.current.style.strokeDashoffset = offsetStr;
    pathRef.current.style.opacity = opacityStr;

    if (auraRef.current) {
      auraRef.current.style.strokeDashoffset = offsetStr;
      auraRef.current.style.opacity = `${(opacity * 0.25).toFixed(2)}`;
    }

    // Position traveling spark head EXACTLY AT THE MATHEMATICAL TIP OF THE DRAWN STROKE
    // Zero capOffset: eliminates any gap or exposed stroke cut completely
    if (headRef.current) {
      try {
        const targetDist = Math.min(totalLength, Math.max(0, totalLength * progress));
        const currentPoint = pathRef.current.getPointAtLength(targetDist);
        const counterScaleY = Math.max(0.1, Math.min(3, (8 * metrics.width) / containerHeight));

        headRef.current.setAttribute(
          "transform",
          `translate(${currentPoint.x.toFixed(1)}, ${currentPoint.y.toFixed(1)}) scale(1, ${counterScaleY.toFixed(4)})`
        );
        headRef.current.style.opacity = opacity > 0.05 ? "1" : "0";
      } catch {
        // ignore layout timing edge cases
      }
    }
  }, [containerRef, prefersReducedMotion]);

  // Main lifecycle: unthrottled continuous RAF scheduler that NEVER cancels pending frames mid-scroll
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    updateContainerMetrics();

    if (pathRef.current) {
      try {
        const len = pathRef.current.getTotalLength();
        totalLengthRef.current = len;
        initDashArray(len);
      } catch {
        totalLengthRef.current = 0;
      }
    }

    // Non-cancelling RAF queue: guarantees updateScrollFlow executes on EVERY display frame during continuous scroll
    const renderTick = () => {
      if (rafRef.current !== null) return; // already queued for this display frame!
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        updateScrollFlow();
      });
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      updateContainerMetrics();
      updateDockGeometry();
      if (pathRef.current) {
        try {
          const len = pathRef.current.getTotalLength();
          totalLengthRef.current = len;
          initDashArray(len);
        } catch {}
      }
      renderTick();
    };

    // Immediate initial execution
    updateDockGeometry();
    updateScrollFlow();

    const t1 = setTimeout(() => {
      updateContainerMetrics();
      updateDockGeometry();
      if (pathRef.current) {
        try {
          const len = pathRef.current.getTotalLength();
          totalLengthRef.current = len;
          initDashArray(len);
        } catch {}
      }
      updateScrollFlow();
    }, 120);

    const t2 = setTimeout(() => {
      updateContainerMetrics();
      updateDockGeometry();
      updateScrollFlow();
    }, 450);

    if (lenis) {
      lenis.on("scroll", renderTick);
    }
    window.addEventListener("scroll", renderTick, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize, { passive: true });
    window.addEventListener("portfolio:section-revealed", handleResize);
    window.addEventListener("portfolio:checkpoints-updated", handleResize);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (lenis) lenis.off("scroll", renderTick);
      window.removeEventListener("scroll", renderTick);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      window.removeEventListener("portfolio:section-revealed", handleResize);
      window.removeEventListener("portfolio:checkpoints-updated", handleResize);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [containerRef, lenis, updateContainerMetrics, updateDockGeometry, updateScrollFlow]);

  const initialPathD = getCanonicalPath(770, 7550);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none will-change-transform"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 1000 8000"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Muted industrial dull red gradient for thick solid rail */}
          <linearGradient id="dullRedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#801c1e" />
            <stop offset="50%" stopColor="#96282a" />
            <stop offset="100%" stopColor="#872022" />
          </linearGradient>

          {/* Spark Head subtle muted red aura */}
          <radialGradient id="sparkHeadDullGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#96282a" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#801c1e" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#801c1e" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Subtle Soft Depth Underlayer */}
        <path
          ref={auraRef}
          d={initialPathD}
          stroke="rgba(128, 28, 30, 0.25)"
          strokeWidth={isMobile ? "22" : "9"}
          strokeLinecap="butt"
        />

        {/* 2. Primary Thick Solid Dull Red Rail */}
        <path
          ref={pathRef}
          d={initialPathD}
          stroke="url(#dullRedGradient)"
          strokeWidth={isMobile ? "13" : "5.5"}
          strokeLinecap="butt"
        />

        {/* 3. Solid Dull Red Spark Head (Welded directly over stroke tip, cleanly capping it) */}
        <g
          ref={headRef}
          className="will-change-transform"
          style={{ opacity: 0 }}
        >
          {/* Subtle dark red ambient halo */}
          <circle cx="0" cy="0" r={isMobile ? 22 : 16} fill="url(#sparkHeadDullGlow)" />
          {/* Solid dull red terminal body */}
          <circle cx="0" cy="0" r={isMobile ? 9.5 : 5} fill="#96282a" stroke="#5e1517" strokeWidth="1" />
          {/* Muted red center pip */}
          <circle cx="0" cy="0" r={isMobile ? 3.5 : 2} fill="#b53538" />
        </g>
      </svg>
    </div>
  );
}
