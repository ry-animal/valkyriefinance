import type { Meta, StoryObj } from '@storybook/react';
import {
  BrutalButton,
  BrutalCard,
  BrutalCardContent,
  BrutalCardDescription,
  BrutalCardFooter,
  BrutalCardHeader,
  BrutalCardTitle,
} from '../index';

const meta: Meta = {
  title: 'Enhanced Components',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj;

export const ButtonVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-8">
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Button Variants</h3>
        <BrutalButton variant="default">Default</BrutalButton>
        <BrutalButton variant="gradient">Gradient</BrutalButton>
        <BrutalButton variant="neon">Neon</BrutalButton>
        <BrutalButton variant="defi">DeFi</BrutalButton>
        <BrutalButton variant="outline">Outline</BrutalButton>
        <BrutalButton variant="destructive">Destructive</BrutalButton>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Button Sizes</h3>
        <BrutalButton size="xs">Extra Small</BrutalButton>
        <BrutalButton size="sm">Small</BrutalButton>
        <BrutalButton size="default">Default</BrutalButton>
        <BrutalButton size="lg">Large</BrutalButton>
        <BrutalButton size="xl">Extra Large</BrutalButton>
      </div>
    </div>
  ),
};

export const CardVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
      <BrutalCard variant="default" hover="lift">
        <BrutalCardHeader>
          <BrutalCardTitle>Default Card</BrutalCardTitle>
          <BrutalCardDescription>
            Classic brutal design with lift hover effect
          </BrutalCardDescription>
        </BrutalCardHeader>
        <BrutalCardContent>
          <p className="text-sm text-gray-600">
            This card showcases the default brutal styling with enhanced shadows.
          </p>
        </BrutalCardContent>
        <BrutalCardFooter>
          <BrutalButton size="sm">Action</BrutalButton>
        </BrutalCardFooter>
      </BrutalCard>

      <BrutalCard variant="gradient" hover="glow" rounded="lg">
        <BrutalCardHeader>
          <BrutalCardTitle>Gradient Card</BrutalCardTitle>
          <BrutalCardDescription>
            Beautiful gradient background with glow effect
          </BrutalCardDescription>
        </BrutalCardHeader>
        <BrutalCardContent>
          <p className="text-sm text-gray-600">
            Perfect for displaying DeFi metrics and performance data.
          </p>
        </BrutalCardContent>
        <BrutalCardFooter>
          <BrutalButton variant="gradient" size="sm">
            Invest
          </BrutalButton>
        </BrutalCardFooter>
      </BrutalCard>

      <BrutalCard variant="neon" hover="scale" rounded="xl">
        <BrutalCardHeader>
          <BrutalCardTitle className="text-cyan-400">Neon Card</BrutalCardTitle>
          <BrutalCardDescription className="text-gray-300">
            Futuristic neon styling with scale animation
          </BrutalCardDescription>
        </BrutalCardHeader>
        <BrutalCardContent>
          <div className="text-cyan-400 font-mono text-lg">$1,234.56</div>
          <p className="text-sm text-gray-300">Ideal for crypto wallets and trading interfaces.</p>
        </BrutalCardContent>
        <BrutalCardFooter>
          <BrutalButton variant="neon" size="sm">
            Trade
          </BrutalButton>
        </BrutalCardFooter>
      </BrutalCard>
    </div>
  ),
};

export const AnimationShowcase: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-8">
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Button Animations</h3>
        <div className="space-y-3">
          <BrutalButton animation="hover">Hover Scale</BrutalButton>
          <BrutalButton animation="bounce">Bounce</BrutalButton>
          <BrutalButton animation="pulse">Pulse</BrutalButton>
          <BrutalButton animation="wiggle">Wiggle</BrutalButton>
          <BrutalButton animation="float">Float</BrutalButton>
          <BrutalButton animation="glow">Glow Pulse</BrutalButton>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Utility Classes</h3>
        <div className="space-y-3">
          <div className="p-4 bg-gradient-animated text-white font-semibold rounded">
            Gradient Animation
          </div>
          <div className="shimmer h-4 bg-gray-200 rounded"></div>
          <div className="float p-4 bg-white border-2 border-black shadow-brutal-sm">
            Float Animation
          </div>
          <div className="glow-pulse p-4 bg-white border-2 border-blue-400">Glow Pulse</div>
        </div>
      </div>
    </div>
  ),
};

export const DesignTokens: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">DeFi Colors</h3>
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-profit rounded border-2 border-black shadow-brutal-sm mx-auto mb-2"></div>
            <span className="text-sm font-medium">Profit</span>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-loss rounded border-2 border-black shadow-brutal-sm mx-auto mb-2"></div>
            <span className="text-sm font-medium">Loss</span>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-staking rounded border-2 border-black shadow-brutal-sm mx-auto mb-2"></div>
            <span className="text-sm font-medium">Staking</span>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-liquidity rounded border-2 border-black shadow-brutal-sm mx-auto mb-2"></div>
            <span className="text-sm font-medium">Liquidity</span>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yield rounded border-2 border-black shadow-brutal-sm mx-auto mb-2"></div>
            <span className="text-sm font-medium">Yield</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Typography</h3>
        <div className="space-y-2">
          <div className="text-fluid-xs">Fluid Extra Small</div>
          <div className="text-fluid-sm">Fluid Small</div>
          <div className="text-fluid-base">Fluid Base</div>
          <div className="text-fluid-lg">Fluid Large</div>
          <div className="text-fluid-xl font-brutal">Brutal Extra Large</div>
          <div className="text-fluid-2xl font-display">Display 2XL</div>
          <div className="text-fluid-3xl font-brutal">Brutal 3XL</div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Gradient Text</h3>
        <div className="space-y-2">
          <div className="gradient-text text-2xl font-bold">Primary Gradient</div>
          <div className="gradient-text-success text-2xl font-bold">Success Gradient</div>
          <div className="gradient-text-warning text-2xl font-bold">Warning Gradient</div>
          <div className="gradient-text-danger text-2xl font-bold">Danger Gradient</div>
        </div>
      </div>
    </div>
  ),
};
