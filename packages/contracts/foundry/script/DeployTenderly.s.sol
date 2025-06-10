// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import "../src/ValkryieToken.sol";
import "../src/ValkryieVault.sol";
import "../src/ValkryiePriceOracle.sol";

/**
 * @title DeployTenderly
 * @dev Specialized deployment script for Tenderly Virtual TestNets
 * Following best practices from tenderly-best-practices.mdc
 */
contract DeployTenderly is Script {
    
    // Tenderly-specific configuration
    struct TenderlyConfig {
        string tokenName;
        string tokenSymbol;
        uint256 initialSupply;
        string vaultName;
        string vaultSymbol;
        address feeRecipient;
        address owner;
        bool enableMonitoring;
        bool enableGasProfiling;
    }
    
    // Deployment addresses for monitoring
    address public deployedToken;
    address public deployedVault;
    address public deployedPriceOracle;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("=== Tenderly Virtual TestNet Deployment ===");
        console.log("Deployer:", deployer);
        console.log("Balance:", deployer.balance);
        console.log("Chain ID:", block.chainid);
        console.log("Block Number:", block.number);
        
        // Get Tenderly-specific configuration
        TenderlyConfig memory config = getTenderlyConfig();
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy with simulation validation
        deployContracts(config);
        
        // Set up AI strategies for testing
        setupAIStrategies();
        
        // Configure monitoring and alerts
        setupMonitoring(config);
        
        vm.stopBroadcast();
        
        // Save deployment info for Tenderly Dashboard
        saveTenderlyDeploymentInfo();
        
        console.log("=== Tenderly Deployment Complete ===");
        logDeploymentSummary();
    }
    
    function deployContracts(TenderlyConfig memory config) internal {
        // Deploy Price Oracle with simulation
        console.log("Deploying ValkryiePriceOracle...");
        deployedPriceOracle = address(new ValkryiePriceOracle());
        console.log("ValkryiePriceOracle deployed at:", deployedPriceOracle);
        
        // Deploy Valkryie Token with unlimited faucet simulation
        console.log("Deploying ValkryieToken...");
        deployedToken = address(new ValkryieToken(
            config.tokenName,
            config.tokenSymbol,
            config.initialSupply,
            config.owner
        ));
        console.log("ValkryieToken deployed at:", deployedToken);
        
        // Deploy Vault with AI integration
        console.log("Deploying ValkryieVault with AI capabilities...");
        deployedVault = address(new ValkryieVault(
            IERC20(deployedToken),
            config.vaultName,
            config.vaultSymbol,
            config.owner,
            config.feeRecipient,
            deployedPriceOracle,
            address(0), // VRF disabled for Virtual TestNet
            address(0)  // CCIP disabled for Virtual TestNet
        ));
        console.log("ValkryieVault deployed at:", deployedVault);
    }
    
    function setupAIStrategies() internal {
        console.log("Setting up AI strategies for testing...");
        
        ValkryieVault vault = ValkryieVault(deployedVault);
        
        // Strategy 1: Conservative DeFi Lending (Low Risk)
        vault.addStrategy(
            0x1111111111111111111111111111111111111111, // Mock Aave strategy
            3000,       // 30% allocation
            "Conservative Lending",
            400,        // 4% expected APY
            2000,       // 20% risk score (low risk)
            0           // Local chain
        );
        console.log("Added Conservative Lending strategy");
        
        // Strategy 2: Moderate Yield Farming (Medium Risk)  
        vault.addStrategy(
            0x2222222222222222222222222222222222222222, // Mock Curve strategy
            4000,       // 40% allocation
            "Yield Farming",
            800,        // 8% expected APY
            5000,       // 50% risk score (medium risk)
            0           // Local chain
        );
        console.log("Added Yield Farming strategy");
        
        // Strategy 3: Advanced Liquidity Mining (High Risk)
        vault.addStrategy(
            0x3333333333333333333333333333333333333333, // Mock Uniswap V4 strategy
            3000,       // 30% allocation
            "Liquidity Mining",
            1200,       // 12% expected APY
            8000,       // 80% risk score (high risk)
            0           // Local chain
        );
        console.log("Added Liquidity Mining strategy");
        
        console.log("AI strategies configured for Virtual TestNet simulation");
    }
    
    function setupMonitoring(TenderlyConfig memory config) internal {
        if (!config.enableMonitoring) return;
        
        console.log("Configuring Tenderly monitoring and alerts...");
        
        // Emit events for Tenderly monitoring setup
        emit TenderlyMonitoringSetup(deployedVault, deployedToken, deployedPriceOracle);
        emit AIStrategyMonitoring(deployedVault, 3); // 3 strategies configured
        
        // Log key metrics for monitoring
        ValkryieVault vault = ValkryieVault(deployedVault);
        console.log("Total assets:", vault.totalAssets());
        console.log("Total supply:", vault.totalSupply());
        console.log("Strategies count: 3");
        
        console.log("Monitoring events emitted for Tenderly Dashboard");
    }
    
    function getTenderlyConfig() internal view returns (TenderlyConfig memory) {
        return TenderlyConfig({
            tokenName: "Valkryie Token (Tenderly)",
            tokenSymbol: "VLK-T",
            initialSupply: 10000000 * 1e18, // 10M tokens for testing
            vaultName: "Valkryie AI Vault (Tenderly)",
            vaultSymbol: "vVLK-T",
            feeRecipient: vm.addr(vm.envUint("PRIVATE_KEY")),
            owner: vm.addr(vm.envUint("PRIVATE_KEY")),
            enableMonitoring: true,
            enableGasProfiling: true
        });
    }
    
    function saveTenderlyDeploymentInfo() internal {
        string memory json = "tenderly_deployment";
        
        vm.serializeAddress(json, "token", deployedToken);
        vm.serializeAddress(json, "vault", deployedVault);
        vm.serializeAddress(json, "priceOracle", deployedPriceOracle);
        vm.serializeUint(json, "chainId", block.chainid);
        vm.serializeUint(json, "blockNumber", block.number);
        vm.serializeUint(json, "timestamp", block.timestamp);
        vm.serializeString(json, "environment", "tenderly_virtual_testnet");
        
        string memory finalJson = vm.serializeUint(json, "strategiesCount", 3);
        
        vm.writeJson(finalJson, "tenderly_deployment.json");
        console.log("Tenderly deployment info saved to: tenderly_deployment.json");
    }
    
    function logDeploymentSummary() internal view {
        console.log("Token Address:", deployedToken);
        console.log("Vault Address:", deployedVault);
        console.log("Price Oracle:", deployedPriceOracle);
        console.log("Strategies Configured: 3");
        console.log("Ready for AI simulation and testing");
    }
    
    // Events for Tenderly monitoring
    event TenderlyMonitoringSetup(address indexed vault, address indexed token, address indexed priceOracle);
    event AIStrategyMonitoring(address indexed vault, uint256 strategiesCount);
}

