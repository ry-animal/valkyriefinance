/**
 * HyperLiquid wallet signing using existing Reown/Wagmi infrastructure
 * Integrates with your existing wallet connection system
 */

import type { WalletClient } from 'viem';
import { HyperLiquidAPIError } from './types';

export class HyperLiquidWalletSigner {
  constructor(private walletClient: WalletClient) {}

  /**
   * Generate authenticated signature for HyperLiquid API requests
   * Uses the connected wallet's private key (via Reown/Wagmi)
   */
  async signAPIRequest(payload: any): Promise<string> {
    if (!this.walletClient.account) {
      throw new HyperLiquidAPIError('No wallet connected');
    }

    const message = JSON.stringify(payload);
    const signature = await this.walletClient.signMessage({
      account: this.walletClient.account,
      message,
    });

    return signature;
  }

  /**
   * Get the connected wallet address
   */
  getAddress(): string {
    if (!this.walletClient.account) {
      throw new HyperLiquidAPIError('No wallet connected');
    }
    return this.walletClient.account.address;
  }

  /**
   * Generate nonce for API requests (timestamp-based)
   */
  generateNonce(): number {
    return Date.now();
  }

  /**
   * Create signed payload for HyperLiquid API
   */
  async createSignedPayload(action: any): Promise<{
    action: any;
    nonce: number;
    signature: string;
    vaultAddress?: string;
  }> {
    const nonce = this.generateNonce();
    const payload = {
      action,
      nonce,
      vaultAddress: null, // For main account trading
    };

    const signature = await this.signAPIRequest(payload);

    return {
      ...payload,
      signature,
      vaultAddress: payload.vaultAddress || undefined,
    };
  }
}

/**
 * Hook for using HyperLiquid signer with existing Wagmi setup
 */
export function createHyperLiquidSigner(walletClient: WalletClient): HyperLiquidWalletSigner {
  return new HyperLiquidWalletSigner(walletClient);
}
