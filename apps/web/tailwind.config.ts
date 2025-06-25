import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    // Include UI package components so Tailwind can discover their classes
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  // In Tailwind v4, theme configuration is done via @theme directive in CSS
  // No theme configuration needed here
} satisfies Config;

export default config;
