"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function StoryMotion() {
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    let cleanupExternal = () => {};
    const context = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>("main section[data-story-steps]");

      sections.forEach((section) => {
        if (section.dataset.storyTrack === "timeline") return;
        const steps = Math.max(1, Number(section.dataset.storySteps) || 1);
        section.dataset.storyStops = JSON.stringify(
          Array.from({ length: steps + 1 }, (_, index) => index / steps)
        );
      });
      window.dispatchEvent(new CustomEvent("portfolio:checkpoints-updated"));

      media.add("(prefers-reduced-motion: no-preference)", () => {
      const about = document.querySelector<HTMLElement>("#about.about-section");
      const aboutTitle = about?.querySelector<HTMLElement>(".about-title");
      const aboutKicker = about?.querySelector<HTMLElement>(".about-kicker");
      const aboutSubtitle = about?.querySelector<HTMLElement>(".about-subtitle");
      const aboutCue = about?.querySelector<HTMLElement>(".about-cue");
      const aboutBackdrop = about?.querySelector<HTMLElement>(".about-backdrop");
      const aboutContent = about?.querySelector<HTMLElement>(".about-content-wrap");

      if (about && aboutTitle && aboutContent) {
        const compactTitleX = () => {
          const left = Math.min(124, window.innerWidth * 0.065);
          const scaledHalfWidth = (aboutTitle.offsetWidth * 0.2) / 2;
          return left - window.innerWidth / 2 + scaledHalfWidth;
        };

        gsap.set(aboutContent, { autoAlpha: 0, y: 24 });

        // The About morph is the single cinematic chapter intro. It plays once
        // on first entry and retains its compact heading/content on the way back.
        const intro = gsap.timeline({
          paused: true,
          onComplete: () => {
            about.dataset.introPlayed = "true";
            window.dispatchEvent(new CustomEvent("portfolio:section-revealed", { detail: { id: "about" } }));
          },
        });

        intro.to(aboutTitle, {
          scale: 0.2,
          x: compactTitleX,
          y: () => -(window.innerHeight / 2 - Math.max(82, Math.min(105, window.innerHeight * 0.11))),
          opacity: 0.94,
          transformOrigin: "center center",
          duration: 0.62,
          ease: "power2.inOut",
        }, 0);
        if (aboutKicker) intro.to(aboutKicker, { autoAlpha: 0, y: -8, duration: 0.25, ease: "power2.out" }, 0);
        if (aboutSubtitle) intro.to(aboutSubtitle, { autoAlpha: 0, y: 8, duration: 0.25, ease: "power2.out" }, 0);
        if (aboutCue) intro.to(aboutCue, { autoAlpha: 0, duration: 0.2, ease: "power2.out" }, 0);
        if (aboutBackdrop) intro.to(aboutBackdrop, { autoAlpha: 0, duration: 0.3, ease: "power2.out" }, 0.28);
        intro.to(aboutContent, { autoAlpha: 1, y: 0, duration: 0.48, ease: "power2.out" }, 0.48);

        ScrollTrigger.create({
          trigger: about,
          start: "top top",
          once: true,
          onEnter: () => {
            if (about.dataset.introPlayed !== "true") intro.play(0);
          },
        });
      }

      // Skill categories reveal one by one during their pinned track. The
      // highest revealed category is retained while scrolling back upward.
      const skillsSection = document.querySelector<HTMLElement>("#skills");
      const skillsTrack = skillsSection?.querySelector<HTMLElement>(".skills-story-track");
      const groups = skillsTrack ? gsap.utils.toArray<HTMLElement>(".skills-group", skillsTrack) : [];
      if (skillsSection && skillsTrack && groups.length) {
        let highestRevealed = -1;
        groups.forEach((group) => {
          gsap.set(group, { autoAlpha: 0, y: 18 });
          gsap.set(group.querySelectorAll<HTMLElement>(".dot-fill"), { autoAlpha: 0, scale: 0.4 });
        });

        const revealThrough = (index: number) => {
          const target = clamp(index, 0, groups.length - 1);
          for (let i = highestRevealed + 1; i <= target; i++) {
            const group = groups[i];
            highestRevealed = i;
            gsap.to(group, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power2.out", overwrite: "auto" });
            const fills = group.querySelectorAll<HTMLElement>(".dot-fill");
            gsap.to(fills, {
              autoAlpha: 1,
              scale: 1,
              duration: 0.28,
              stagger: 0.025,
              ease: "power1.out",
              overwrite: "auto",
            });
            window.dispatchEvent(new CustomEvent("portfolio:section-revealed", {
              detail: { id: `skills-${group.dataset.skillGroup ?? i}` },
            }));
          }
        };

        ScrollTrigger.create({
          trigger: skillsSection,
          start: "top top",
          endTrigger: skillsTrack,
          end: "bottom bottom",
          invalidateOnRefresh: true,
          onUpdate: (trigger) => {
            const index = Math.floor(trigger.progress * groups.length);
            revealThrough(index);
          },
          onEnter: () => revealThrough(0),
          onEnterBack: () => revealThrough(0),
        });
      }

      });

      const refresh = () => {
        ScrollTrigger.refresh();
        window.dispatchEvent(new CustomEvent("portfolio:checkpoints-updated"));
      };
      if (document.fonts?.ready) void document.fonts.ready.then(refresh);
      window.addEventListener("load", refresh, { once: true });
      const readyTimer = window.setTimeout(refresh, 900);
      cleanupExternal = () => {
        window.clearTimeout(readyTimer);
        window.removeEventListener("load", refresh);
      };
    });

    return () => {
      cleanupExternal();
      media.revert();
      context.revert();
    };
  }, [pathname]);

  return null;
}
