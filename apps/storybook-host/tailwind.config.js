/** @type {import('tailwindcss').Config} */
module.exports = {
  ...require('../../packages/config/tailwind.config.js'),
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './.storybook/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
};
