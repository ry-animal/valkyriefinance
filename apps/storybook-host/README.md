# Valkyrie Finance Storybook

This workspace hosts the Storybook for Valkyrie Finance's design system and component library.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Chromatic project token
   ```

3. **Start Storybook:**
   ```bash
   pnpm storybook
   # or from project root:
   pnpm storybook
   ```

## 📖 Available Scripts

### Development
- `pnpm storybook` - Start Storybook development server on port 6006
- `pnpm build-storybook` - Build static Storybook for production

### Testing
- `pnpm test:visual` - Run visual regression tests with Chromatic
- `pnpm test:visual:ci` - Run visual tests in CI mode (exit on changes)
- `pnpm test:e2e` - Run end-to-end tests on stories
- `pnpm test:a11y` - Run accessibility tests with coverage

### Chromatic Publishing
- `pnpm chromatic` - Publish to Chromatic with console error handling
- `pnpm chromatic:ci` - CI-friendly Chromatic publish

## 🔧 Environment Setup

### Required Environment Variables

Create a `.env.local` file with:

```bash
# Get your token from: https://www.chromatic.com/manage
CHROMATIC_PROJECT_TOKEN=your_chromatic_token_here
NODE_ENV=development
```

### Chromatic Integration

- **Live Storybook**: https://685507ae37d20824ea038010-pzzaogjyuk.chromatic.com/
- **Project Dashboard**: https://www.chromatic.com/setup?appId=685507ae37d20824ea038010

## 🎨 Component Structure

```
packages/ui/src/
├── components/          # Reusable UI components
│   ├── button.tsx
│   ├── button.stories.tsx
│   └── ...
├── stories/             # Complex pattern examples
│   ├── Overview.stories.tsx
│   ├── Interactive-Demo.stories.tsx
│   └── Web3-Patterns.stories.tsx
└── styles/
    └── globals.css      # Design system CSS
```

## 🔗 Key Features

- **🎯 React Server Components** - Next.js 15 RSC support
- **♿ Accessibility Testing** - Automated a11y validation
- **📱 Responsive Design** - Multi-device testing
- **🎨 Design Tokens** - Consistent theming system
- **🧪 Interactive Testing** - Play functions for user flows
- **📊 Visual Regression** - Chromatic integration

## 🛠️ Development

### Adding New Components

1. Create component in `packages/ui/src/components/`
2. Add corresponding `.stories.tsx` file
3. Export from `packages/ui/src/index.ts`
4. Test in Storybook locally
5. Publish to Chromatic for review

### Design System Guidelines

- Follow Shadcn/UI patterns
- Use CSS variables for theming
- Include accessibility attributes
- Document props with TypeScript
- Provide usage examples in stories

## 📚 Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Chromatic Documentation](https://www.chromatic.com/docs)
- [Shadcn/UI Documentation](https://ui.shadcn.com)
- [Next.js RSC Documentation](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
