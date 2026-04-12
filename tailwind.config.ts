import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['var(--font-poppins)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // CSS-variable-driven semantic tokens — auto-switch dark/light
        // Using <alpha-value> so Tailwind opacity modifiers (bg-canvas/80) work
        canvas:    'rgb(var(--canvas-rgb)  / <alpha-value>)',
        surface:   'rgb(var(--surface-rgb) / <alpha-value>)',
        panel:     'rgb(var(--panel-rgb)   / <alpha-value>)',
        foreground:'rgb(var(--fg-rgb)      / <alpha-value>)',
        muted:     'rgb(var(--muted-rgb)   / <alpha-value>)',
      },
    },
  },
  plugins: [],
};
export default config;
