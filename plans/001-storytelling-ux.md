# 001 — Refine the Nothing OS portfolio storytelling experience

- **Status**: IMPLEMENTED — visual browser QA pending
- **Commit**: `4f95705`
- **Severity**: HIGH
- **Category**: Story flow, navigation, and motion
- **Estimated scope**: 11–15 existing files, roughly 300–500 lines changed; no new dependencies

## Goal

Make the portfolio feel distinctive, polished, and easy to explore while preserving its Nothing OS identity: near-black surfaces, red signal accents, Doto display lettering, Space Grotesk body text, IBM Plex Mono metadata, the boot loader, GitHub telemetry, the timeline trail, and the project stack.

The experience must remain ordinary, continuous page scrolling. A single oversized wheel event must not skip a storytelling checkpoint, but there must be no gesture lock, forced snap, automatic section pull, or extra click required to continue. Chapter introductions should not repeatedly cover the screen, and a visitor who has already seen an introduction should not be made to replay its full-screen morph in reverse while navigating back.

## Scope and boundaries

- Work only in the existing Next.js app. Keep `legacy-site/` as the archived source unless a separate cleanup is explicitly requested.
- Preserve the current visual idea, font families, red/black palette, information architecture, and project data. Improve hierarchy, spacing, responsiveness, and pacing without inventing a new theme.
- Do not add animation or UI dependencies.
- Do not commit or push.
- Before changing Next.js application code, read the relevant installed Next.js guide under `node_modules/next/dist/docs/` as required by the repository’s `AGENTS.md`.
- Treat visible user-facing facts as authored content. Do not turn self-reported data into claims of verified results.

## Current findings

1. The active section rail compares page scroll with each element’s `offsetTop` in `components/layout/SideRail.tsx:30–39`. The `#contact` and `#achievements` anchors are positioned inside their parent sections, so their `offsetTop` values are local to those parents. This matches the screenshots where “08 · CONTACT” appears active while earlier sections are visible.
2. `components/providers/LenisProvider.tsx:87–108` caps each wheel delta and attenuates it near checkpoints, but never caps it to the distance to the next checkpoint. A large event, or queued Lenis target, can still cross several story beats.
3. `components/ui/StoryMotion.tsx:29` skips the timeline. The timeline has its own pinned horizontal sequence in `components/ui/timeline.tsx:73–215`, but its title is not integrated as a chapter transition in that sequence.
4. The screen-covering morph is shared across ordinary sections through `SectionHead` and the generic story path in `components/ui/StoryMotion.tsx:416–514`. Repeating the same full-screen title beat before every section makes navigation feel slower than the content warrants.
5. The credentials timeline dispatches an achievements reveal at its progress threshold and again at the card reveal callback in `components/ui/StoryMotion.tsx:146–160, 257–263`. `components/ui/AchievementCounter.tsx:34–40` restarts counting on every reveal, so one reveal sequence can restart the counter.
6. The hero telemetry layout truncates longer stat labels in the supplied screenshot. Project cards overlap, but the currently readable card is not consistently distinguished from the previews behind it. Certificate cards leave substantial unused visual space.
7. Skill percentages look like objective ratings even though they are self-assessments. The UI needs to label that clearly or present proficiency in a less falsely precise way.
8. `components/sections/Achievements.tsx`, `Certifications.tsx`, `Social.tsx`, and `Contact.tsx` appear to be older stand-alone versions; the home route uses `Credentials.tsx` and `Connect.tsx`. Confirm imports before removing dead duplicates.

## Target experience

### Story cadence

- Keep the full-screen title morph as the signature transition from Hero into About.
- Use compact, consistent chapter markers for Education, Skills, and Projects. Let each title resolve into the existing small heading area while content enters; do not insert another full-screen panel or an extra blank viewport.
- Use one restrained, integrated transition when moving from Projects into the proof section (Certifications and Achievements). Certifications and Achievements remain part of the existing combined story, not duplicated sections.
- Use a compact Social Links / Contact handoff in the same style. The Contact form remains available in the normal flow and via direct navigation.
- Retain the red signal motif, subtle title movement, and small content reveals. Vary timing and emphasis by section rather than repeating identical cover-screen choreography.

### Direction and revisit behavior

- On a visitor’s first forward pass, play each section’s compact entrance once and mark that section as visited for the current page session.
- After an introduction has completed, retain the compact heading and readable content state. Scrolling back must not replay the giant title morph or hide already revealed content.
- Scroll-linked explanatory visuals may follow the user’s direction when that helps orientation (for example, the timeline line or active project emphasis), but section navigation must never auto-pull, snap, wait for gesture end, or require a click to unlock.
- Direct menu/anchor navigation must land at the content header, not at a previously seen intro screen. Use appropriate sticky-header offsets.

