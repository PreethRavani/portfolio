"use client";

import React, { useEffect, useRef } from "react";

interface LottieAnimationProps {
  src?: string;
  animationData?: object;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  preserveAspectRatio?: string;
}

export default function LottieAnimation({
  src,
  animationData,
  className = "w-full h-full",
  loop = true,
  autoplay = true,
  preserveAspectRatio = "xMidYMid meet",
}: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let anim: any = null;
    let isMounted = true;

    const initLottie = async () => {
      try {
        const lottieModule = await import("lottie-web");
        const lottie = (lottieModule.default || lottieModule) as any;
        if (!isMounted || !containerRef.current) return;

        // Clean any previous SVG child before creating a new instance
        containerRef.current.innerHTML = "";

        anim = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop,
          autoplay,
          rendererSettings: {
            preserveAspectRatio,
            clearCanvas: true,
            progressiveLoad: true,
            hideOnTransparent: true,
          },
          ...(animationData ? { animationData } : { path: src }),
        });
      } catch (err) {
        console.error("Failed to load Lottie animation:", err);
      }
    };

    initLottie();

    return () => {
      isMounted = false;
      if (anim) {
        anim.destroy();
      }
    };
  }, [src, animationData, loop, autoplay, preserveAspectRatio]);

  return (
    <div
      ref={containerRef}
      className={`lottie-container relative overflow-hidden flex items-center justify-center ${className}`}
    />
  );
}
