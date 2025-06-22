import type { Meta, StoryObj } from '@storybook/react';
import {
  Badge,
  BrutalButton,
  BrutalCard,
  BrutalCardContent,
  BrutalCardFooter,
  BrutalCardHeader,
  BrutalCardTitle,
} from '../index';

const meta: Meta = {
  title: 'DeFi/Simple Dashboard',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const Dashboard: Story = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-fluid-hero font-brutal font-black uppercase tracking-wider mb-4">
          Valkyrie Finance
        </h1>
        <p className="text-fluid-lg text-gray-300 max-w-2xl mx-auto">
          Next-generation DeFi platform with AI-powered yield optimization
        </p>
      </div>

      {/* Portfolio Overview */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <BrutalCard variant="neon" hover="glow" className="h-full">
            <BrutalCardHeader>
              <BrutalCardTitle className="text-cyan-400">Total Portfolio</BrutalCardTitle>
            </BrutalCardHeader>
            <BrutalCardContent>
              <div className="text-3xl font-bold text-profit mb-2">$125,432.67</div>
              <div className="flex items-center gap-2">
                <Badge className="bg-profit text-white">+12.5%</Badge>
                <span className="text-sm text-gray-300">+$13,890.45</span>
              </div>
            </BrutalCardContent>
          </BrutalCard>

          <BrutalCard variant="gradient" hover="lift" className="h-full">
            <BrutalCardHeader>
              <BrutalCardTitle>Staking Rewards</BrutalCardTitle>
            </BrutalCardHeader>
            <BrutalCardContent>
              <div className="text-2xl font-bold text-staking mb-2">1,567.89 VALKYRIE</div>
              <div className="text-sm text-gray-300">APY: 24.7%</div>
            </BrutalCardContent>
            <BrutalCardFooter>
              <BrutalButton variant="defi" size="sm" animation="pulse">
                Claim Rewards
              </BrutalButton>
            </BrutalCardFooter>
          </BrutalCard>

          <BrutalCard variant="default" hover="scale" className="h-full">
            <BrutalCardHeader>
              <BrutalCardTitle>Liquidity Pools</BrutalCardTitle>
            </BrutalCardHeader>
            <BrutalCardContent>
              <div className="text-2xl font-bold text-liquidity mb-2">$45,678.90</div>
              <div className="text-sm text-gray-300">3 Active Pools</div>
            </BrutalCardContent>
            <BrutalCardFooter>
              <BrutalButton variant="outline" size="sm" animation="hover">
                Manage
              </BrutalButton>
            </BrutalCardFooter>
          </BrutalCard>

          <BrutalCard variant="glass" hover="bounce" className="h-full">
            <BrutalCardHeader>
              <BrutalCardTitle>AI Yield</BrutalCardTitle>
            </BrutalCardHeader>
            <BrutalCardContent>
              <div className="text-2xl font-bold text-yield mb-2">18.9% APY</div>
              <div className="text-sm text-gray-300">Auto-optimized</div>
            </BrutalCardContent>
            <BrutalCardFooter>
              <BrutalButton variant="gradient" size="sm" animation="glow">
                Optimize
              </BrutalButton>
            </BrutalCardFooter>
          </BrutalCard>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-12">
        <h2 className="text-fluid-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <BrutalButton variant="gradient" animation="glow" className="h-20 flex-col">
            <div className="text-2xl mb-1">💰</div>
            <span className="text-sm">Swap</span>
          </BrutalButton>
          <BrutalButton variant="neon" animation="float" className="h-20 flex-col">
            <div className="text-2xl mb-1">🏦</div>
            <span className="text-sm">Lend</span>
          </BrutalButton>
          <BrutalButton variant="defi" animation="pulse" className="h-20 flex-col">
            <div className="text-2xl mb-1">🥩</div>
            <span className="text-sm">Stake</span>
          </BrutalButton>
          <BrutalButton variant="outline" animation="bounce" className="h-20 flex-col">
            <div className="text-2xl mb-1">🌊</div>
            <span className="text-sm">Pool</span>
          </BrutalButton>
          <BrutalButton variant="gradient" animation="wiggle" className="h-20 flex-col">
            <div className="text-2xl mb-1">🤖</div>
            <span className="text-sm">AI Vault</span>
          </BrutalButton>
          <BrutalButton variant="neon" animation="rubber" className="h-20 flex-col">
            <div className="text-2xl mb-1">🗳️</div>
            <span className="text-sm">Vote</span>
          </BrutalButton>
        </div>
      </section>

      {/* Market Data */}
      <section>
        <h2 className="text-fluid-2xl font-bold mb-6">Market Overview</h2>
        <BrutalCard variant="glass" hover="scale">
          <BrutalCardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">$2,456.78</div>
                <div className="text-sm text-gray-400">ETH Price</div>
                <Badge className="bg-profit text-white mt-1">+2.4%</Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">$89.45</div>
                <div className="text-sm text-gray-400">VALKYRIE Price</div>
                <Badge className="bg-profit text-white mt-1">+8.7%</Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400 mb-1">$2.4B</div>
                <div className="text-sm text-gray-400">Total TVL</div>
                <Badge className="bg-neutral text-white mt-1">+0.2%</Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400 mb-1">23.5%</div>
                <div className="text-sm text-gray-400">Avg APY</div>
                <Badge className="bg-profit text-white mt-1">+1.2%</Badge>
              </div>
            </div>
          </BrutalCardContent>
        </BrutalCard>
      </section>
    </div>
  ),
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white p-4">
      <header className="mb-8 text-center">
        <h1 className="text-fluid-2xl font-brutal font-black uppercase tracking-wider mb-2">
          Valkyrie
        </h1>
        <p className="text-sm text-gray-300">DeFi Dashboard</p>
      </header>

      <div className="space-y-6">
        <BrutalCard variant="neon" hover="glow">
          <BrutalCardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-profit mb-1">$125,432.67</div>
              <div className="text-sm text-gray-300">Total Portfolio</div>
              <Badge className="bg-profit text-white mt-2">+12.5%</Badge>
            </div>
          </BrutalCardContent>
        </BrutalCard>

        <div className="grid grid-cols-2 gap-4">
          <BrutalCard variant="gradient" hover="lift" className="h-full">
            <BrutalCardContent className="text-center">
              <div className="text-lg font-bold text-staking mb-1">1.5K</div>
              <div className="text-xs text-gray-300">VALKYRIE</div>
            </BrutalCardContent>
          </BrutalCard>
          <BrutalCard variant="default" hover="scale" className="h-full">
            <BrutalCardContent className="text-center">
              <div className="text-lg font-bold text-yield mb-1">18.9%</div>
              <div className="text-xs text-gray-300">AI APY</div>
            </BrutalCardContent>
          </BrutalCard>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <BrutalButton variant="gradient" size="sm" className="flex-col py-4">
            <div className="text-lg mb-1">💰</div>
            <span className="text-xs">Swap</span>
          </BrutalButton>
          <BrutalButton variant="neon" size="sm" className="flex-col py-4">
            <div className="text-lg mb-1">🥩</div>
            <span className="text-xs">Stake</span>
          </BrutalButton>
          <BrutalButton variant="defi" size="sm" className="flex-col py-4">
            <div className="text-lg mb-1">🤖</div>
            <span className="text-xs">AI</span>
          </BrutalButton>
        </div>
      </div>
    </div>
  ),
};
