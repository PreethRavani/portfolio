"use client";

import React, { useEffect, useRef } from "react";

export interface SquaresTerminalProps {
  columns?: number;
  rows?: number;
  color?: string;
  backgroundColor?: string;
  speed?: number;
  rowBias?: number;
  fillThreshold?: number;
  dashHead?: number;
  dashTail?: number;
  rowFloor?: number;
  alternateRows?: boolean;
  curvature?: number;
  glow?: number;
  vignette?: number;
  opacity?: number;
  className?: string;
}

export default function SquaresTerminal({
  columns = 128,
  rows = 128,
  color = "#ff3b30", // Nothing OS Red accent
  backgroundColor = "#050505",
  speed = 15,
  rowBias = 0,
  fillThreshold = 0.3,
  dashHead = 0.1,
  dashTail = 1,
  rowFloor = 0.3,
  alternateRows = true,
  curvature = 1,
  glow = 0.25,
  vignette = 0.5,
  opacity = 1,
  className = "",
}: SquaresTerminalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    // Helper: parse hex color into rgb
    const parseHex = (hex: string): [number, number, number] => {
      let c = hex.replace("#", "");
      if (c.length === 3) c = c.split("").map((x) => x + x).join("");
      const num = parseInt(c, 16);
      return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    };

    const phosphorRGB = parseHex(color);

    // Pre-generate row properties to keep animation smooth and deterministic
    const rowSpeeds = new Float32Array(rows);
    const rowOffsets = new Float32Array(rows);
    const rowDensities = new Float32Array(rows);

    for (let r = 0; r < rows; r++) {
      // Deterministic pseudo-random seed per row
      const seed = Math.sin(r * 12.9898 + 78.233) * 43758.5453;
      const rnd = seed - Math.floor(seed);
      const dir = rowBias !== 0 ? (Math.random() < Math.abs(rowBias) ? Math.sign(rowBias) : 1) : (rnd > 0.5 ? 1 : -1);
      rowSpeeds[r] = (speed * (0.6 + rnd * 0.8)) * dir;
      rowOffsets[r] = rnd * columns * 4;
      rowDensities[r] = 0.7 + (rnd * 0.6);
    }

    let width = 0;
    let height = 0;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);
    handleResize();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    let tAccum = 0;

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      tAccum += dt;

      ctx.clearRect(0, 0, width, height);

      // Background fill if specified
      if (backgroundColor && backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }

      const cellW = width / columns;
      const cellH = height / rows;
      const gapX = Math.max(0.6, cellW * 0.15);
      const gapY = Math.max(0.6, cellH * 0.2);
      const sqW = Math.max(1, cellW - gapX);
      const sqH = Math.max(1, cellH - gapY);

      const pointer = pointerRef.current;
      const pointerRadius = Math.max(80, width * 0.12);

      // Render grid cells
      ctx.save();
      ctx.globalAlpha = opacity;

      for (let r = 0; r < rows; r++) {
        // Scanline blanking
        if (alternateRows && r % 2 === 1) continue;

        const y = r * cellH;
        const rowSpeed = rowSpeeds[r];
        const offset = rowOffsets[r] + tAccum * rowSpeed;
        const density = rowDensities[r];

        for (let c = 0; c < columns; c++) {
          const x = c * cellW;

          // Compute moving pattern wave
          const cellPos = (c + offset) * density;
          const wave = Math.sin(cellPos * 0.25) * 0.5 + 0.5;
          const microFlicker = Math.sin(cellPos * 1.7 + tAccum * 5) * 0.5 + 0.5;
          const combined = wave * 0.7 + microFlicker * 0.3;

          let cellAlpha = 0;
          if (combined > fillThreshold) {
            const normalized = (combined - fillThreshold) / (1 - fillThreshold);
            if (normalized < dashHead) {
              cellAlpha = (normalized / Math.max(dashHead, 0.01));
            } else {
              cellAlpha = Math.max(0, 1 - (normalized - dashHead) / Math.max(dashTail, 0.01));
            }
          }

          // Apply row dimming floor
          cellAlpha = Math.max(cellAlpha > 0 ? rowFloor : 0, cellAlpha);

          // Pointer excitation
          if (pointer.active) {
            const dx = (x + sqW / 2) - pointer.x;
            const dy = (y + sqH / 2) - pointer.y;
            const dist = Math.hypot(dx, dy);
            if (dist < pointerRadius) {
              const boost = Math.pow(1 - dist / pointerRadius, 2);
              cellAlpha = Math.min(1, cellAlpha + boost * 0.7);
            }
          }

          if (cellAlpha <= 0.02) continue;

          // CRT curvature distortion approximation
          let drawX = x;
          let drawY = y;
          if (curvature > 0) {
            const nx = (x / width) - 0.5;
            const ny = (y / height) - 0.5;
            const distSq = nx * nx + ny * ny;
            const warp = 1 + distSq * curvature * 0.12;
            drawX = (nx * warp + 0.5) * width;
            drawY = (ny * warp + 0.5) * height;
          }

          ctx.fillStyle = `rgba(${phosphorRGB[0]}, ${phosphorRGB[1]}, ${phosphorRGB[2]}, ${cellAlpha.toFixed(3)})`;
          ctx.fillRect(drawX, drawY, sqW, sqH);
        }
      }

      // CRT Vignette
      if (vignette > 0) {
        const radius = Math.hypot(width, height) * 0.55;
        const grad = ctx.createRadialGradient(
          width / 2,
          height / 2,
          radius * 0.3,
          width / 2,
          height / 2,
          radius
        );
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(0.7, `rgba(0,0,0,${(vignette * 0.3).toFixed(2)})`);
        grad.addColorStop(1, `rgba(0,0,0,${Math.min(0.95, vignette * 0.85).toFixed(2)})`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [
    columns,
    rows,
    color,
    backgroundColor,
    speed,
    rowBias,
    fillThreshold,
    dashHead,
    dashTail,
    rowFloor,
    alternateRows,
    curvature,
    glow,
    vignette,
    opacity,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none block w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
}
