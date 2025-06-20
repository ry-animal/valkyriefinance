import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
});
