import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, arbitrum, optimism, polygon } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'
import { env } from './env'

export const wagmiConfig = createConfig({
  chains: env.NEXT_PUBLIC_ENABLE_TESTNETS 
    ? [mainnet, sepolia, arbitrum, optimism, polygon] 
    : [mainnet, arbitrum, optimism, polygon],
  connectors: [
    injected(),
    coinbaseWallet({ 
      appName: 'Valkyrie Finance',
      appLogoUrl: 'https://valkyrie.finance/logo.png'
    }),
    walletConnect({ 
      projectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'default-project-id',
      metadata: {
        name: 'Valkyrie Finance',
        description: 'AI-Powered DeFi Vault Platform',
        url: 'https://valkyrie.finance',
        icons: ['https://valkyrie.finance/logo.png'],
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'demo'}`),
    [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'demo'}`),
    [arbitrum.id]: http(`https://arb-mainnet.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'demo'}`),
    [optimism.id]: http(`https://opt-mainnet.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'demo'}`),
    [polygon.id]: http(`https://polygon-mainnet.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'demo'}`),
  },
  ssr: true,
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}

export const supportedChains = [mainnet, arbitrum, optimism, polygon]
export const supportedChainIds = supportedChains.map(chain => chain.id)

export function getChainById(chainId: number) {
  return supportedChains.find(chain => chain.id === chainId)
}

export function isSupportedChain(chainId: number): boolean {
  return supportedChainIds.includes(chainId as any)
} 