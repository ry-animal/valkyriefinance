# Tailwind CSS v4 Migration - Valkryie Finance

This document outlines the migration to Tailwind CSS v4 and the best practices implemented across the monorepo.

## ✅ Migration Completed

### 1. CSS-First Configuration
- **Before**: JavaScript-based configuration in `tailwind.config.js`
- **After**: CSS-based configuration using `@theme` directive in CSS files

### 2. Import Statement Updates
- **Before**: `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`
- **After**: `@import "tailwindcss";`

### 3. Animation System Update
- **Before**: `tailwindcss-animate` plugin
- **After**: `tw-animate-css` import for v4 compatibility

### 4. Reduced @apply Usage
- **Before**: Heavy use of `@apply` for component styles
- **After**: Component-based abstraction with minimal `@apply` usage

## 🏗️ Architecture Changes

### Theme Configuration Location
All design tokens are now defined in CSS files using the `@theme` directive:

**apps/web/src/app/globals.css**
```css
@theme {
  --color-primary: hsl(0 0% 0%);
  --color-background: hsl(0 0% 100%);
  --text-mega: 8rem;
  --text-mega--line-height: 0.8;
  --shadow-brutal: 8px 8px 0px 0px #000000;
}
```

**packages/ui/src/styles/globals.css**
```css
@theme {
  --color-blue-500: #3b82f6;
  --text-base: 16px;
  --text-base--line-height: 24px;
  --spacing-4: 16px;
}
```

### Component-Based Design System
Replaced `@apply`-heavy utility classes with proper React components:

#### Brutal Design Components
- `BrutalButton` - Replaces `.brutal-button` class
- `BrutalCard` - Replaces `.brutal-card` class
- `BrutalInput` - Replaces `.brutal-input` class

Example usage:
```tsx
// Before
<button className="brutal-button">Click me</button>

// After
<BrutalButton variant="default" size="lg">Click me</BrutalButton>
```

### Simplified Config Files
Tailwind config files now only handle:
- Content scanning paths
- Plugin configuration requiring JavaScript logic

```js
// tailwind.config.js (simplified)
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  // Theme is now in CSS files
  plugins: [require('tailwindcss-animate')], // Only JS-based plugins
};
```

## 🎨 Design Token Structure

### Color System
Using semantic color naming with proper CSS variable namespacing:
```css
/* Semantic colors */
--color-primary: hsl(0 0% 0%);
--color-primary-foreground: hsl(0 0% 100%);
--color-background: hsl(0 0% 100%);
--color-foreground: hsl(0 0% 0%);

/* Brand colors */
--color-brutal-black: #000000;
--color-brutal-white: #ffffff;
```

### Typography Scale
Typography with line heights and letter spacing:
```css
--text-mega: 8rem;
--text-mega--line-height: 0.8;
--text-mega--letter-spacing: -0.05em;

--text-base: 16px;
--text-base--line-height: 24px;
```

### Dark Mode
Dark mode handled with CSS variable overrides:
```css
.dark {
  --color-background: hsl(0 0% 0%);
  --color-foreground: hsl(0 0% 100%);
}
```

## 📦 Package Structure

### apps/web
- Uses brutal design system
- Custom theme in `src/app/globals.css`
- Minimal config in `tailwind.config.ts`

### packages/ui
- Shared component library
- Standard design tokens in `src/styles/globals.css`
- Exports brutal design components

### packages/config
- Simplified shared config
- No theme configuration (moved to CSS)

## 🚀 Performance Benefits

### Build Performance
- **Faster incremental builds**: v4's Rust engine provides near-instantaneous rebuilds
- **Smaller bundle size**: Only generates CSS for classes actually used
- **Better caching**: Improved caching strategies reduce repeated work

### Runtime Performance
- **Native CSS features**: Leverages cascade layers, container queries, color-mix()
- **Reduced CSS size**: Elimination of unused styles
- **Better browser optimization**: Uses modern CSS features for better performance

## 🔧 Developer Experience

### IDE Integration
- Better autocompletion with CSS-native configuration
- Color previews work automatically with CSS variables
- IntelliSense improvements for theme values

### Type Safety
- Component-based design system provides TypeScript support
- Variant props are type-checked
- Design token usage is more predictable

## 📚 Best Practices Implemented

### 1. Component-First Approach
- Style reuse through React components, not CSS classes
- Use CVA (Class Variance Authority) for variant management
- Minimal `@apply` usage (only for uncontrolled markup)

### 2. CSS Variable Strategy
- Semantic naming conventions
- Proper namespacing (`--color-*`, `--text-*`, `--spacing-*`)
- Dark mode through variable overrides

### 3. Dynamic Class Handling
- Complete class names in lookup tables
- CSS variables for truly dynamic values
- `clsx` and `tailwind-merge` for conditional classes

### 4. Modern CSS Features
- Cascade layers for style precedence
- Container queries for responsive components
- Color-mix() for opacity modifiers
- Logical properties for RTL support

## 🔄 Migration Impact

### Breaking Changes
- Old brutal utility classes removed (`.brutal-button`, `.brutal-card`, etc.)
- Theme configuration moved from JS to CSS
- Some shadow and spacing scale adjustments

### Compatibility
- Requires modern browsers (Safari 16.4+, Chrome 111+, Firefox 128+)
- Node.js components work with existing React patterns
- Design tokens remain consistent

## 📖 Usage Examples

### Using Theme Variables
```tsx
// In components
<div className="bg-primary text-primary-foreground" />

// In custom CSS
.custom-element {
  background-color: hsl(var(--color-primary));
  font-size: var(--text-lg);
}
```

### Component Variants
```tsx
<BrutalButton
  variant="outline"
  size="lg"
  shadow="hover"
>
  Get Started
</BrutalButton>

<BrutalCard hover="lift" padding="lg">
  <h3>Card Title</h3>
  <p>Card content</p>
</BrutalCard>
```

### Dynamic Classes
```tsx
// Lookup table pattern
const statusStyles = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-yellow-500 text-black',
};

<div className={statusStyles[status]} />

// CSS variables for dynamic values
<div
  className="bg-[--user-color] size-12"
  style={{ '--user-color': userSelectedColor }}
/>
```

## 🎯 Next Steps

1. **Component Migration**: Update existing components to use new brutal design components
2. **Documentation**: Add Storybook stories for new components
3. **Testing**: Ensure visual regression testing covers new components
4. **Performance Monitoring**: Track build time improvements and bundle size reductions

## 📚 References

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [CVA Documentation](https://cva.style/docs)
- [CSS Cascade Layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
- [Modern CSS Features](https://web.dev/css-cascade-layers/)
