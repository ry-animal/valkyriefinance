import type { Meta, StoryObj } from '@storybook/react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './alert';

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Alert {...args}>
      <Info className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components to your app using the cli.</AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
  render: (args) => (
    <Alert {...args}>
      <XCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  render: (args) => (
    <Alert {...args} className="border-green-200 bg-green-50 text-green-800">
      <CheckCircle className="h-4 w-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>Your changes have been saved successfully.</AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  render: (args) => (
    <Alert {...args} className="border-amber-200 bg-amber-50 text-amber-800">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        This action cannot be undone. Please proceed with caution.
      </AlertDescription>
    </Alert>
  ),
};

export const WithoutTitle: Story = {
  render: (args) => (
    <Alert {...args}>
      <Info className="h-4 w-4" />
      <AlertDescription>A simple alert message without a title.</AlertDescription>
    </Alert>
  ),
};

export const LongContent: Story = {
  render: (args) => (
    <Alert {...args}>
      <Info className="h-4 w-4" />
      <AlertTitle>Important Notice</AlertTitle>
      <AlertDescription>
        This is a longer alert message that demonstrates how the alert component handles multiple
        lines of text. It should wrap nicely and maintain proper spacing between the icon, title,
        and description. You can include additional information here to help users understand the
        context and any actions they might need to take.
      </AlertDescription>
    </Alert>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>This is an informational alert with default styling.</AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>This is an error alert with destructive styling.</AlertDescription>
      </Alert>

      <Alert className="border-green-200 bg-green-50 text-green-800">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>This is a success alert with custom green styling.</AlertDescription>
      </Alert>

      <Alert className="border-amber-200 bg-amber-50 text-amber-800">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>This is a warning alert with custom amber styling.</AlertDescription>
      </Alert>
    </div>
  ),
};
