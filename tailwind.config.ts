import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      colors: {
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        primary:     { DEFAULT: "hsl(var(--primary))",     foreground: "hsl(var(--primary-foreground))" },
        secondary:   { DEFAULT: "hsl(var(--secondary))",   foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted:       { DEFAULT: "hsl(var(--muted))",       foreground: "hsl(var(--muted-foreground))" },
        accent:      { DEFAULT: "hsl(var(--accent))",      foreground: "hsl(var(--accent-foreground))" },
        popover:     { DEFAULT: "hsl(var(--popover))",     foreground: "hsl(var(--popover-foreground))" },
        card:        { DEFAULT: "hsl(var(--card))",        foreground: "hsl(var(--card-foreground))" },
        brand: {
          orange: "#ff6b00",
          gold:   "#ffd000",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Keyframes defined in globals.css — Tailwind only needs the animation shorthand
      keyframes: {
        "dialog-in":     { from: { opacity: "0" }, to: { opacity: "1" } }, // actual transform in CSS
        "fade-up":       { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "tap-pulse":     { "0%,100%": { boxShadow: "0 0 0 0 rgba(255,107,0,0)" }, "50%": { boxShadow: "0 0 0 8px rgba(255,107,0,0.3)" } },
        "confetti-fall": { to: { transform: "translateY(110vh) rotate(720deg)", opacity: "0" } },
        "spin-glow":     { "0%,100%": { opacity: "0.4" }, "50%": { opacity: "1" } },
      },
      animation: {
        "dialog-in":     "dialog-in 0.25s cubic-bezier(0.34,1.2,0.64,1) both",
        "fade-up":       "fade-up 0.3s ease both",
        "tap-pulse":     "tap-pulse 2s ease-in-out infinite",
        "confetti-fall": "confetti-fall linear forwards",
        "spin-glow":     "spin-glow 1.5s ease-in-out infinite",
      },
    },
  },
  safelist: [
    // Dynamic classes that Tailwind can't detect at build time
    "border-brand-orange",
    "text-brand-orange",
    "bg-brand-orange/10",
    "bg-brand-orange/12",
    "bg-brand-orange/15",
    "border-brand-orange/20",
    "border-brand-orange/40",
    "border-brand-orange/25",
    "text-amber-300",
    "bg-amber-400/10",
    "border-amber-400/20",
    "bg-amber-400/15",
    "border-amber-400/30",
    "bg-green-400/10",
    "border-green-400/20",
    "bg-red-400/10",
    "border-red-400/20",
    "bg-red-500/15",
    "border-red-500/30",
    "text-red-400",
    "bg-red-500/25",
  ],
  plugins: [],
}

export default config
