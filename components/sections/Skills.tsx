"use client";

import SectionHead from "@/components/ui/SectionHead";
import { skillsList } from "@/lib/data";

const TOTAL_DOTS = 9;

export default function Skills() {
  const categories = [
    { key: "frontend", label: "FRONTEND ENGINEERING" },
    { key: "backend", label: "BACKEND & ARCHITECTURE" },
    { key: "tools", label: "DEVELOPER TOOLS & WORKFLOWS" },
  ] as const;

  return (
    <section
      id="skills"
      data-story-steps={categories.length}
      className="section skills relative py-20 md:py-24 px-6 md:px-14 border-b border-border/30"
    >
      <SectionHead index="03" title="SKILLS" subtitle="TECHNICAL EXPERTISE · SELF-ASSESSMENT" />

      <div className="skills-story-track" style={{ height: `${categories.length * 100}svh` }}>
        <div className="skills-groups max-w-5xl mx-auto px-4">
          {categories.map((cat) => {
            const categorySkills = skillsList.filter((s) => s.category === cat.key);

            return (
              <div
                key={cat.key}
                data-skill-group={cat.key}
                className="skills-group flex flex-col justify-center gap-3 sm:gap-3.5"
                aria-label={cat.label}
              >
                {/* Category Header */}
                <div className="skills-group-label flex items-center gap-2.5 font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  <span className="skills-group-dot w-1.5 h-1.5 rounded-full bg-nothing-red shadow-[0_0_8px_rgba(255,59,48,0.8)]" />
                  <span>{cat.label}</span>
                </div>

                {/* Grid of Skill Cards */}
                <div className="skills-card-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                  {categorySkills.map((skill) => {
                    const targetFilled = Math.min(
                      TOTAL_DOTS,
                      Math.max(1, Math.round((skill.percent / 100) * TOTAL_DOTS))
                    );

                    return (
                      <div
                        key={skill.name}
                        data-filled-dots={targetFilled}
                        className="skill-card group flex flex-col justify-between p-4 sm:p-5 rounded-2xl border border-border/70 bg-card hover:border-nothing-red/60 hover:-translate-y-1 transition-all duration-300 shadow-md"
                      >
                        {/* Skill Title & Percentage */}
                        <div className="skill-card-top flex items-center justify-between gap-3 mb-3 sm:mb-4">
                          <h3 className="font-body text-sm font-semibold text-foreground group-hover:text-nothing-red transition-colors">
                            {skill.name}
                          </h3>
                          <span className="skill-percent font-mono text-xs text-muted-foreground tabular-nums">
                            {skill.percent}%
                          </span>
                        </div>

                        {/* Dot Matrix Indicators - 9 dots total, filled + red marker + dark unfilled track */}
                        <div className="skill-dots flex items-center gap-1.5 sm:gap-2" aria-hidden="true">
                          {Array.from({ length: TOTAL_DOTS }).map((_, idx) => {
                            const dotIndex = idx + 1;
                            const isFilled = dotIndex <= targetFilled;
                            const isMarker = dotIndex === targetFilled;

                            return (
                              <span
                                key={idx}
                                className="dot relative w-2.5 h-2.5 rounded-full bg-[#2a2a2a] border border-white/[0.04] flex items-center justify-center shrink-0"
                              >
                                {isFilled && (
                                  <span
                                    className={`dot-fill absolute inset-0 rounded-full ${
                                      isMarker
                                        ? "is-marker bg-nothing-red shadow-[0_0_8px_rgba(255,59,48,0.95)]"
                                        : "is-filled bg-[#eaeaea] shadow-[0_0_4px_rgba(255,255,255,0.3)]"
                                    }`}
                                  />
                                )}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
