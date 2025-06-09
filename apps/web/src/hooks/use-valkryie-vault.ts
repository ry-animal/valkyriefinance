import { useAccount, useChainId, useReadContract, useWriteContract } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { ERC4626_VAULT_ABI, getContractAddress } from '@valkryie/contracts'
import { useWeb3Store } from '@/stores/web3-store'

// Vault information
export function useVaultInfo() {
  const chainId = useChainId()
  const vaultAddress = getContractAddress(chainId, 'valkryieVault')

  const { data: name } = useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'name',
    query: { enabled: !!vaultAddress },
  })

  const { data: symbol } = useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'symbol',
    query: { enabled: !!vaultAddress },
  })

  const { data: asset } = useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'asset',
    query: { enabled: !!vaultAddress },
  })

  const { data: totalSupply } = useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'totalSupply',
    query: { enabled: !!vaultAddress },
  })

  const { data: totalAssets } = useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'totalAssets',
    query: { enabled: !!vaultAddress },
  })

  return {
    vaultAddress,
    name,
    symbol,
    asset,
    totalSupply,
    totalAssets,
    formattedTotalSupply: totalSupply ? formatUnits(totalSupply, 18) : '0',
    formattedTotalAssets: totalAssets ? formatUnits(totalAssets, 18) : '0',
  }
}

// User's vault balance and position
export function useVaultBalance() {
  const { address } = useAccount()
  const chainId = useChainId()
  const vaultAddress = getContractAddress(chainId, 'valkryieVault')

  const { data: shares } = useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: !!vaultAddress && !!address },
  })

  const { data: assetsFromShares } = useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'convertToAssets',
    args: [shares || BigInt(0)],
    query: { enabled: !!vaultAddress && !!shares },
  })

  const { data: maxWithdraw } = useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'maxWithdraw',
    args: [address!],
    query: { enabled: !!vaultAddress && !!address },
  })

  const { data: maxRedeem } = useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'maxRedeem',
    args: [address!],
    query: { enabled: !!vaultAddress && !!address },
  })

  return {
    shares,
    assetsFromShares,
    maxWithdraw,
    maxRedeem,
    formattedShares: shares ? formatUnits(shares, 18) : '0',
    formattedAssetsFromShares: assetsFromShares ? formatUnits(assetsFromShares, 18) : '0',
    formattedMaxWithdraw: maxWithdraw ? formatUnits(maxWithdraw, 18) : '0',
    formattedMaxRedeem: maxRedeem ? formatUnits(maxRedeem, 18) : '0',
  }
}

// Preview functions for estimating operations
export function useVaultPreviews() {
  const chainId = useChainId()
  const vaultAddress = getContractAddress(chainId, 'valkryieVault')

  const previewDeposit = (assets: string) => {
    const assetsWei = parseUnits(assets, 18)
    return useReadContract({
      address: vaultAddress,
      abi: ERC4626_VAULT_ABI,
      functionName: 'previewDeposit',
      args: [assetsWei],
      query: { enabled: !!vaultAddress && !!assets },
    })
  }

  const previewMint = (shares: string) => {
    const sharesWei = parseUnits(shares, 18)
    return useReadContract({
      address: vaultAddress,
      abi: ERC4626_VAULT_ABI,
      functionName: 'previewMint',
      args: [sharesWei],
      query: { enabled: !!vaultAddress && !!shares },
    })
  }

  const previewWithdraw = (assets: string) => {
    const assetsWei = parseUnits(assets, 18)
    return useReadContract({
      address: vaultAddress,
      abi: ERC4626_VAULT_ABI,
      functionName: 'previewWithdraw',
      args: [assetsWei],
      query: { enabled: !!vaultAddress && !!assets },
    })
  }

  const previewRedeem = (shares: string) => {
    const sharesWei = parseUnits(shares, 18)
    return useReadContract({
      address: vaultAddress,
      abi: ERC4626_VAULT_ABI,
      functionName: 'previewRedeem',
      args: [sharesWei],
      query: { enabled: !!vaultAddress && !!shares },
    })
  }

  return {
    previewDeposit,
    previewMint,
    previewWithdraw,
    previewRedeem,
  }
}

// Vault operations
export function useVaultOperations() {
  const { address } = useAccount()
  const chainId = useChainId()
  const vaultAddress = getContractAddress(chainId, 'valkryieVault')
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