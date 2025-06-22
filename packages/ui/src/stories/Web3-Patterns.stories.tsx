import type { Meta, StoryObj } from '@storybook/react';
import {
  AlertTriangle,
  ArrowUpDown,
  CheckCircle,
  Copy,
  ExternalLink,
  Globe,
  Lock,
  RefreshCw,
  Shield,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../components/alert';
import { Avatar, AvatarFallback, AvatarImage } from '../components/avatar';
import { Badge } from '../components/badge';
import { Button } from '../components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/card';
import { Input } from '../components/input';
import { Label } from '../components/label';
import { Progress } from '../components/progress';

const meta = {
  title: 'Web3/Patterns',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Web3 and DeFi specific UI patterns and components for the Valkyrie Finance platform.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Wallet Connection Flow
function WalletConnectionFlow() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 2000);
  };

  if (isConnected) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-green-500 rounded-full" />
            </div>
            <CardTitle>Wallet Connected</CardTitle>
            <CardDescription>0x742d...356c</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Balance:</span>
              <Badge variant="secondary">1,234.56 ETH</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Network:</span>
              <Badge>Ethereum</Badge>
            </div>
            <Button className="w-full" onClick={() => setIsConnected(false)}>
              Disconnect
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Connect Your Wallet</CardTitle>
          <CardDescription>Connect your wallet to start using Valkyrie Finance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" onClick={handleConnect} disabled={isConnecting}>
            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
          </Button>
          <Button variant="outline" className="w-full">
            WalletConnect
          </Button>
          <Button variant="outline" className="w-full">
            Coinbase Wallet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Transaction Confirmation Modal
