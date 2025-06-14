"use client";
import { VaultDashboard } from "@/components/vault/vault-dashboard";
import { WalletConnect } from "@/components/wallet/wallet-connect";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BrutalGrid, BrutalSection, BrutalHeadline, BrutalBox, BrutalText } from "@/components/brutalist/layout";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <BrutalSection fullWidth className="min-h-screen flex items-center justify-center border-b-4 border-black">
        <div className="text-center max-w-6xl mx-auto">
          <BrutalHeadline size="mega" className="mb-8">
            DEFI
            <br />
            BRUTALISM
          </BrutalHeadline>
          <BrutalText variant="mono" size="xl" className="mb-12 max-w-4xl mx-auto">
            THE MOST AGGRESSIVE YIELD OPTIMIZATION PLATFORM. 
            AI-POWERED. CROSS-CHAIN COMPATIBLE. ZERO COMPROMISE.
          </BrutalText>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="xl" className="shadow-brutal-xl text-2xl px-16 py-8">
              LAUNCH APP
            </Button>
            <Button variant="outline" size="xl" className="text-2xl px-16 py-8">
              READ DOCS
            </Button>
          </div>
        </div>
      </BrutalSection>

      {/* Stats Section */}
      <BrutalSection fullWidth className="bg-black text-white border-white">
        <BrutalGrid cols={12} className="bg-black border-white">
          <BrutalBox className="col-span-12 md:col-span-3 bg-black border-white text-white text-center" border>
            <BrutalHeadline size="massive" className="text-white mb-4">
              $127M
            </BrutalHeadline>
            <BrutalText variant="brutal" className="text-white">
              TOTAL VALUE LOCKED
            </BrutalText>
          </BrutalBox>
          
          <BrutalBox className="col-span-12 md:col-span-3 bg-black border-white text-white text-center" border>
            <BrutalHeadline size="massive" className="text-white mb-4">
              24.7%
            </BrutalHeadline>
            <BrutalText variant="brutal" className="text-white">
              AVERAGE APY
            </BrutalText>
          </BrutalBox>
          
          <BrutalBox className="col-span-12 md:col-span-3 bg-black border-white text-white text-center" border>
            <BrutalHeadline size="massive" className="text-white mb-4">
              7
            </BrutalHeadline>
            <BrutalText variant="brutal" className="text-white">
              SUPPORTED CHAINS
            </BrutalText>
          </BrutalBox>
          
          <BrutalBox className="col-span-12 md:col-span-3 bg-black border-white text-white text-center" border>
            <BrutalHeadline size="massive" className="text-white mb-4">
              99.9%
            </BrutalHeadline>
            <BrutalText variant="brutal" className="text-white">
              UPTIME
            </BrutalText>
          </BrutalBox>
        </BrutalGrid>
      </BrutalSection>

      {/* Features Section */}
      <BrutalSection className="py-20">
        <BrutalHeadline size="giant" className="mb-16 text-center">
          FEATURES
        </BrutalHeadline>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>AI OPTIMIZATION</CardTitle>
              <CardDescription>MACHINE LEARNING ALGORITHMS</CardDescription>
            </CardHeader>
            <CardContent>
              <BrutalText variant="mono" className="mb-6">
                ADVANCED AI MODELS CONTINUOUSLY ANALYZE MARKET CONDITIONS 
                AND OPTIMIZE YIELD STRATEGIES IN REAL-TIME.
              </BrutalText>
              <Button className="w-full">LEARN MORE</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CROSS-CHAIN SWAPS</CardTitle>
              <CardDescription>SEAMLESS BRIDGING</CardDescription>
            </CardHeader>
            <CardContent>
              <BrutalText variant="mono" className="mb-6">
                SWAP FROM ANY SUPPORTED CHAIN DIRECTLY INTO OUR 
                YIELD-BEARING VAULT WITH ONE TRANSACTION.
              </BrutalText>
              <Button className="w-full">LEARN MORE</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>UNISWAP V4 HOOKS</CardTitle>
              <CardDescription>CUSTOM LIQUIDITY MANAGEMENT</CardDescription>
            </CardHeader>
            <CardContent>
              <BrutalText variant="mono" className="mb-6">
                PROPRIETARY HOOKS OPTIMIZE LIQUIDITY POSITIONS AND 
                MINIMIZE IMPERMANENT LOSS AUTOMATICALLY.
              </BrutalText>
              <Button className="w-full">LEARN MORE</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ERC-4626 VAULT</CardTitle>
              <CardDescription>STANDARDIZED INTERFACE</CardDescription>
            </CardHeader>
            <CardContent>
              <BrutalText variant="mono" className="mb-6">
                FULLY COMPLIANT ERC-4626 TOKENIZED VAULT WITH 
                MAXIMUM COMPOSABILITY AND INTEROPERABILITY.
              </BrutalText>
              <Button className="w-full">LEARN MORE</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>RISK MANAGEMENT</CardTitle>
              <CardDescription>AUTOMATED PROTECTION</CardDescription>
            </CardHeader>
            <CardContent>
              <BrutalText variant="mono" className="mb-6">
                AI-POWERED RISK ASSESSMENT AND AUTOMATED CIRCUIT 
                BREAKERS PROTECT YOUR FUNDS 24/7.
              </BrutalText>
              <Button className="w-full">LEARN MORE</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>GOVERNANCE TOKEN</CardTitle>
              <CardDescription>DECENTRALIZED CONTROL</CardDescription>
            </CardHeader>
            <CardContent>
              <BrutalText variant="mono" className="mb-6">
                PARTICIPATE IN PROTOCOL GOVERNANCE AND EARN 
                REWARDS WITH THE VALKYRIE TOKEN.
              </BrutalText>
              <Button className="w-full">LEARN MORE</Button>
            </CardContent>
          </Card>
        </div>
      </BrutalSection>

      {/* Technology Stack */}
      <BrutalSection fullWidth className="bg-white border-black">
        <div className="max-w-7xl mx-auto">
          <BrutalHeadline size="giant" className="mb-16 text-center">
            TECHNOLOGY
          </BrutalHeadline>
          
          <BrutalGrid cols={4} className="gap-8">
            <BrutalBox className="text-center">
              <BrutalText variant="brutal" size="lg" className="mb-4">
                SOLIDITY
              </BrutalText>
              <BrutalText variant="mono">
                SMART CONTRACTS
              </BrutalText>
            </BrutalBox>
            
            <BrutalBox className="text-center">
              <BrutalText variant="brutal" size="lg" className="mb-4">
                FOUNDRY
              </BrutalText>
              <BrutalText variant="mono">
                TESTING FRAMEWORK
              </BrutalText>
            </BrutalBox>
            
            <BrutalBox className="text-center">
              <BrutalText variant="brutal" size="lg" className="mb-4">
                CHAINLINK
              </BrutalText>
              <BrutalText variant="mono">
                ORACLE NETWORK
              </BrutalText>
            </BrutalBox>
            
            <BrutalBox className="text-center">
              <BrutalText variant="brutal" size="lg" className="mb-4">
                UNISWAP V4
              </BrutalText>
              <BrutalText variant="mono">
                DEX PROTOCOL
              </BrutalText>
            </BrutalBox>
          </BrutalGrid>
        </div>
      </BrutalSection>

      {/* Call to Action */}
      <BrutalSection fullWidth className="bg-black text-white border-white py-20">
        <div className="text-center max-w-4xl mx-auto">
          <BrutalHeadline size="giant" className="text-white mb-8">
            READY TO
            <br />
            MAXIMIZE YIELD?
          </BrutalHeadline>
          <BrutalText variant="mono" size="xl" className="text-white mb-12">
            JOIN THE MOST AGGRESSIVE DEFI PLATFORM. NO BULLSHIT. NO COMPROMISE.
          </BrutalText>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/dashboard">
            <Button variant="ghost" size="xl" className="text-white hover:bg-white hover:text-black hover:cursor-pointer text-2xl px-16 py-8">
                GET STARTED
              </Button>
            </Link>
            <Button variant="ghost" size="xl" className="text-white hover:bg-white hover:text-black hover:cursor-pointer text-2xl px-16 py-8">
              VIEW GITHUB
            </Button>
          </div>
        </div>
      </BrutalSection>
    </div>
  );
}
