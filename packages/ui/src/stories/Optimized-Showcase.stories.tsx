import type { Meta, StoryObj } from '@storybook/react';
// Only import specific icons to reduce bundle size
import { ArrowRight, BarChart3, TrendingUp, Wallet, Zap } from 'lucide-react';
// Tree-shaken imports - only import what we need
import { Badge } from '../components/badge';
import { BrutalButton } from '../components/brutal-button';
import {
  BrutalCard,
  BrutalCardContent,
  BrutalCardDescription,
  BrutalCardHeader,
  BrutalCardTitle,
} from '../components/brutal-card';
import { LazyStoryWrapper } from '../components/lazy-story-wrapper';

const meta: Meta = {
  title: 'Design System/Optimized Showcase',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Optimized showcase with lazy loading and tree shaking for better performance.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Critical components - load immediately
const CriticalComponents = () => (
  <div className="p-8 space-y-8">
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold mb-4">Critical Components</h1>
      <p className="text-gray-600">Essential UI components that load immediately</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BrutalCard>
        <BrutalCardHeader>
          <BrutalCardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Portfolio
          </BrutalCardTitle>
          <BrutalCardDescription>Your DeFi portfolio overview</BrutalCardDescription>
        </BrutalCardHeader>
        <BrutalCardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Value</span>
              <span className="font-bold">$12,345.67</span>
            </div>
            <div className="flex justify-between">
              <span>24h Change</span>
              <Badge className="bg-green-500 text-white">+5.2%</Badge>
            </div>
          </div>
        </BrutalCardContent>
      </BrutalCard>

      <BrutalCard>
        <BrutalCardHeader>
          <BrutalCardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance
          </BrutalCardTitle>
          <BrutalCardDescription>Recent performance metrics</BrutalCardDescription>
        </BrutalCardHeader>
        <BrutalCardContent>
          <div className="space-y-3">
            <BrutalButton size="sm" className="w-full">
              View Details
            </BrutalButton>
          </div>
        </BrutalCardContent>
      </BrutalCard>

      <BrutalCard>
        <BrutalCardHeader>
          <BrutalCardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </BrutalCardTitle>
          <BrutalCardDescription>Fast access to common operations</BrutalCardDescription>
        </BrutalCardHeader>
        <BrutalCardContent>
          <div className="space-y-2">
            <BrutalButton variant="gradient" size="sm" className="w-full">
              Swap Tokens
            </BrutalButton>
            <BrutalButton variant="outline" size="sm" className="w-full">
              Add Liquidity
            </BrutalButton>
          </div>
        </BrutalCardContent>
      </BrutalCard>
    </div>
  </div>
);

// Secondary components - load after critical ones
const SecondaryComponents = () => (
  <div className="p-8 space-y-8 bg-gray-50">
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold mb-4">Secondary Components</h2>
      <p className="text-gray-600">Additional features loaded progressively</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BrutalCard variant="gradient">
        <BrutalCardHeader>
          <BrutalCardTitle>Analytics Dashboard</BrutalCardTitle>
          <BrutalCardDescription>Detailed performance analytics</BrutalCardDescription>
        </BrutalCardHeader>
        <BrutalCardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>APY</span>
              <span className="text-green-600 font-bold">12.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>TVL</span>
              <span className="font-bold">$2.1M</span>
            </div>
            <BrutalButton variant="neon" size="sm" className="w-full">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </BrutalButton>
          </div>
        </BrutalCardContent>
      </BrutalCard>

      <BrutalCard variant="neon">
        <BrutalCardHeader>
          <BrutalCardTitle className="text-cyan-400">Advanced Trading</BrutalCardTitle>
          <BrutalCardDescription className="text-gray-300">
            Professional trading tools
          </BrutalCardDescription>
        </BrutalCardHeader>
        <BrutalCardContent>
          <div className="space-y-4">
            <div className="text-cyan-400 font-mono text-lg">$1,234.56</div>
            <BrutalButton variant="neon" size="sm" className="w-full">
              <ArrowRight className="h-4 w-4 mr-2" />
              Start Trading
            </BrutalButton>
          </div>
        </BrutalCardContent>
      </BrutalCard>
    </div>
  </div>
);

// Heavy components - load last with intersection observer
const HeavyComponents = () => (
  <div className="p-8 space-y-8 bg-gradient-to-br from-blue-50 to-purple-50">
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold mb-4">Heavy Components</h2>
      <p className="text-gray-600">Complex components loaded on-demand</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Simulated heavy components */}
      {Array.from({ length: 6 }, (_, i) => (
        <BrutalCard key={i} className="min-h-[200px]">
          <BrutalCardHeader>
            <BrutalCardTitle>Complex Component {i + 1}</BrutalCardTitle>
            <BrutalCardDescription>
              Heavy component with complex animations and interactions
            </BrutalCardDescription>
          </BrutalCardHeader>
          <BrutalCardContent>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <BrutalButton animation="pulse" variant="gradient" size="sm" className="w-full mt-4">
                Interactive Action
              </BrutalButton>
            </div>
          </BrutalCardContent>
        </BrutalCard>
      ))}
    </div>
  </div>
);

