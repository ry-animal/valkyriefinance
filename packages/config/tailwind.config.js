const tokens = require('../ui/src/tokens/design-tokens.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../apps/web/src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Theme configuration is now in CSS files using @theme directive
  // This config only handles content scanning and plugins that require JS logic
  plugins: [
    // Note: tailwindcss-animate is deprecated in v4, use tw-animate-css instead
    require('tailwindcss-animate'),
  ],
};
