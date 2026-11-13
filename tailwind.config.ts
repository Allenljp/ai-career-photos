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
        ink: "#0B0F19",
        accent: {
          DEFAULT: "#4D7CFE",
          hover: "#3B6AEF",
        },
        surface: "#F7F8FA",
        muted: "#5B6475",
        success: "#16A34A",
        warning: "#D97706",
        danger: "#DC2626",
      },
      borderColor: {
        soft: "rgba(0,0,0,0.08)",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.06)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
