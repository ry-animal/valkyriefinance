import type { Preview } from '@storybook/react';
import React from 'react';

// Import the design system CSS from packages/ui
import '../../../packages/ui/src/styles/globals.css';
import './storybook.css';

// Ensure React is globally available
(globalThis as any).React = React;

// Add debug info to see if CSS is loading
console.log('Storybook Preview: CSS should be loaded now');

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
      description: {
        component: 'Valkyrie Finance Design System Components',
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: 'hsl(0 0% 100%)',
        },
        {
          name: 'dark',
          value: 'hsl(224 71.4% 4.1%)',
        },
        {
          name: 'gray',
          value: 'hsl(220 14.3% 95.9%)',
        },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1280px',
            height: '800px',
          },
        },
        wide: {
          name: 'Wide Screen',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
      },
    },
    // Enhanced accessibility configuration
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
      options: {
        checks: { 'color-contrast': { options: { noScroll: true } } },
        restoreScroll: true,
      },
      manual: false, // Enable automatic accessibility testing
    },
    // Next.js specific parameters for RSC support
    nextjs: {
      appDirectory: true, // Required for next/navigation hooks
      navigation: {
        pathname: '/',
        query: {},
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light';

      // Apply theme class to root element for proper CSS variable application
      React.useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        // Also set data attribute for additional styling hooks
        root.setAttribute('data-theme', theme);
      }, [theme]);

      return React.createElement(
        'div',
        {
          className: `storybook-wrapper ${theme}`,
          style: {
            minHeight: '100vh',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            backgroundColor: theme === 'dark' ? 'hsl(224 71.4% 4.1%)' : 'hsl(0 0% 100%)',
            color: theme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(224 71.4% 4.1%)',
          },
        },
        React.createElement(
          'div',
          {
            className: 'min-h-screen bg-background text-foreground p-4',
          },
          React.createElement(Story)
        )
      );
    },
  ],
};

export default preview;
