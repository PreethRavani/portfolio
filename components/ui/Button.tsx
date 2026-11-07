"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import MagneticWrapper from "./MagneticWrapper";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  magnetic?: boolean;
}

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  icon,
  magnetic = true,
  className,
  ...props
}: ButtonProps) {
  const baseClasses = cn(
    "group relative inline-flex items-center justify-center gap-2.5 rounded-full font-mono text-xs tracking-wider uppercase overflow-hidden transition-all duration-300 isolate focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nothing-red",
    size === "sm" && "px-4 py-2 text-[11px]",
    size === "md" && "px-6 py-3.5 text-xs",
    size === "lg" && "px-8 py-4 text-sm",
    variant === "primary" && [
      "bg-foreground text-background font-medium hover:text-white shadow-sm",
      "before:content-[''] before:absolute before:inset-0 before:bg-nothing-red before:-translate-x-[101%] hover:before:translate-x-0 before:transition-transform before:duration-500 before:ease-out before:-z-10",
    ],
    variant === "outline" && [
      "border border-border/80 hover:border-nothing-red bg-card/40 hover:bg-card/90 text-foreground shadow-sm",
    ],
    variant === "ghost" && [
      "text-muted-foreground hover:text-foreground hover:bg-card/50",
    ],
    className
  );

  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          {icon}
        </span>
      )}
    </>
  );

  const rendered = href ? (
    href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") ? (
      <a
        href={href}
        className={baseClasses}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    ) : (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    )
  ) : (
    <button className={baseClasses} {...props}>
      {content}
    </button>
  );

  if (magnetic) {
    return <MagneticWrapper>{rendered}</MagneticWrapper>;
  }

  return rendered;
}
