# Valkyrie Finance 🚀

> **AI-Powered DeFi Yield Optimization Platform**

[![Development Status](https://img.shields.io/badge/Status-Component%20System%20Complete-green.svg)](https://github.com/valkyrie-finance)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue.svg)](https://www.typescriptlang.org/)
[![Storybook](https://img.shields.io/badge/Storybook-50%2B%20Stories-ff69b4.svg)](http://localhost:6006)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Valkyrie Finance combines cutting-edge AI technology with DeFi protocols to deliver automated, intelligent yield optimization. Built with a production-ready component system and comprehensive development environment.

## ✨ **What's New - Component System Complete!**

🎉 **Just Completed**: Full component library with Storybook documentation
🚀 **Ready**: Complete development environment with single-command setup
📚 **Available**: 20+ production-ready components with 50+ interactive stories
🔧 **Working**: All services running with hot reload and type safety

## 🚀 **Quick Start**

```bash
# Clone and setup (one-time)
git clone <repository-url>
cd valkryiefinance
pnpm install

# Start everything (development)
pnpm dev

# Access applications
# Web App:    http://localhost:3001
# Server API: http://localhost:3000
# Storybook:  http://localhost:6006
```

**That's it!** All services run with hot reload and type safety.

## 🎨 **Component System**

### **Comprehensive UI Library (`@valkyrie/ui`)**

**20+ Production-Ready Components:**
- **Core**: Button, Card, Input, Label, Badge, Avatar, Alert
- **Forms**: React Hook Form integration with Zod validation
- **Overlays**: Dialog, Popover, Tooltip, Toast
- **Data**: Table, Tabs, Progress, Skeleton
- **Layout**: BrutalGrid, responsive containers

### **Interactive Storybook Documentation**

**50+ Stories Covering:**
- **Form Examples**: Contact forms, settings, DeFi vault deposits
- **Dialog Patterns**: Wallet connection, confirmations, vault details
- **DeFi Components**: APY explanations, slippage tolerance, TVL tooltips
- **Accessibility**: WCAG compliant with keyboard navigation

**View Components**: [http://localhost:6006](http://localhost:6006) (after running `pnpm dev`)

## 🏗️ **Architecture**

### **Monorepo Structure**
```
valkryiefinance/
├── apps/
│   ├── web/              # Next.js frontend (port 3001) ✅
│   ├── server/           # tRPC API server (port 3000) ✅
│   ├── storybook-host/   # Component docs (port 6006) ✅
│   └── ai-engine/        # Go AI service ⏳
├── packages/
│   ├── ui/               # Component library ✅
│   ├── common/           # Shared utilities ✅
│   ├── config/           # Configuration ✅
│   └── contracts/        # Smart contracts ⏳
```

### **Technology Stack**
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Components**: Shadcn/ui, Radix UI, React Hook Form, Zod
- **Backend**: tRPC, Drizzle ORM, PostgreSQL, Better Auth
- **Development**: Storybook, Turbo, pnpm workspaces
- **Web3**: Wagmi, Viem, ConnectKit (ready for integration)

## 🎯 **Current Features**

### ✅ **Complete & Working**
- **Component System**: 20+ components with comprehensive Storybook
- **Development Environment**: Single command runs all services
- **Type Safety**: End-to-end TypeScript with strict mode
- **Form System**: React Hook Form + Zod validation
- **Authentication**: Better Auth integration ready
- **Database**: Drizzle ORM with PostgreSQL

### ⏳ **In Development**
- **Smart Contracts**: ERC-4626 vault deployment
- **AI Engine**: Go-based yield optimization service
- **Web3 Integration**: Live DeFi protocol connections
- **Real Data**: Live vault operations and yield tracking

## 🛠️ **Development Commands**

```bash
# Development
pnpm dev                 # Start all services
pnpm dev:web            # Frontend only
pnpm dev:server         # Backend only
pnpm dev:storybook      # Storybook only

# Building
pnpm build              # Build all packages
pnpm build:web          # Build frontend
pnpm build:server       # Build backend

# Testing
pnpm test               # Run all tests
pnpm test:watch         # Tests in watch mode
pnpm type-check         # TypeScript checking

# Code Quality
pnpm lint               # Lint all packages
pnpm format             # Format code
```

## 📊 **Component Development Workflow**

### **Adding New Components**

1. **Add shadcn component** (from web app):
   ```bash
   cd apps/web
   pnpm dlx shadcn@latest add [component]
   ```

2. **Move to UI package**:
   ```bash
   mv src/components/ui/[component].tsx ../../packages/ui/src/components/
   ```

3. **Export from UI package**:
   ```typescript
   // packages/ui/src/index.ts
   export * from './components/[component]';
   ```

4. **Create Storybook stories**:
   ```typescript
   // packages/ui/src/components/[component].stories.tsx
   export default {
     title: 'Components/[Component]',
     component: [Component],
   };
   ```

### **Using Components**

```typescript
// Import from centralized UI package
import { Button, Card, Dialog } from '@valkyrie/ui';

// Use with full type safety
<Button variant="default" size="lg">
  Deposit to Vault
</Button>
```

## 🎨 **Design System**

### **Color Tokens**
- **Semantic colors**: Primary, secondary, accent, destructive
- **Theme support**: Dark/light mode with CSS custom properties
- **Consistent palette**: Shared across all components

### **Typography**
- **Font system**: Inter for UI, JetBrains Mono for code
- **Size scale**: Consistent rem-based sizing
- **Line heights**: Optimized for readability

### **Spacing**
- **Grid system**: 4px base unit with consistent spacing
- **Component spacing**: Standardized padding and margins
- **Responsive design**: Mobile-first approach

## 🔐 **Security & Best Practices**

### **Type Safety**
- **TypeScript strict mode**: 100% type coverage
- **Zod validation**: Runtime type checking
- **tRPC**: End-to-end type safety

### **Accessibility**
- **WCAG 2.1 AA**: Compliant components
- **Keyboard navigation**: Full keyboard support
- **Screen readers**: Proper ARIA labels

### **Performance**
- **Bundle optimization**: Tree shaking and code splitting
- **Image optimization**: Next.js Image component
- **Lazy loading**: Component and route-based loading

## 📚 **Documentation**

- **[Technical Guide](documentation/TECHNICAL_GUIDE.md)**: Complete architecture overview
- **[Project Status](documentation/PROJECT_STATUS.md)**: Current development status
- **[Storybook](http://localhost:6006)**: Interactive component documentation
- **[API Docs](http://localhost:3000/api/trpc)**: tRPC API documentation

## 🚀 **Deployment**

### **Development**
- **Local**: `pnpm dev` - All services with hot reload
- **Storybook**: `pnpm dev:storybook` - Component development

### **Production** (Ready for deployment)
- **Frontend**: Vercel with automatic deployments
- **Backend**: Railway or Vercel serverless
- **Database**: Supabase with connection pooling
- **Components**: Published to npm as `@valkyrie/ui`

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes**: Follow TypeScript and component patterns
4. **Add tests**: Ensure component coverage
5. **Create stories**: Add Storybook documentation
6. **Submit PR**: With comprehensive description

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 **Links**

- **Website**: [https://valkyrie.finance](https://valkyrie.finance) (Coming Soon)
- **Documentation**: [Technical Guide](documentation/TECHNICAL_GUIDE.md)
- **Component Library**: [Storybook](http://localhost:6006)
- **API Documentation**: [tRPC Docs](http://localhost:3000/api/trpc)

---

**Built with ❤️ by the Valkyrie Finance Team**

*Democratizing DeFi through AI-powered yield optimization*
