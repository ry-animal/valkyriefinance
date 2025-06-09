"use client";
import { VaultDashboard } from "@/components/vault/vault-dashboard";
import { WalletConnect } from "@/components/wallet/wallet-connect";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/footer";

export default function Home() {

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-r from-background to-muted/20">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Valkryie Finance
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Next-generation DeFi platform with AI-powered yield optimization.
              Deposit assets into our intelligent vaults for automated cross-chain yield farming.
            </p>
            <div className="pt-4">
              <WalletConnect />
            </div>
          </div>
        </div>
      </section>

      {/* Main Vault Interface */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Intelligent Yield Vaults</h2>
            <p className="text-muted-foreground">
              AI-driven strategies automatically optimize your yield across DeFi protocols
            </p>
          </div>

          <VaultDashboard />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🤖 AI-Powered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced machine learning algorithms continuously optimize yield strategies
                  across multiple DeFi protocols and chains.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🌉 Cross-Chain
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Seamlessly bridge assets from any supported chain directly into
                  high-yield vaults with a single transaction.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📈 Optimized Yield
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Automated rebalancing and strategy execution ensures you're always
                  earning the highest risk-adjusted returns.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
