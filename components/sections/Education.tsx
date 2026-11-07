"use client";

import Timeline, { type TimelineNodeItem } from "@/components/ui/timeline";
import SectionHead from "@/components/ui/SectionHead";

// Exactly 3 Timeline Branches with alternating rhythm:
// 1. 2011 - 2023: Vidya Vikasini [Class X ICSE - 95%] (Down)
// 2. 2023 - 2025: Rahul International [Class XII CBSE - 87%] (Up)
// 3. 2025 - 2029: DJ Sanghvi College [B.Tech IT *Current* - CGPA = 9.33] (Down)
// Followed by the "More To Explore..." scroll reveal text over the extending line

const timelineNodes: TimelineNodeItem[] = [
  {
    id: "icse-vidya-vikasini",
    year: "2011 — 2023",
    title: "ICSE Class 10th",
    institution: "Vidya Vikasini School",
    badge: "95%",
    status: "done",
    side: "bottom",
    description: "Graduated with 95% distinction and highest honors in computer science fundamentals.",
  },
  {
    id: "cbse-rahul-international",
    year: "2023 — 2025",
    title: "CBSE Class 12th",
    institution: "Rahul International School",
    badge: "87%",
    status: "done",
    side: "top",
    description: "Specialized in Computer Science, Mathematics, Physics, and analytical problem solving.",
  },
  {
    id: "btech-dj-sanghvi",
    year: "2025 — 2029 · PRESENT",
    title: "B.Tech Information Technology",
    institution: "DJ Sanghvi College of Engineering",
    badge: "CGPA = 9.33",
    status: "current",
    side: "bottom",
    description: "Specializing in Advanced Data Structures, System Design, Algorithms, and Modern Web Systems.",
  },
];

export default function Education() {
  return (
    <div id="education" className="section education relative border-b border-border/30 px-6 py-20 md:px-14 md:py-24 bg-background/40 backdrop-blur-md">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHead
          index="02"
          title="EDUCATION TIMELINE"
          subtitle="ACADEMIC MILESTONES &amp; ROOTS"
          align="left"
        />
      </div>
      <Timeline
        id="education-timeline"
        birthDate="20th July, 2007"
        nodes={timelineNodes}
        lottieUrl="/images/Fqd2NBCndl.json"
        videoUrl="/images/Fqd2NBCndl.webm"
        imageUrl="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
        imageAlt="Academic and university research workspace"
      />
    </div>
  );
}
