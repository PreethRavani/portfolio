"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Wifi } from "lucide-react";

export type DeviceFinish = "titanium" | "black" | "silver" | "gold" | "blue";

export interface DeviceProps {
  children?: React.ReactNode;
  image?: string;
  alt?: string;
  finish?: DeviceFinish;
  frameColor?: string;
  screenColor?: string;
  shadowColor?: string;
  orientation?: "portrait" | "landscape";
  width?: number | string;
  scale?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  tilt?: number;
  float?: number;
  lift?: number;
  className?: string;
  isDocked?: boolean;
}

const FINISH_STYLES: Record<
  DeviceFinish,
  {
    outerBorder: string;
    rimGradient: string;
    bezelBg: string;
    buttonBg: string;
  }
> = {
  black: {
    outerBorder: "border-neutral-800",
    rimGradient: "linear-gradient(135deg, #333333 0%, #1a1a1a 45%, #2a2a2a 70%, #0d0d0d 100%)",
    bezelBg: "#0a0a0a",
    buttonBg: "#262626",
  },
  titanium: {
    outerBorder: "border-neutral-700",
    rimGradient: "linear-gradient(135deg, #595652 0%, #3a3835 45%, #4a4844 70%, #2b2a28 100%)",
    bezelBg: "#121211",
    buttonBg: "#3d3b38",
  },
  silver: {
    outerBorder: "border-neutral-400",
    rimGradient: "linear-gradient(135deg, #e5e5e5 0%, #999999 45%, #cccccc 70%, #888888 100%)",
    bezelBg: "#141414",
    buttonBg: "#b3b3b3",
  },
  gold: {
    outerBorder: "border-amber-700/60",
    rimGradient: "linear-gradient(135deg, #f3e5ab 0%, #c5a059 45%, #dfc384 70%, #947133 100%)",
    bezelBg: "#16130d",
    buttonBg: "#b8944d",
  },
  blue: {
    outerBorder: "border-sky-900",
    rimGradient: "linear-gradient(135deg, #2c3e50 0%, #1a252f 45%, #243342 70%, #0f171e 100%)",
    bezelBg: "#0c1117",
    buttonBg: "#1e2b37",
  },
};

