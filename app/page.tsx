import React from "react";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Education from "@/components/sections/Education";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Credentials from "@/components/sections/Credentials";
import Connect from "@/components/sections/Connect";
import StoryFlowContainer from "@/components/layout/StoryFlowContainer";
import { fetchGitHubTelemetry } from "@/lib/github";

export default async function Home() {
  const contributions = await fetchGitHubTelemetry();

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section (No flow rails, clean Nothing OS layout) */}
      <Hero contributions={contributions} />

      {/* 2. Story Flow Container (Flow scroll rail starts here at About through Connect) */}
      <StoryFlowContainer>
        <About />
        <Education />
        <Skills />
        <Projects />
        <Credentials />
        <Connect />
      </StoryFlowContainer>
    </div>
  );
}
