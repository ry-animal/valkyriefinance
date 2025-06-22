import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Progress } from './progress';

const meta: Meta<typeof Progress> = {
  title: 'UI/Progress',
  component: Progress,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
  },
};

export const Empty: Story = {
  args: {
    value: 0,
  },
};

export const Complete: Story = {
  args: {
    value: 100,
  },
};

export const LowProgress: Story = {
  args: {
    value: 15,
  },
};

export const HighProgress: Story = {
  args: {
    value: 85,
  },
};

export const WithLabels: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Upload Progress</span>
          <span>25%</span>
        </div>
        <Progress value={25} />
      </div>

      <div>
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Download Progress</span>
          <span>75%</span>
        </div>
        <Progress value={75} />
      </div>

      <div>
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Sync Progress</span>
          <span>100%</span>
        </div>
        <Progress value={100} />
      </div>
    </div>
  ),
};

export const Animated: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timer = setTimeout(() => setProgress(66), 500);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Loading...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      </div>
    );
  },
};

export const MultipleSteps: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Installation Progress</h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Step 1: Download</span>
              <span className="text-green-600">✓ Complete</span>
            </div>
            <Progress value={100} />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Step 2: Extract</span>
              <span className="text-green-600">✓ Complete</span>
            </div>
            <Progress value={100} />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Step 3: Install</span>
              <span>45%</span>
            </div>
            <Progress value={45} />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Step 4: Configure</span>
              <span className="text-muted-foreground">Pending</span>
            </div>
            <Progress value={0} />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Small (default)</p>
        <Progress value={60} />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Medium</p>
        <Progress value={60} className="h-3" />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Large</p>
        <Progress value={60} className="h-4" />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Extra Large</p>
        <Progress value={60} className="h-6" />
      </div>
    </div>
  ),
};
