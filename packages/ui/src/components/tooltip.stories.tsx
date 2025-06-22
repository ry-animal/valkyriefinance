import type { Meta, StoryObj } from '@storybook/react';
import { AlertTriangle, HelpCircle, Info } from 'lucide-react';
import { Badge } from './badge';
import { Button } from './button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Info className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Additional information about this feature</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Get help with this section</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Warning: This action cannot be undone</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const DifferentSides: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-8">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Top (default)</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tooltip on top</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Right</Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Tooltip on right</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Bottom</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Tooltip on bottom</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Left</Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Tooltip on left</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const DeFiTooltips: Story = {
  render: () => (
    <div className="space-y-6 p-6">
      {/* APY Explanation */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">APY: 12.5%</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>
              Annual Percentage Yield - The estimated yearly return including compound interest.
              This rate may fluctuate based on market conditions.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Risk Level */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary">Medium Risk</Badge>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>
              Risk assessment based on volatility, smart contract audits, and historical
              performance. Medium risk indicates moderate price fluctuations.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* TVL */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">TVL: $2.4M</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>
              Total Value Locked - The total amount of assets currently deposited in this vault.
              Higher TVL generally indicates more trust and stability.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Slippage */}
      <div className="flex items-center gap-2">
        <span className="text-sm">Slippage Tolerance: 0.5%</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertTriangle className="h-4 w-4 text-yellow-500 cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>
              Maximum price difference you're willing to accept. Lower values reduce slippage but
              may cause transaction failures in volatile markets.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Smart Contract Details</Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-sm">
        <div className="space-y-2">
          <p className="font-semibold">Valkyrie Vault v2.1</p>
          <p className="text-sm">Contract: 0x1234...5678</p>
          <p className="text-sm">Audited by: Consensys, Trail of Bits</p>
          <p className="text-sm">Last audit: March 2024</p>
          <p className="text-sm text-muted-foreground">
            This vault uses AI-optimized strategies to maximize yield while minimizing risk through
            automated rebalancing.
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  ),
};
