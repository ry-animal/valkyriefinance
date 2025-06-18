"use client"

import { VaultDashboard } from "@/components/vault/vault-dashboard"
import { ClientWalletGuard } from "@/components/wallet/client-wallet-guard"
import { LayoutDashboard } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <LayoutDashboard className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Your command center for portfolio overview and quick actions.
            </p>
          </div>
        </div>
      </header>

      <main>
        <ClientWalletGuard>
          <VaultDashboard />
          {/* We can add more dashboard components here in the future */}
        </ClientWalletGuard>
      </main>
    </div>
  )
}
