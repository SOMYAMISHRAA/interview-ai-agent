import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0B",
        surface: "#111113",
        elevated: "#18181B",
        border: "#27272A",
        primary: "#FAFAFA",
        secondary: "#A1A1AA",
        tertiary: "#71717A",
        accent: {
          DEFAULT: "#818CF8",
          dim: "#6366F1",
          bright: "#A5B4FC",
        },
        strength: "#34D399",
        gap: "#FBBF24",
        danger: "#F87171",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out",
        blink: "blink 1.4s infinite",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, rgba(129,140,248,0.08), transparent 60%)",
      },
    },
  },
  plugins: [],
};
export default config;
