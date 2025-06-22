import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Badge } from './badge';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Input } from './input';
import { Label } from './label';
import { Separator } from './separator';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A modal dialog that interrupts the user with important content and expects a response.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" defaultValue="@peduarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const ConfirmationDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WalletConnectionDialog: Story = {
  render: () => {
    const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

    const wallets = [
      { id: 'metamask', name: 'MetaMask', description: 'Connect using browser wallet' },
      { id: 'walletconnect', name: 'WalletConnect', description: 'Connect using mobile wallet' },
      { id: 'coinbase', name: 'Coinbase Wallet', description: 'Connect using Coinbase' },
    ];

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Connect Wallet</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect Your Wallet</DialogTitle>
            <DialogDescription>
              Choose a wallet to connect to the Valkyrie Finance platform.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {wallets.map((wallet) => (
              <button
                key={wallet.id}
                type="button"
                className={`flex items-center space-x-4 rounded-lg border p-4 cursor-pointer transition-colors text-left w-full ${
                  selectedWallet === wallet.id ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedWallet(wallet.id)}
              >
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="font-medium">{wallet.name}</div>
                  <div className="text-sm text-muted-foreground">{wallet.description}</div>
                </div>
                {selectedWallet === wallet.id && <Badge variant="default">Selected</Badge>}
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button disabled={!selectedWallet}>Connect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

export const VaultDetailsDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Vault Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>AI-Optimized ETH Vault</DialogTitle>
          <DialogDescription>
            Automated yield farming with AI-driven strategy optimization
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Vault Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Total Value Locked</Label>
              <div className="text-2xl font-bold">$2.4M</div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Current APY</Label>
              <div className="text-2xl font-bold text-green-600">12.5%</div>
            </div>
          </div>

          <Separator />

          {/* Strategy Info */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Current Strategy</Label>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Uniswap V4 LP (ETH/USDC)</span>
                <Badge variant="secondary">65%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Aave Lending</span>
                <Badge variant="secondary">25%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Cash Reserve</span>
                <Badge variant="secondary">10%</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Performance */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Performance (30d)</Label>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-green-600">+8.2%</div>
                <div className="text-xs text-muted-foreground">Total Return</div>
              </div>
              <div>
                <div className="text-lg font-semibold">156</div>
                <div className="text-xs text-muted-foreground">AI Rebalances</div>
              </div>
              <div>
                <div className="text-lg font-semibold">0.02%</div>
                <div className="text-xs text-muted-foreground">Max Drawdown</div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Close</Button>
          <Button>Deposit to Vault</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
