'use client';

import {
  type AccountState,
  HyperLiquidClient,
  type Order,
  type OrderType,
  type Position,
} from '@valkyrie/common/hyperliquid';
// UI components temporarily replaced with native elements
// import {
//   Badge,
//   Button,
//   Card,
//   Input,
//   Label,
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from '@valkyrie/ui';
import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useWalletClient } from 'wagmi';

export function HyperLiquidTradingInterface() {
  const { data: walletClient } = useWalletClient();
  const [client, setClient] = useState<HyperLiquidClient | null>(null);
  const [accountState, setAccountState] = useState<AccountState | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<string>('BTC');
  const [activeTab, setActiveTab] = useState<'trade' | 'positions'>('trade');
  const [orderForm, setOrderForm] = useState({
    side: 'B' as 'B' | 'S',
    size: '',
    price: '',
    orderType: 'limit' as OrderType,
    reduceOnly: false,
  });

  // Initialize HyperLiquid client when wallet connects
  useEffect(() => {
    if (walletClient) {
      const hyperliquidClient = new HyperLiquidClient(walletClient);
      setClient(hyperliquidClient);
    } else {
      setClient(null);
    }
  }, [walletClient]);

  // Fetch account data
  useEffect(() => {
    if (!client) return;

    const fetchAccountData = async () => {
      try {
        const [accountData, positionsData] = await Promise.all([
          client.getAccountState(),
          client.getPositions(),
        ]);
        setAccountState(accountData);
        setPositions(positionsData);
      } catch (error) {
        console.error('Failed to fetch account data:', error);
      }
    };

    fetchAccountData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchAccountData, 30000);
    return () => clearInterval(interval);
  }, [client]);

  const handlePlaceOrder = async () => {
    if (!client || !orderForm.size || !orderForm.price) return;

    try {
      // This would be the actual order placement
      console.log('Placing order:', {
        coin: selectedCoin,
        ...orderForm,
      });

      // Reset form after successful order
      setOrderForm({
        side: 'B',
        size: '',
        price: '',
        orderType: 'limit',
        reduceOnly: false,
      });
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };

  const formatBalance = (balance: string) => {
    return parseFloat(balance).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

  const formatPnl = (pnl: string, isPercent = false) => {
    const value = parseFloat(pnl);
    const formatted = value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return (
      <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
        {value >= 0 ? '+' : ''}
        {formatted}
        {isPercent ? '%' : ''}
      </span>
    );
  };

  if (!walletClient) {
    return (
      <div className="p-6 border-4 border-yellow-500 bg-yellow-50">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <h3 className="font-bold text-yellow-800">Wallet Required</h3>
        </div>
        <p className="text-yellow-700">
          Please connect your wallet to access HyperLiquid trading features.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            type="button"
            onClick={() => setActiveTab('trade')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'trade'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Trade
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('positions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'positions'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Positions ({positions.length})
          </button>
        </nav>
      </div>

      {/* Account Balance */}
      {accountState && (
        <div className="p-4 border-4 border-black bg-white">
          <h3 className="font-bold mb-2">Account Balance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Total Value</p>
              <p className="font-mono font-bold">
                ${formatBalance(accountState.marginSummary.accountValue)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Available</p>
              <p className="font-mono font-bold">
                ${formatBalance(accountState.marginSummary.totalMarginUsed)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Total PnL</p>
              <p className="font-mono font-bold">
                {formatPnl(accountState.marginSummary.totalNtlPos)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Margin Ratio</p>
              <p className="font-mono font-bold">
                {(parseFloat(accountState.marginSummary.totalMarginUsed) * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'trade' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Form */}
          <div className="p-6 border-4 border-black bg-white">
            <h3 className="font-bold text-xl mb-4">Place Order</h3>

            <div className="space-y-4">
              {/* Coin Selection */}
              <div>
                <label htmlFor="coinSelect" className="block text-sm font-medium mb-1">
                  Asset
                </label>
                <select
                  id="coinSelect"
                  value={selectedCoin}
                  onChange={(e) => setSelectedCoin(e.target.value)}
                  className="w-full p-2 border-2 border-black"
                >
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                  <option value="SOL">SOL</option>
                </select>
              </div>

              {/* Side Selection */}
              <div>
                <div className="block text-sm font-medium mb-1">Side</div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderForm((prev) => ({ ...prev, side: 'B' }))}
                    className={`flex-1 py-2 px-4 border-2 border-black font-medium ${
                      orderForm.side === 'B'
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-black hover:bg-green-50'
                    }`}
                  >
                    <TrendingUp className="h-4 w-4 inline mr-1" />
                    Buy
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderForm((prev) => ({ ...prev, side: 'S' }))}
                    className={`flex-1 py-2 px-4 border-2 border-black font-medium ${
                      orderForm.side === 'S'
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-black hover:bg-red-50'
                    }`}
                  >
                    <TrendingDown className="h-4 w-4 inline mr-1" />
                    Sell
                  </button>
                </div>
              </div>

              {/* Order Type */}
              <div>
                <label htmlFor="orderType" className="block text-sm font-medium mb-1">
                  Order Type
                </label>
                <select
                  id="orderType"
                  value={orderForm.orderType}
                  onChange={(e) =>
                    setOrderForm((prev) => ({ ...prev, orderType: e.target.value as OrderType }))
                  }
                  className="w-full p-2 border-2 border-black"
                >
                  <option value="limit">Limit</option>
                  <option value="market">Market</option>
                </select>
              </div>

              {/* Size */}
              <div>
                <label htmlFor="orderSize" className="block text-sm font-medium mb-1">
                  Size
                </label>
                <input
                  id="orderSize"
                  type="number"
                  value={orderForm.size}
                  onChange={(e) => setOrderForm((prev) => ({ ...prev, size: e.target.value }))}
                  placeholder="0.00"
                  className="w-full p-2 border-2 border-black"
                />
              </div>

              {/* Price (only for limit orders) */}
              {orderForm.orderType === 'limit' && (
                <div>
                  <label htmlFor="orderPrice" className="block text-sm font-medium mb-1">
                    Price
                  </label>
                  <input
                    id="orderPrice"
                    type="number"
                    value={orderForm.price}
                    onChange={(e) => setOrderForm((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    className="w-full p-2 border-2 border-black"
                  />
                </div>
              )}

              {/* Reduce Only */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="reduceOnly"
                  checked={orderForm.reduceOnly}
                  onChange={(e) =>
                    setOrderForm((prev) => ({ ...prev, reduceOnly: e.target.checked }))
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="reduceOnly" className="text-sm font-medium">
                  Reduce Only
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={!orderForm.size || (orderForm.orderType === 'limit' && !orderForm.price)}
                className={`w-full py-3 px-4 border-2 border-black font-bold ${
                  orderForm.side === 'B'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {orderForm.side === 'B' ? 'Buy' : 'Sell'} {selectedCoin}
              </button>
            </div>
          </div>

          {/* Market Info */}
          <div className="p-6 border-4 border-black bg-white">
            <h3 className="font-bold text-xl mb-4">Market Info - {selectedCoin}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Last Price:</span>
                <span className="font-mono font-bold">$45,230.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">24h Change:</span>
                <span className="font-mono text-green-600">+2.34%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">24h Volume:</span>
                <span className="font-mono">$1.2B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Open Interest:</span>
                <span className="font-mono">$890M</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'positions' && (
        <div className="p-6 border-4 border-black bg-white">
          <h3 className="font-bold text-xl mb-4">Open Positions</h3>

          {positions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No open positions</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="text-left p-2">Asset</th>
                    <th className="text-right p-2">Size</th>
                    <th className="text-right p-2">Entry Price</th>
                    <th className="text-right p-2">Mark Price</th>
                    <th className="text-right p-2">PnL</th>
                    <th className="text-right p-2">PnL %</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((position, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{position.coin}</td>
                      <td className="p-2 text-right font-mono">
                        <span
                          className={
                            parseFloat(position.szi) > 0 ? 'text-green-600' : 'text-red-600'
                          }
                        >
                          {parseFloat(position.szi) > 0 ? '+' : ''}
                          {position.szi}
                        </span>
                      </td>
                      <td className="p-2 text-right font-mono">
                        ${parseFloat(position.entryPx || '0').toFixed(2)}
                      </td>
                      <td className="p-2 text-right font-mono">
                        ${parseFloat(position.positionValue || '0').toFixed(2)}
                      </td>
                      <td className="p-2 text-right font-mono">
                        {formatPnl(position.unrealizedPnl || '0')}
                      </td>
                      <td className="p-2 text-right font-mono">{formatPnl('0', true)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
