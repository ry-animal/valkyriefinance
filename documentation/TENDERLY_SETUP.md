# Tenderly Integration Setup Guide

This guide walks through setting up Tenderly for the AI-driven Valkyrie Finance vault following best practices from `tenderly-best-practices.mdc`.

## Prerequisites

1. **Tenderly Account**: Create an account at [tenderly.co](https://tenderly.co)
2. **Tenderly CLI**: Install the Tenderly CLI
   ```bash
   npm install -g @tenderly/cli
   ```
3. **Project Setup**: Ensure your Foundry project is properly configured

## Step 1: Initialize Tenderly Project

1. **Login to Tenderly**:

   ```bash
   tenderly login
   ```

2. **Initialize Project**:

   ```bash
   tenderly init
   ```

3. **Update tenderly.yaml**:
   - Copy the configuration from `tenderly.yaml`
   - Replace `account_id` with your Tenderly account ID
   - Update `project_slug` if desired

## Step 2: Create Virtual TestNet (DevNet)

1. **Create DevNet**:

   ```bash
   tenderly devnet spawn-rpc --project valkyrie-finance --template mainnet
   ```

2. **Get DevNet RPC URL**:
   ```bash
   tenderly devnet list
   ```
3. **Update Environment Variables**:
   ```bash
   # Add to .env
   TENDERLY_RPC_URL=https://virtual.mainnet.rpc.tenderly.co/your-devnet-id
   TENDERLY_PROJECT_ID=your-project-id
   TENDERLY_USERNAME=your-username
   ```

## Step 3: Deploy Contracts to Tenderly DevNet

1. **Deploy using Tenderly Script**:

   ```bash
   forge script script/DeployTenderly.s.sol --rpc-url $TENDERLY_RPC_URL --broadcast
   ```

2. **Verify Deployment**:

   ```bash
   # Check deployment in Tenderly Dashboard
   tenderly export init
   tenderly export
   ```

3. **Update Contract Addresses**:
   - Copy deployment addresses to `tenderly.yaml`
   - Update monitoring configuration

## Step 4: Run Tenderly Integration Tests

1. **Execute Tests**:

   ```bash
   forge test --match-contract TenderlyIntegrationTest --rpc-url $TENDERLY_RPC_URL -vv
   ```

2. **Monitor in Tenderly Dashboard**:
   - Go to your Tenderly project
   - View transactions in real-time
   - Check gas usage and execution traces

## Step 5: Set Up Monitoring & Alerts

### Configure Alerts

1. **Create Alert Rules**:

   ```bash
   tenderly alerts create \
     --name "Vault Health Monitor" \
     --network "your-devnet-id" \
     --type "function" \
     --contract "ValkyrieVault" \
     --function "deposit"
   ```

2. **Set Up Webhooks**:
   ```yaml
   # In tenderly.yaml
   integrations:
     discord:
       enabled: true
       webhook_url: "https://discord.com/api/webhooks/your-webhook"
   ```

### Deploy Web3 Actions

1. **Create Web3 Action**:

   ```bash
   tenderly actions create \
     --name "vault-health-monitor" \
     --file "scripts/tenderly-monitoring.js" \
     --trigger "periodic" \
     --interval "5m"
   ```

2. **Set Action Secrets**:
   ```bash
   tenderly actions secrets set VAULT_ADDRESS "0x..."
   tenderly actions secrets set RPC_URL "https://virtual.mainnet.rpc.tenderly.co/..."
   ```

## Step 6: Advanced Simulation & Debugging

### Pre-Execution Simulation

1. **Simulate AI Transactions**:

   ```bash
   # Use Tenderly Simulator API
   curl -X POST https://api.tenderly.co/api/v1/account/$TENDERLY_USERNAME/project/$TENDERLY_PROJECT_ID/simulate \
     -H "X-Access-Key: $TENDERLY_ACCESS_KEY" \
     -d '{
       "network_id": "1337",
       "from": "0x...",
       "to": "0x...",
       "input": "0x...",
       "gas": 500000,
       "gas_price": "20000000000"
     }'
   ```

2. **Debug Failed Transactions**:
   - Use Tenderly Debugger in the dashboard
   - Step through execution line by line
   - Analyze state changes

### Gas Optimization

1. **Generate Gas Reports**:

   ```bash
   forge test --gas-report --rpc-url $TENDERLY_RPC_URL
   ```

2. **Profile Specific Functions**:
   ```bash
   forge test --match-test "test_TenderlyGasProfiling" --rpc-url $TENDERLY_RPC_URL -vvv
   ```

## Step 7: Real-Time Monitoring Setup

### Dashboard Configuration

1. **Create Custom Dashboard**:

   - Go to Tenderly Dashboard
   - Create new dashboard for vault metrics
   - Add widgets for:
     - Total Assets
     - Total Supply
     - AI Rebalancing Events
     - Gas Usage Trends

2. **Set Up Analytics**:
   ```yaml
   # Custom analytics queries
   analytics:
     vault_performance:
       - name: "Total Value Locked"
         query: "SELECT SUM(totalAssets) FROM VaultEvents"
       - name: "Daily Rebalances"
         query: "SELECT COUNT(*) FROM RebalanceEvents WHERE timestamp > NOW() - INTERVAL 1 DAY"
   ```

### Anomaly Detection

1. **Configure Anomaly Rules**:

   ```javascript
   // In tenderly-monitoring.js
   const ANOMALY_THRESHOLDS = {
     ASSET_CHANGE: 0.1, // 10% change
     PRICE_DEVIATION: 0.05, // 5% price change
     GAS_SPIKE: 1000000, // 1M gas
     REBALANCE_FREQUENCY: 10, // 10 per hour
   };
   ```

2. **Test Anomaly Detection**:
   ```bash
   forge test --match-test "test_TenderlyAnomalyDetection" --rpc-url $TENDERLY_RPC_URL -v
   ```

## Step 8: Production Deployment Preparation

### Mainnet Fork Testing

1. **Create Mainnet Fork**:

   ```bash
   tenderly devnet spawn-rpc --project valkyrie-finance --template mainnet --chain-id 1
   ```

2. **Test Against Real Protocols**:
   ```bash
   # Deploy and test against real Uniswap, Chainlink, etc.
   forge test --rpc-url $TENDERLY_MAINNET_FORK_URL --fork-block-number 18000000
   ```

### Security Validation

1. **Run Security Tests**:

   ```bash
   forge test --match-contract Security --rpc-url $TENDERLY_RPC_URL
   ```

2. **Stress Test**:
   ```bash
   forge test --match-test "test_TenderlyStressTesting" --rpc-url $TENDERLY_RPC_URL -v
   ```

## Key Tenderly Features for AI Vault

### 1. **Unlimited Faucet**

- Test with unlimited ETH and tokens
- Simulate whale deposits and stress scenarios
- No funding constraints for comprehensive testing

### 2. **Real-Time Debugging**

- Step-by-step execution analysis
- State change inspection
- Gas usage breakdown

### 3. **Simulation API**

- Pre-validate AI decisions before execution
- Test parameter changes safely
- Simulate edge cases and black swan events

### 4. **Monitoring & Alerts**

- Real-time vault health monitoring
- Automated anomaly detection
- Custom alert rules for AI behavior

### 5. **Gas Profiling**

- Optimize AI operation costs
- Identify gas bottlenecks
- Track efficiency improvements

## Troubleshooting

### Common Issues

1. **RPC Connection Issues**:

   ```bash
   # Check DevNet status
   tenderly devnet list

   # Restart if needed
   tenderly devnet spawn-rpc --project valkyrie-finance --template mainnet
   ```

2. **Contract Verification**:

   ```bash
   # Verify contracts manually
   tenderly verify --networks your-devnet-id ValkyrieVault
   ```

3. **Web3 Actions Debugging**:
   ```bash
   # Check action logs
   tenderly actions logs vault-health-monitor
   ```

### Best Practices

1. **Always use block pinning** for deterministic tests
2. **Monitor gas usage** continuously during development
3. **Set up comprehensive alerts** before production
4. **Use simulation API** for all critical operations
5. **Test anomaly detection** thoroughly

## Next Steps

1. **Deploy to Testnet**: Use learnings from Tenderly to deploy to Sepolia
2. **Security Audits**: Conduct thorough audits using Tenderly insights
3. **Production Deployment**: Deploy to mainnet with monitoring active
4. **Continuous Monitoring**: Maintain 24/7 monitoring and alerting

## Resources

- [Tenderly Documentation](https://docs.tenderly.co/)
- [Web3 Actions Guide](https://docs.tenderly.co/web3-actions)
- [Simulation API Reference](https://docs.tenderly.co/reference/simulation-api)
- [DevNets Guide](https://docs.tenderly.co/devnets)

---

**Tenderly Integration Complete! 🎉**

Your AI-driven vault now has:

- ✅ Comprehensive monitoring
- ✅ Real-time debugging
- ✅ Automated anomaly detection
- ✅ Gas optimization
- ✅ Stress testing capabilities
