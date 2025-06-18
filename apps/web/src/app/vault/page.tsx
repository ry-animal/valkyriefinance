"use client"

import { VaultDashboard } from '@/components/vault/vault-dashboard'
import { ClientWalletGuard } from '@/components/wallet/client-wallet-guard'
import { Vault, TrendingUp } from 'lucide-react'

export default function VaultPage() {
    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <header className="mb-8">
                <div className="flex items-center gap-4">
                    <Vault className="h-10 w-10 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Valkyrie Vault</h1>
                        <p className="text-muted-foreground">
                            Your central hub for asset management and yield optimization.
                        </p>
                    </div>
                </div>
            </header>

            <main>
                <ClientWalletGuard>
                    <VaultDashboard />
                </ClientWalletGuard>
            </main>
        </div>
    )
} 