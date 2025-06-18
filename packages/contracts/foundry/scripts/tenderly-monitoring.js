/**
 * Tenderly Web3 Actions: AI Vault Monitoring
 *
 * This script implements automated monitoring for the AI-driven Valkyrie Vault
 * following best practices from tenderly-best-practices.mdc
 */

const { ethers } = require('ethers');

// Vault monitoring thresholds
const MONITORING_CONFIG = {
  MAX_GAS_THRESHOLD: 1000000,
  LARGE_DEPOSIT_THRESHOLD: ethers.utils.parseEther('1000'), // 1000 tokens
  REBALANCE_FREQUENCY_LIMIT: 10, // Max 10 rebalances per hour
  ANOMALY_SEVERITY_LEVELS: {
    LOW: 1,
    MEDIUM: 5,
    HIGH: 8,
    CRITICAL: 10,
  },
};

// Contract ABIs (simplified for monitoring)
const VAULT_ABI = [
  'function totalAssets() view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function paused() view returns (bool)',
  'event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares)',
  'event Withdraw(address indexed caller, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)',
  'event StrategyRebalanced(uint256[] newAllocations)',
  'event AnomalyDetected(string anomalyType, address vault, uint256 severity)',
];

/**
 * Main monitoring function triggered by Tenderly
 */
