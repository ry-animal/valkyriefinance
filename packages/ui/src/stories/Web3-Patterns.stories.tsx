import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../components/alert';
import { Avatar, AvatarFallback, AvatarImage } from '../components/avatar';
import { Badge } from '../components/badge';
import { Button } from '../components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/card';
import { Input } from '../components/input';
import { Label } from '../components/label';
import { Progress } from '../components/progress';

const meta: Meta = {
  title: 'Patterns/Web3 Finance',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Web3 Finance UI Patterns

Advanced patterns specifically designed for DeFi applications, including:
- Wallet connection flows
- Transaction confirmations
- Yield farming interfaces
- Liquidity provision
- Cross-chain bridging
        `,
      },
    },
  },
};

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
