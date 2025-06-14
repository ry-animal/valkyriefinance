'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    useAuthStore,
    useUIStore,
    usePortfolioStore,
    useWeb3Store,
    useNotifications,
    useSelectedPortfolio
} from '@/stores';

export function AuthStoreExample() {
    const { user, isAuthenticated, setUser, connectWallet, disconnectWallet } = useAuthStore();

    const mockWalletConnect = () => {
        const mockUser = {
            id: '1',
            walletAddress: '0x1234...5678',
            ensName: 'demo.eth',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setUser(mockUser);
        connectWallet(mockUser);
    };

    const mockWalletDisconnect = () => {
        disconnectWallet();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Wallet Auth Store Example</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-sm text-muted-foreground">Status:</p>
                    <Badge variant={isAuthenticated ? "default" : "secondary"}>
                        {isAuthenticated ? "Wallet Connected" : "Wallet Disconnected"}
                    </Badge>
                </div>

                {user && (
                    <div>
                        <p className="text-sm text-muted-foreground">Wallet:</p>
                        <p className="text-sm font-mono">{user.walletAddress}</p>
                        {user.ensName && (
                            <p className="text-sm text-muted-foreground">ENS: {user.ensName}</p>
                        )}
                    </div>
                )}

                <div className="flex gap-2">
                    <Button
                        onClick={mockWalletConnect}
                        disabled={isAuthenticated}
                    >
                        Mock Connect Wallet
                    </Button>
                    <Button
                        onClick={mockWalletDisconnect}
                        variant="outline"
                        disabled={!isAuthenticated}
                    >
                        Disconnect Wallet
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export function UIStoreExample() {
    const {
        activeModal,
        openModal,
        closeModal,
        addNotification,
        toggleDarkMode,
        isDarkMode
    } = useUIStore();

    const notifications = useNotifications();

    return (
        <Card>
            <CardHeader>
                <CardTitle>UI Store Example</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-sm text-muted-foreground">Active Modal:</p>
                    <Badge variant={activeModal ? "default" : "secondary"}>
                        {activeModal || "None"}
                    </Badge>
                </div>

                <div className="flex gap-2 flex-wrap">
                    <Button
                        onClick={() => openModal('create-portfolio')}
                        size="sm"
                    >
                        Open Modal
                    </Button>
                    <Button
                        onClick={closeModal}
                        variant="outline"
                        size="sm"
                        disabled={!activeModal}
                    >
                        Close Modal
                    </Button>
                    <Button
                        onClick={() => addNotification({
                            type: 'success',
                            title: 'Success!',
                            message: 'This is a test notification',
                        })}
                        size="sm"
                    >
                        Add Notification
                    </Button>
                    <Button
                        onClick={toggleDarkMode}
                        size="sm"
                        variant="outline"
                    >
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </Button>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Notifications ({notifications.length}):
                    </p>
                    {notifications.map((notification) => (
                        <Badge key={notification.id} className="mr-2 mb-2">
                            {notification.title}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export function PortfolioStoreExample() {
    const {
        portfolios,
        addPortfolio,
        selectPortfolio,
        selectedPortfolioId
    } = usePortfolioStore();

    const selectedPortfolio = useSelectedPortfolio();
    const [newPortfolioName, setNewPortfolioName] = useState('');

    const handleAddPortfolio = () => {
        if (newPortfolioName.trim()) {
            addPortfolio({
                id: Math.random().toString(36).substring(2, 9),
                name: newPortfolioName,
                description: 'Demo portfolio',
                totalValue: '0',
                currency: 'USD',
                isDefault: portfolios.length === 0,
                userId: 'demo-user',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            setNewPortfolioName('');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Portfolio Store Example</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-sm text-muted-foreground">
                        Selected Portfolio:
                    </p>
                    <Badge>
                        {selectedPortfolio?.name || "None"}
                    </Badge>
                </div>

                <div className="flex gap-2">
                    <Input
                        placeholder="Portfolio name"
                        value={newPortfolioName}
                        onChange={(e) => setNewPortfolioName(e.target.value)}
                    />
                    <Button onClick={handleAddPortfolio}>
                        Add Portfolio
                    </Button>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Portfolios ({portfolios.length}):
                    </p>
                    <div className="flex gap-2 flex-wrap">
                        {portfolios.map((portfolio) => (
                            <Button
                                key={portfolio.id}
                                variant={selectedPortfolioId === portfolio.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => selectPortfolio(portfolio.id)}
                            >
                                {portfolio.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function Web3StoreExample() {
    const {
        isConnected,
        address,
        chainId,
        setConnected,
        setAddress,
        setChainId,
        addTransaction,
        pendingTransactions
    } = useWeb3Store();

    const mockConnect = () => {
        setConnected(true);
        setAddress('0x1234567890123456789012345678901234567890');
        setChainId(1);
    };

    const mockDisconnect = () => {
        setConnected(false);
        setAddress(null);
        setChainId(null);
    };

    const mockTransaction = () => {
        addTransaction({
            hash: `0x${Math.random().toString(16).substring(2, 66)}`,
            type: 'swap',
            status: 'pending',
            chainId: chainId || 1,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Web3 Store Example</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-sm text-muted-foreground">Connection Status:</p>
                    <Badge variant={isConnected ? "default" : "secondary"}>
                        {isConnected ? "Connected" : "Disconnected"}
                    </Badge>
                </div>

                {isConnected && (
                    <>
                        <div>
                            <p className="text-sm text-muted-foreground">Address:</p>
                            <p className="text-xs font-mono">{address}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Chain ID:</p>
                            <Badge>{chainId}</Badge>
                        </div>
                    </>
                )}

                <div className="flex gap-2">
                    <Button
                        onClick={mockConnect}
                        disabled={isConnected}
                    >
                        Mock Connect
                    </Button>
                    <Button
                        onClick={mockDisconnect}
                        variant="outline"
                        disabled={!isConnected}
                    >
                        Disconnect
                    </Button>
                    <Button
                        onClick={mockTransaction}
                        disabled={!isConnected}
                        size="sm"
                    >
                        Mock Transaction
                    </Button>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Pending Transactions ({pendingTransactions.length}):
                    </p>
                    {pendingTransactions.map((tx) => (
                        <Badge key={tx.hash} variant="outline" className="mr-2 mb-2">
                            {tx.type}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 