import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, sepolia, arbitrum, optimism, polygon } from '@reown/appkit/networks'
import { QueryClient } from '@tanstack/react-query'
import { env } from './env'

// 1. Get projectId from environment
const projectId = env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '1a91f40c774bfe7c56b13d36dc0fe7a6'

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

// 6. Export wagmi config
export const wagmiConfig = wagmiAdapter.wagmiConfig

// 7. Export query client
export const queryClient = new QueryClient()

// Helper function to get chain by ID
export function getChainById(chainId: number) {
  return networks.find(chain => chain.id === chainId)
} 