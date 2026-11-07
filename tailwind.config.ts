import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--black-950)",
        foreground: "var(--grey-100)",
        card: {
          DEFAULT: "var(--black-900)",
          foreground: "var(--grey-100)",
        },
        border: "var(--black-700)",
        muted: {
          DEFAULT: "var(--black-800)",
          foreground: "var(--grey-500)",
        },
        accent: {
          DEFAULT: "var(--red)",
          foreground: "var(--white)",
        },
        nothing: {
          red: "var(--red)",
          black: "var(--black-950)",
          dark: "var(--black-900)",
          card: "var(--black-900)",
          border: "var(--black-700)",
          hover: "var(--black-600)",
          muted: "var(--grey-500)",
          sub: "var(--grey-300)",
          light: "var(--grey-100)",
        },
      },
      fontFamily: {
        display: ["var(--font-doto)", "'Doto'", "'Space Grotesk'", "sans-serif"],
        body: ["var(--font-space-grotesk)", "'Space Grotesk'", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "'IBM Plex Mono'", "monospace"],
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.15)" },
        },
        "scroll-drop": {
          "0%": { top: "-100%" },
          "60%": { top: "100%" },
          "100%": { top: "100%" },
        },
        "scan-line": {
          "0%, 100%": { top: "-40%" },
          "50%": { top: "100%" },
        },
      },
      animation: {
        marquee: "marquee 22s linear infinite",
        "pulse-glow": "pulse-glow 1.8s ease-in-out infinite",
        "scroll-drop": "scroll-drop 2s ease-in-out infinite",
        "scan-line": "scan-line 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
