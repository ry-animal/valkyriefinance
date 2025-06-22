import type { Meta, StoryObj } from '@storybook/react';
import { Layout, Monitor, MousePointer, Palette, Smartphone, Tablet, Type } from 'lucide-react';
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

const meta = {
  title: 'Design System/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Complete overview of the Valkyrie Finance design system components and patterns.',
      },
    },
    // RSC compatibility
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const DesignSystem: Story = {
  render: () => (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Palette className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Valkyrie Design System</h1>
              <p className="text-muted-foreground">
                A comprehensive design system built with Tailwind CSS v4 and shadcn/ui
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-8">
          {/* Color Palette */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <Palette className="h-5 w-5" />
              <h2 className="text-2xl font-semibold">Color Palette</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Primary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="h-12 w-full rounded bg-primary"></div>
                  <div className="h-8 w-full rounded bg-primary/80"></div>
                  <div className="h-8 w-full rounded bg-primary/60"></div>
                  <div className="h-8 w-full rounded bg-primary/40"></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Secondary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="h-12 w-full rounded bg-secondary"></div>
                  <div className="h-8 w-full rounded bg-secondary/80"></div>
                  <div className="h-8 w-full rounded bg-secondary/60"></div>
                  <div className="h-8 w-full rounded bg-secondary/40"></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Accent</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="h-12 w-full rounded bg-accent"></div>
                  <div className="h-8 w-full rounded bg-accent/80"></div>
                  <div className="h-8 w-full rounded bg-accent/60"></div>
                  <div className="h-8 w-full rounded bg-accent/40"></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Destructive</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="h-12 w-full rounded bg-destructive"></div>
                  <div className="h-8 w-full rounded bg-destructive/80"></div>
                  <div className="h-8 w-full rounded bg-destructive/60"></div>
                  <div className="h-8 w-full rounded bg-destructive/40"></div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Typography */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <Type className="h-5 w-5" />
              <h2 className="text-2xl font-semibold">Typography</h2>
            </div>
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <h1 className="text-4xl font-bold">Heading 1</h1>
                  <p className="text-sm text-muted-foreground">text-4xl font-bold</p>
                </div>
                <div>
                  <h2 className="text-3xl font-semibold">Heading 2</h2>
                  <p className="text-sm text-muted-foreground">text-3xl font-semibold</p>
                </div>
                <div>
                  <h3 className="text-2xl font-medium">Heading 3</h3>
                  <p className="text-sm text-muted-foreground">text-2xl font-medium</p>
                </div>
                <div>
                  <p className="text-base">
                    Body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                  <p className="text-sm text-muted-foreground">text-base</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Small text - Additional information or captions.
                  </p>
                  <p className="text-xs text-muted-foreground">text-sm text-muted-foreground</p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Components */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <MousePointer className="h-5 w-5" />
              <h2 className="text-2xl font-semibold">Components</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle>Buttons</CardTitle>
                  <CardDescription>Interactive elements for user actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm">Small</Button>
                    <Button>Default</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Form Elements */}
              <Card>
                <CardHeader>
                  <CardTitle>Form Elements</CardTitle>
                  <CardDescription>Input fields and form controls</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="demo-input">Email</Label>
                    <Input id="demo-input" type="email" placeholder="Enter your email" />
                  </div>
                  <div className="flex gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Avatars */}
              <Card>
                <CardHeader>
                  <CardTitle>Avatars</CardTitle>
                  <CardDescription>User profile representations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-8 w-8" />
                    <Avatar className="h-10 w-10" />
                    <Avatar className="h-12 w-12" />
                    <Avatar className="h-16 w-16" />
                  </div>
                </CardContent>
              </Card>

              {/* Cards */}
              <Card>
                <CardHeader>
                  <CardTitle>Card Layouts</CardTitle>
                  <CardDescription>Content containers and layouts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Total Balance</p>
                          <p className="text-2xl font-bold">$12,345.67</p>
                        </div>
                        <Badge variant="default">+12.5%</Badge>
                      </div>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Responsive Design */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <Layout className="h-5 w-5" />
              <h2 className="text-2xl font-semibold">Responsive Design</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <CardTitle className="text-sm">Mobile</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Optimized for mobile devices with touch-friendly interactions.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Tablet className="h-4 w-4" />
                    <CardTitle className="text-sm">Tablet</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Adaptive layouts that work seamlessly on tablet devices.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    <CardTitle className="text-sm">Desktop</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Full-featured experience for desktop and larger screens.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Complete overview of the design system including colors, typography, components, and responsive design principles.',
      },
    },
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
