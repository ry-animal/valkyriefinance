'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@valkyrie/ui';
import { AlertTriangle, CheckCircle, ExternalLink, Shield, XCircle } from 'lucide-react';
import { useCallback, useState } from 'react';
import {
  isSafeExternalUrl,
  validateContractAddress,
  validateTransactionParams,
} from '@/utils/security';

interface TransactionDetails {
  to?: string;
  value?: string;
  data?: string;
  gasLimit?: string;
  chainId?: number;
}

interface SecureTransactionGuardProps {
  transaction: TransactionDetails;
  onApprove: () => void;
  onReject: () => void;
  contractName?: string;
  functionName?: string;
  isLoading?: boolean;
}

export function SecureTransactionGuard({
  transaction,
  onApprove,
  onReject,
  contractName,
  functionName,
  isLoading = false,
}: SecureTransactionGuardProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Validate transaction parameters
  const validation = validateTransactionParams(transaction);
  const isValidAddress = transaction.to ? validateContractAddress(transaction.to) : false;

  // Risk assessment
  const getRiskLevel = useCallback(() => {
    let riskScore = 0;

    // High value transactions
    if (transaction.value && parseFloat(transaction.value) > 1) {
      riskScore += 2;
    }

    // Unknown contract
    if (!contractName) {
      riskScore += 1;
    }

    // Complex transaction data
    if (transaction.data && transaction.data.length > 100) {
      riskScore += 1;
    }

    // Invalid parameters
    if (!validation.isValid) {
      riskScore += 3;
    }

    if (riskScore >= 4) return 'high';
    if (riskScore >= 2) return 'medium';
    return 'low';
  }, [transaction, contractName, validation.isValid]);

  const riskLevel = getRiskLevel();

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      default:
        return 'success';
    }
  };

  const getBlockExplorerUrl = (address: string, chainId: number = 1) => {
    const explorers = {
      1: 'https://etherscan.io/address/',
      137: 'https://polygonscan.com/address/',
      42161: 'https://arbiscan.io/address/',
      10: 'https://optimistic.etherscan.io/address/',
      8453: 'https://basescan.org/address/',
    };

    const baseUrl = explorers[chainId as keyof typeof explorers] || explorers[1];
    return `${baseUrl}${address}`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-2">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <CardTitle>Transaction Security Review</CardTitle>
          </div>
          <Badge variant={getRiskColor(riskLevel) as any}>{riskLevel.toUpperCase()} RISK</Badge>
        </div>
        <CardDescription>Please review this transaction carefully before signing</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Validation Errors */}
        {!validation.isValid && (
          <div className="p-4 border-2 border-red-500 rounded-lg bg-red-50">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-800">Security Issues Detected</h3>
            </div>
            <ul className="space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index} className="text-sm text-red-700">
                  • {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Transaction Overview */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-600">Contract</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-sm">{contractName || 'Unknown Contract'}</span>
                {transaction.to && (
                  <a
                    href={getBlockExplorerUrl(transaction.to, transaction.chainId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      const url = getBlockExplorerUrl(transaction.to!, transaction.chainId);
                      if (!isSafeExternalUrl(url)) {
                        e.preventDefault();
                        alert('Unsafe external URL detected');
                      }
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600">Function</div>
              <div className="mt-1">
                <span className="font-mono text-sm">{functionName || 'Unknown Function'}</span>
              </div>
            </div>
          </div>

          {transaction.value && parseFloat(transaction.value) > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-600">Value</div>
              <div className="mt-1">
                <span className="font-mono text-lg font-bold">{transaction.value} ETH</span>
              </div>
            </div>
          )}

          <div>
            <div className="text-sm font-medium text-gray-600">Recipient Address</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {transaction.to || 'Not specified'}
              </span>
              {isValidAddress ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
            </div>
          </div>
        </div>

        {/* Security Warnings */}
        {riskLevel === 'high' && (
          <div className="p-4 border-2 border-red-500 rounded-lg bg-red-50">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-800">High Risk Transaction</h3>
            </div>
            <p className="text-sm text-red-700">
              This transaction has been flagged as high risk. Please verify all details carefully
              and ensure you trust the recipient contract.
            </p>
          </div>
        )}

        {/* Advanced Details */}
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="mb-4"
          >
            {showDetails ? 'Hide' : 'Show'} Advanced Details
          </Button>

          {showDetails && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-600">Gas Limit</div>
                <div className="mt-1 font-mono text-sm">{transaction.gasLimit || 'Auto'}</div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-600">Chain ID</div>
                <div className="mt-1 font-mono text-sm">
                  {transaction.chainId || 'Not specified'}
                </div>
              </div>

              {transaction.data && (
                <div>
                  <div className="text-sm font-medium text-gray-600">Transaction Data</div>
                  <div className="mt-1 font-mono text-xs bg-white p-2 rounded border break-all">
                    {transaction.data}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Security Checklist */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800">Security Checklist</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              {isValidAddress ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
              <span>Valid contract address</span>
            </div>
            <div className="flex items-center gap-2">
              {validation.isValid ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
              <span>Transaction parameters valid</span>
            </div>
            <div className="flex items-center gap-2">
              {contractName ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-yellow-600" />
              )}
              <span>Contract identity verified</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button onClick={onReject} variant="outline" className="flex-1" disabled={isLoading}>
            Reject Transaction
          </Button>
          <Button
            onClick={onApprove}
            disabled={!validation.isValid || isLoading}
            className="flex-1"
          >
            {isLoading ? 'Processing...' : 'Approve & Sign'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
