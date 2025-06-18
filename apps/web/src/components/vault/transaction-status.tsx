'use client';

import { AlertTriangle, ArrowUpRight, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useChainId, useWaitForTransactionReceipt } from 'wagmi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { bt } from '@/lib/theme-utils';
import { cn } from '@/lib/utils';
import { useWeb3Store } from '@/stores/web3-store';

interface TransactionStatusProps {
  hash?: `0x${string}`;
  onComplete?: () => void;
}

export function TransactionStatus({ hash, onComplete }: TransactionStatusProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const chainId = useChainId();
  const { pendingTransactions, recentTransactions } = useWeb3Store();

  const {
    data: receipt,
    isLoading,
    isSuccess,
    isError,
  } = useWaitForTransactionReceipt({
    hash,
    query: { enabled: !!hash },
  });

  // Find transaction in store
  const allTransactions = [...pendingTransactions, ...recentTransactions];
  const transaction = hash ? allTransactions.find((tx: any) => tx.hash === hash) : null;

  useEffect(() => {
    if (!hash) return;

    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [hash]);

  useEffect(() => {
    if (isSuccess && onComplete) {
      onComplete();
    }
  }, [isSuccess, onComplete]);

  if (!hash || !transaction) {
    return null;
  }

  const getBlockExplorerUrl = (hash: string) => {
    const explorers = {
      1: 'https://etherscan.io/tx/',
      11155111: 'https://sepolia.etherscan.io/tx/',
      84532: 'https://sepolia.basescan.org/tx/',
      42161: 'https://arbiscan.io/tx/',
      10: 'https://optimistic.etherscan.io/tx/',
    };
    return `${explorers[chainId as keyof typeof explorers] || explorers[1]}${hash}`;
  };

  const getStatusColor = () => {
    if (isError) return 'text-red-500';
    if (isSuccess) return 'text-green-500';
    return 'text-yellow-500';
  };

  const getStatusIcon = () => {
    if (isError) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (isSuccess) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
  };

  const getStatusText = () => {
    if (isError) return 'Failed';
    if (isSuccess) return 'Confirmed';
    return 'Pending';
  };

  return (
    <Card className={cn('border-4', bt.border, bt.section)}>
      <CardHeader>
        <CardTitle className={cn('text-lg font-black flex items-center gap-2', bt.heading)}>
          {getStatusIcon()}
          Transaction {getStatusText()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className={bt.muted}>Type:</span>
            <Badge variant="outline" className={cn('uppercase', bt.section)}>
              {transaction.type}
            </Badge>
          </div>

          <div className="flex justify-between text-sm">
            <span className={bt.muted}>Amount:</span>
            <span className={cn('font-mono', bt.heading)}>
              {transaction.amount} {transaction.token || 'ETH'}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className={bt.muted}>Status:</span>
            <span className={cn('font-medium', getStatusColor())}>{getStatusText()}</span>
          </div>

          {isLoading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={bt.muted}>Time elapsed:</span>
                <span className={cn('font-mono', bt.heading)}>{timeElapsed}s</span>
              </div>
              <Progress value={(timeElapsed / 60) * 100} className="h-2" />
              <p className={cn('text-xs', bt.muted)}>Average confirmation time: 30-60 seconds</p>
            </div>
          )}

          {isSuccess && receipt && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={bt.muted}>Block:</span>
                <span className={cn('font-mono', bt.heading)}>
                  {receipt.blockNumber.toString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={bt.muted}>Gas used:</span>
                <span className={cn('font-mono', bt.heading)}>{receipt.gasUsed.toString()}</span>
              </div>
            </div>
          )}

          {isError && (
            <div className={cn('p-3 border-2 border-red-500', bt.sectionAlt)}>
              <p className="text-sm text-red-600">
                Transaction failed. Please try again or contact support if the issue persists.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className={cn('flex-1 border-2', bt.border)} asChild>
            <a
              href={getBlockExplorerUrl(hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-3 w-3" />
              View on Explorer
            </a>
          </Button>

          {isSuccess && (
            <Button size="sm" className={cn('flex-1 border-2', bt.border)} onClick={onComplete}>
              <ArrowUpRight className="h-3 w-3 mr-1" />
              Continue
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
