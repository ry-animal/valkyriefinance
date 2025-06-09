"use client";

import { ConnectKitButton } from 'connectkit'
import { useAccount, useDisconnect } from 'wagmi'
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWeb3Store } from "@/stores/web3-store";
import { Wallet, Unplug } from "lucide-react";
import { useEffect } from 'react';

export function WalletConnect() {
    const { address, isConnected, chain } = useAccount()
    const { disconnect: wagmiDisconnect } = useDisconnect()
    const {
        setConnected,
        setAddress,
        setChainId,
        disconnect: storeDisconnect
    } = useWeb3Store()

    // Sync Wagmi state with Zustand store
    useEffect(() => {
        if (isConnected && address) {
            setConnected(true)
            setAddress(address)
            setChainId(chain?.id || 1)
        } else {
            storeDisconnect()
        }
    }, [isConnected, address, chain, setConnected, setAddress, setChainId, storeDisconnect])

    const formatAddress = (addr: string) =>
        `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    const getChainName = (chainId?: number) => {
        const chains = {
            1: "Ethereum",
            42161: "Arbitrum",
            10: "Optimism",
            137: "Polygon"
        };
        return chains[chainId as keyof typeof chains] || "Unknown";
    };

    return (
        <ConnectKitButton.Custom>
            {({ isConnected, show, address, chain }) => {
                if (isConnected && address) {
                    return (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="font-mono">
                                    {formatAddress(address)}
                                </Badge>
                                {chain && (
                                    <Badge variant="secondary">
                                        {getChainName(chain.id)}
                                    </Badge>
                                )}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    wagmiDisconnect()
                                    storeDisconnect()
                                }}
                                className="flex items-center gap-2"
                            >
                                <Unplug className="h-4 w-4" />
                                Disconnect
                            </Button>
                        </div>
                    );
                }

                return (
                    <Button
                        onClick={show}
                        size="lg"
                        className="flex items-center gap-2"
                    >
                        <Wallet className="h-5 w-5" />
                        Connect Wallet
                    </Button>
                );
            }}
        </ConnectKitButton.Custom>
    );
} 