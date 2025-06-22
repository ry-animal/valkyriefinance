import type { Meta, StoryObj } from '@storybook/react';
import { BrutalButton, BrutalCard, BrutalCardContent } from '../index';

const meta: Meta = {
  title: 'Design System/Animations',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj;

export const ButtonAnimations: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Button Animations</h2>
        <p className="text-gray-600">Hover and interact with the buttons to see animations</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="text-center space-y-3">
          <h3 className="font-semibold text-gray-700">Hover Scale</h3>
          <BrutalButton animation="hover">Hover Me</BrutalButton>
        </div>

        <div className="text-center space-y-3">
          <h3 className="font-semibold text-gray-700">Bounce</h3>
          <BrutalButton animation="bounce">Bounce</BrutalButton>
        </div>

        <div className="text-center space-y-3">
          <h3 className="font-semibold text-gray-700">Pulse</h3>
          <BrutalButton animation="pulse">Pulse</BrutalButton>
        </div>

        <div className="text-center space-y-3">
          <h3 className="font-semibold text-gray-700">Wiggle</h3>
          <BrutalButton animation="wiggle">Wiggle</BrutalButton>
        </div>

        <div className="text-center space-y-3">
          <h3 className="font-semibold text-gray-700">Float</h3>
          <BrutalButton animation="float">Float</BrutalButton>
        </div>

        <div className="text-center space-y-3">
          <h3 className="font-semibold text-gray-700">Glow Pulse</h3>
          <BrutalButton animation="glow" variant="neon">
            Glow
          </BrutalButton>
        </div>
      </div>
    </div>
  ),
};

export const CSSAnimations: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">CSS Animation Utilities</h2>
        <p className="text-gray-600">Pure CSS animations built into the design system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="text-center space-y-3">
          <h3 className="font-semibold text-gray-700">Shimmer Loading</h3>
          <div className="space-y-2">
            <div className="shimmer h-4 bg-gray-200 rounded"></div>
            <div className="shimmer h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="shimmer h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>

        <div className="text-center space-y-3">
          <h3 className="font-semibold text-gray-700">Gradient Animation</h3>
          <div className="p-6 bg-gradient-animated text-white font-semibold rounded-lg">
            Animated Gradient
          </div>
        </div>

        <div className="text-center space-y-3">
          <h3 className="font-semibold text-gray-700">Float Animation</h3>
          <div className="float p-4 bg-white border-2 border-black shadow-brutal-sm rounded">
            Floating Element
          </div>
        </div>

        <div className="text-center space-y-3">
          <h3 className="font-semibold text-gray-700">Glow Pulse</h3>
          <div className="glow-pulse p-4 bg-white border-2 border-blue-400 rounded">
            Glowing Element
          </div>
        </div>

        <div className="text-center space-y-3">
          <h3 className="font-semibold text-gray-700">Morphing Borders</h3>
          <div className="morphing p-4 bg-white border-2 border-purple-400">Morphing Shape</div>
        </div>

        <div className="text-center space-y-3">
          <h3 className="font-semibold text-gray-700">Heartbeat</h3>
          <div className="heartbeat p-4 bg-red-100 border-2 border-red-400 rounded text-red-700">
            ❤️ Heartbeat
          </div>
        </div>
      </div>
    </div>
  ),
};

export const CardHoverEffects: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Card Hover Effects</h2>
        <p className="text-gray-600">Hover over the cards to see different effects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BrutalCard hover="lift">
          <BrutalCardContent className="text-center p-6">
            <h3 className="font-bold mb-2">Lift Effect</h3>
            <p className="text-gray-600">Hover to lift up</p>
          </BrutalCardContent>
        </BrutalCard>

        <BrutalCard hover="glow" variant="neon">
          <BrutalCardContent className="text-center p-6">
            <h3 className="font-bold mb-2 text-cyan-400">Glow Effect</h3>
            <p className="text-gray-300">Hover to glow</p>
          </BrutalCardContent>
        </BrutalCard>

        <BrutalCard hover="scale">
          <BrutalCardContent className="text-center p-6">
            <h3 className="font-bold mb-2">Scale Effect</h3>
            <p className="text-gray-600">Hover to scale</p>
          </BrutalCardContent>
        </BrutalCard>

        <BrutalCard hover="float" variant="gradient">
          <BrutalCardContent className="text-center p-6">
            <h3 className="font-bold mb-2">Float Effect</h3>
            <p className="text-gray-600">Hover to float</p>
          </BrutalCardContent>
        </BrutalCard>

        <BrutalCard hover="bounce">
          <BrutalCardContent className="text-center p-6">
            <h3 className="font-bold mb-2">Bounce Effect</h3>
            <p className="text-gray-600">Hover to bounce</p>
          </BrutalCardContent>
        </BrutalCard>

        <BrutalCard hover="rubber" variant="glass">
          <BrutalCardContent className="text-center p-6">
            <h3 className="font-bold mb-2">Rubber Effect</h3>
            <p className="text-gray-600">Hover for rubber band</p>
          </BrutalCardContent>
        </BrutalCard>
      </div>
    </div>
  ),
};
