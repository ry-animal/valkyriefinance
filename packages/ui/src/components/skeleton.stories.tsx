import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardHeader } from './card';
import { Skeleton } from './skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Skeleton className="h-4 w-[250px]" />,
};

export const Circle: Story = {
  render: () => <Skeleton className="h-12 w-12 rounded-full" />,
};

export const Rectangle: Story = {
  render: () => <Skeleton className="h-20 w-20 rounded-md" />,
};

export const Text: Story = {
  render: () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[150px]" />
    </div>
  ),
};

export const Avatar: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
};

export const CardExample: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
    </Card>
  ),
};

export const Table: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-[100px]" />
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-8 w-[120px]" />
        <Skeleton className="h-8 w-[80px]" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex space-x-2">
          <Skeleton className="h-6 w-[100px]" />
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-6 w-[120px]" />
          <Skeleton className="h-6 w-[80px]" />
        </div>
      ))}
    </div>
  ),
};

export const Button: Story = {
  render: () => (
    <div className="flex space-x-2">
      <Skeleton className="h-10 w-[100px]" />
      <Skeleton className="h-10 w-[120px]" />
      <Skeleton className="h-10 w-[80px]" />
    </div>
  ),
};

export const Dashboard: Story = {
  render: () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <Skeleton className="h-10 w-[100px]" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-8 w-[150px]" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[150px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    </div>
  ),
};
