import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';
import { Label } from './label';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'checkbox',
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <Label htmlFor="checkbox">Accept terms and conditions</Label>
    </div>
  ),
};

export const Checked: Story = {
  args: {
    id: 'checkbox-checked',
    checked: true,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <Label htmlFor="checkbox-checked">This is checked</Label>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    id: 'checkbox-disabled',
    disabled: true,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <Label htmlFor="checkbox-disabled">This is disabled</Label>
    </div>
  ),
};

export const DisabledChecked: Story = {
  args: {
    id: 'checkbox-disabled-checked',
    disabled: true,
    checked: true,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <Label htmlFor="checkbox-disabled-checked">Disabled and checked</Label>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Preferences</p>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="email" />
            <Label htmlFor="email">Email notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="sms" />
            <Label htmlFor="sms">SMS notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="push" defaultChecked />
            <Label htmlFor="push">Push notifications</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Features</p>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="analytics" defaultChecked />
            <Label htmlFor="analytics">Enable analytics</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="marketing" />
            <Label htmlFor="marketing">Marketing emails</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="social" disabled />
            <Label htmlFor="social">Social media integration (coming soon)</Label>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-start space-x-2">
        <Checkbox id="terms" className="mt-1" />
        <div className="space-y-1">
          <Label htmlFor="terms">Accept terms and conditions</Label>
          <p className="text-sm text-muted-foreground">
            By checking this box, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox id="newsletter" className="mt-1" />
        <div className="space-y-1">
          <Label htmlFor="newsletter">Subscribe to newsletter</Label>
          <p className="text-sm text-muted-foreground">
            Get the latest updates and news delivered to your inbox.
          </p>
        </div>
      </div>
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium mb-2">Normal States</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="unchecked" />
              <Label htmlFor="unchecked">Unchecked</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="checked" checked />
              <Label htmlFor="checked">Checked</Label>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Disabled States</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="disabled-unchecked" disabled />
              <Label htmlFor="disabled-unchecked">Disabled unchecked</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="disabled-checked" disabled checked />
              <Label htmlFor="disabled-checked">Disabled checked</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
