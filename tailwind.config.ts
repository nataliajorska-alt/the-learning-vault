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
        // Midnight Library palette
        ivory: "#0E1626",        // main body bg (granat ink)
        cream: "#1A2438",        // card / surface bg
        paper: "#E8DFCC",        // light cream text on dark
        forest: {
          DEFAULT: "#0A111E",    // deepest surface (top nav, modals)
          2: "#243049",          // hover state
        },
        gold: {
          DEFAULT: "#B8924D",    // brass accent
          2: "#C9A961",          // brass hover
        },
        ink: "#E8DFCC",          // primary body text (same as paper)
        muted: "#9AA3A8",        // muted/secondary text
        line: "rgba(232,223,204,0.10)",  // borders, subtle on dark
        rose: "#C9622F",         // burnt orange secondary accent
        danger: "#D86056",       // soft warm red for dark mode
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
        content: "1024px",
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
