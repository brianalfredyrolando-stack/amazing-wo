import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FBF8F2",
        parchment: "#F3ECE0",
        sage: "#A8B79E",
        botanical: {
          DEFAULT: "#2F4A3C",
          soft: "#3C5C4B",
          dark: "#22382C",
        },
        gold: "#B08D57",
        terracotta: "#C2705A",
        ink: "#2A2622",
        muted: "#6E665C",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(42,38,34,0.04), 0 8px 24px -12px rgba(42,38,34,0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
