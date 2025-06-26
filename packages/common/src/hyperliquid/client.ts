/**
 * HyperLiquid API client with integrated Reown wallet support
 * Follows best practices from HyperLiquid documentation
 */

import { getChain } from '@valkyrie/config/networks';
import type { WalletClient } from 'viem';
import { HyperLiquidRateLimiter } from './rate-limiter';
import type {
  AccountState,
  Leverage,
  MarginMode,
  MarketData,
  Order,
  OrderBook,
  Position,
} from './types';
import { HyperLiquidAPIError } from './types';
import { HyperLiquidWalletSigner } from './wallet-signer';

export class HyperLiquidClient {
  private baseUrl: string;
  private signer?: HyperLiquidWalletSigner;
  private rateLimiter: HyperLiquidRateLimiter;

  constructor(walletClient?: WalletClient, customBaseUrl?: string) {
    const hyperliquidChain = getChain(998); // HyperLiquid chain ID
    this.baseUrl = customBaseUrl || hyperliquidChain?.apiEndpoint || 'https://api.hyperliquid.xyz';
    this.rateLimiter = new HyperLiquidRateLimiter();

    if (walletClient) {
      this.signer = new HyperLiquidWalletSigner(walletClient);
    }
  }

  /**
   * Connect a wallet client for authenticated requests
   */
  connect(walletClient: WalletClient): void {
    this.signer = new HyperLiquidWalletSigner(walletClient);
  }

  /**
   * Check if client is connected to a wallet
   */
  isConnected(): boolean {
    return !!this.signer;
  }

  // =================
  // PUBLIC API METHODS (No authentication required)
  // =================

  /**
   * Get market data for all assets
   */
  async getAllMids(): Promise<Record<string, string>> {
    return this.makeRequest('/info', {
      type: 'allMids',
    });
  }

  /**
   * Get order book for a specific asset
   */
  async getOrderBook(coin: string): Promise<OrderBook> {
    return this.makeRequest('/info', {
      type: 'l2Book',
      coin,
    });
  }

  /**
   * Get recent trades for a specific asset
   */
  async getTrades(coin: string): Promise<MarketData[]> {
    return this.makeRequest('/info', {
      type: 'recentTrades',
      coin,
    });
  }

  /**
   * Get available assets for trading
   */
  async getAssets(): Promise<any[]> {
    return this.makeRequest('/info', {
      type: 'meta',
    });
  }

  /**
   * Get funding rates
   */
  async getFundingRates(): Promise<Record<string, string>> {
    return this.makeRequest('/info', {
      type: 'fundingHistory',
      coin: '@0', // All coins
    });
  }

  // =================
  // AUTHENTICATED API METHODS (Require wallet connection)
  // =================

  /**
   * Get user's account state
   */
  async getAccountState(): Promise<AccountState> {
    this.requireConnection();

    return this.makeRequest('/info', {
      type: 'clearinghouseState',
      user: this.signer?.getAddress(),
    });
  }

  /**
   * Get user's open positions
   */
  async getPositions(): Promise<Position[]> {
    this.requireConnection();

    return this.makeRequest('/info', {
      type: 'userState',
      user: this.signer?.getAddress(),
    });
  }

  /**
   * Get user's open orders
   */
  async getOpenOrders(): Promise<any[]> {
    this.requireConnection();

    return this.makeRequest('/info', {
      type: 'openOrders',
      user: this.signer?.getAddress(),
    });
  }

  /**
   * Place a new order
   */
  async placeOrder(order: Order): Promise<any> {
    this.requireConnection();

    const action = {
      type: 'order',
      orders: [order],
      grouping: 'na',
    };

    return this.makeAuthenticatedRequest(action);
  }

  /**
   * Cancel an order by client order ID
   */
  async cancelOrder(coin: string, clientOrderId: string): Promise<any> {
    this.requireConnection();

    const action = {
      type: 'cancel',
      cancels: [
        {
          coin,
          oid: clientOrderId,
        },
      ],
    };

    return this.makeAuthenticatedRequest(action);
  }

  /**
   * Cancel all orders for a specific asset
   */
  async cancelAllOrders(coin?: string): Promise<any> {
    this.requireConnection();

    const action = {
      type: 'cancelByCloid',
      cancels: coin ? [{ coin }] : [],
    };

    return this.makeAuthenticatedRequest(action);
  }

  /**
   * Set leverage for an asset
   */
  async setLeverage(leverage: Leverage): Promise<any> {
    this.requireConnection();

    const action = {
      type: 'updateLeverage',
      asset: leverage.coin,
      isCross: leverage.is_cross,
      leverage: leverage.leverage,
    };

    return this.makeAuthenticatedRequest(action);
  }

  /**
   * Set margin mode (cross or isolated)
   */
  async setMarginMode(coin: string, mode: MarginMode): Promise<any> {
    this.requireConnection();

    const action = {
      type: 'updateIsolatedMargin',
      asset: coin,
      isCross: mode === 'cross',
    };

    return this.makeAuthenticatedRequest(action);
  }

  /**
   * Transfer funds between spot and perpetual accounts
   */
  async transfer(
    amount: string,
    fromAccount: 'spot' | 'perp',
    _toAccount: 'spot' | 'perp'
  ): Promise<any> {
    this.requireConnection();

    const action = {
      type: 'spotSend',
      hyperliquidChain: fromAccount === 'spot' ? 'Mainnet' : 'Mainnet',
      signatureChainId: '0xa4b1', // Arbitrum
      destination: this.signer?.getAddress(),
      amount,
      time: Date.now(),
    };

    return this.makeAuthenticatedRequest(action);
  }

  // =================
  // PRIVATE HELPER METHODS
  // =================

  private requireConnection(): void {
    if (!this.signer) {
      throw new HyperLiquidAPIError('Wallet not connected. Call connect() first.');
    }
  }

  private async makeRequest(endpoint: string, data: any): Promise<any> {
    await this.rateLimiter.waitForLimit();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new HyperLiquidAPIError(
        `API request failed: ${response.statusText}`,
        'API_ERROR',
        response.status
      );
    }

    return response.json();
  }

  private async makeAuthenticatedRequest(action: any): Promise<any> {
    this.requireConnection();

    const signedPayload = await this.signer?.createSignedPayload(action);

    return this.makeRequest('/exchange', signedPayload);
  }
}

/**
 * Create a HyperLiquid client with rate limiting
 */
export function createHyperLiquidClient(walletClient?: WalletClient): HyperLiquidClient {
  return new HyperLiquidClient(walletClient);
}