### Section behavior

- **Hero:** keep the 3D GitHub telemetry as the visual anchor and keep it gated until the boot loader finishes. Make stat labels readable at narrow desktop widths and on mobile. Keep the loader skippable, short, and limited to first entry in a session; it must never delay access to content while waiting for the 3D bundle.
- **About:** keep the large-screen morph once, then reveal the current About content in-place. Preserve clear body copy, strong portrait framing, and visible links.
- **Education:** introduce the timeline with a compact “Education Timeline” title handoff, then keep the horizontal trail pinned only for the three meaningful node beats. The path and pulse sit behind the cards; each card enters clearly at its node. On small screens, use the existing vertical timeline in normal flow.
- **Skills:** reveal Frontend, Backend, then Developer Tools on successive scroll beats. Keep earlier categories visible but visually quieter than the current category. Animate the existing dot indicators with the category reveal. Fit all categories within the pinned desktop viewport without clipping; use natural stacked flow on mobile.
- **Projects:** keep the vertical-scroll-driven sticky stack. The active card is the readable, full-detail panel; inactive cards are smaller/lower-contrast previews with their order still apparent. Scrolling down advances the stack smoothly; scrolling up may restore card emphasis but must not replay the chapter intro. Keep an accessible, non-pinned mobile list.
- **Certifications and Achievements:** preserve the single combined story. Give certificate cards a better information hierarchy and a verification link when one exists. Keep achievement cards compact and square on desktop. Trigger each number count once when its card first becomes visible; do not restart or jump during reverse navigation.
- **Social and Contact:** keep social links easy to scan and interactive; reveal the form without forcing another full-screen hold. Preserve direct email and WhatsApp routes. Keep labels, validation feedback, and success/error states readable.

### Visual and content polish

- Keep Doto for display moments, chapter titles, and selected numerals. Use Space Grotesk for paragraph copy and project/certificate descriptions; reserve IBM Plex Mono for metadata, labels, and technical details.
- Fix telemetry stat truncation with concise labels or a responsive wrapping layout. Do not reduce text below comfortable reading size to make it fit.
- Clarify that skill levels are self-assessed, or remove precise percentages in favor of descriptive proficiency. Keep the red dot scale as a visual motif if it remains understandable.
- Reduce unused space in certificate cards by balancing icon/date, title/issuer, a short detail, and a verify action. Avoid adding decorative filler.
- Keep inactive project previews legible enough to communicate there are more projects, but clearly subordinate them to the active project.
- Make card spacing, max widths, and section gutters consistent. Preserve a calm black surface; use red for signal, state, and action rather than adding more ambient effects.

## Implementation steps

