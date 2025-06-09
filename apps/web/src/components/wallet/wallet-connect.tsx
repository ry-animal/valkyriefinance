"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWeb3Store } from "@/stores/web3-store";
import { Wallet, Unplug } from "lucide-react";

export function WalletConnect() {
    const {
        isConnected,
        address,
        chainId,
        setConnected,
        setAddress,
        setChainId,
        disconnect
    } = useWeb3Store();

    const formatAddress = (addr: string) =>
        `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    const getChainName = (id: number) => {
        const chains = {
            1: "Ethereum",
            42161: "Arbitrum",
            10: "Optimism",
            137: "Polygon"
        };
        return chains[id as keyof typeof chains] || "Unknown";
    };

    if (isConnected && address) {
        return (
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                        {formatAddress(address)}
                    </Badge>
                    {chainId && (
                        <Badge variant="secondary">
                            {getChainName(chainId)}
                        </Badge>
                    )}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={disconnect}
                    className="flex items-center gap-2"
                >
                    <Unplug className="h-4 w-4" />
                    Disconnect
                </Button>
            </div>
        );
    }

    const handleConnect = () => {
        // Mock wallet connection for demo
        setConnected(true);
        setAddress("0x1234567890123456789012345678901234567890");
        setChainId(1);
    };

    return (
        <Button
            onClick={handleConnect}
            size="lg"
            className="flex items-center gap-2"
        >
            <Wallet className="h-5 w-5" />
            Connect Wallet
        </Button>
    );
} 