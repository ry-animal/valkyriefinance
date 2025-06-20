import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '../components/alert';
import { Avatar, AvatarFallback, AvatarImage } from '../components/avatar';
import { Badge } from '../components/badge';
import { Button } from '../components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/card';
import { Input } from '../components/input';
import { Label } from '../components/label';
import { Progress } from '../components/progress';
import { Skeleton } from '../components/skeleton';

const meta: Meta = {
  title: 'Design System/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Valkyrie Finance Design System

A comprehensive design system built with **Shadcn/UI** components, **Tailwind CSS**, and **design tokens**.
This overview showcases the complete component library with consistent theming and accessibility features.

## Key Features

- 🎨 **Token-based Design System**: Consistent colors, spacing, and typography
- 🌙 **Dark Mode Support**: Complete light/dark theme implementation
- ♿ **Accessibility First**: WCAG compliant components with proper ARIA labels
- 📱 **Responsive Design**: Mobile-first responsive components
- ⚡ **React Server Components**: Compatible with Next.js 15 RSC architecture
- 🎯 **TypeScript**: Full type safety across all components

## Design Tokens

Our design system is built on a foundation of design tokens that ensure consistency:

- **Colors**: Semantic color palette with light/dark mode variants
- **Typography**: Consistent font scales and weights
- **Spacing**: Harmonious spacing scale
- **Border Radius**: Consistent corner radius system
        `,
      },
    },
    // RSC compatibility
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DesignSystemOverview: Story = {
  name: 'Complete Design System',
  render: () => (
    <div className="min-h-screen bg-background p-8 space-y-8">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-foreground">Valkyrie Finance Design System</h1>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            A modern, accessible, and comprehensive component library for building beautiful Web3
            interfaces.
          </p>
          <div className="flex gap-2 justify-center">
            <Badge variant="default">Next.js 15</Badge>
            <Badge variant="secondary">React 19</Badge>
            <Badge variant="outline">TypeScript</Badge>
            <Badge variant="destructive">Tailwind CSS</Badge>
          </div>
        </div>

        {/* Color Palette */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Color System</CardTitle>
            <CardDescription>
              Our semantic color palette adapts to light and dark themes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-16 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-medium">Primary</span>
                </div>
                <p className="text-sm text-foreground-secondary">Primary actions</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-secondary rounded-lg flex items-center justify-center">
                  <span className="text-secondary-foreground font-medium">Secondary</span>
                </div>
                <p className="text-sm text-foreground-secondary">Secondary actions</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-destructive rounded-lg flex items-center justify-center">
                  <span className="text-destructive-foreground font-medium">Destructive</span>
                </div>
                <p className="text-sm text-foreground-secondary">Dangerous actions</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground font-medium">Muted</span>
                </div>
                <p className="text-sm text-foreground-secondary">Subtle elements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Components Showcase */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>Interactive elements for user actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">Primary Button</Button>
              <Button variant="secondary" className="w-full">
                Secondary Button
              </Button>
              <Button variant="outline" className="w-full">
                Outline Button
              </Button>
              <Button variant="destructive" className="w-full">
                Destructive Button
              </Button>
              <Button variant="ghost" className="w-full">
                Ghost Button
              </Button>
            </CardContent>
          </Card>

          {/* Form Elements */}
          <Card>
            <CardHeader>
              <CardTitle>Form Components</CardTitle>
              <CardDescription>Input fields and form controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label>Progress Example</Label>
                <Progress value={75} className="w-full" />
                <p className="text-sm text-foreground-secondary">75% complete</p>
              </div>
            </CardContent>
          </Card>

          {/* User Interface */}
          <Card>
            <CardHeader>
              <CardTitle>User Interface</CardTitle>
              <CardDescription>Avatars, badges, and status indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-foreground-secondary">Developer</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge>Active</Badge>
                <Badge variant="secondary">Beta</Badge>
                <Badge variant="outline">New</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Components */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Feedback & Status</CardTitle>
              <CardDescription>Alerts, notifications, and loading states</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  This is an informational alert to provide context to users.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Loading States</h4>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Status Indicators</h4>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-sm">Online</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      <span className="text-sm">Away</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="text-sm">Offline</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-border">
          <p className="text-foreground-secondary">
            Built with ❤️ for the Valkyrie Finance ecosystem
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const ComponentGrid: Story = {
  name: 'Component Grid',
  render: () => (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Component Showcase</h2>
          <p className="text-foreground-secondary">
            A grid view of all available components in different states
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {['vault-1', 'vault-2', 'vault-3', 'vault-4', 'vault-5', 'vault-6'].map((vaultId, i) => (
            <Card key={vaultId} className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{String.fromCharCode(65 + i)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium">Component {i + 1}</h3>
                    <p className="text-sm text-foreground-secondary">Example description</p>
                  </div>
                </div>
                <Progress value={(i + 1) * 15} />
                <div className="flex gap-2">
                  <Button size="sm" variant={i % 2 === 0 ? 'default' : 'secondary'}>
                    Action
                  </Button>
                  <Badge variant={i % 3 === 0 ? 'default' : 'outline'}>Status</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
