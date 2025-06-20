// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import "../src/ValkyrieToken.sol";
import "../src/ValkyrieVault.sol";
import "../src/ValkyriePriceOracle.sol";

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
        
        // Deployment complete - all monitoring events emitted for Tenderly
        console.log("All deployment data available in transaction logs for Tenderly monitoring");
    }
    
    function deployContracts(TenderlyConfig memory config) internal {
        // Deploy Price Oracle with simulation
        console.log("Deploying ValkyriePriceOracle...");
        deployedPriceOracle = address(new ValkyriePriceOracle());
        console.log("ValkyriePriceOracle deployed at:", deployedPriceOracle);
        
        // Deploy Valkyrie Token with unlimited faucet simulation
        console.log("Deploying ValkyrieToken...");
        deployedToken = address(new ValkyrieToken(
            config.tokenName,
            config.tokenSymbol,
            config.initialSupply,
            config.owner
        ));
        console.log("ValkyrieToken deployed at:", deployedToken);
        
        // Deploy Vault with AI integration
        console.log("Deploying ValkyrieVault with AI capabilities...");
        deployedVault = address(new ValkyrieVault(
            IERC20(deployedToken),
            config.vaultName,
            config.vaultSymbol,
            config.owner,
            config.feeRecipient,
            deployedPriceOracle
        ));
        console.log("ValkyrieVault deployed at:", deployedVault);
    }
    
    function setupAIStrategies() internal {
        console.log("Setting up AI strategies for testing...");
        
        ValkyrieVault vault = ValkyrieVault(deployedVault);
        
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
        ValkyrieVault vault = ValkyrieVault(deployedVault);
        console.log("Total assets:", vault.totalAssets());
        console.log("Total supply:", vault.totalSupply());
        console.log("Strategies count: 3");
        
        console.log("Monitoring events emitted for Tenderly Dashboard");
    }
    
    function getTenderlyConfig() internal view returns (TenderlyConfig memory) {
        return TenderlyConfig({
            tokenName: "Valkyrie Token (Tenderly)",
            tokenSymbol: "VLK-T",
            initialSupply: 10000000 * 1e18, // 10M tokens for testing
            vaultName: "Valkyrie AI Vault (Tenderly)",
            vaultSymbol: "vVLK-T",
            feeRecipient: vm.addr(vm.envUint("PRIVATE_KEY")),
            owner: vm.addr(vm.envUint("PRIVATE_KEY")),
            enableMonitoring: true,
            enableGasProfiling: true
        });
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
        
        ValkyrieVault vault = ValkyrieVault(vaultAddress);
        
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
        
        ValkyrieVault vault = ValkyrieVault(vaultAddress);
        ValkyrieToken token = ValkyrieToken(address(vault.asset()));
        
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