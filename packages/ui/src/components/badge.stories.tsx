import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile badge component for displaying status, labels, and categorical information. Built with Radix UI primitives and styled with design tokens.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'The visual style variant of the badge',
    },
    asChild: {
      control: { type: 'boolean' },
      description: 'Render as a child component (useful for links)',
    },
    children: {
      control: { type: 'text' },
      description: 'The content to display inside the badge',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Primary Stories
export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

// Content Variations
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-label="Check icon"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        Verified
      </>
    ),
  },
};

export const NumericBadge: Story = {
  args: {
    children: '42',
    variant: 'secondary',
  },
};

export const LongText: Story = {
  args: {
    children: 'Long badge text content',
    variant: 'outline',
  },
};

export const Status: Story = {
  args: {
    variant: 'secondary',
    children: 'Active',
  },
};

// Use Cases Examples
export const StatusIndicators: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Active</Badge>
      <Badge variant="secondary">Pending</Badge>
      <Badge variant="destructive">Failed</Badge>
      <Badge variant="outline">Draft</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common status indicators using different badge variants.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available badge variants displayed together for comparison.',
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-label="Success icon"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        Success
      </Badge>
      <Badge variant="secondary">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-label="Time icon"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l3 3" />
        </svg>
        In Progress
      </Badge>
      <Badge variant="destructive">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-label="Error icon"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>
        Error
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges with icons to provide additional context and visual appeal.',
      },
    },
  },
};

// Interactive Example
export const AsLink: Story = {
  render: () => (
    <a href="javascript:void(0)" className="inline-block">
      <Badge asChild>
        <span>Clickable Badge</span>
      </Badge>
    </a>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badge rendered as a link using the asChild prop.',
      },
    },
  },
};
