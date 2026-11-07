"use client";

import React, { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MessageSquare,
  ArrowUpRight,
  ArrowUp,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Github,
  Linkedin,
  MessageCircle,
  Instagram,
  Radio,
  Zap,
  X,
  Check,
} from "lucide-react";
import Button from "@/components/ui/Button";
import MagneticWrapper from "@/components/ui/MagneticWrapper";
import { useLenis } from "@/components/providers/LenisProvider";
import { siteMeta, socialLinks } from "@/lib/data";
import SectionHead from "@/components/ui/SectionHead";
import Device from "@/components/ui/device";

const ICON_MAP: Record<string, ReactNode> = {
  github: <Github className="w-5 h-5" />,
  linkedin: <Linkedin className="w-5 h-5" />,
  "message-circle": <MessageCircle className="w-5 h-5" />,
  instagram: <Instagram className="w-5 h-5" />,
};

export default function Connect() {
  const lenis = useLenis();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // 3D Device Boot-up state strictly linked to Flow Rail arrival / departure
  const [bootPhase, setBootPhase] = useState<"standby" | "booting" | "online">("standby");
  const [isDocked, setIsDocked] = useState(false);
  const bootTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if rail is already docked on initial load/refresh
    if (typeof window !== "undefined") {
      const isAlreadyConnected = (window as unknown as { __portfolioRailConnected?: boolean }).__portfolioRailConnected;
      if (isAlreadyConnected) {
        setIsDocked(true);
        setBootPhase("booting");
        if (bootTimerRef.current) clearTimeout(bootTimerRef.current);
        bootTimerRef.current = setTimeout(() => {
          setBootPhase("online");
        }, 1500);
      }
    }

    const handleRailConnection = (e: Event) => {
      const customEvent = e as CustomEvent<{ connected: boolean }>;
      const connected = customEvent.detail?.connected ?? false;

      if (connected) {
        // Rail enters the vicinity / docks at the top edge -> initiate bootup with deliberate delay
        setIsDocked(true);
        setBootPhase((current) => {
          if (current === "online") return "online";
          if (current === "booting") return "booting";

          if (bootTimerRef.current) clearTimeout(bootTimerRef.current);
          bootTimerRef.current = setTimeout(() => {
            setBootPhase("online");
          }, 2000);
          return "booting";
        });
      } else {
        // Rail disconnected (scrolled back up) -> reset to standby prompt
        setIsDocked(false);
        if (bootTimerRef.current) clearTimeout(bootTimerRef.current);
        setBootPhase("standby");
      }
    };

    window.addEventListener("portfolio:rail-connection", handleRailConnection);

    return () => {
      window.removeEventListener("portfolio:rail-connection", handleRailConnection);
      if (bootTimerRef.current) clearTimeout(bootTimerRef.current);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "", website: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to deliver message. Please try again or email directly.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error occurred. Please try reaching out directly via email.");
    }
  };

  return (
    <section
      id="social"
      data-story-steps="2"
      className="section connect-section relative border-b border-border/30 !pt-20 md:!pt-28"
    >
      <div className="mx-auto w-full max-w-6xl">
          <SectionHead index="07" title="SOCIAL LINKS" subtitle="COMMUNITY PRESENCE &amp; CHANNELS" align="left" />

          {/* =========================================================
              2. PINNED SOCIAL CARDS BAR (Shifted safely down below nav)
             ========================================================= */}
          <div className="social-cards-flow w-full">
            <div className="social-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {socialLinks.map((item) => (
                <MagneticWrapper key={item.name} strength={0.2} className="w-full">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-border/70 bg-card hover:border-nothing-red overflow-hidden transition-[border-color,background-color] duration-200 isolate w-full shadow-sm"
                  >
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-nothing-red -translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.65,0,0.35,1)] -z-10"
                    />
                    <div className="flex items-center gap-3.5 z-10 transition-colors duration-300 group-hover:text-white min-w-0">
                      <div className="w-9 h-9 rounded-full border border-border/60 group-hover:border-white/30 flex items-center justify-center transition-colors shrink-0">
                        {ICON_MAP[item.iconName]}
                      </div>
                      <div className="min-w-0">
                        <h3 className="social-name font-body text-sm font-semibold text-foreground group-hover:text-white transition-colors truncate">
                          {item.name}
                        </h3>
                        <span className="social-handle font-mono text-xs text-muted-foreground group-hover:text-white/80 transition-colors block truncate">
                          {item.handle}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 z-10 shrink-0 ml-2" />
                  </a>
                </MagneticWrapper>
              ))}
            </div>
          </div>

          {/* =========================================================
              3. CONTACT ZONE (Strictly placed below the social cards)
             ========================================================= */}
          <div id="contact" className="contact-zone-flow mt-24 scroll-mt-24 w-full">
            {/* Contact Chapter Stage (Centered in lower area during Beat 2) */}
            <SectionHead index="08" title="CONTACT" subtitle="PROJECT INQUIRIES &amp; CONVERSATIONS" align="left" />

            {/* Contact Content Area (Has dedicated pt-12 to leave room for CONTACT title above) */}
            <div className="contact-content-area w-full">
              <div className="connect-form-grid grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* Pitch & Direct Channels */}
                <div className="contact-pitch lg:col-span-5 flex flex-col gap-4">
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-tight">
                    Let&apos;s build something exceptional together.
                  </h2>
                  <p className="font-body text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Have an engineering role, collaborative product idea, or project in mind? Reach out — I read every message and respond promptly.
                  </p>
                  <div className="flex flex-col gap-2.5 pt-1">
                    {/* Direct Email */}
                    <a
                      href={`mailto:${siteMeta.email}`}
                      className="group flex items-center gap-3 p-3 rounded-xl border border-border/70 bg-card hover:border-nothing-red transition-all duration-200 shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-nothing-red shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground">
                          Direct Email
                        </span>
                        <span className="font-mono text-xs text-foreground group-hover:text-nothing-red transition-colors truncate">
                          {siteMeta.email}
                        </span>
                      </div>
                    </a>
                    {/* WhatsApp */}
                    <a
                      href="https://wa.me/919324757227?text=Hey%2C%20Let's%20Connect"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 p-3 rounded-xl border border-border/70 bg-card hover:border-nothing-red transition-all duration-200 shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-nothing-red shrink-0">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground">
                          Instant Message
                        </span>
                        <span className="font-mono text-xs text-foreground group-hover:text-nothing-red transition-colors truncate">
                          WhatsApp Direct Channel
                        </span>
                      </div>
                    </a>
                  </div>
                </div>

                {/* 3D Mobile Device Form */}
                <div className="lg:col-span-7 flex justify-center w-full">
                  <Device
                    finish="black"
                    tilt={6}
                    lift={1}
                    float={1}
                    isDocked={isDocked || bootPhase === "online"}
                    className="w-full max-w-[430px]"
                  >
                    <AnimatePresence mode="wait">
                      {/* 1. STANDBY / DISCONNECTED SCREEN (Flow rail not docked) */}
                      {bootPhase === "standby" && (
                        <motion.div
                          key="standby"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className="w-full h-full min-h-[460px] flex flex-col items-center justify-between py-8 px-4 select-none text-center relative overflow-hidden"
                        >
                          {/* Ambient Scanline overlay */}
                          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:100%_4px]" />

                          {/* Top Standby Badge */}
                          <div className="relative z-10 flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/60 backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-nothing-red animate-pulse" />
                            <span className="font-mono text-[9px] tracking-widest text-neutral-400 uppercase">
                              OS 2.5 // DISCONNECTED
                            </span>
                          </div>

                          {/* Center Graphic & "Connection Lost ✕ Scroll to Connect" Prompt */}
                          <div className="relative z-10 flex flex-col items-center gap-4 my-auto">
                            <div className="relative w-16 h-16 rounded-2xl border border-dashed border-nothing-red/40 flex items-center justify-center bg-nothing-red/10">
                              <X className="w-7 h-7 text-nothing-red stroke-[2.5]" />
                              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-nothing-red animate-ping" />
                            </div>

                            <div className="flex flex-col gap-1.5 text-center">
                              <div className="flex items-center justify-center gap-1.5 text-nothing-red font-mono text-sm sm:text-base font-bold tracking-widest uppercase">
                                <span>Connection Lost</span>
                                <span className="text-nothing-red font-black">✕</span>
                              </div>
                              <span className="font-mono text-xs text-white/90 font-medium tracking-widest uppercase">
                                Scroll to Connect
                              </span>
                              <p className="font-mono text-[10px] text-muted-foreground max-w-[210px] leading-relaxed mx-auto mt-0.5">
                                Connect flow rail at top chassis edge to power on terminal
                              </p>
                            </div>
                          </div>

                          {/* Bottom Connection Status Pill */}
                          <div className="relative z-10 flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800/80 bg-neutral-900/40 text-neutral-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-nothing-red/70" />
                            <span className="font-mono text-[9px] tracking-widest uppercase">
                              CARRIER SIGNAL INACTIVE
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {/* 2. BOOTLOADER SEQUENCE (Connection Found ✓ \n Successfully Connected) */}
                      {bootPhase === "booting" && (
                        <motion.div
                          key="booting"
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.02 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className="w-full h-full min-h-[460px] flex flex-col items-center justify-between py-10 px-6 font-mono text-center select-none relative overflow-hidden"
                        >
                          {/* Cyber Scanline & phosphor pulse */}
                          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_3px] opacity-40 animate-pulse" />

                          {/* Top Status Badge */}
                          <div className="relative z-10 flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-900/40 bg-emerald-950/40 backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            <span className="font-mono text-[9px] tracking-widest text-emerald-400 uppercase">
                              OS 2.5 // DOCKED
                            </span>
                          </div>

                          {/* Center Graphic & "Connection Found ✓ \n Successfully Connected" */}
                          <div className="relative z-10 flex flex-col items-center gap-3.5 my-auto">
                            <div className="relative w-16 h-16 rounded-2xl border border-dashed border-emerald-500/40 flex items-center justify-center bg-emerald-500/10 shadow-[0_0_25px_rgba(52,211,153,0.18)]">
                              <Check className="w-7 h-7 text-emerald-400 stroke-[2.5]" />
                              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            </div>

                            <div className="flex flex-col gap-1 text-center">
                              <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-sm sm:text-base font-bold tracking-widest uppercase">
                                <span>Connection Found</span>
                                <span className="text-emerald-400 font-black">✓</span>
                              </div>
                              <span className="text-white text-xs sm:text-sm font-semibold tracking-widest uppercase">
                                Successfully Connected
                              </span>
                            </div>

                            {/* Animated Loading Bar */}
                            <div className="w-full max-w-[220px] h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800 mt-2">
                              <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                className="h-full bg-emerald-400"
                              />
                            </div>
                            <span className="text-[9px] text-emerald-400/90 tracking-wider">
                              CARRIER LINK ESTABLISHED // INITIALIZING...
                            </span>
                          </div>

                          {/* Bottom Status */}
                          <div className="relative z-10 text-[9px] text-neutral-500 tracking-widest uppercase">
                            DIRECT CHANNEL // 08
                          </div>
                        </motion.div>
                      )}

                      {/* 3. ONLINE ACTIVE CONTACT INTERFACE */}
                      {bootPhase === "online" && (
                        <motion.div
                          key="online"
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          className="flex flex-col gap-3 py-1"
                        >
                          {/* Mobile App Title Bar */}
                          <div className="flex items-center justify-between border-b border-border/40 pb-2.5 mb-1">
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-nothing-red animate-pulse-glow" />
                              <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                                TRANSMISSION // 08
                              </span>
                            </div>
                            <span className="font-mono text-[9px] text-nothing-red tracking-wider uppercase border border-nothing-red/30 px-1.5 py-0.5 rounded">
                              DIRECT CHANNEL
                            </span>
                          </div>

                      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                        <label className="sr-only" aria-hidden="true">
                          Leave this field empty
                          <input
                            name="website"
                            tabIndex={-1}
                            autoComplete="off"
                            value={formData.website ?? ""}
                            onChange={handleChange}
                          />
                        </label>

                        {/* Name */}
                        <div className="form-group relative">
                          <input
                            type="text"
                            maxLength={100}
                            id="formName"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder=" "
                            className="peer w-full bg-card/60 rounded-xl border border-border/80 py-2.5 px-3 font-body text-xs text-foreground focus:outline-none focus:border-nothing-red transition-colors"
                          />
                          <label
                            htmlFor="formName"
                            className="absolute left-3 top-2.5 font-mono text-[11px] tracking-wider text-muted-foreground pointer-events-none transition-all duration-200 peer-focus:-top-2.5 peer-focus:left-2 peer-focus:text-[9px] peer-focus:text-nothing-red peer-focus:bg-background peer-focus:px-1 peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:text-muted-foreground peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:px-1"
                          >
                            Your Name *
                          </label>
                        </div>

                        {/* Email */}
                        <div className="form-group relative">
                          <input
                            type="email"
                            maxLength={254}
                            id="formEmail"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder=" "
                            className="peer w-full bg-card/60 rounded-xl border border-border/80 py-2.5 px-3 font-body text-xs text-foreground focus:outline-none focus:border-nothing-red transition-colors"
                          />
                          <label
                            htmlFor="formEmail"
                            className="absolute left-3 top-2.5 font-mono text-[11px] tracking-wider text-muted-foreground pointer-events-none transition-all duration-200 peer-focus:-top-2.5 peer-focus:left-2 peer-focus:text-[9px] peer-focus:text-nothing-red peer-focus:bg-background peer-focus:px-1 peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:text-muted-foreground peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:px-1"
                          >
                            Your Email *
                          </label>
                        </div>

                        {/* Subject */}
                        <div className="form-group relative">
                          <input
                            type="text"
                            maxLength={160}
                            id="formSubject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder=" "
                            className="peer w-full bg-card/60 rounded-xl border border-border/80 py-2.5 px-3 font-body text-xs text-foreground focus:outline-none focus:border-nothing-red transition-colors"
                          />
                          <label
                            htmlFor="formSubject"
                            className="absolute left-3 top-2.5 font-mono text-[11px] tracking-wider text-muted-foreground pointer-events-none transition-all duration-200 peer-focus:-top-2.5 peer-focus:left-2 peer-focus:text-[9px] peer-focus:text-nothing-red peer-focus:bg-background peer-focus:px-1 peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:text-muted-foreground peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:px-1"
                          >
                            Subject / Purpose
                          </label>
                        </div>

                        {/* Message */}
                        <div className="form-group relative">
                          <textarea
                            id="formMessage"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={3}
                            maxLength={5000}
                            placeholder=" "
                            className="peer w-full bg-card/60 rounded-xl border border-border/80 py-2.5 px-3 font-body text-xs text-foreground focus:outline-none focus:border-nothing-red transition-colors resize-none"
                          />
                          <label
                            htmlFor="formMessage"
                            className="absolute left-3 top-2.5 font-mono text-[11px] tracking-wider text-muted-foreground pointer-events-none transition-all duration-200 peer-focus:-top-2.5 peer-focus:left-2 peer-focus:text-[9px] peer-focus:text-nothing-red peer-focus:bg-background peer-focus:px-1 peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:text-muted-foreground peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:px-1"
                          >
                            Your Message *
                          </label>
                        </div>

                        {/* Error Banner */}
                        {status === "error" && (
                          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-nothing-red/10 border border-nothing-red/30 text-nothing-red text-[11px] font-mono">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{errorMessage}</span>
                          </div>
                        )}

                        {/* Success Banner */}
                        {status === "success" && (
                          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-500 text-[11px] font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Message delivered! I will respond promptly.</span>
                          </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-1">
                          <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            disabled={status === "loading"}
                            aria-live="polite"
                            className="w-full justify-center"
                            icon={
                              status === "loading" ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : status === "success" ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                              ) : (
                                <ArrowUpRight className="w-4 h-4" />
                              )
                            }
                          >
                            {status === "loading"
                              ? "Transmitting..."
                              : status === "success"
                              ? "Delivered ✓"
                              : "Send Message"}
                          </Button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Device>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              4. DOCKED SLIDE-IN FOOTER (Slides up into bottom whitespace)
             ========================================================= */}
          <footer className="connect-inline-footer mt-20 border-t border-border/40 bg-background/70 py-4">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 font-mono text-xs">
              {/* Left: Section Marker & Copyright */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <span className="text-nothing-red font-semibold tracking-widest text-[11px] sm:text-xs shrink-0">
                  09 / FOOTER
                </span>
                <span className="hidden md:inline text-muted-foreground/40" aria-hidden="true">|</span>
                <p className="text-muted-foreground truncate text-[11px] sm:text-xs">
                  © {currentYear} Preeth Ravani. Engineered with Next.js &amp; TypeScript.
                </p>
              </div>

              {/* Center: Tagline */}
              <p className="hidden lg:block text-muted-foreground/60 italic text-[11px]">
                Less screen time. More life.
              </p>

              {/* Right: Back to Top */}
              <MagneticWrapper strength={0.3} className="shrink-0 pointer-events-auto">
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="group flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/70 hover:border-nothing-red bg-card/60 hover:bg-card text-foreground font-mono text-[11px] tracking-wider uppercase transition-all duration-300 shadow-sm"
                  aria-label="Back to top"
                >
                  <span>Back to Top</span>
                  <ArrowUp className="w-3 h-3 text-nothing-red transition-transform duration-300 group-hover:-translate-y-0.5" />
                </button>
              </MagneticWrapper>
            </div>
          </footer>
      </div>
    </section>
  );
}