/**
 * @title TenderlySimulation
 * @dev Contract for simulating AI-driven transactions before execution
 */
contract TenderlySimulation is Script {
    
    function simulateAIRebalancing(address vaultAddress, uint256[] memory newAllocations) external {
        console.log("=== Simulating AI Rebalancing ===");
        
        ValkryieVault vault = ValkryieVault(vaultAddress);
        
        // Pre-simulation state
        uint256 totalAssetsBefore = vault.totalAssets();
        uint256 totalSupplyBefore = vault.totalSupply();
        
        console.log("Pre-rebalance total assets:", totalAssetsBefore);
        console.log("Pre-rebalance total supply:", totalSupplyBefore);
        
        // Simulate the rebalancing (in a real scenario, this would be called by AI)
        vm.startPrank(vault.owner());
        
        try vault.rebalanceStrategy(newAllocations) {
            console.log("Rebalancing simulation: SUCCESS");
            
            // Post-simulation state
            uint256 totalAssetsAfter = vault.totalAssets();
            uint256 totalSupplyAfter = vault.totalSupply();
            
            console.log("Post-rebalance total assets:", totalAssetsAfter);
            console.log("Post-rebalance total supply:", totalSupplyAfter);
            
            // Validate invariants
            require(totalSupplyAfter == totalSupplyBefore, "Supply should not change during rebalancing");
            console.log("Invariant check: PASSED");
            
        } catch Error(string memory reason) {
            console.log("Rebalancing simulation: FAILED");
            console.log("Reason:", reason);
        }
        
        vm.stopPrank();
        console.log("=== Simulation Complete ===");
    }
    
    function simulateStressTest(address vaultAddress) external {
        console.log("=== Simulating Stress Test Scenarios ===");
        
        ValkryieVault vault = ValkryieVault(vaultAddress);
        ValkryieToken token = ValkryieToken(address(vault.asset()));
        
        // Scenario 1: Large deposit
        address largeDepositor = address(0x9999);
        uint256 largeAmount = 1000000 * 1e18; // 1M tokens
        
        vm.deal(largeDepositor, 1 ether);
        vm.startPrank(largeDepositor);
        
        // Mint tokens to depositor (using unlimited faucet concept)
        vm.store(address(token), keccak256(abi.encode(largeDepositor, 0)), bytes32(largeAmount));
        
        token.approve(vaultAddress, largeAmount);
        
        try vault.deposit(largeAmount, largeDepositor) {
            console.log("Large deposit simulation: SUCCESS");
            console.log("Deposited amount:", largeAmount);
        } catch Error(string memory reason) {
            console.log("Large deposit simulation: FAILED");
            console.log("Reason:", reason);
        }
        
        vm.stopPrank();
        
        // Scenario 2: Rapid withdrawal
        vm.startPrank(largeDepositor);
        uint256 shares = vault.balanceOf(largeDepositor);
        
        try vault.redeem(shares, largeDepositor, largeDepositor) {
            console.log("Rapid withdrawal simulation: SUCCESS");
            console.log("Redeemed shares:", shares);
        } catch Error(string memory reason) {
            console.log("Rapid withdrawal simulation: FAILED");
            console.log("Reason:", reason);
        }
        
        vm.stopPrank();
        console.log("=== Stress Test Complete ===");
    }
} 