export default function Device({
  children,
  image,
  alt = "Device screen",
  finish = "black",
  frameColor,
  screenColor = "#050505",
  shadowColor = "#000000",
  orientation = "portrait",
  width,
  scale = 0.5,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  tilt = 8,
  float = 1,
  lift = 1,
  className = "",
  isDocked = false,
}: DeviceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const finishConfig = FINISH_STYLES[finish] || FINISH_STYLES.black;

  // Real-time client status clock
  const [clockTime, setClockTime] = useState("9:41");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setClockTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (tilt === 0) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setPointerOffset({ x: px, y: py });
  };

  const handlePointerEnter = () => setIsHovered(true);
  const handlePointerLeave = () => {
    setIsHovered(false);
    setPointerOffset({ x: 0, y: 0 });
  };

  // Combine resting rotation, tilt response, and hover lift
  const currentRotX = rotateX - pointerOffset.y * tilt * 2;
  const currentRotY = rotateY + pointerOffset.x * tilt * 2;
  const currentLiftY = isHovered ? -lift * 14 : 0;

  const isPortrait = orientation === "portrait";
  const defaultWidth = isPortrait ? "min(400px, 92vw)" : "min(720px, 94vw)";
  const finalWidth = width ?? defaultWidth;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`relative select-none flex items-center justify-center p-4 sm:p-6 [perspective:1400px] ${className}`}
      style={{
        width: typeof finalWidth === "number" ? `${finalWidth}px` : finalWidth,
      }}
    >
      {/* 3D Moving Phone Chassis */}
      <div
        id="portfolio-phone-chassis"
        className="relative w-full rounded-[48px] sm:rounded-[52px] transition-transform duration-300 ease-out will-change-transform"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) rotateZ(${rotateZ}deg) translateY(${currentLiftY}px)`,
          background: frameColor ?? finishConfig.rimGradient,
          boxShadow: isDocked
            ? `
                0 25px 60px -12px ${shadowColor}cc,
                0 12px 24px -8px ${shadowColor}99,
                0 0 35px rgba(255, 59, 48, 0.22),
                0 0 15px rgba(255, 59, 48, 0.35),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2),
                inset 0 2px 4px rgba(255, 255, 255, 0.3),
                inset 0 -2px 4px rgba(0, 0, 0, 0.6)
              `
            : `
                0 25px 60px -12px ${shadowColor}cc,
                0 12px 24px -8px ${shadowColor}99,
                inset 0 0 0 1px rgba(255, 255, 255, 0.16),
                inset 0 2px 4px rgba(255, 255, 255, 0.25),
                inset 0 -2px 4px rgba(0, 0, 0, 0.6)
              `,
          padding: "10px",
        }}
      >
        {/* Precision Laser Rail Docking Target (Pinned at top-right chassis rim above battery) */}
        <div
          id="phone-dock-target"
          className="pointer-events-none absolute -top-1 right-10 sm:right-12 w-2 h-2 opacity-0 select-none"
          aria-hidden="true"
        />
        {/* Physical Side Buttons (Left Volume & Right Power) */}
        {/* Volume Up */}
        <div
          className="absolute -left-[3.5px] top-[108px] w-[3.5px] h-10 rounded-l-md transition-colors"
          style={{ background: finishConfig.buttonBg }}
          aria-hidden="true"
        />
        {/* Volume Down */}
        <div
          className="absolute -left-[3.5px] top-[156px] w-[3.5px] h-10 rounded-l-md transition-colors"
          style={{ background: finishConfig.buttonBg }}
          aria-hidden="true"
        />
        {/* Power Button */}
        <div
          className="absolute -right-[3.5px] top-[124px] w-[3.5px] h-14 rounded-r-md transition-colors"
          style={{ background: finishConfig.buttonBg }}
          aria-hidden="true"
        />

        {/* Inner Black Bezel Frame */}
        <div
          className="relative w-full overflow-hidden rounded-[38px] sm:rounded-[42px] border border-neutral-800/90 flex flex-col"
          style={{
            backgroundColor: screenColor,
            minHeight: isPortrait ? "560px" : "360px",
            maxHeight: isPortrait ? "720px" : "420px",
          }}
        >
          {/* Top Status Bar & Dynamic Island */}
          <div className="relative z-30 pt-3 px-6 pb-1 flex items-center justify-between text-[11px] font-mono text-neutral-400 shrink-0">
            {/* Clock (Live local real-time) */}
            <span
              className="font-semibold text-white/90 tabular-nums select-none"
              suppressHydrationWarning
            >
              {isMounted ? clockTime : "9:41"}
            </span>

            {/* Dynamic Island Pill */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-24 sm:w-28 h-6 bg-black rounded-full border border-neutral-800 flex items-center justify-end pr-2.5 gap-1.5 shadow-sm">
              {/* Camera Lens */}
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-700/80 shadow-inner flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-indigo-950/70" />
              </span>
              {/* Sensor */}
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-950" />
            </div>

            {/* Network / Battery Badges */}
            <div className="flex items-center gap-1.5 text-neutral-300">
              <span className="text-[10px] tracking-tight">5G</span>
              <Wifi className="w-3 h-3 text-neutral-300" />
              {/* Battery Icon */}
              <div className="w-5 h-2.5 rounded-[4px] border border-neutral-400 p-[1px] flex items-center">
                <div className="h-full w-[85%] bg-emerald-400 rounded-[2px]" />
              </div>
            </div>
          </div>

          {/* Screen Content Viewport */}
          <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 py-4 custom-scrollbar">
            {children ? (
              children
            ) : image ? (
              <div className="relative w-full h-full min-h-[460px]">
                <Image
                  src={image}
                  alt={alt}
                  fill
                  className="object-cover object-center rounded-2xl"
                />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                <span className="font-mono text-xs uppercase tracking-widest text-nothing-red">
                  Device Screen
                </span>
                <p className="font-body text-xs mt-2">No screen content provided</p>
              </div>
            )}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="relative z-30 w-full py-2 flex items-center justify-center shrink-0">
            <span className="w-28 h-1 rounded-full bg-neutral-400/50" />
          </div>

          {/* Diagonal Screen Glare Sheen Reflection (does not block pointer) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 opacity-30 mix-blend-screen"
            style={{
              background:
                "linear-gradient(120deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.04) 25%, transparent 55%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
