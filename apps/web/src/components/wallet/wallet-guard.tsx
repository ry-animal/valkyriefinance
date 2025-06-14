"use client"

import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface WalletGuardProps {
  children: React.ReactNode
  redirectTo?: string
  requireConnection?: boolean
}

export function WalletGuard({ 
  children, 
  redirectTo = '/dashboard', 
  requireConnection = false 
}: WalletGuardProps) {
  const { isConnected } = useAccount()
  const router = useRouter()

  useEffect(() => {
    if (requireConnection && !isConnected) {
      // Redirect to home page if wallet connection is required but not connected
      router.push('/')
    } else if (!requireConnection && isConnected) {
      // Redirect away from home if wallet is connected
      router.push(redirectTo)
    }
  }, [isConnected, requireConnection, redirectTo, router])

  // For home page (requireConnection = false), don't render if connected
  if (!requireConnection && isConnected) {
    return null
  }

  // For protected pages (requireConnection = true), don't render if not connected
  if (requireConnection && !isConnected) {
    return null
  }

  return <>{children}</>
} 