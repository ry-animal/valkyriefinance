import type { Meta, StoryObj } from '@storybook/react';
import { BrutalButton, BrutalCard, BrutalCardContent } from '../index';

const meta: Meta = {
  title: 'Design System/Animation System',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj;

export const AnimationShowcase: Story = {
  render: () => (
    <div className="p-8 space-y-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Animation System</h1>
        <p className="text-gray-600">
          Comprehensive animation utilities for creating engaging user experiences
        </p>
      </div>

      {/* Button Animations */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Button Animations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center space-y-2">
            <BrutalButton animation="hover">Hover Scale</BrutalButton>
            <p className="text-sm text-gray-500">hover</p>
          </div>
          <div className="text-center space-y-2">
            <BrutalButton animation="bounce">Bounce</BrutalButton>
            <p className="text-sm text-gray-500">bounce</p>
          </div>
          <div className="text-center space-y-2">
            <BrutalButton animation="pulse">Pulse</BrutalButton>
            <p className="text-sm text-gray-500">pulse</p>
          </div>
          <div className="text-center space-y-2">
            <BrutalButton animation="wiggle">Wiggle</BrutalButton>
            <p className="text-sm text-gray-500">wiggle</p>
          </div>
          <div className="text-center space-y-2">
            <BrutalButton animation="float">Float</BrutalButton>
            <p className="text-sm text-gray-500">float</p>
          </div>
          <div className="text-center space-y-2">
            <BrutalButton animation="glow" variant="neon">
              Glow
            </BrutalButton>
            <p className="text-sm text-gray-500">glow</p>
          </div>
          <div className="text-center space-y-2">
            <BrutalButton animation="rubber">Rubber</BrutalButton>
            <p className="text-sm text-gray-500">rubber</p>
          </div>
          <div className="text-center space-y-2">
            <BrutalButton animation="heartbeat">Heartbeat</BrutalButton>
            <p className="text-sm text-gray-500">heartbeat</p>
          </div>
        </div>
      </section>

      {/* Card Hover Effects */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Card Hover Effects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BrutalCard hover="lift">
            <BrutalCardContent className="p-6 text-center">
              <h3 className="font-bold mb-2">Lift Effect</h3>
              <p className="text-gray-600">Hover to lift</p>
            </BrutalCardContent>
          </BrutalCard>
          <BrutalCard hover="glow" variant="neon">
            <BrutalCardContent className="p-6 text-center">
              <h3 className="font-bold mb-2 text-cyan-400">Glow Effect</h3>
              <p className="text-gray-300">Hover to glow</p>
            </BrutalCardContent>
          </BrutalCard>
          <BrutalCard hover="scale">
            <BrutalCardContent className="p-6 text-center">
              <h3 className="font-bold mb-2">Scale Effect</h3>
              <p className="text-gray-600">Hover to scale</p>
            </BrutalCardContent>
          </BrutalCard>
        </div>
      </section>

      {/* CSS Animation Classes */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">CSS Animation Utilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <h3 className="font-semibold">Shimmer Loading</h3>
            <div className="space-y-2">
              <div className="shimmer h-4 bg-gray-200 rounded"></div>
              <div className="shimmer h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="shimmer h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="text-center space-y-3">
            <h3 className="font-semibold">Gradient Animation</h3>
            <div className="p-4 bg-gradient-animated text-white font-semibold rounded">
              Animated Gradient
            </div>
          </div>
          <div className="text-center space-y-3">
            <h3 className="font-semibold">Heartbeat</h3>
            <div className="heartbeat p-4 bg-red-100 border-2 border-red-400 rounded text-red-700">
              ❤️ Heartbeat
            </div>
          </div>
        </div>
      </section>
    </div>
  ),
};

export const PerformanceConsiderations: Story = {
  render: () => (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Animation Performance</h1>
      <div className="space-y-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-blue-800">Best Practices</h2>
          <ul className="space-y-2 text-blue-700">
            <li>• Use CSS transforms instead of changing layout properties</li>
            <li>• Prefer opacity and transform for smooth 60fps animations</li>
            <li>• Use will-change property sparingly and remove after animation</li>
            <li>• Consider reduced motion preferences with prefers-reduced-motion</li>
          </ul>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-green-800">GPU-Accelerated Properties</h2>
          <ul className="space-y-2 text-green-700">
            <li>• transform: translate3d(), scale(), rotate()</li>
            <li>• opacity</li>
            <li>• filter (with caution)</li>
          </ul>
        </div>

        <div className="bg-amber-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-amber-800">Avoid Animating</h2>
          <ul className="space-y-2 text-amber-700">
            <li>• width, height (use transform: scale instead)</li>
            <li>• top, left, right, bottom (use transform: translate instead)</li>
            <li>• box-shadow (expensive repaints)</li>
          </ul>
        </div>
      </div>
    </div>
  ),
};
