"use client"

import { VaultDashboard } from "@/components/vault/vault-dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BrutalGrid, BrutalSection, BrutalHeadline, BrutalBox, BrutalText } from "@/components/brutalist/layout"
import { WalletGuard } from "@/components/wallet/wallet-guard"

export default function DashboardPage() {
  return (
    <WalletGuard requireConnection={true}>
      <div className="min-h-screen bg-white dark:bg-black">
        {/* Dashboard Header */}
        <BrutalSection className="py-12 border-b-4 border-black dark:border-white">
          <BrutalHeadline size="huge" className="mb-8 text-center text-black dark:text-white">
            VALKYRIE DASHBOARD
          </BrutalHeadline>
          <BrutalText variant="mono" size="lg" className="text-center max-w-4xl mx-auto text-black dark:text-white">
            MONITOR YOUR POSITIONS. TRACK YOUR YIELDS. OPTIMIZE YOUR STRATEGY.
          </BrutalText>
        </BrutalSection>

        {/* Main Dashboard Content */}
        <BrutalSection className="py-8">
          <VaultDashboard />
        </BrutalSection>

        {/* Portfolio Stats */}
        <BrutalSection className="py-16 bg-gray-50 dark:bg-gray-900 border-t-4 border-black dark:border-white">
          <BrutalHeadline size="massive" className="mb-12 text-center text-black dark:text-white">
            PORTFOLIO OVERVIEW
          </BrutalHeadline>
          
          <BrutalGrid cols={3} className="gap-8">
            <BrutalBox className="text-center bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-8" border>
              <BrutalHeadline size="huge" className="text-black dark:text-white mb-4">
                $0.00
              </BrutalHeadline>
              <BrutalText variant="brutal" className="text-black dark:text-white">
                TOTAL VALUE
              </BrutalText>
            </BrutalBox>
            
            <BrutalBox className="text-center bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-8" border>
              <BrutalHeadline size="huge" className="text-green-500 mb-4">
                +0.00%
              </BrutalHeadline>
              <BrutalText variant="brutal" className="text-black dark:text-white">
                24H P&L
              </BrutalText>
            </BrutalBox>
            
            <BrutalBox className="text-center bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-8" border>
              <BrutalHeadline size="huge" className="text-black dark:text-white mb-4">
                0.00%
              </BrutalHeadline>
              <BrutalText variant="brutal" className="text-black dark:text-white">
                AVG APY
              </BrutalText>
            </BrutalBox>
          </BrutalGrid>
        </BrutalSection>

        {/* Quick Actions */}
        <BrutalSection fullWidth className="bg-white dark:bg-black text-black dark:text-white border-black dark:border-white">
          <div className="max-w-4xl mx-auto text-center">
            <BrutalHeadline size="huge" className="mb-8 text-black dark:text-white">
              QUICK ACTIONS
            </BrutalHeadline>
            
            <BrutalGrid cols={2} className="gap-8">
              <BrutalBox className="bg-white dark:bg-black border-black dark:border-white text-black dark:text-white" border>
                <BrutalHeadline size="lg" className="text-black dark:text-white mb-6">
                  DEPOSIT FUNDS
                </BrutalHeadline>
                <BrutalText variant="mono" className="text-black dark:text-white mb-6">
                  ADD FUNDS TO START EARNING YIELD
                </BrutalText>
                <Button variant="outline" className="border-black dark:border-white text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black">
                  DEPOSIT NOW
                </Button>
              </BrutalBox>
              
              <BrutalBox className="bg-white dark:bg-black border-black dark:border-white text-black dark:text-white" border>
                <BrutalHeadline size="lg" className="text-black dark:text-white mb-6">
                  WITHDRAW FUNDS
                </BrutalHeadline>
                <BrutalText variant="mono" className="text-black dark:text-white mb-6">
                  WITHDRAW YOUR EARNINGS ANYTIME
                </BrutalText>
                <Button variant="outline" className="border-black dark:border-white text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black">
                  WITHDRAW
                </Button>
              </BrutalBox>
            </BrutalGrid>
          </div>
        </BrutalSection>
      </div>
    </WalletGuard>
  );
}
