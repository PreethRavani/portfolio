import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github, CheckCircle, Cpu, UserCheck } from "lucide-react";
import { projectsList } from "@/lib/data";
import Button from "@/components/ui/Button";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return projectsList.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projectsList.find((item) => item.slug === slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.title} — ${project.category}`,
    description: project.description,
    openGraph: { title: project.title, description: project.description, type: "article" },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const projectIndex = projectsList.findIndex((p) => p.slug === slug);
  if (projectIndex === -1) {
    notFound();
  }

  const project = projectsList[projectIndex];
  const prevProject = projectIndex > 0 ? projectsList[projectIndex - 1] : null;
  const nextProject = projectIndex < projectsList.length - 1 ? projectsList[projectIndex + 1] : null;

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-14 max-w-5xl mx-auto">
      {/* Back to Home Link */}
      <div className="mb-10">
        <Link
          href="/#projects"
          className="group inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-muted-foreground hover:text-nothing-red transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to All Projects</span>
        </Link>
      </div>

      {/* Hero Header */}
      <header className="flex flex-col gap-6 pb-12 border-b border-border/40">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full border border-nothing-red/40 bg-nothing-red/10 font-mono text-xs text-nothing-red uppercase tracking-wider">
            {project.category}
          </span>
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            {project.year}
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-foreground uppercase">
          {project.title}
        </h1>

        <p className="font-body text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed">
          {project.subtitle}
        </p>

        {/* Action Links & Meta Info */}
        <div className="flex flex-wrap items-center justify-between gap-6 pt-4">
          <div className="flex flex-wrap items-center gap-4">
            {project.links.live && (
              <Button
                href={project.links.live}
                variant="primary"
                size="md"
                icon={<ArrowUpRight className="w-4 h-4" />}
              >
                Launch Project Live
              </Button>
            )}

            {project.links.github && (
              <Button
                href={project.links.github}
                variant="outline"
                size="md"
                icon={<Github className="w-4 h-4" />}
              >
                View Source Code
              </Button>
            )}
          </div>

          <div className="flex items-center gap-6 font-mono text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-nothing-red" />
              {project.role}
            </span>
          </div>
        </div>
      </header>

      {/* Key Architectural Metrics */}
      {project.metrics && project.metrics.length > 0 && (
        <section className="py-12 border-b border-border/40">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {project.metrics.map((metric) => (
              <div
                key={metric.label}
                className="p-6 rounded-2xl border border-border/60 bg-card/60 flex flex-col gap-1"
              >
                <span className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
                  {metric.value}
                </span>
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Deep-Dive Case Study Narrative */}
      <section className="py-14 flex flex-col gap-12 border-b border-border/40">
        <div>
          <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-nothing-red font-semibold mb-4 flex items-center gap-2">
            <span>01</span>
            <span>/ EXECUTIVE OVERVIEW</span>
          </h2>
          <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
            {project.longDescription}
          </p>
        </div>

        {project.overview && (
          <div>
            <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-nothing-red font-semibold mb-4 flex items-center gap-2">
              <span>02</span>
              <span>/ ENGINEERING MOTIVATION &amp; CHALLENGES</span>
            </h2>
            <p className="font-body text-base text-muted-foreground leading-relaxed">
              {project.overview}
            </p>
          </div>
        )}

        {/* Feature Highlights */}
        {project.features && project.features.length > 0 && (
          <div>
            <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-nothing-red font-semibold mb-6 flex items-center gap-2">
              <span>03</span>
              <span>/ CORE SYSTEM CAPABILITIES</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.features.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3.5 p-4 rounded-xl border border-border/60 bg-card/40"
                >
                  <CheckCircle className="w-4 h-4 text-nothing-red flex-shrink-0 mt-0.5" />
                  <span className="font-body text-sm text-foreground/90 leading-relaxed">
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technology Breakdown */}
        {project.techStack && project.techStack.length > 0 && (
          <div>
            <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-nothing-red font-semibold mb-6 flex items-center gap-2">
              <span>04</span>
              <span>/ TECH STACK BREAKDOWN</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {project.techStack.map((stack) => (
                <div
                  key={stack.category}
                  className="p-5 rounded-2xl border border-border/70 bg-card flex flex-col gap-3"
                >
                  <h3 className="font-mono text-xs tracking-wider uppercase text-foreground font-semibold flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-nothing-red" />
                    {stack.category}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {stack.items.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-md border border-border/50 bg-background font-mono text-[11px] text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Prev / Next Project Navigation Footer */}
      <nav
        className="pt-12 flex flex-col sm:flex-row items-center justify-between gap-6"
        aria-label="Other projects navigation"
      >
        {prevProject ? (
          <Link
            href={`/projects/${prevProject.slug}`}
            className="group flex flex-col items-start gap-1 p-4 rounded-xl border border-border/50 hover:border-nothing-red bg-card/40 w-full sm:w-auto"
          >
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground flex items-center gap-1 uppercase">
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Previous Case Study
            </span>
            <span className="font-display text-base font-semibold text-foreground group-hover:text-nothing-red transition-colors">
              {prevProject.title}
            </span>
          </Link>
        ) : <div />}

        {nextProject && (
          <Link
            href={`/projects/${nextProject.slug}`}
            className="group flex flex-col items-end gap-1 p-4 rounded-xl border border-border/50 hover:border-nothing-red bg-card/40 w-full sm:w-auto"
          >
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground flex items-center gap-1 uppercase">
              Next Case Study
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="font-display text-base font-semibold text-foreground group-hover:text-nothing-red transition-colors">
              {nextProject.title}
            </span>
          </Link>
        )}
      </nav>
    </div>
  );
}
