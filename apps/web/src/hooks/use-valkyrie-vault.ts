import { useAccount, useChainId, useReadContract, useWriteContract } from 'wagmi'
import { formatUnits, parseUnits, formatEther } from 'viem'
import { ERC4626_VAULT_ABI, getContractAddress } from '@valkryie/contracts'
import { useWeb3Store } from '@/stores/web3-store'

// Vault information
export function useVaultInfo() {
  const chainId = useChainId()

  const { data: name } = useReadContract({
    address: getContractAddress(chainId, 'valkyrieVault'),
    abi: ERC4626_VAULT_ABI,
    functionName: 'name',
  })

  const { data: symbol } = useReadContract({
    address: getContractAddress(chainId, 'valkyrieVault'),
    abi: ERC4626_VAULT_ABI,
    functionName: 'symbol',
  })

  const { data: asset } = useReadContract({
    address: getContractAddress(chainId, 'valkyrieVault'),
    abi: ERC4626_VAULT_ABI,
    functionName: 'asset',
  })

  const { data: totalSupply } = useReadContract({
    address: getContractAddress(chainId, 'valkyrieVault'),
    abi: ERC4626_VAULT_ABI,
    functionName: 'totalSupply',
  })

  const { data: totalAssets } = useReadContract({
    address: getContractAddress(chainId, 'valkyrieVault'),
    abi: ERC4626_VAULT_ABI,
    functionName: 'totalAssets',
  })

  return {
    name: name || '',
    symbol: symbol || '',
    asset,
    totalSupply,
    totalAssets: totalAssets || BigInt(0),
    vaultAddress: getContractAddress(chainId, 'valkyrieVault'),
    formattedTotalSupply: totalSupply ? formatUnits(totalSupply, 18) : '0',
    formattedTotalAssets: totalAssets ? formatEther(totalAssets) : '0.0',
  }
}

// User's vault balance and position
export function useVaultBalance() {
  const { address } = useAccount()
  const chainId = useChainId()

  const { data: shares } = useReadContract({
    address: getContractAddress(chainId, 'valkyrieVault'),
    abi: ERC4626_VAULT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { data: assetsFromShares } = useReadContract({
    address: getContractAddress(chainId, 'valkyrieVault'),
    abi: ERC4626_VAULT_ABI,
    functionName: 'convertToAssets',
    args: shares ? [shares] : undefined,
    query: { enabled: !!shares },
  })

  const { data: maxWithdraw } = useReadContract({
    address: getContractAddress(chainId, 'valkyrieVault'),
    abi: ERC4626_VAULT_ABI,
    functionName: 'maxWithdraw',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { data: maxRedeem } = useReadContract({
    address: getContractAddress(chainId, 'valkyrieVault'),
    abi: ERC4626_VAULT_ABI,
    functionName: 'maxRedeem',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  return {
    shares: shares || BigInt(0),
    assetsFromShares: assetsFromShares || BigInt(0),
    maxWithdraw,
    maxRedeem,
    formattedShares: shares ? formatEther(shares) : '0.0',
    formattedAssetsFromShares: assetsFromShares ? formatEther(assetsFromShares) : '0.0',
    formattedMaxWithdraw: maxWithdraw ? formatEther(maxWithdraw) : '0.0',
    formattedMaxRedeem: maxRedeem ? formatEther(maxRedeem) : '0.0',
  }
}

// Preview functions for estimating operations
export function useVaultPreviewDeposit(assets: string) {
  const chainId = useChainId()
  const vaultAddress = getContractAddress(chainId, 'valkyrieVault')
  const assetsWei = assets ? parseUnits(assets, 18) : 0n

  return useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'previewDeposit',
    args: [assetsWei],
    query: { enabled: !!vaultAddress && !!assets },
  })
}

export function useVaultPreviewMint(shares: string) {
  const chainId = useChainId()
  const vaultAddress = getContractAddress(chainId, 'valkyrieVault')
  const sharesWei = shares ? parseUnits(shares, 18) : 0n

  return useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'previewMint',
    args: [sharesWei],
    query: { enabled: !!vaultAddress && !!shares },
  })
}

export function useVaultPreviewWithdraw(assets: string) {
  const chainId = useChainId()
  const vaultAddress = getContractAddress(chainId, 'valkyrieVault')
  const assetsWei = assets ? parseUnits(assets, 18) : 0n

  return useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'previewWithdraw',
    args: [assetsWei],
    query: { enabled: !!vaultAddress && !!assets },
  })
}

