import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadProps {
  index?: string;
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
  align?: "center" | "left" | "between";
}

export default function SectionHead({
  index,
  title,
  subtitle,
  className,
  children,
  align = "center",
}: SectionHeadProps) {
  return (
    <div
      className={cn(
        "section-head story-title-stage compact-section-head relative flex flex-col",
        className
      )}
      data-story-transition
    >
      <span className="story-title-backdrop" aria-hidden="true" />
      <div
        className={cn("story-title-lockup", align === "left" && "story-title-lockup--left")}
      >
        <h2 className="story-title font-display">{title}</h2>
        {subtitle && <p className="story-title-subtitle font-mono">{subtitle}</p>}
      </div>

      {children && <div className={cn("story-head-actions", align === "between" && "story-head-actions--between")}>{children}</div>}
      <span className="story-scroll-cue font-mono">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></span>

      {align === "center" && (
        <span
          className="heading-node"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
