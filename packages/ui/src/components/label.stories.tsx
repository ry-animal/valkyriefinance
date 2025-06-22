import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';
import { Input } from './input';
import { Label } from './label';

const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Email address',
  },
};

export const WithInput: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">Email address</Label>
      <Input id="email" type="email" placeholder="Enter your email" />
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="password">
        Password <span className="text-red-500">*</span>
      </Label>
      <Input id="password" type="password" placeholder="Enter your password" />
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">I agree to the terms and conditions</Label>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div className="space-y-6 max-w-sm">
      <div className="space-y-2">
        <Label htmlFor="first-name">First name</Label>
        <Input id="first-name" placeholder="John" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="last-name">Last name</Label>
        <Input id="last-name" placeholder="Doe" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email-form">
          Email address <span className="text-red-500">*</span>
        </Label>
        <Input id="email-form" type="email" placeholder="john@example.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone number</Label>
        <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="newsletter-form" />
        <Label htmlFor="newsletter-form">Subscribe to our newsletter</Label>
      </div>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="default">Default label</Label>
        <Input id="default" placeholder="Default input" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="small" className="text-sm">
          Small label
        </Label>
        <Input id="small" placeholder="Small input" className="h-8" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="large" className="text-lg font-semibold">
          Large label
        </Label>
        <Input id="large" placeholder="Large input" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="muted" className="text-muted-foreground">
          Muted label
        </Label>
        <Input id="muted" placeholder="Muted input" />
      </div>
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" placeholder="johndoe" />
        <p className="text-sm text-muted-foreground">This will be your public display name.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Tell us about yourself..."
        />
        <p className="text-sm text-muted-foreground">Write a brief description about yourself.</p>
      </div>
    </div>
  ),
};
