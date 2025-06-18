import { ArrowLeftRight } from 'lucide-react';
import { CrossChainSwapForm } from '@/components/swap/cross-chain-swap-form';
import { ClientWalletGuard } from '@/components/wallet/client-wallet-guard';

export default function SwapPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 flex justify-center">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-4 bg-background p-4 rounded-full shadow-md mb-4">
            <ArrowLeftRight className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Cross-Chain Swap</h1>
          <p className="text-muted-foreground">Bridge your assets into the Valkyrie ecosystem.</p>
        </header>

        <main>
          <ClientWalletGuard>
            <CrossChainSwapForm />
          </ClientWalletGuard>
        </main>
      </div>
    </div>
  );
}