async function monitorVaultHealth(context) {
  console.log('🔍 Starting AI Vault Health Monitor...');

  const { secrets, storage } = context;
  const provider = new ethers.providers.JsonRpcProvider(secrets.RPC_URL);

  try {
    // Initialize vault contract
    const vaultAddress = secrets.VAULT_ADDRESS;
    const vault = new ethers.Contract(vaultAddress, VAULT_ABI, provider);

    // Perform health checks
    const healthData = await performHealthChecks(vault, storage);

    // Analyze for anomalies
    const anomalies = await detectAnomalies(healthData, storage);

    // Generate alerts if needed
    if (anomalies.length > 0) {
      await generateAlerts(anomalies, context);
    }

    // Update storage with latest metrics
    await updateMetricsStorage(healthData, storage);

    console.log('✅ Vault health monitoring completed successfully');

    return {
      status: 'success',
      timestamp: new Date().toISOString(),
      healthData,
      anomalies: anomalies.length,
    };
  } catch (error) {
    console.error('❌ Vault monitoring failed:', error);

    await generateCriticalAlert(
      {
        type: 'MONITORING_FAILURE',
        message: error.message,
        severity: MONITORING_CONFIG.ANOMALY_SEVERITY_LEVELS.CRITICAL,
      },
      context
    );

    return {
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Perform comprehensive health checks on the vault
 */
async function performHealthChecks(vault, storage) {
  console.log('📊 Performing vault health checks...');

  const [totalAssets, totalSupply, isPaused] = await Promise.all([
    vault.totalAssets(),
    vault.totalSupply(),
    vault.paused(),
  ]);

  // Calculate key metrics
  const sharePrice = totalSupply.gt(0)
    ? totalAssets.div(totalSupply)
    : ethers.utils.parseEther('1');
  const utilizationRate = totalAssets.gt(0) ? totalSupply.mul(10000).div(totalAssets) : 0;

  // Get previous metrics for comparison
  const previousMetrics = (await storage.getJson('vault_metrics')) || {};

  const healthData = {
    totalAssets: totalAssets.toString(),
    totalSupply: totalSupply.toString(),
    sharePrice: sharePrice.toString(),
    utilizationRate: utilizationRate.toString(),
    isPaused,
    timestamp: Date.now(),
    previousMetrics,
  };

  console.log('📈 Health metrics collected:', {
    totalAssets: ethers.utils.formatEther(totalAssets),
    totalSupply: ethers.utils.formatEther(totalSupply),
    sharePrice: ethers.utils.formatEther(sharePrice),
    isPaused,
  });

  return healthData;
}

/**
 * AI-powered anomaly detection
 */
async function detectAnomalies(healthData, storage) {
  console.log('🤖 Running AI anomaly detection...');

  const anomalies = [];
  const { totalAssets, totalSupply, sharePrice, previousMetrics, isPaused } = healthData;

  // 1. Sudden asset changes (potential exploit or large withdrawal)
  if (previousMetrics.totalAssets) {
    const assetChange = Math.abs(
      (parseFloat(totalAssets) - parseFloat(previousMetrics.totalAssets)) /
        parseFloat(previousMetrics.totalAssets)
    );

    if (assetChange > 0.1) {
      // 10% change threshold
      anomalies.push({
        type: 'SUDDEN_ASSET_CHANGE',
        severity:
          assetChange > 0.5
            ? MONITORING_CONFIG.ANOMALY_SEVERITY_LEVELS.CRITICAL
            : MONITORING_CONFIG.ANOMALY_SEVERITY_LEVELS.HIGH,
        data: { assetChange: `${(assetChange * 100).toFixed(2)}%` },
        message: `Sudden asset change detected: ${(assetChange * 100).toFixed(2)}%`,
      });
    }
  }

  // 2. Share price manipulation detection
  if (previousMetrics.sharePrice) {
    const priceChange = Math.abs(
      (parseFloat(sharePrice) - parseFloat(previousMetrics.sharePrice)) /
        parseFloat(previousMetrics.sharePrice)
    );

    if (priceChange > 0.05) {
      // 5% price change threshold
      anomalies.push({
        type: 'SHARE_PRICE_ANOMALY',
        severity:
          priceChange > 0.2
            ? MONITORING_CONFIG.ANOMALY_SEVERITY_LEVELS.HIGH
            : MONITORING_CONFIG.ANOMALY_SEVERITY_LEVELS.MEDIUM,
        data: { priceChange: `${(priceChange * 100).toFixed(2)}%` },
        message: `Unusual share price movement: ${(priceChange * 100).toFixed(2)}%`,
      });
    }
  }

  // 3. Emergency pause detection
  if (isPaused) {
    anomalies.push({
      type: 'VAULT_PAUSED',
      severity: MONITORING_CONFIG.ANOMALY_SEVERITY_LEVELS.CRITICAL,
      data: { isPaused },
      message: 'Vault is currently paused - emergency state detected',
    });
  }

  // 4. AI rebalancing frequency analysis
  const rebalanceHistory = (await storage.getJson('rebalance_history')) || [];
  const recentRebalances = rebalanceHistory.filter(
    (r) => Date.now() - r.timestamp < 3600000 // Last hour
  );

  if (recentRebalances.length > MONITORING_CONFIG.REBALANCE_FREQUENCY_LIMIT) {
    anomalies.push({
      type: 'EXCESSIVE_REBALANCING',
      severity: MONITORING_CONFIG.ANOMALY_SEVERITY_LEVELS.HIGH,
      data: { rebalanceCount: recentRebalances.length },
      message: `Excessive AI rebalancing detected: ${recentRebalances.length} in the last hour`,
    });
  }

  console.log(`🔍 Anomaly detection complete. Found ${anomalies.length} anomalies`);

  return anomalies;
}

/**
 * Generate alerts for detected anomalies
 */
async function generateAlerts(anomalies, context) {
  console.log('🚨 Generating alerts for anomalies...');

  const { webhook } = context;

  for (const anomaly of anomalies) {
    const _alertPayload = {
      type: 'VAULT_ANOMALY',
      severity: anomaly.severity,
      message: anomaly.message,
      data: anomaly.data,
      timestamp: new Date().toISOString(),
      vault: context.secrets.VAULT_ADDRESS,
    };

    // Send to webhook (Discord, Slack, etc.)
    if (webhook?.url) {
      try {
        await fetch(webhook.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content:
              `🚨 **Vault Anomaly Detected**\n` +
              `**Type:** ${anomaly.type}\n` +
              `**Severity:** ${anomaly.severity}/10\n` +
              `**Message:** ${anomaly.message}\n` +
              `**Vault:** ${context.secrets.VAULT_ADDRESS}\n` +
              `**Time:** ${new Date().toISOString()}`,
          }),
        });

        console.log(`✅ Alert sent for ${anomaly.type}`);
      } catch (error) {
        console.error(`❌ Failed to send alert for ${anomaly.type}:`, error);
      }
    }
  }
}

/**
 * Generate critical system alerts
 */
