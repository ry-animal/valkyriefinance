"use client"

import { useAccount } from 'wagmi'
import { ConnectButton } from './connect-button'
import { ShieldAlert } from 'lucide-react'

interface ClientWalletGuardProps {
    children: React.ReactNode
}

export function ClientWalletGuard({ children }: ClientWalletGuardProps) {
    const { isConnected } = useAccount()

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center mt-10">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-4">
                    <ShieldAlert className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Connect Your Wallet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2 mb-6">
                    Please connect your wallet to view this page and interact with your assets.
                </p>
                <ConnectButton />
            </div>
        )
    }

    return <>{children}</>
} 