import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, sepolia, arbitrum, optimism, polygon } from '@reown/appkit/networks'
import { QueryClient } from '@tanstack/react-query'
import { env } from './env'
import { http, createConfig } from 'wagmi'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

// 1. Get projectId from environment
const projectId = env.NEXT_PUBLIC_REOWN_PROJECT_ID

// 2. Create a metadata object - optional
const metadata = {
  name: 'Valkyrie Finance',
  description: 'AI-Driven DeFi Platform',
  url: 'https://valkyrie.finance', // origin must match your domain & subdomain
  icons: ['https://assets.reown.com/reown-profile-pic.png']
}

// 3. Set the networks
export const networks = [mainnet, sepolia, arbitrum, optimism, polygon]

// 4. Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks
})

// 5. Create modal
let appKit: any = null

export function initializeAppKit() {
  if (typeof window === 'undefined') return null
  
  if (!appKit) {
    appKit = createAppKit({
      adapters: [wagmiAdapter],
      projectId,
      networks: networks as any,
      metadata
    })
  }
  
  return appKit
}

// Export function to get AppKit instance
export function getAppKit() {
  return appKit
}

// 6. Create wagmi config function
function createWagmiConfig() {
  return createConfig({
    chains: env.NEXT_PUBLIC_ENABLE_TESTNETS 
      ? [mainnet, sepolia, arbitrum, optimism] 
      : [mainnet, arbitrum, optimism],
    connectors: [
      injected(),
      coinbaseWallet({ appName: 'Valkyrie Finance' }),
      ...(typeof window !== 'undefined' ? [walletConnect({ 
        projectId: env.NEXT_PUBLIC_REOWN_PROJECT_ID 
      })] : []),
    ],
    transports: {
      [mainnet.id]: http(
        env.NEXT_PUBLIC_ALCHEMY_API_KEY 
          ? `https://eth-mainnet.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
          : 'https://cloudflare-eth.com'
      ),
      [sepolia.id]: http(
        env.NEXT_PUBLIC_ALCHEMY_API_KEY 
          ? `https://eth-sepolia.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
          : 'https://rpc.sepolia.org'
      ),
      [arbitrum.id]: http(
        env.NEXT_PUBLIC_ALCHEMY_API_KEY 
          ? `https://arb-mainnet.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
          : 'https://arb1.arbitrum.io/rpc'
      ),
      [optimism.id]: http(
        env.NEXT_PUBLIC_ALCHEMY_API_KEY 
          ? `https://opt-mainnet.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
          : 'https://mainnet.optimism.io'
      ),
    },
  })
}

// Always create a config (both server and client side)
export const wagmiConfig = createWagmiConfig()

// 7. Export query client
export const queryClient = new QueryClient()

// Helper function to get chain by ID
export function getChainById(chainId: number) {
  return networks.find(chain => chain.id === chainId)
} 