function TransactionConfirmation() {
  const [step, setStep] = useState<'confirm' | 'pending' | 'success'>('confirm');

  const handleConfirm = () => {
    setStep('pending');
    setTimeout(() => setStep('success'), 3000);
  };

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              ✓
            </div>
            <CardTitle className="text-green-600">Transaction Successful</CardTitle>
            <CardDescription>Your transaction has been confirmed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTitle>Transaction Hash</AlertTitle>
              <AlertDescription className="font-mono text-xs break-all">
                0x8ba1f109551bd432803012645b3a1b7d6c2e2b85f4b6b0b5f1a8a8d2a8d8c8e8
              </AlertDescription>
            </Alert>
            <Button className="w-full" onClick={() => setStep('confirm')}>
              View on Etherscan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'pending') {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" />
            </div>
            <CardTitle>Confirming Transaction</CardTitle>
            <CardDescription>Please wait while your transaction is processed</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={66} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Estimated time: 30 seconds
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Confirm Transaction</CardTitle>
          <CardDescription>Review your transaction details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Action:</span>
              <span className="font-medium">Deposit to Vault</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-medium">1,000 USDC</span>
            </div>
            <div className="flex justify-between">
              <span>Gas Fee:</span>
              <span className="font-medium">~$12.50</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total:</span>
              <span>1,000 USDC + $12.50</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleConfirm}>
              Confirm
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Yield Farm Interface
function YieldFarmInterface() {
  const [staked, setStaked] = useState('0');
  const [rewards] = useState('12.45');

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Pool Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <Avatar className="border-2 border-background">
                  <AvatarFallback>ETH</AvatarFallback>
                </Avatar>
                <Avatar className="border-2 border-background">
                  <AvatarFallback>USDC</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <CardTitle>ETH-USDC LP</CardTitle>
                <CardDescription>Liquidity Pool</CardDescription>
              </div>
            </div>
            <Badge variant="secondary">435% APY</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">$2.4M</p>
              <p className="text-sm text-muted-foreground">Total Staked</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">$156K</p>
              <p className="text-sm text-muted-foreground">Your Stake</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">${rewards}</p>
              <p className="text-sm text-muted-foreground">Pending Rewards</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staking Interface */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Stake LP Tokens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Amount to Stake</Label>
              <Input placeholder="0.0" value={staked} onChange={(e) => setStaked(e.target.value)} />
              <p className="text-sm text-muted-foreground">Available: 245.67 LP tokens</p>
            </div>
            <Button className="w-full">Stake Tokens</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Claim Rewards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">${rewards}</p>
              <p className="text-sm text-muted-foreground">VLK Rewards</p>
            </div>
            <Button variant="outline" className="w-full" disabled={parseFloat(rewards) === 0}>
              Claim Rewards
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const WalletConnection: Story = {
  name: 'Wallet Connection Flow',
  render: () => <WalletConnectionFlow />,
  parameters: {
    docs: {
      description: {
        story: 'Complete wallet connection flow with loading states and connection management.',
      },
    },
  },
};

export const TransactionFlow: Story = {
  name: 'Transaction Confirmation',
  render: () => <TransactionConfirmation />,
  parameters: {
    docs: {
      description: {
        story:
          'Multi-step transaction confirmation process with gas estimation and success feedback.',
      },
    },
  },
};

export const YieldFarming: Story = {
  name: 'Yield Farm Interface',
  render: () => <YieldFarmInterface />,
  parameters: {
    docs: {
      description: {
        story: 'Complete yield farming interface with staking, rewards, and pool statistics.',
      },
    },
  },
};

export const Web3Components: Story = {
  render: () => (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Web3 UI Patterns</h1>
          <p className="text-muted-foreground">
            DeFi-specific components and patterns for blockchain applications
          </p>
        </div>

        <div className="grid gap-8">
          {/* Wallet Connection */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Connection
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Connect Wallet</CardTitle>
                  <CardDescription>Initial connection state</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" size="lg">
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Connect your wallet to start using Valkyrie Finance
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Connected State</CardTitle>
                  <CardDescription>Wallet successfully connected</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8" />
                      <div>
                        <p className="font-medium">0x1234...5678</p>
                        <p className="text-sm text-muted-foreground">MetaMask</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Connected
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Copy className="mr-1 h-3 w-3" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Explorer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Network Status</CardTitle>
                  <CardDescription>Chain information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span className="font-medium">Ethereum</span>
                    </div>
                    <Badge variant="outline">Mainnet</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Balance:</span>
                      <span className="font-medium">1.234 ETH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Gas Price:</span>
                      <span className="font-medium">25 gwei</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Token Swap Interface */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5" />
              Token Swap Interface
            </h2>
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Swap Tokens</CardTitle>
                  <CardDescription>Exchange tokens with best rates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>From</Label>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 min-w-[100px]">
                        <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">ETH</span>
                      </div>
                      <Input placeholder="0.0" className="text-right" />
                    </div>
                    <p className="text-xs text-muted-foreground">Balance: 1.234 ETH</p>
                  </div>

                  <div className="flex justify-center">
                    <Button variant="outline" size="icon">
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>To</Label>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 min-w-[100px]">
                        <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                        <span className="font-medium">USDC</span>
                      </div>
                      <Input placeholder="0.0" className="text-right" disabled />
                    </div>
                    <p className="text-xs text-muted-foreground">Balance: 0 USDC</p>
                  </div>

                  <div className="bg-muted rounded-lg p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rate:</span>
                      <span>1 ETH = 2,450 USDC</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Slippage:</span>
                      <span>0.5%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Gas Fee:</span>
                      <span>~$12.50</span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    Swap Tokens
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* DeFi Vault Cards */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Vault & Yield Farming
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">ETH Vault</CardTitle>
                      <CardDescription>Automated yield strategies</CardDescription>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      +12.5% APY
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">TVL:</span>
                      <span className="font-medium">$2.4M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Your Deposit:</span>
                      <span className="font-medium">1.5 ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Earned:</span>
                      <span className="font-medium text-green-600">+0.023 ETH</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Deposit
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Withdraw
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">USDC Vault</CardTitle>
                      <CardDescription>Stable yield generation</CardDescription>
                    </div>
                    <Badge variant="secondary">
                      <Lock className="mr-1 h-3 w-3" />
                      8.2% APY
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">TVL:</span>
                      <span className="font-medium">$5.7M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Your Deposit:</span>
                      <span className="font-medium">1,000 USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Earned:</span>
                      <span className="font-medium text-green-600">+12.34 USDC</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Deposit
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Withdraw
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">AI Strategy</CardTitle>
                      <CardDescription>Machine learning optimized</CardDescription>
                    </div>
                    <Badge variant="outline" className="border-purple-200 text-purple-700">
                      <Zap className="mr-1 h-3 w-3" />
                      AI Powered
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expected APY:</span>
                      <span className="font-medium">15.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Risk Level:</span>
                      <Badge variant="outline" className="h-5">
                        Medium
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Strategy:</span>
                      <span className="text-sm">Dynamic Rebalancing</span>
                    </div>
                  </div>
                  <Button className="w-full">Join Strategy</Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Transaction Status */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Transaction Status</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Pending
                  </CardTitle>
                  <CardDescription>Transaction submitted</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={33} />
                    <p className="text-sm text-muted-foreground">Waiting for confirmation...</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      View on Explorer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Confirmed
                  </CardTitle>
                  <CardDescription>Transaction successful</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={100} />
                    <p className="text-sm text-green-600">
                      Transaction confirmed in block 18,234,567
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      View on Explorer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    Failed
                  </CardTitle>
                  <CardDescription>Transaction reverted</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={0} className="bg-red-100" />
                    <p className="text-sm text-red-600">Insufficient gas for transaction</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Retry
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <ExternalLink className="mr-1 h-3 w-3" />
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Portfolio Summary */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Portfolio Overview</h2>
            <Card>
              <CardHeader>
                <CardTitle>Your Portfolio</CardTitle>
                <CardDescription>Total value and asset breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold">$12,345.67</p>
                      <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                      <Badge variant="default" className="mt-2 bg-green-100 text-green-800">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        +12.5% (24h)
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">ETH</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">$8,234.56</p>
                        <p className="text-xs text-muted-foreground">66.7%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">USDC</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">$3,111.11</p>
                        <p className="text-xs text-muted-foreground">25.2%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">Other</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">$1,000.00</p>
                        <p className="text-xs text-muted-foreground">8.1%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of Web3 and DeFi UI patterns including wallet connection, token swaps, vault management, and portfolio tracking.',
      },
    },
  },
};