export function useVaultPreviewRedeem(shares: string) {
  const chainId = useChainId()
  const vaultAddress = getContractAddress(chainId, 'valkyrieVault')
  const sharesWei = shares ? parseUnits(shares, 18) : 0n

  return useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'previewRedeem',
    args: [sharesWei],
    query: { enabled: !!vaultAddress && !!shares },
  })
}

// Vault operations
export function useVaultOperations() {
  const { address } = useAccount()
  const chainId = useChainId()
  const vaultAddress = getContractAddress(chainId, 'valkyrieVault')
  const { writeContractAsync, isPending, error } = useWriteContract()
  const { addTransaction } = useWeb3Store()

  const deposit = async (assets: string, receiver?: `0x${string}`) => {
    if (!vaultAddress || !address) throw new Error('Wallet not connected')

    const assetsWei = parseUnits(assets, 18)
    const receiverAddress = receiver || address
    
    try {
      const hash = await writeContractAsync({
        address: vaultAddress,
        abi: ERC4626_VAULT_ABI,
        functionName: 'deposit',
        args: [assetsWei, receiverAddress],
      })

      addTransaction({
        hash,
        type: 'vault_deposit',
        status: 'pending',
        chainId,
        amount: formatUnits(assetsWei, 18),
        token: 'Vault Assets',
      })

      return hash
    } catch (error) {
      console.error('Vault deposit failed:', error)
      throw error
    }
  }

  const mint = async (shares: string, receiver?: `0x${string}`) => {
    if (!vaultAddress || !address) throw new Error('Wallet not connected')

    const sharesWei = parseUnits(shares, 18)
    const receiverAddress = receiver || address
    
    try {
      const hash = await writeContractAsync({
        address: vaultAddress,
        abi: ERC4626_VAULT_ABI,
        functionName: 'mint',
        args: [sharesWei, receiverAddress],
      })

      addTransaction({
        hash,
        type: 'vault_deposit',
        status: 'pending',
        chainId,
        amount: formatUnits(sharesWei, 18),
        token: 'Vault Shares',
      })

      return hash
    } catch (error) {
      console.error('Vault mint failed:', error)
      throw error
    }
  }

  const withdraw = async (assets: string, receiver?: `0x${string}`, owner?: `0x${string}`) => {
    if (!vaultAddress || !address) throw new Error('Wallet not connected')

    const assetsWei = parseUnits(assets, 18)
    const receiverAddress = receiver || address
    const ownerAddress = owner || address
    
    try {
      const hash = await writeContractAsync({
        address: vaultAddress,
        abi: ERC4626_VAULT_ABI,
        functionName: 'withdraw',
        args: [assetsWei, receiverAddress, ownerAddress],
      })

      addTransaction({
        hash,
        type: 'vault_withdraw',
        status: 'pending',
        chainId,
        amount: formatUnits(assetsWei, 18),
        token: 'Vault Assets',
      })

      return hash
    } catch (error) {
      console.error('Vault withdraw failed:', error)
      throw error
    }
  }

  const redeem = async (shares: string, receiver?: `0x${string}`, owner?: `0x${string}`) => {
    if (!vaultAddress || !address) throw new Error('Wallet not connected')

    const sharesWei = parseUnits(shares, 18)
    const receiverAddress = receiver || address
    const ownerAddress = owner || address
    
    try {
      const hash = await writeContractAsync({
        address: vaultAddress,
        abi: ERC4626_VAULT_ABI,
        functionName: 'redeem',
        args: [sharesWei, receiverAddress, ownerAddress],
      })

      addTransaction({
        hash,
        type: 'vault_withdraw',
        status: 'pending',
        chainId,
        amount: formatUnits(sharesWei, 18),
        token: 'Vault Shares',
      })

      return hash
    } catch (error) {
      console.error('Vault redeem failed:', error)
      throw error
    }
  }

  return {
    deposit,
    mint,
    withdraw,
    redeem,
    isPending,
    error,
  }
} 