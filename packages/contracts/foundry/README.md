# Valkyrie Contracts: Audit & Deployment Guide

## Table of Contents

- [Overview](#overview)
- [Audit Checklist](#audit-checklist)
- [Running All Tests](#running-all-tests)
- [Gas & Coverage Reports](#gas--coverage-reports)
- [Deployment Instructions](#deployment-instructions)
- [Mock Asset Deployment (Testnets/Dev)](#mock-asset-deployment-testnetsdev)
- [Post-Deployment Verification & Monitoring](#post-deployment-verification--monitoring)
- [Tenderly Dashboard & Monitoring](#tenderly-dashboard--monitoring)
- [Updating Gas/Coverage Thresholds](#updating-gascoverage-thresholds)
- [Interpreting deployment_info JSON](#interpreting-deployment_info-json)
- [Help & Issues](#help--issues)

---

## Overview

This repo contains the core smart contracts for the Valkyrie AI-driven DeFi platform, including:

- `ValkyrieToken` (ERC20, staking, rewards)
- `ValkyrieVault` (ERC4626, AI strategies, security)
- `ValkyriePriceOracle` (Chainlink/AI hybrid)

All contracts are fully tested, invariant/fuzzed, and gas-optimized. See below for audit, deployment, and monitoring instructions.

---

## Audit Checklist

- [x] **Reentrancy Guards**: All external functions that transfer tokens or interact with other contracts use `nonReentrant`.
- [x] **Access Control**: All sensitive functions are protected by `onlyOwner` or role-based access.
- [x] **Input Validation**: All external inputs are validated, with custom errors for clarity/gas.
- [x] **Checks-Effects-Interactions**: All state changes before external calls.
- [x] **Custom Errors**: Used throughout for gas savings and auditability.
- [x] **Events**: Emitted for all major state changes (deposits, withdrawals, rewards, rebalances, etc).
- [x] **Struct Packing**: All major structs are tightly packed for gas efficiency.
- [x] **Gas Tests**: All major flows have gas snapshot tests with realistic thresholds.
- [x] **Invariant Tests**: Vault and token invariants (e.g. totalAssets >= totalSupply) are enforced and tested.
- [x] **Fuzz Tests**: All user flows and edge cases are fuzzed.
- [x] **Coverage**: 99%+ line/test coverage (see below).
- [x] **Chainlink/VRF/CCIP**: All integrations are tested with mocks and real mainnet forking.
- [x] **Emergency Pause**: All contracts have emergency pause/withdraw.
- [x] **Tenderly Monitoring**: All contracts are monitored in Tenderly (see below).

---

## Running All Tests

```sh
forge test --gas-report
```

- Runs all unit, integration, fuzz, and invariant tests.
- CI will fail if any test or gas threshold fails.

## Gas & Coverage Reports

- **Gas:**
  - Snapshots: `forge snapshot`
  - Check for regressions: `forge snapshot --check`
- **Coverage:**
  - Run: `forge coverage --report summary`
  - (Optional) HTML: `forge coverage --report lcov && genhtml -o coverage-report lcov.info`
- **Typical Coverage:** 99%+ (see CI for latest)

---

## Deployment Instructions

### 1. Set up environment

```sh
cp env.example .env
# Edit .env to set PRIVATE_KEY and any RPC URLs
```

### 2. Deploy to any EVM chain

```sh
forge script script/Deploy.s.sol:Deploy --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast --verify
```

- The script will deploy the PriceOracle, Token, and Vault, and configure the vault.
- Deployment info is saved as `deployments_<chainid>.json`.
- To customize config (names, supply, etc), edit `getDeployConfig()` in `Deploy.s.sol`.

---

## Mock Asset Deployment (Testnets/Dev)

For testnets or local dev, deploy with a mock USDC asset:

```sh
forge script script/Deploy.s.sol:DeployWithMockAsset --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast
```

- Deploys a mock USDC, PriceOracle, Token, and Vault.

---

## Post-Deployment Verification & Monitoring

- **Verify contracts**: Use `--verify` flag or Etherscan/Tenderly dashboard.
- **Check deployment_info**: See `deployments_<chainid>.json` for addresses and block info.
- **Monitor events**: All major events are emitted and can be tracked in Tenderly or Etherscan.
- **Set up Tenderly monitoring**: See below.

---

## Tenderly Dashboard & Monitoring

- All contracts are monitored in [Tenderly](https://dashboard.tenderly.co/ryanimal/valkyrie/testnet/8f558d9c-c617-4e05-bb6b-46f358e3d96d)
- **Admin RPC:** https://virtual.mainnet.rpc.tenderly.co/a15210f9-4786-4a41-8689-acaaa52d2d0a
- **Public RPC:** https://virtual.mainnet.rpc.tenderly.co/9ff653b8-a6e0-4359-9cbe-12e56449c8ea
- **Public WebSocket:** wss://virtual.mainnet.rpc.tenderly.co/01883a9b-1543-4b62-a9f7-279658e205d6
- Use admin endpoints for privileged operations, public for dApp/frontend and general access.
- Real-time monitoring for:
  - Vault deposits/withdrawals
  - AI strategy execution
  - Oracle updates
  - Gas usage
  - Emergency events
- See `TENDERLY_DEPLOYMENT.md` for example deployment and monitoring setup.

---

## Updating Gas/Coverage Thresholds

- Gas thresholds are set in `test/GasOptimization.t.sol`.
- To update: edit the `assertLt(gasUsed, ...)` values and re-run `forge snapshot`.
- Coverage is enforced in CI; see `forge coverage` output for details.

---

## Interpreting deployment_info JSON

- After deployment, a file like `deployments_<chainid>.json` is created.
- Contains contract addresses, chainId, blockNumber, and timestamp.
- Use this for frontend integration, monitoring, and audit artifacts.

---

## How to Generate Audit Artifacts

- **Gas:** `forge snapshot` (outputs .gas-snapshot)
- **Coverage:** `forge coverage --report summary` (outputs to stdout)
- **Deployment Info:** See `deployments_<chainid>.json`
- **Tenderly:** All transactions and events are visible in the dashboard

---

## Help & Issues

- For Foundry usage: [Foundry Book](https://book.getfoundry.sh/)
- For contract or deployment issues: open an issue in this repo or contact the Valkyrie core team.
- For Tenderly monitoring: see the dashboard or contact ops.
