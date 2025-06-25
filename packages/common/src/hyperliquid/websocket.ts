/**
 * HyperLiquid WebSocket client for real-time market data
 * Integrates with your existing React state management
 */

import { getChain } from '@valkyrie/config/networks';
import WebSocket from 'ws';
import { HyperLiquidRateLimiter } from './rate-limiter';
import type { MarketData, OrderBook } from './types';
import { HyperLiquidAPIError } from './types';

export type WSMessageType =
  | 'allMids'
  | 'notification'
  | 'webData2'
  | 'orderBook'
  | 'trades'
  | 'candle';

export interface WSMessage {
  channel: WSMessageType;
  data: any;
}

export interface WSSubscription {
  id: string;
  type: WSMessageType;
  coin?: string;
  interval?: string;
  callback: (data: any) => void;
}

export class HyperLiquidWebSocket {
  private ws: WebSocket | null = null;
  private subscriptions = new Map<string, WSSubscription>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private rateLimiter: HyperLiquidRateLimiter;
  private isConnecting = false;

  constructor() {
    this.rateLimiter = new HyperLiquidRateLimiter();
  }

  /**
   * Connect to HyperLiquid WebSocket
   */
  async connect(): Promise<void> {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;

    try {
      const hyperliquidChain = getChain(998); // HyperLiquid chain ID
      const wsEndpoint = hyperliquidChain?.wsEndpoint || 'wss://api.hyperliquid.xyz/ws';

      this.ws = new WebSocket(wsEndpoint);

      this.ws.onopen = () => this.handleOpen();
      this.ws.onmessage = (event) => this.handleMessage(event);
      this.ws.onclose = (event) => this.handleClose(event);
      this.ws.onerror = (error) => this.handleError(error);

      // Wait for connection
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('WebSocket connection timeout'));
        }, 10000);

        this.ws!.onopen = () => {
          clearTimeout(timeout);
          this.handleOpen();
          resolve();
        };

        this.ws!.onerror = (error) => {
          clearTimeout(timeout);
          reject(error);
        };
      });
    } catch (error) {
      this.isConnecting = false;
      throw new HyperLiquidAPIError(
        `WebSocket connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'WS_CONNECTION_ERROR'
      );
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.subscriptions.clear();
    this.reconnectAttempts = 0;
    this.isConnecting = false;
  }

  /**
   * Subscribe to market data
   */
  async subscribeToMarketData(coin: string, callback: (data: MarketData) => void): Promise<string> {
    await this.ensureConnected();

    const subscriptionId = `market_${coin}_${Date.now()}`;

    this.subscriptions.set(subscriptionId, {
      id: subscriptionId,
      type: 'allMids',
      coin,
      callback,
    });

    await this.sendMessage({
      method: 'subscribe',
      subscription: {
        type: 'allMids',
        coin,
      },
    });

    return subscriptionId;
  }

  /**
   * Subscribe to order book updates
   */
  async subscribeToOrderBook(coin: string, callback: (data: OrderBook) => void): Promise<string> {
    await this.ensureConnected();

    const subscriptionId = `orderbook_${coin}_${Date.now()}`;

    this.subscriptions.set(subscriptionId, {
      id: subscriptionId,
      type: 'orderBook',
      coin,
      callback,
    });

    await this.sendMessage({
      method: 'subscribe',
      subscription: {
        type: 'l2Book',
        coin,
      },
    });

    return subscriptionId;
  }

  /**
   * Subscribe to user notifications (requires authentication)
   */
  async subscribeToUserNotifications(user: string, callback: (data: any) => void): Promise<string> {
    await this.ensureConnected();

    const subscriptionId = `user_${user}_${Date.now()}`;

    this.subscriptions.set(subscriptionId, {
      id: subscriptionId,
      type: 'notification',
      callback,
    });

    await this.sendMessage({
      method: 'subscribe',
      subscription: {
        type: 'notification',
        user,
      },
    });

    return subscriptionId;
  }

  /**
   * Unsubscribe from a specific subscription
   */
  async unsubscribe(subscriptionId: string): Promise<void> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      return;
    }

    await this.sendMessage({
      method: 'unsubscribe',
      subscription: {
        type: subscription.type,
        coin: subscription.coin,
      },
    });

    this.subscriptions.delete(subscriptionId);
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private async ensureConnected(): Promise<void> {
    if (!this.isConnected()) {
      await this.connect();
    }
  }

  private async sendMessage(message: any): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new HyperLiquidAPIError('WebSocket not connected', 'WS_NOT_CONNECTED');
    }

    // Apply rate limiting
    await this.rateLimiter.waitForLimit();

    this.ws.send(JSON.stringify(message));
  }

  private handleOpen(): void {
    console.log('HyperLiquid WebSocket connected');
    this.isConnecting = false;
    this.reconnectAttempts = 0;

    // Start heartbeat
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.sendMessage({ method: 'ping' }).catch(console.error);
      }
    }, 30000); // 30 second heartbeat
  }

  private handleMessage(event: any): void {
    try {
      const message = JSON.parse(event.data);

      // Handle different message types
      if (message.channel && message.data) {
        this.routeMessage(message);
      } else if (message.method === 'pong') {
        // Heartbeat response - no action needed
        return;
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  private routeMessage(message: WSMessage): void {
    // Route message to appropriate subscriptions
    for (const [id, subscription] of this.subscriptions) {
      if (this.messageMatchesSubscription(message, subscription)) {
        try {
          subscription.callback(message.data);
        } catch (error) {
          console.error(`Error in subscription callback ${id}:`, error);
        }
      }
    }
  }

  private messageMatchesSubscription(message: WSMessage, subscription: WSSubscription): boolean {
    if (message.channel !== subscription.type) {
      return false;
    }

    // For coin-specific subscriptions, check if the data contains the coin
    if (subscription.coin && message.data) {
      const data = message.data;

      // Check various possible coin field names
      if (
        data.coin === subscription.coin ||
        data.symbol === subscription.coin ||
        (data.mids && data.mids[subscription.coin] !== undefined)
      ) {
        return true;
      }
    }

    return !subscription.coin; // Match if no specific coin required
  }

  private handleClose(event: any): void {
    console.log('HyperLiquid WebSocket disconnected:', event.code, event.reason);
    this.isConnecting = false;

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    // Attempt reconnection if not a clean close
    if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.scheduleReconnect();
    }
  }

  private handleError(error: any): void {
    console.error('HyperLiquid WebSocket error:', error);
    this.isConnecting = false;
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * 2 ** (this.reconnectAttempts - 1); // Exponential backoff

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      if (this.reconnectAttempts <= this.maxReconnectAttempts) {
        this.connect().catch(console.error);
      }
    }, delay);
  }
}

/**
 * React hook for HyperLiquid WebSocket connection
 * Integrates with your existing React patterns
 */
export function useHyperLiquidWebSocket() {
  // This would integrate with your React state management
  // Return WebSocket instance and connection status
  return {
    connect: () => {}, // Implementation would use React state
    disconnect: () => {},
    subscribeToMarketData: () => {},
    subscribeToOrderBook: () => {},
    isConnected: false,
  };
}
