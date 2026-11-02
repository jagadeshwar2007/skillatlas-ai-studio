/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050811",
        surface: "#0a0f1d",
        card: "#0f172a",
        border: "#1e293b",
        primary: {
          DEFAULT: "#00f2fe",
          hover: "#38bdf8",
          glow: "rgba(0, 242, 254, 0.25)"
        },
        accent: {
          DEFAULT: "#818cf8",
          pink: "#ec4899",
          amber: "#f59e0b",
          emerald: "#10b981"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      }
    },
  },
  plugins: [],
};
