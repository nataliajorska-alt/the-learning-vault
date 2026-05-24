import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Old Library palette — warm dark mahogany / sepia
        // Legacy aliases preserved so existing pages keep rendering
        ivory: "#1B1108",        // main body bg (deep mahogany)
        cream: "#271A0C",        // card / surface bg (warm leather)
        paper: "#E8DFCC",        // light cream text on dark
        forest: {
          DEFAULT: "#120A04",
          2: "#3A2615",
        },
        gold: {
          DEFAULT: "#B8924D",
          2: "#C9A961",
          300: "#d9b878",
          400: "#c8a25c",
          500: "#B8924D",
          600: "#927037",
          700: "#6a5128",
        },
        ink: "#E8DFCC",
        muted: "#9AA3A8",
        line: "rgba(232,223,204,0.10)",
        rose: "#C9622F",
        danger: "#D86056",

        // v2 design tokens — from today.html handoff
        mahogany: {
          950: "#15100A",
          900: "#1B1108",        // canonical bg
          800: "#261810",
          700: "#3a2418",
        },
        manila: {                // "paper" tiers under a distinct name to avoid clash
          50:  "#F4ECD8",
          100: "#ECDFC4",
          200: "#E2D6BA",        // canonical card
          300: "#d4c39e",
          400: "#b9a378",
        },
        oxblood: "#5a1410",
        cognac:  "#7a4a1f",
        racing:  "#1f3a26",
        burgundy: "#3a0f1c",
        ink2: "#8B2E1F",         // red stamp ink (avoid clashing with cream `ink`)
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        eyebrow: "0.25em",
      },
      borderRadius: {
        DEFAULT: "4px",
      },
      boxShadow: {
        lift: "0 12px 32px -16px rgba(0,0,0,0.4)",
        soft: "0 4px 12px -4px rgba(0,0,0,0.25)",
      },
      transitionTimingFunction: {
        gentle: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      maxWidth: {
        content: "1280px",
      },
      spacing: {
        sidebar: "256px",
        topnav: "64px",
      },
    },
  },
  plugins: [],
};

export default config;