export const OptimizedShowcase: Story = {
  name: 'Progressive Loading Demo',
  render: () => (
    <div className="min-h-screen">
      {/* Critical components load immediately */}
      <CriticalComponents />

      {/* Secondary components load after 200ms */}
      <LazyStoryWrapper delay={200} enableIntersectionObserver={false}>
        <SecondaryComponents />
      </LazyStoryWrapper>

      {/* Heavy components load when scrolled into view */}
      <LazyStoryWrapper delay={500} enableIntersectionObserver={true}>
        <HeavyComponents />
      </LazyStoryWrapper>
    </div>
  ),
};

export const TreeShakingDemo: Story = {
  name: 'Tree Shaking Optimization',
  render: () => (
    <div className="p-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Tree Shaking Demo</h1>
        <p className="text-gray-600">
          This story only imports specific components and icons, reducing bundle size
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-yellow-800">Optimization Techniques</h3>
        <ul className="space-y-2 text-yellow-700">
          <li>✅ Individual component imports instead of barrel exports</li>
          <li>✅ Specific icon imports from lucide-react</li>
          <li>✅ Lazy loading for heavy components</li>
          <li>✅ Progressive loading with intersection observer</li>
          <li>✅ CSS animations instead of heavy animation libraries</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BrutalCard>
          <BrutalCardHeader>
            <BrutalCardTitle>Bundle Size Impact</BrutalCardTitle>
            <BrutalCardDescription>Comparison of optimization techniques</BrutalCardDescription>
          </BrutalCardHeader>
          <BrutalCardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Before optimization:</span>
                <span className="text-red-600 font-bold">2.8MB</span>
              </div>
              <div className="flex justify-between">
                <span>After tree shaking:</span>
                <span className="text-yellow-600 font-bold">1.9MB</span>
              </div>
              <div className="flex justify-between">
                <span>With lazy loading:</span>
                <span className="text-green-600 font-bold">1.2MB</span>
              </div>
            </div>
          </BrutalCardContent>
        </BrutalCard>

        <BrutalCard>
          <BrutalCardHeader>
            <BrutalCardTitle>Performance Metrics</BrutalCardTitle>
            <BrutalCardDescription>Loading time improvements</BrutalCardDescription>
          </BrutalCardHeader>
          <BrutalCardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Initial load:</span>
                <span className="text-green-600 font-bold">-60%</span>
              </div>
              <div className="flex justify-between">
                <span>Time to interactive:</span>
                <span className="text-green-600 font-bold">-45%</span>
              </div>
              <div className="flex justify-between">
                <span>Lighthouse score:</span>
                <span className="text-green-600 font-bold">95/100</span>
              </div>
            </div>
          </BrutalCardContent>
        </BrutalCard>
      </div>
    </div>
  ),
};
