import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fceaf1",
          100: "#f9d3e3",
          200: "#f4a9ce",
          300: "#ec4899",
          400: "#e11d74",
          500: "#be185d",
          600: "#9d174d",
          700: "#831843",
          800: "#701a75",
          900: "#4a044e",
        },
        gold: {
          50: "#faf8f2",
          100: "#f5efdc",
          200: "#ebdcb0",
          300: "#d4af37",
          400: "#b8860b",
          500: "#996515",
          600: "#854d0e",
          700: "#713b12",
          800: "#5f310f",
          900: "#3f1d04",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;