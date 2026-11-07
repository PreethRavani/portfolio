"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import { projectsList } from "@/lib/data";

export default function Projects() {
  const cardWidths = [
    "w-[min(92vw,860px)]",
    "w-[min(94vw,900px)]",
    "w-[min(96vw,940px)]",
    "w-[min(98vw,980px)]",
  ];

  return (
    <section
      id="projects"
      data-story-steps={projectsList.length}
      className="section projects-section relative py-24 md:py-28 px-4 sm:px-6 md:px-14 border-b border-border/30 bg-background/40 backdrop-blur-md"
    >
      {/* Chapter Marker / Title Stage */}
      <SectionHead
        index="04"
        title="PROJECTS"
        subtitle="FEATURED CASE STUDIES &amp; PRODUCTION APPS"
      />

      {/* =========================================================
          CSS STICKY STACKING CARDS CONTAINER (Scroll-Driven Stacking)
         ========================================================= */}
      <div className="projects-stacking-track relative w-full max-w-6xl mx-auto flex flex-col items-center pt-4 sm:pt-8 pb-24 sm:pb-32">
        {projectsList.map((project, i) => {
          const stickyTopDesktop = `calc(clamp(82px, 10.5svh, 110px) + ${i * 22}px)`;
          const stickyTopMobile = `calc(clamp(60px, 8svh, 80px) + ${i * 14}px)`;
          const cardWidth = cardWidths[i] || "w-[min(96vw,940px)]";

          return (
            <div
              key={project.slug}
              className="sticky w-full flex items-center justify-center top-[var(--sticky-top)]"
              style={
                {
                  "--sticky-top": stickyTopDesktop,
                  "--sticky-top-desk": stickyTopDesktop,
                  "--sticky-top-mob": stickyTopMobile,
                } as React.CSSProperties
              }
            >
              <div className="w-full flex items-center justify-center py-2 sm:py-6">
                <article
                  className={`project-card ${cardWidth} rounded-2xl sm:rounded-3xl border border-border/80 bg-card shadow-[0_-14px_40px_rgba(0,0,0,0.92),0_0_0_1px_rgba(255,255,255,0.06)] hover:border-nothing-red/50 transition-[border-color,box-shadow] duration-300 overflow-hidden flex flex-col md:flex-row group`}
                >
                  {/* Left Column: Media Thumbnail with Nothing OS Accents */}
                  <div className="relative md:w-5/12 aspect-[16/9] sm:aspect-[16/10] md:aspect-auto min-h-[160px] sm:min-h-[200px] md:min-h-[380px] bg-background overflow-hidden border-b md:border-b-0 md:border-r border-border/40 shrink-0">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 420px"
                        className="object-cover object-center filter brightness-[0.75] contrast-[1.15] group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-card via-card to-background flex items-center justify-center">
                        <span className="font-mono text-xs text-muted-foreground">PREETH / LAB</span>
                      </div>
                    )}

                    {/* Technical Grid Overlay */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(currentColor_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"
                    />

                    {/* Scanline Light Gradient */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
                    />

                    {/* Top Corner Badge */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-2">
                      <span className="font-mono text-[11px] sm:text-xs font-bold tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-background/80 border border-border/80 text-nothing-red backdrop-blur-md shadow-sm">
                        0{i + 1}
                      </span>
                      <span className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-muted-foreground px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-border/60 bg-background/70 backdrop-blur-sm">
                        {project.category}
                      </span>
                    </div>

                    {/* Live indicator badge on bottom-left of media */}
                    {project.links.live && (
                      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-emerald-400 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-background/85 border border-emerald-500/30 backdrop-blur-md font-semibold">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        LIVE
                      </div>
                    )}
                  </div>

                  {/* Right Column: Project Info & Actions */}
                  <div className="p-4 sm:p-7 md:p-8 md:w-7/12 flex flex-col justify-between gap-4 sm:gap-6 flex-1">
                    <div>
                      {/* Subtitle / Role metadata */}
                      <div className="flex items-center justify-between gap-3 mb-1.5 sm:mb-2">
                        <span className="font-mono text-[11px] sm:text-xs text-muted-foreground tracking-wider uppercase">
                          {project.year ? `${project.year} · ` : ""}{project.role}
                        </span>
                        <span className="font-mono text-xs text-nothing-red font-semibold">●</span>
                      </div>

                      {/* Project Title */}
                      <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight group-hover:text-nothing-red transition-colors">
                        {project.title}
                      </h3>

                      {/* Short Description */}
                      <p className="font-body text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed mt-2 sm:mt-3">
                        {project.description}
                      </p>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-border/70 bg-background/60 font-mono text-[10px] sm:text-[11px] text-muted-foreground tracking-wide hover:border-nothing-red/40 hover:text-foreground transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Links */}
                    <div className="pt-3 sm:pt-4 flex items-center justify-between border-t border-border/30">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="group/link inline-flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase text-foreground hover:text-nothing-red transition-colors"
                      >
                        <span className="font-semibold">Case Study</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-nothing-red transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </Link>

                      <div className="flex items-center gap-4">
                        {project.links.github && (
                          <a
                            href={project.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors p-1"
                            aria-label={`${project.title} GitHub Repository`}
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}

                        {project.links.live && (
                          <a
                            href={project.links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs tracking-wider text-muted-foreground hover:text-nothing-red transition-colors flex items-center gap-1"
                          >
                            <span>Live Demo</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
