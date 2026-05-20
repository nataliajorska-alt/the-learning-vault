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
        ivory: "#F7F2E8",
        cream: "#FBF8F2",
        forest: {
          DEFAULT: "#1F3A2E",
          2: "#2A4A3C",
        },
        gold: {
          DEFAULT: "#B8924D",
          2: "#C9A961",
        },
        ink: "#1F2E25",
        muted: "#5C6B5F",
        line: "rgba(31,58,46,0.08)",
        rose: "#A8746A",
        danger: "#8B3A3A",
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
        lift: "0 8px 24px -12px rgba(31,58,46,0.18)",
        soft: "0 2px 8px -2px rgba(31,58,46,0.08)",
      },
      transitionTimingFunction: {
        gentle: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      maxWidth: {
        content: "1024px",
      },
      spacing: {
        sidebar: "256px",
      },
    },
  },
  plugins: [],
};

export default config;
