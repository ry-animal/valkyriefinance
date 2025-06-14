"use client"
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BrutalGrid, BrutalSection, BrutalHeadline, BrutalBox, BrutalText } from "@/components/brutalist/layout"

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession();

  // TODO: Re-enable tRPC integration after fixing type issues
  // const privateData = useQuery({
  //   queryKey: ['privateData'],
  //   queryFn: () => trpc.privateData.query(),
  // });

  useEffect(() => {
    if (!session && !isPending) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <BrutalSection fullWidth className="border-b-4 border-black">
        <div className="max-w-7xl mx-auto">
          <BrutalHeadline size="mega" className="mb-8">
            VALKYRIE
            <br />
            FINANCE
          </BrutalHeadline>
          <BrutalText variant="mono" size="xl" className="mb-8 max-w-3xl">
            DEFI BRUTALISM. NO COMPROMISES. MAXIMUM YIELD. ZERO BULLSHIT.
          </BrutalText>
          <div className="flex gap-4">
            <Button size="xl" className="shadow-brutal-lg">
              DEPOSIT NOW
            </Button>
            <Button variant="outline" size="xl">
              VIEW VAULT
            </Button>
          </div>
        </div>
      </BrutalSection>

      {/* Portfolio Overview */}
      <BrutalSection className="py-16">
        <BrutalHeadline size="huge" className="mb-12">
          PORTFOLIO
        </BrutalHeadline>
        
        <BrutalGrid cols={12} className="mb-12">
          {/* Total Value */}
          <BrutalBox className="col-span-4">
            <BrutalText variant="brutal" size="sm">TOTAL VALUE</BrutalText>
            <BrutalHeadline size="massive" className="text-6xl mb-2">
              $127,432
            </BrutalHeadline>
            <BrutalText variant="mono" className="text-green-600">
              +12.5% TODAY
            </BrutalText>
          </BrutalBox>

          {/* Active Strategies */}
          <BrutalBox className="col-span-4">
            <BrutalText variant="brutal" size="sm">ACTIVE STRATEGIES</BrutalText>
            <BrutalHeadline size="massive" className="text-6xl mb-2">
              7
            </BrutalHeadline>
            <BrutalText variant="mono">
              YIELD FARMING ACTIVE
            </BrutalText>
          </BrutalBox>

          {/* APY */}
          <BrutalBox className="col-span-4">
            <BrutalText variant="brutal" size="sm">CURRENT APY</BrutalText>
            <BrutalHeadline size="massive" className="text-6xl mb-2">
              24.7%
            </BrutalHeadline>
            <BrutalText variant="mono">
              ANNUALIZED RETURN
            </BrutalText>
          </BrutalBox>
        </BrutalGrid>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>DEPOSIT FUNDS</CardTitle>
              <CardDescription>ADD LIQUIDITY TO VAULT</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full mb-4" size="lg">
                DEPOSIT ETH
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                CROSS-CHAIN SWAP
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>WITHDRAW FUNDS</CardTitle>
              <CardDescription>CLAIM YOUR EARNINGS</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full mb-4" size="lg">
                WITHDRAW ALL
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                PARTIAL WITHDRAW
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>STRATEGY SETTINGS</CardTitle>
              <CardDescription>MANAGE AI AUTOMATION</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full mb-4" size="lg">
                AI SETTINGS
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                MANUAL MODE
              </Button>
            </CardContent>
          </Card>
        </div>
      </BrutalSection>

      {/* AI Insights */}
      <BrutalSection className="bg-black text-white border-white">
        <BrutalHeadline size="huge" className="mb-12 text-white">
          AI INSIGHTS
        </BrutalHeadline>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BrutalBox className="bg-black border-white text-white" border>
            <BrutalText variant="brutal" size="sm" className="text-white mb-4">
              STRATEGY RECOMMENDATION
            </BrutalText>
            <BrutalText variant="mono" className="text-white mb-6">
              INCREASE UNISWAP V4 ALLOCATION BY 15% FOR OPTIMAL YIELD CAPTURE. 
              CURRENT MARKET CONDITIONS FAVOR CONCENTRATED LIQUIDITY POSITIONS.
            </BrutalText>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              EXECUTE STRATEGY
            </Button>
          </BrutalBox>

          <BrutalBox className="bg-black border-white text-white" border>
            <BrutalText variant="brutal" size="sm" className="text-white mb-4">
              RISK ASSESSMENT
            </BrutalText>
            <BrutalText variant="mono" className="text-white mb-6">
              LOW RISK DETECTED. IMPERMANENT LOSS PROBABILITY: 2.3%. 
              LIQUIDATION THRESHOLD: SAFE. PROCEED WITH CONFIDENCE.
            </BrutalText>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              VIEW DETAILS
            </Button>
          </BrutalBox>
        </div>
      </BrutalSection>

      {/* Market Data */}
      <BrutalSection className="py-16">
        <BrutalHeadline size="huge" className="mb-12">
          MARKET DATA
        </BrutalHeadline>
        
        <BrutalGrid cols={6} className="gap-4">
          <BrutalBox className="col-span-2">
            <BrutalText variant="brutal" size="sm">ETH/USD</BrutalText>
            <BrutalHeadline size="huge" className="text-4xl">
              $2,847
            </BrutalHeadline>
          </BrutalBox>
          
          <BrutalBox className="col-span-2">
            <BrutalText variant="brutal" size="sm">TVL</BrutalText>
            <BrutalHeadline size="huge" className="text-4xl">
              $12.4M
            </BrutalHeadline>
          </BrutalBox>
          
          <BrutalBox className="col-span-2">
            <BrutalText variant="brutal" size="sm">VOLUME 24H</BrutalText>
            <BrutalHeadline size="huge" className="text-4xl">
              $847K
            </BrutalHeadline>
          </BrutalBox>
        </BrutalGrid>
      </BrutalSection>
    </div>
  );
}
