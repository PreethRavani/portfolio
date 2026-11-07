"use client";

import React, { useRef } from "react";
import FlowScrollRail from "@/components/ui/FlowScrollRail";

interface StoryFlowContainerProps {
  children: React.ReactNode;
}

export default function StoryFlowContainer({ children }: StoryFlowContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Background Flow Scroll Rail (starts from About section down to Connect) */}
      <FlowScrollRail containerRef={containerRef} />

      {/* Main Content Sections (Guaranteed higher stacking layer for interactions) */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
