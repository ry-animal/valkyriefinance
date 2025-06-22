import type { Meta, StoryObj } from '@storybook/react';
import { motion } from 'framer-motion';
import {
  Badge,
  BrutalButton,
  BrutalCard,
  BrutalCardContent,
  BrutalCardDescription,
  BrutalCardFooter,
  BrutalCardHeader,
  BrutalCardTitle,
} from '../index';
import {
  animationPresets,
  brutalHoverVariants,
  defiAnimations,
  fadeInVariants,
  floatVariants,
  glowPulseVariants,
  morphingVariants,
  scaleInVariants,
  slideInVariants,
  staggerContainer,
  staggerItem,
} from '../lib/animations';

const meta: Meta = {
  title: 'Design System/Showcase',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Comprehensive showcase of the enhanced Valkyrie UI design system with sophisticated design tokens, modern animations, and DeFi-specific components.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const DesignTokensShowcase: Story = {
  name: 'Design Tokens & Colors',
  render: () => (
    <div className="p-8 space-y-12 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        className="text-center"
      >
        <h1 className="text-fluid-hero font-brutal font-black uppercase tracking-wider text-black mb-4">
          Design System
        </h1>
        <p className="text-fluid-lg text-gray-600 max-w-2xl mx-auto">
          Sophisticated design tokens, modern animations, and DeFi-specific components
        </p>
      </motion.div>

      {/* Color Palette */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-6"
      >
        <motion.h2 variants={staggerItem} className="text-fluid-2xl font-bold text-gray-900">
          Color Palette
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Core Colors */}
          <motion.div variants={staggerItem} className="space-y-3">
            <h3 className="font-semibold text-gray-700">Core Colors</h3>
            <div className="space-y-2">
              {['blue', 'emerald', 'red', 'amber', 'purple', 'cyan'].map((color) => (
                <div key={color} className="flex items-center space-x-2">
                  <div
                    className={`w-8 h-8 rounded border-2 border-black shadow-brutal-sm bg-${color}-500`}
                  />
                  <span className="text-sm font-medium capitalize">{color}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* DeFi Colors */}
          <motion.div variants={staggerItem} className="space-y-3">
            <h3 className="font-semibold text-gray-700">DeFi Colors</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded border-2 border-black shadow-brutal-sm bg-profit" />
                <span className="text-sm font-medium">Profit</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded border-2 border-black shadow-brutal-sm bg-loss" />
                <span className="text-sm font-medium">Loss</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded border-2 border-black shadow-brutal-sm bg-staking" />
                <span className="text-sm font-medium">Staking</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded border-2 border-black shadow-brutal-sm bg-liquidity" />
                <span className="text-sm font-medium">Liquidity</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded border-2 border-black shadow-brutal-sm bg-yield" />
                <span className="text-sm font-medium">Yield</span>
              </div>
            </div>
          </motion.div>

          {/* Shadows */}
          <motion.div variants={staggerItem} className="space-y-3">
            <h3 className="font-semibold text-gray-700">Shadow Effects</h3>
            <div className="space-y-3">
              <div className="w-16 h-16 bg-white shadow-brutal border-2 border-black flex items-center justify-center">
                <span className="text-xs font-bold">Brutal</span>
              </div>
              <div className="w-16 h-16 bg-white shadow-glow border-2 border-blue-400 flex items-center justify-center">
                <span className="text-xs font-bold">Glow</span>
              </div>
              <div className="w-16 h-16 bg-white shadow-lg rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold">Soft</span>
              </div>
            </div>
          </motion.div>

          {/* Typography */}
          <motion.div variants={staggerItem} className="space-y-3">
            <h3 className="font-semibold text-gray-700">Typography</h3>
            <div className="space-y-2">
              <div className="text-fluid-xs">Fluid XS</div>
              <div className="text-fluid-sm">Fluid SM</div>
              <div className="text-fluid-base">Fluid Base</div>
              <div className="text-fluid-lg">Fluid LG</div>
              <div className="text-fluid-xl font-brutal">Brutal XL</div>
              <div className="text-fluid-2xl font-display">Display 2XL</div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  ),
};

export const ButtonShowcase: Story = {
  name: 'Enhanced Buttons',
  render: () => (
    <div className="p-8 space-y-12 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-6"
      >
        <motion.h1
          variants={staggerItem}
          className="text-fluid-2xl font-bold text-gray-900 text-center"
        >
          Enhanced Button Components
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div variants={staggerItem} className="space-y-4">
            <h3 className="font-semibold text-gray-700">Variants</h3>
            <div className="space-y-3">
              <BrutalButton variant="default">Default</BrutalButton>
              <BrutalButton variant="gradient">Gradient</BrutalButton>
              <BrutalButton variant="neon">Neon</BrutalButton>
              <BrutalButton variant="defi">DeFi</BrutalButton>
              <BrutalButton variant="outline">Outline</BrutalButton>
              <BrutalButton variant="destructive">Destructive</BrutalButton>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-4">
            <h3 className="font-semibold text-gray-700">Sizes</h3>
            <div className="space-y-3">
              <BrutalButton size="xs">Extra Small</BrutalButton>
              <BrutalButton size="sm">Small</BrutalButton>
              <BrutalButton size="default">Default</BrutalButton>
              <BrutalButton size="lg">Large</BrutalButton>
              <BrutalButton size="xl">Extra Large</BrutalButton>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-4">
            <h3 className="font-semibold text-gray-700">Animations</h3>
            <div className="space-y-3">
              <BrutalButton animation="hover">Hover Scale</BrutalButton>
              <BrutalButton animation="bounce">Bounce</BrutalButton>
              <BrutalButton animation="pulse">Pulse</BrutalButton>
              <BrutalButton animation="wiggle">Wiggle</BrutalButton>
              <BrutalButton animation="float">Float</BrutalButton>
              <BrutalButton animation="glow">Glow Pulse</BrutalButton>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  ),
};

export const CardShowcase: Story = {
  name: 'Enhanced Cards',
  render: () => (
    <div className="p-8 space-y-12 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-6"
      >
        <motion.h1
          variants={staggerItem}
          className="text-fluid-2xl font-bold text-gray-900 text-center"
        >
          Enhanced Card Components
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div variants={staggerItem}>
            <BrutalCard variant="default" hover="lift">
              <BrutalCardHeader>
                <BrutalCardTitle>Default Card</BrutalCardTitle>
                <BrutalCardDescription>
                  Classic brutal design with lift hover effect
                </BrutalCardDescription>
              </BrutalCardHeader>
              <BrutalCardContent>
                <p className="text-sm text-gray-600">
                  This card showcases the default brutal styling with enhanced shadows and hover
                  animations.
                </p>
              </BrutalCardContent>
              <BrutalCardFooter>
                <BrutalButton size="sm">Action</BrutalButton>
              </BrutalCardFooter>
            </BrutalCard>
          </motion.div>

          <motion.div variants={staggerItem}>
            <BrutalCard variant="gradient" hover="glow" rounded="lg">
              <BrutalCardHeader>
                <BrutalCardTitle>Gradient Card</BrutalCardTitle>
                <BrutalCardDescription>
                  Beautiful gradient background with glow effect
                </BrutalCardDescription>
              </BrutalCardHeader>
              <BrutalCardContent>
                <div className="space-y-2">
                  <Badge className="bg-profit text-white">Profit: +12.5%</Badge>
                  <p className="text-sm text-gray-600">
                    Perfect for displaying DeFi metrics and performance data.
                  </p>
                </div>
              </BrutalCardContent>
              <BrutalCardFooter>
                <BrutalButton variant="gradient" size="sm">
                  Invest
                </BrutalButton>
              </BrutalCardFooter>
            </BrutalCard>
          </motion.div>

          <motion.div variants={staggerItem}>
            <BrutalCard variant="neon" hover="scale" rounded="xl">
              <BrutalCardHeader>
                <BrutalCardTitle className="text-cyan-400">Neon Card</BrutalCardTitle>
                <BrutalCardDescription className="text-gray-300">
                  Futuristic neon styling with scale animation
                </BrutalCardDescription>
              </BrutalCardHeader>
              <BrutalCardContent>
                <div className="space-y-2">
                  <div className="text-cyan-400 font-mono text-lg">$1,234.56</div>
                  <p className="text-sm text-gray-300">
                    Ideal for crypto wallets and trading interfaces.
                  </p>
                </div>
              </BrutalCardContent>
              <BrutalCardFooter>
                <BrutalButton variant="neon" size="sm">
                  Trade
                </BrutalButton>
              </BrutalCardFooter>
            </BrutalCard>
          </motion.div>
        </div>
      </motion.div>
    </div>
  ),
};

export const AnimationShowcase: Story = {
  name: 'Animation System',
  render: () => (
    <div className="p-8 space-y-12 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-6"
      >
        <motion.h1
          variants={staggerItem}
          className="text-fluid-2xl font-bold text-gray-900 text-center"
        >
          Animation Showcase
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={staggerItem} className="space-y-4">
            <h3 className="font-semibold text-gray-700">Entrance Animations</h3>
            <div className="space-y-3">
              <motion.div
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                className="p-4 bg-white border-2 border-black shadow-brutal-sm"
              >
                Fade In
              </motion.div>
              <motion.div
                variants={slideInVariants}
                initial="hidden"
                animate="visible"
                className="p-4 bg-white border-2 border-black shadow-brutal-sm"
              >
                Slide In
              </motion.div>
              <motion.div
                variants={scaleInVariants}
                initial="hidden"
                animate="visible"
                className="p-4 bg-white border-2 border-black shadow-brutal-sm"
              >
                Scale In
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-4">
            <h3 className="font-semibold text-gray-700">Continuous Animations</h3>
            <div className="space-y-3">
              <motion.div
                variants={floatVariants}
                animate="animate"
                className="p-4 bg-white border-2 border-black shadow-brutal-sm"
              >
                Float
              </motion.div>
              <motion.div
                variants={glowPulseVariants}
                animate="animate"
                className="p-4 bg-white border-2 border-blue-400"
              >
                Glow Pulse
              </motion.div>
              <motion.div
                variants={morphingVariants}
                animate="animate"
                className="p-4 bg-white border-2 border-black shadow-brutal-sm"
              >
                Morphing
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-4">
            <h3 className="font-semibold text-gray-700">DeFi Animations</h3>
            <div className="space-y-3">
              <motion.div
                variants={defiAnimations.profitGlow}
                animate="animate"
                className="p-4 bg-emerald-50 border-2 border-emerald-500 text-emerald-700 font-semibold"
              >
                Profit Glow
              </motion.div>
              <motion.div
                variants={defiAnimations.lossGlow}
                animate="animate"
                className="p-4 bg-red-50 border-2 border-red-500 text-red-700 font-semibold"
              >
                Loss Glow
              </motion.div>
              <motion.div
                variants={defiAnimations.stakingPulse}
                animate="animate"
                className="p-4 bg-purple-50 border-2 border-purple-500 text-purple-700 font-semibold"
              >
                Staking Pulse
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-4">
            <h3 className="font-semibold text-gray-700">Interactive Effects</h3>
            <div className="space-y-3">
              <motion.div
                variants={brutalHoverVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="p-4 bg-white border-2 border-black cursor-pointer"
              >
                Brutal Hover
              </motion.div>
              <motion.div
                {...animationPresets.cardHover}
                className="p-4 bg-white border border-gray-200 rounded-lg cursor-pointer"
              >
                Card Hover
              </motion.div>
              <motion.div className="p-4 bg-gradient-animated text-white font-semibold cursor-pointer">
                Gradient Animation
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  ),
};

export const UtilityShowcase: Story = {
  name: 'Utility Classes & Effects',
  render: () => (
    <div className="p-8 space-y-12 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-6"
      >
        <motion.h1
          variants={staggerItem}
          className="text-fluid-2xl font-bold text-gray-900 text-center"
        >
          Utility Classes & Effects
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div variants={staggerItem} className="space-y-4">
            <h3 className="font-semibold text-gray-700">Glass Morphism</h3>
            <div className="relative p-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl">
              <div className="glass p-4 rounded-lg">
                <p className="text-white font-medium">Glass effect with backdrop blur</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-4">
            <h3 className="font-semibold text-gray-700">Gradient Text</h3>
            <div className="space-y-2">
              <div className="gradient-text text-2xl font-bold">Primary Gradient</div>
              <div className="gradient-text-success text-2xl font-bold">Success Gradient</div>
              <div className="gradient-text-warning text-2xl font-bold">Warning Gradient</div>
              <div className="gradient-text-danger text-2xl font-bold">Danger Gradient</div>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-4">
            <h3 className="font-semibold text-gray-700">Shimmer Effect</h3>
            <div className="space-y-3">
              <div className="shimmer h-4 bg-gray-200 rounded"></div>
              <div className="shimmer h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="shimmer h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  ),
};

export const DeFiDashboard: Story = {
  name: 'DeFi Dashboard Demo',
  render: () => (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="p-8 space-y-8 bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen text-white"
    >
      <motion.header variants={staggerItem} className="text-center space-y-4">
        <h1 className="text-fluid-hero font-brutal font-black uppercase tracking-wider">
          DeFi Dashboard
        </h1>
        <p className="text-fluid-lg text-gray-300">
          Showcasing DeFi-specific components and animations
        </p>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div variants={staggerItem}>
          <BrutalCard variant="neon" hover="glow">
            <BrutalCardHeader>
              <BrutalCardTitle className="text-cyan-400">Portfolio Value</BrutalCardTitle>
            </BrutalCardHeader>
            <BrutalCardContent>
              <motion.div
                variants={defiAnimations.priceChange(true)}
                animate="animate"
                className="text-3xl font-bold text-profit"
              >
                $12,345.67
              </motion.div>
              <div className="text-sm text-gray-300 mt-2">+$1,234.56 (11.2%)</div>
            </BrutalCardContent>
          </BrutalCard>
        </motion.div>

        <motion.div variants={staggerItem}>
          <BrutalCard variant="gradient" hover="scale">
            <BrutalCardHeader>
              <BrutalCardTitle>Staking Rewards</BrutalCardTitle>
            </BrutalCardHeader>
            <BrutalCardContent>
              <motion.div
                variants={defiAnimations.stakingPulse}
                animate="animate"
                className="text-2xl font-bold text-staking"
              >
                156.78 VALKYRIE
              </motion.div>
              <div className="text-sm text-gray-600 mt-2">12.5% APY</div>
            </BrutalCardContent>
            <BrutalCardFooter>
              <BrutalButton variant="defi" size="sm">
                Claim
              </BrutalButton>
            </BrutalCardFooter>
          </BrutalCard>
        </motion.div>

        <motion.div variants={staggerItem}>
          <BrutalCard variant="default" hover="lift">
            <BrutalCardHeader>
              <BrutalCardTitle>Liquidity Pool</BrutalCardTitle>
            </BrutalCardHeader>
            <BrutalCardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-liquidity">VALKYRIE/ETH</span>
                  <span className="font-bold">$5,678.90</span>
                </div>
                <div className="text-sm text-gray-600">24.7% APR</div>
              </div>
            </BrutalCardContent>
            <BrutalCardFooter>
              <BrutalButton variant="outline" size="sm">
                Manage
              </BrutalButton>
            </BrutalCardFooter>
          </BrutalCard>
        </motion.div>
      </div>

      <motion.div variants={staggerItem} className="flex flex-wrap gap-4 justify-center">
        <BrutalButton variant="gradient" animation="glow">
          Connect Wallet
        </BrutalButton>
        <BrutalButton variant="neon" animation="float">
          Trade
        </BrutalButton>
        <BrutalButton variant="defi" animation="pulse">
          Stake
        </BrutalButton>
        <BrutalButton variant="outline" animation="bounce">
          Governance
        </BrutalButton>
      </motion.div>
    </motion.div>
  ),
};
