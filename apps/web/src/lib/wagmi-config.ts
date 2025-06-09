import { http, createConfig } from 'wagmi'
import { mainnet, arbitrum, optimism, polygon } from 'wagmi/chains'
import { coinbaseWallet, injected } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [mainnet, arbitrum, optimism, polygon],
  connectors: [
    injected(),
    coinbaseWallet({ 
      appName: 'Valkryie Finance'
    }),
  ],
  transports: {
    [mainnet.id]: http('https://eth.public-rpc.com'),
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    [optimism.id]: http('https://mainnet.optimism.io'),
    [polygon.id]: http('https://polygon-rpc.com'),
  },
})

export const supportedChains = [mainnet, arbitrum, optimism, polygon]
export const supportedChainIds = supportedChains.map(chain => chain.id)

export function getChainById(chainId: number) {
  return supportedChains.find(chain => chain.id === chainId)
}

export function isSupportedChain(chainId: number): boolean {
  return supportedChainIds.includes(chainId as any)
} 