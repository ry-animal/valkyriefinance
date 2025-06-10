'use client'

import { ConnectKitButton } from 'connectkit'
import { Button } from '@/components/ui/button'
import { Wallet, ChevronDown } from 'lucide-react'

export function ConnectButton() {
    return (
        <ConnectKitButton.Custom>
            {({
                isConnected,
                isConnecting,
                show,
                hide,
                address,
                ensName,
                chain,
                unsupported
            }) => {
                const displayAddress = ensName ?? (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '')

                if (isConnected) {
                    return (
                        <Button
                            onClick={show}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                            <span className="hidden sm:inline">
                                {unsupported ? 'Unsupported Network' : displayAddress}
                            </span>
                            <span className="sm:hidden">
                                {unsupported ? 'Wrong Network' : 'Connected'}
                            </span>
                            <ChevronDown className="w-3 h-3" />
                        </Button>
                    )
                }

                return (
                    <Button
                        onClick={show}
                        disabled={isConnecting}
                        className="flex items-center gap-2"
                    >
                        <Wallet className="w-4 h-4" />
                        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                    </Button>
                )
            }}
        </ConnectKitButton.Custom>
    )
} 