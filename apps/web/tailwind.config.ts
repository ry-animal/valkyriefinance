import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#000000",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#ffffff",
          foreground: "#000000",
        },
        destructive: {
          DEFAULT: "#000000",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f5f5f5",
          foreground: "#000000",
        },
        accent: {
          DEFAULT: "#000000",
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#000000",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#000000",
        },
        brutal: {
          black: "#000000",
          white: "#ffffff",
          gray: "#808080",
        }
      },
      borderRadius: {
        lg: "0px",
        md: "0px",
        sm: "0px",
        DEFAULT: "0px",
        none: "0px",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "monospace"],
        mono: ["var(--font-geist-mono)", "Courier New", "monospace"],
        serif: ["Times New Roman", "serif"],
        brutal: ["Impact", "Arial Black", "sans-serif"],
      },
      fontSize: {
        "mega": ["8rem", { lineHeight: "0.8", letterSpacing: "-0.05em" }],
        "giant": ["6rem", { lineHeight: "0.8", letterSpacing: "-0.05em" }],
        "massive": ["4rem", { lineHeight: "0.9", letterSpacing: "-0.02em" }],
        "huge": ["3rem", { lineHeight: "0.9", letterSpacing: "-0.02em" }],
      },
      spacing: {
        "grid": "2rem",
        "grid-sm": "1rem",
        "grid-lg": "4rem",
        "brutal": "8px",
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      gridTemplateColumns: {
        "brutal": "repeat(12, 1fr)",
        "brutal-auto": "repeat(auto-fit, minmax(200px, 1fr))",
        "16": "repeat(16, minmax(0, 1fr))",
        "20": "repeat(20, minmax(0, 1fr))",
        "24": "repeat(24, minmax(0, 1fr))",
      },
      boxShadow: {
        "brutal": "8px 8px 0px 0px #000000",
        "brutal-lg": "16px 16px 0px 0px #000000",
        "brutal-xl": "24px 24px 0px 0px #000000",
        "brutal-sm": "4px 4px 0px 0px #000000",
      },
      animation: {
        "slide-brutal": "slide-brutal 0.2s ease-out",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        "slide-brutal": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config; 