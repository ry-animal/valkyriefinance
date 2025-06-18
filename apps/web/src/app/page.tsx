import Link from 'next/link';
import {
  BrutalBox,
  BrutalGrid,
  BrutalHeadline,
  BrutalSection,
  BrutalText,
} from '@/components/brutalist/layout';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// This is now a Server Component (default in App Router)
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <BrutalSection
        fullWidth
        className="min-h-screen flex items-center justify-center border-b-4 border-black dark:border-white"
      >
        <div className="text-center max-w-6xl mx-auto">
          <BrutalHeadline size="mega" className="mb-8 text-black dark:text-white">
            DEFI
            <br />
            BRUTALISM
          </BrutalHeadline>
          <BrutalText
            variant="mono"
            size="xl"
            className="mb-12 max-w-4xl mx-auto text-black dark:text-white"
          >
            THE MOST AGGRESSIVE YIELD OPTIMIZATION PLATFORM. AI-POWERED. CROSS-CHAIN COMPATIBLE.
            ZERO COMPROMISE.
          </BrutalText>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/dashboard">
              <Button
                size="xl"
                className="shadow-brutal-xl text-2xl px-16 py-8 bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                LAUNCH APP
              </Button>
            </Link>
            <Button
              size="xl"
              className="shadow-brutal-xl text-2xl px-16 py-8 bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              READ DOCS
            </Button>
          </div>
        </div>
      </BrutalSection>

      {/* Stats Section */}
      <BrutalSection
        fullWidth
        className="bg-white dark:bg-black text-black dark:text-white border-black dark:border-white"
      >
        <BrutalGrid cols={12} className="bg-white dark:bg-black border-black dark:border-white">
          <BrutalBox
            className="col-span-12 md:col-span-3 bg-white dark:bg-black border-black dark:border-white text-black dark:text-white text-center"
            border
          >
            <BrutalHeadline size="massive" className="text-black dark:text-white mb-4">
              $127M
            </BrutalHeadline>
            <BrutalText variant="brutal" className="text-black dark:text-white">
              TOTAL VALUE LOCKED
            </BrutalText>
          </BrutalBox>

          <BrutalBox
            className="col-span-12 md:col-span-3 bg-white dark:bg-black border-black dark:border-white text-black dark:text-white text-center"
            border
          >
            <BrutalHeadline size="massive" className="text-black dark:text-white mb-4">
              24.7%
            </BrutalHeadline>
            <BrutalText variant="brutal" className="text-black dark:text-white">
              AVERAGE APY
            </BrutalText>
          </BrutalBox>

          <BrutalBox
            className="col-span-12 md:col-span-3 bg-white dark:bg-black border-black dark:border-white text-black dark:text-white text-center"
            border
          >
            <BrutalHeadline size="massive" className="text-black dark:text-white mb-4">
              7
            </BrutalHeadline>
            <BrutalText variant="brutal" className="text-black dark:text-white">
              SUPPORTED CHAINS
            </BrutalText>
          </BrutalBox>

          <BrutalBox
            className="col-span-12 md:col-span-3 bg-white dark:bg-black border-black dark:border-white text-black dark:text-white text-center"
            border
          >
            <BrutalHeadline size="massive" className="text-black dark:text-white mb-4">
              99.9%
            </BrutalHeadline>
            <BrutalText variant="brutal" className="text-black dark:text-white">
              UPTIME
            </BrutalText>
          </BrutalBox>
        </BrutalGrid>
      </BrutalSection>

      {/* Features Section */}
      <BrutalSection className="py-20 bg-white dark:bg-black">
        <BrutalHeadline size="giant" className="mb-16 text-center text-black dark:text-white">
          FEATURES
        </BrutalHeadline>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-white dark:bg-gray-900 border-black dark:border-white">
            <CardHeader>
              <CardTitle className="text-black dark:text-white">AI OPTIMIZATION</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                MACHINE LEARNING ALGORITHMS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BrutalText variant="mono" className="text-black dark:text-white">
                ADVANCED AI MODELS CONTINUOUSLY ANALYZE MARKET CONDITIONS AND OPTIMIZE YIELD
                STRATEGIES IN REAL-TIME.
              </BrutalText>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-black dark:border-white">
            <CardHeader>
              <CardTitle className="text-black dark:text-white">CROSS-CHAIN SWAPS</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                SEAMLESS BRIDGING
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BrutalText variant="mono" className="text-black dark:text-white">
                SWAP FROM ANY SUPPORTED CHAIN DIRECTLY INTO OUR YIELD-BEARING VAULT WITH ONE
                TRANSACTION.
              </BrutalText>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-black dark:border-white">
            <CardHeader>
              <CardTitle className="text-black dark:text-white">UNISWAP V4 HOOKS</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                CUSTOM LIQUIDITY MANAGEMENT
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BrutalText variant="mono" className="text-black dark:text-white">
                PROPRIETARY HOOKS OPTIMIZE LIQUIDITY POSITIONS AND MINIMIZE IMPERMANENT LOSS
                AUTOMATICALLY.
              </BrutalText>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-black dark:border-white">
            <CardHeader>
              <CardTitle className="text-black dark:text-white">ERC-4626 VAULT</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                STANDARDIZED INTERFACE
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BrutalText variant="mono" className="text-black dark:text-white">
                FULLY COMPLIANT ERC-4626 TOKENIZED VAULT WITH MAXIMUM COMPOSABILITY AND
                INTEROPERABILITY.
              </BrutalText>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-black dark:border-white">
            <CardHeader>
              <CardTitle className="text-black dark:text-white">RISK MANAGEMENT</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                AUTOMATED PROTECTION
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BrutalText variant="mono" className="text-black dark:text-white">
                AI-POWERED RISK ASSESSMENT AND AUTOMATED CIRCUIT BREAKERS PROTECT YOUR FUNDS 24/7.
              </BrutalText>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-black dark:border-white">
            <CardHeader>
              <CardTitle className="text-black dark:text-white">GOVERNANCE TOKEN</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                DECENTRALIZED CONTROL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BrutalText variant="mono" className="text-black dark:text-white">
                PARTICIPATE IN PROTOCOL GOVERNANCE AND EARN REWARDS WITH THE VALKYRIE TOKEN.
              </BrutalText>
            </CardContent>
          </Card>
        </div>
      </BrutalSection>

      {/* Technology Stack */}
      <BrutalSection fullWidth className="bg-white dark:bg-black border-black dark:border-white">
        <div className="max-w-7xl mx-auto">
          <BrutalHeadline size="giant" className="mb-16 text-center text-black dark:text-white">
            TECHNOLOGY
          </BrutalHeadline>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
            <BrutalBox
              className="text-center bg-white dark:bg-black border-black dark:border-white"
              border
            >
              <BrutalText variant="brutal" size="lg" className="mb-4 text-black dark:text-white">
                SOLIDITY
              </BrutalText>
              <BrutalText variant="mono" className="text-black dark:text-white">
                SMART CONTRACTS
              </BrutalText>
            </BrutalBox>

            <BrutalBox
              className="text-center bg-white dark:bg-black border-black dark:border-white"
              border
            >
              <BrutalText variant="brutal" size="lg" className="mb-4 text-black dark:text-white">
                FOUNDRY
              </BrutalText>
              <BrutalText variant="mono" className="text-black dark:text-white">
                TESTING FRAMEWORK
              </BrutalText>
            </BrutalBox>

            <BrutalBox
              className="text-center bg-white dark:bg-black border-black dark:border-white"
              border
            >
              <BrutalText variant="brutal" size="lg" className="mb-4 text-black dark:text-white">
                CHAINLINK
              </BrutalText>
              <BrutalText variant="mono" className="text-black dark:text-white">
                ORACLE NETWORK
              </BrutalText>
            </BrutalBox>

            <BrutalBox
              className="text-center bg-white dark:bg-black border-black dark:border-white"
              border
            >
              <BrutalText variant="brutal" size="lg" className="mb-4 text-black dark:text-white">
                TYPESCRIPT
              </BrutalText>
              <BrutalText variant="mono" className="text-black dark:text-white">
                TYPE SAFETY
              </BrutalText>
            </BrutalBox>

            <BrutalBox
              className="text-center bg-white dark:bg-black border-black dark:border-white"
              border
            >
              <BrutalText variant="brutal" size="lg" className="mb-4 text-black dark:text-white">
                NEXT.JS
              </BrutalText>
              <BrutalText variant="mono" className="text-black dark:text-white">
                REACT FRAMEWORK
              </BrutalText>
            </BrutalBox>

            <BrutalBox
              className="text-center bg-white dark:bg-black border-black dark:border-white"
              border
            >
              <BrutalText variant="brutal" size="lg" className="mb-4 text-black dark:text-white">
                WAGMI
              </BrutalText>
              <BrutalText variant="mono" className="text-black dark:text-white">
                WEB3 HOOKS
              </BrutalText>
            </BrutalBox>
          </div>
        </div>
      </BrutalSection>

      {/* CTA Section */}
      <BrutalSection
        fullWidth
        className="bg-white dark:bg-black text-black dark:text-white border-black dark:border-white py-20"
      >
        <div className="text-center max-w-4xl mx-auto">
          <BrutalHeadline size="huge" className="mb-8 text-black dark:text-white">
            READY TO OPTIMIZE?
          </BrutalHeadline>
          <BrutalText variant="mono" size="lg" className="mb-12 text-black dark:text-white">
            JOIN THE MOST AGGRESSIVE YIELD FARMING PLATFORM IN DEFI
          </BrutalText>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/dashboard">
              <Button
                size="xl"
                className="text-2xl px-16 py-8 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 dark:hover:text-white"
              >
                START EARNING
              </Button>
            </Link>
            <Button
              size="xl"
              className="text-2xl px-16 py-8 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 dark:hover:text-white"
            >
              LEARN MORE
            </Button>
          </div>
        </div>
      </BrutalSection>

      <Footer />
    </div>
  );
}
