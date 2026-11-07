import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import Button from "@/components/ui/Button";
import { statsData, siteMeta } from "@/lib/data";

export default function About() {
  return (
    <section
      id="about"
      data-story-steps="2"
      className="section about-section relative border-b border-border/30"
    >
      {/* Pinned Scroll Track (220svh for title morph and pinned content reveal) */}
      <div className="about-story-track" style={{ height: "220svh" }}>
        <div className="about-viewport">
          {/* =========================================================
              1. ABOUT ME INTRO CHAPTER STAGE (Title Morph Beat)
             ========================================================= */}
          <div
            className="about-intro-stage section-head story-title-stage relative flex flex-col pointer-events-none"
            data-story-transition
          >
            <span className="story-title-backdrop about-backdrop" aria-hidden="true" />
            <div className="story-title-lockup">
              <h2 className="story-title about-title font-display">ABOUT ME</h2>
              <p className="story-title-subtitle about-subtitle font-mono">
                PHILOSOPHY &amp; BACKGROUND
              </p>
            </div>

            <span className="story-scroll-cue about-cue font-mono">
              SCROLL TO EXPLORE <span aria-hidden="true">↓</span>
            </span>

            <span className="heading-node" aria-hidden="true" />
          </div>

          {/* =========================================================
              2. PINNED ABOUT CONTENT AREA (Revealed after morph settles)
             ========================================================= */}
          <div className="about-content-wrap w-full max-w-6xl mx-auto px-6 md:px-14">
            <div className="about-grid w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Photo Card & Stats Grid */}
              <div className="lg:col-span-5 flex flex-col gap-5 w-[340px] max-w-full mx-auto lg:mx-0">
                {/* Photo Card Wrap (Nothing OS card layers & styling) */}
                <div className="about-card-wrap relative w-[340px] max-w-full">
                  {/* Back tilt card */}
                  <div
                    aria-hidden="true"
                    className="about-card about-card--back"
                  />

                  {/* Front interactive card */}
                  <div className="about-card about-card--front">
                    {/* Image frame */}
                    <div className="about-photo">
                      {/* Natural authentic color photograph */}
                      <Image
                        src="/images/pfp2.png"
                        alt={siteMeta.name}
                        fill
                        sizes="340px"
                        className="photo-mark object-cover object-center"
                      />

                      {/* Scanning light gradient animation */}
                      <span className="photo-scan" aria-hidden="true" />

                      {/* Glowing red live status badge */}
                      <span className="photo-badge" aria-hidden="true" />
                    </div>

                    {/* Photo caption */}
                    <div className="about-photo-caption">
                      <span>PROBLEM → PROTOTYPE → PRODUCT</span>
                    </div>
                  </div>

                  {/* Rotating Circular Text Badge */}
                  <span className="rotating-text hidden sm:block" aria-hidden="true">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      <path
                        id="aboutCirclePath"
                        d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"
                        fill="none"
                      />
                      <text>
                        <textPath href="#aboutCirclePath">
                          AVAILABLE FOR WORK • OPEN TO COLLAB • AVAILABLE FOR WORK • OPEN TO COLLAB •
                        </textPath>
                      </text>
                    </svg>
                  </span>
                </div>

                {/* Stats Grid directly below photo card occupying whitespace */}
                <div className="stat-grid pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-2 border-t border-border/30 w-full">
                  {statsData.map((stat) => (
                    <div key={stat.label} className="stat-item flex flex-col gap-1">
                      <span
                        className="stat-number font-display text-2xl sm:text-3xl font-semibold text-foreground tracking-tight"
                      >
                        {stat.target}{stat.suffix}
                      </span>
                      <span className="stat-label font-mono text-[9px] sm:text-[10px] tracking-wider uppercase text-muted-foreground leading-tight">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Bio Content */}
              <div className="about-content lg:col-span-7 flex flex-col gap-5">
                <h2 className="about-heading reveal-up font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground leading-[1.25]">
                  I craft solutions that are practical by nature, intuitive by design, and impactful by result.
                </h2>

                <p className="about-text reveal-fade font-body text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {siteMeta.fullBio}
                </p>

                <p className="about-text reveal-fade font-body text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Whether architecting distributed server APIs, structuring relational databases, or refining sub-pixel layout animations, I focus on clean code, resilient error boundaries, and delightful micro-interactions.
                </p>

                {/* Action Links */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Button
                    href="https://github.com/PreethRavani"
                    variant="primary"
                    size="md"
                    icon={<Github className="w-4 h-4" />}
                  >
                    View GitHub Profile
                  </Button>

                  <Button
                    href="#contact"
                    variant="outline"
                    size="md"
                    icon={<ArrowUpRight className="w-4 h-4" />}
                  >
                    Know More About Me
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
