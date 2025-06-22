import type { Meta, StoryObj } from '@storybook/react';
import { Eye, EyeOff, Mail, Search } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible input component with support for various types and states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'search', 'url', 'tel'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    placeholder: {
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Enter your email" />
    </div>
  ),
};

export const Types: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="grid gap-1.5">
        <Label htmlFor="text">Text</Label>
        <Input type="text" id="text" placeholder="Enter text" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" placeholder="Enter email" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" placeholder="Enter password" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="number">Number</Label>
        <Input type="number" id="number" placeholder="Enter number" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different input types with labels.',
      },
    },
  },
};

export const States: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="grid gap-1.5">
        <Label>Default</Label>
        <Input placeholder="Default state" />
      </div>
      <div className="grid gap-1.5">
        <Label>Disabled</Label>
        <Input placeholder="Disabled state" disabled />
      </div>
      <div className="grid gap-1.5">
        <Label>With value</Label>
        <Input defaultValue="This has a value" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different input states.',
      },
    },
  },
};

export const WithIcon: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="grid gap-1.5">
        <Label>Search</Label>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-8" />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label>Email</Label>
        <div className="relative">
          <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="email" placeholder="Enter email" className="pl-8" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Inputs with icons positioned inside the input field.',
      },
    },
  },
};

export const PasswordToggle: Story = {
  render: function PasswordToggleExample() {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="password-toggle">Password</Label>
        <div className="relative">
          <Input
            id="password-toggle"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter password"
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Password input with toggle visibility functionality.',
      },
    },
  },
};

export const FormExample: Story = {
  render: () => (
    <form className="space-y-4 w-80">
      <div className="grid gap-1.5">
        <Label htmlFor="form-name">Full Name</Label>
        <Input id="form-name" placeholder="John Doe" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="form-email">Email</Label>
        <Input id="form-email" type="email" placeholder="john@example.com" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="form-phone">Phone</Label>
        <Input id="form-phone" type="tel" placeholder="+1 (555) 123-4567" />
      </div>
      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example form using multiple input fields.',
      },
    },
  },
};
