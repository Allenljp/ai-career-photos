import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#12151A",
          soft: "#3A414C",
        },
        accent: {
          DEFAULT: "#0E6B66",
          hover: "#0A5551",
          soft: "#D5E8E6",
        },
        paper: "#F3F5F7",
        surface: "#E8ECF0",
        muted: "#6B7380",
        studio: {
          DEFAULT: "#C5CED6",
          deep: "#8A96A3",
        },
        success: "#16A34A",
        warning: "#D97706",
        danger: "#DC2626",
      },
      borderColor: {
        soft: "rgba(18,21,26,0.10)",
      },
      boxShadow: {
        soft: "0 1px 0 rgba(18,21,26,0.06)",
      },
      borderRadius: {
        btn: "12px",
      },
      fontFamily: {
        display: ["var(--font-syne)", "Georgia", "serif"],
        sans: ["var(--font-figtree)", "ui-sans-serif", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