async function generateCriticalAlert(alert, context) {
  console.log('🚨 Generating critical alert...');

  const { webhook } = context;

  if (webhook?.url) {
    try {
      await fetch(webhook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content:
            `🔥 **CRITICAL VAULT ALERT** 🔥\n` +
            `**Type:** ${alert.type}\n` +
            `**Message:** ${alert.message}\n` +
            `**Severity:** ${alert.severity}/10\n` +
            `**Vault:** ${context.secrets.VAULT_ADDRESS}\n` +
            `**Time:** ${new Date().toISOString()}\n` +
            `**Action Required:** Immediate investigation needed`,
        }),
      });

      console.log('✅ Critical alert sent');
    } catch (error) {
      console.error('❌ Failed to send critical alert:', error);
    }
  }
}

/**
 * Update metrics storage for historical analysis
 */
async function updateMetricsStorage(healthData, storage) {
  console.log('💾 Updating metrics storage...');

  // Store current metrics
  await storage.putJson('vault_metrics', {
    totalAssets: healthData.totalAssets,
    totalSupply: healthData.totalSupply,
    sharePrice: healthData.sharePrice,
    utilizationRate: healthData.utilizationRate,
    timestamp: healthData.timestamp,
  });

  // Update historical data (keep last 24 hours)
  const historicalData = (await storage.getJson('vault_history')) || [];
  historicalData.push({
    totalAssets: healthData.totalAssets,
    totalSupply: healthData.totalSupply,
    sharePrice: healthData.sharePrice,
    timestamp: healthData.timestamp,
  });

  // Keep only last 24 hours (288 entries for 5-min intervals)
  const last24Hours = historicalData.slice(-288);
  await storage.putJson('vault_history', last24Hours);

  console.log('✅ Metrics storage updated');
}

/**
 * Handle AI rebalancing events
 */
async function handleRebalancingEvent(context) {
  console.log('🔄 Processing AI rebalancing event...');

  const { transactionEvent, storage } = context;

  // Record rebalancing activity
  const rebalanceHistory = (await storage.getJson('rebalance_history')) || [];
  rebalanceHistory.push({
    transactionHash: transactionEvent.hash,
    timestamp: Date.now(),
    blockNumber: transactionEvent.blockNumber,
  });

  // Keep only last 100 rebalances
  const recent = rebalanceHistory.slice(-100);
  await storage.putJson('rebalance_history', recent);

  // Check for excessive frequency
  const recentRebalances = recent.filter(
    (r) => Date.now() - r.timestamp < 3600000 // Last hour
  );

  if (recentRebalances.length > MONITORING_CONFIG.REBALANCE_FREQUENCY_LIMIT) {
    await generateCriticalAlert(
      {
        type: 'EXCESSIVE_REBALANCING',
        message: `AI is rebalancing too frequently: ${recentRebalances.length} times in the last hour`,
        severity: MONITORING_CONFIG.ANOMALY_SEVERITY_LEVELS.HIGH,
      },
      context
    );
  }

  return {
    status: 'success',
    rebalanceCount: recent.length,
    recentActivity: recentRebalances.length,
  };
}

/**
 * Gas optimization monitoring
 */
async function monitorGasUsage(context) {
  console.log('⛽ Monitoring gas usage...');

  const { transactionEvent } = context;
  const gasUsed = parseInt(transactionEvent.gasUsed);

  if (gasUsed > MONITORING_CONFIG.MAX_GAS_THRESHOLD) {
    await generateCriticalAlert(
      {
        type: 'HIGH_GAS_USAGE',
        message: `Transaction used excessive gas: ${gasUsed.toLocaleString()} gas`,
        severity: MONITORING_CONFIG.ANOMALY_SEVERITY_LEVELS.MEDIUM,
      },
      context
    );
  }

  return {
    status: 'success',
    gasUsed,
    threshold: MONITORING_CONFIG.MAX_GAS_THRESHOLD,
    exceeded: gasUsed > MONITORING_CONFIG.MAX_GAS_THRESHOLD,
  };
}

// Export functions for Tenderly Web3 Actions
module.exports = {
  monitorVaultHealth,
  handleRebalancingEvent,
  monitorGasUsage,
};
