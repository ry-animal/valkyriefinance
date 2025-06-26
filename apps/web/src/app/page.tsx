// import { Button } from '@valkyrie/ui';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-black uppercase tracking-tighter">VALKYRIE FINANCE</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-POWERED DEFI PLATFORM. MAXIMUM YIELD. ZERO COMPROMISE.
          </p>

          <button
            type="button"
            className="px-6 py-3 bg-black text-white font-bold uppercase border-4 border-black hover:bg-white hover:text-black transition-colors"
          >
            Test Button
          </button>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="p-6 border-4 border-black bg-white">
            <h2 className="text-2xl font-black uppercase mb-4">AI OPTIMIZATION</h2>
            <p className="text-gray-600">
              Advanced machine learning algorithms optimize your portfolio for maximum returns with
              minimal risk.
            </p>
          </div>

          <div className="p-6 border-4 border-black bg-white">
            <h2 className="text-2xl font-black uppercase mb-4">CROSS-CHAIN SWAPS</h2>
            <p className="text-gray-600">
              Seamlessly move assets across blockchains with our intelligent bridging technology.
            </p>
          </div>

          <div className="p-6 border-4 border-black bg-white">
            <h2 className="text-2xl font-black uppercase mb-4">YIELD VAULTS</h2>
            <p className="text-gray-600">
              Automated yield farming strategies powered by AI to maximize your passive income.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="space-x-4">
            <Link
              href="/dashboard"
              className="inline-block px-8 py-4 bg-black text-white font-black uppercase border-4 border-black hover:bg-white hover:text-black transition-colors"
            >
              ENTER PLATFORM
            </Link>
            <Link
              href="/ai-analytics"
              className="inline-block px-8 py-4 bg-white text-black font-black uppercase border-4 border-black hover:bg-black hover:text-white transition-colors"
            >
              VIEW ANALYTICS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