1. **Inspect the current app instructions and motion implementation.** Read the applicable Next.js documentation under `node_modules/next/dist/docs/`, `AGENTS.md`, `components/layout/SideRail.tsx`, `components/layout/MobileMenu.tsx`, `components/providers/LenisProvider.tsx`, `components/ui/StoryMotion.tsx`, `components/ui/timeline.tsx`, `components/ui/AchievementCounter.tsx`, relevant section components, and the motion rules in `app/globals.css`. Reconcile any source drift against the findings above before editing.
2. **Correct section coordinates and anchor behavior.** In `SideRail.tsx`, derive document positions from `getBoundingClientRect().top + window.scrollY` (or use a section-aware observer with explicit page coordinates), including the nested Contact and Achievements anchors. Keep active states correct during Lenis scrolling, native scroll, resize, and direct hash navigation. Apply sticky-header offsets consistently to rail and menu navigation.
3. **Make wheel overshoot event-local.** In `LenisProvider.tsx`, retain a reasonable per-event delta ceiling, then find the next checkpoint in the input direction using the freshest ScrollTrigger positions. Limit only the portion of the current wheel event that crosses that checkpoint; discard the remainder of that event. Do not return `false` to block a gesture, introduce timers/locks, reset scroll position, snap to a checkpoint, or wait for the next gesture to end. Account for Lenis’s pending destination so a series of queued events cannot jump a checkpoint. Subsequent wheel events continue through Lenis normally. Ensure anchor navigation, keyboard navigation, and touch scrolling remain usable. Refresh checkpoint data after StoryMotion assigns stops, after `ScrollTrigger.refresh()`, and after layout/font changes.
4. **Simplify chapter cadence and visited-state behavior.** Refactor `StoryMotion.tsx` so only About uses the full-screen title morph. Convert Education, Skills, Projects, Credentials, and Connect into compact in-flow chapter handoffs with the shared title treatment. Remove the generic full-viewport treatment from these sections while retaining the section-specific story sequences. Track first-entry completion per section for the current page session. On reverse scroll or revisits, keep compact titles and content visible; allow only supporting visuals to respond to scroll direction. Keep all timelines scoped and cleaned up on media changes/unmount, and ensure no overlapping ScrollTriggers own the same pin range.
5. **Integrate Education’s title and timeline sequence.** Update `components/ui/timeline.tsx` and `components/sections/Education.tsx` to stage the compact title handoff before the pinned horizontal track. Use one timeline/progress model for title, trail, nodes, and cards. Verify exactly three node stops, card-over-line z-order, and reliable release after the third card. Preserve the vertical mobile presentation and reduced-motion fallback.
6. **Tune Skills and Projects.** In `Skills.tsx`, preserve one category per scroll beat, animate dot fills from empty when that category first appears, maintain earlier categories at lower emphasis, and ensure no card is clipped. In `Projects.tsx` and `app/globals.css`, keep the sticky stack, distinguish active and preview states with a restrained scale/opacity/contrast hierarchy, and prevent cards from covering each other’s essential title or action links. Keep keyboard focus order and mobile list behavior natural.
7. **Fix the achievement trigger and improve credentials.** In `StoryMotion.tsx`, define one reveal/hide state source for Achievements and remove duplicate reveal callbacks. In `AchievementCounter.tsx`, make first reveal start once, remain stable on reverse/re-entry, and respect reduced motion. In `Credentials.tsx`, improve certificate card information hierarchy and include verification links only when real URLs exist. Keep the desktop cards square and ensure the combined section’s title and cards fit at common viewport heights.
8. **Polish hero, loader, and contact readability.** In `Hero.tsx`, ensure telemetry labels wrap or abbreviate at narrow widths and the chart does not shift the hero layout after loading. In `StartupLoader.tsx` and its CSS, keep Skip Intro functional, show the loader at most once per tab session, retain the short minimum display only when actually needed, and begin chart loading early enough that the model is ready as the overlay exits. In `Connect.tsx`, preserve form label contrast, validation clarity, and focus visibility.
9. **Remove only verified dead duplicate components.** Trace imports for `Achievements.tsx`, `Certifications.tsx`, `Social.tsx`, and `Contact.tsx`. If they are unused, remove them from the active app tree or clearly mark/archive them without changing `legacy-site/`. Do not delete shared data or styles until references are checked.
10. **Perform visual and interaction QA.** Use the app at desktop (including 1920×1080 and 1366×768), tablet, and phone sizes. Exercise slow wheel input, a single large wheel event, repeated trackpad input, reverse scrolling, menu/rail jumps, keyboard tab/enter, and reduced-motion mode. Confirm the page never locks, skips an entire story beat from one oversized event, auto-snaps while someone is reading, or replays a full-screen intro when returning upward. Confirm each visible title matches the active section and every card/action remains readable. Run the existing lint/build checks after implementation; do not add a test suite as part of this plan.

## Motion conventions

- Keep motion on `transform` and `opacity` where possible; do not animate layout dimensions to stage the transitions.
- Use the existing GSAP/ScrollTrigger and Lenis stack; do not add another scroll or animation system.
- Add shared motion tokens in `app/globals.css` only if needed, using the repository’s current token style. For entrance/reveal use `cubic-bezier(0.23, 1, 0.32, 1)`; for on-screen morph/movement use `cubic-bezier(0.77, 0, 0.175, 1)`. Keep short UI feedback below 300ms; longer timeline movement is allowed when directly tied to scroll progress.
- Do not use `ease-in` for visible content entrances. Do not use `transition: all` for new motion.
- Under `prefers-reduced-motion: reduce`, remove long pinned storytelling and positional travel while leaving content visible, navigation functional, and essential state feedback understandable.

## Done when

- Only About uses the full-screen chapter title morph; other section entries are compact and do not create duplicate sections or blank interstitial screens.
- The first forward visit reveals sections in order. Returning upward does not replay a screen-covering transition or hide content.
- An oversized wheel event cannot carry the user past the next defined checkpoint; there is no lock, forced scroll reset, snap, or mandatory click. Normal subsequent input remains smooth and continuous.
- The rail reports the section currently on screen, including Contact and Achievements, and every anchor lands at a usable heading/content position.
- Education completes all three beats before releasing. Skill categories reveal one at a time. Projects stack smoothly with a clear active card. Achievement numbers count once without restarting.
- Telemetry labels, certificate content, project details, contact fields, and all section titles remain readable at supported widths.
- Mobile and reduced-motion modes present the same content in a navigable natural flow.
- Existing lint and production build complete successfully; no changes are committed or pushed.
