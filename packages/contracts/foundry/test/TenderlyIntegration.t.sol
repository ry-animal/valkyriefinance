// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/ValkryieToken.sol";
import "../src/ValkryieVault.sol";
import "../src/ValkryiePriceOracle.sol";

/**
 * @title TenderlyIntegrationTest
 * @dev Test suite for Tenderly Virtual TestNet integration and AI monitoring
 * Implements best practices from tenderly-best-practices.mdc
 */
contract TenderlyIntegrationTest is Test {
    
    ValkryieToken public token;
    ValkryieVault public vault;
    ValkryiePriceOracle public priceOracle;
    
    address public owner;
    address public feeRecipient;
    address public user1;
    address public user2;
    address public aiController;
    
    // Events for Tenderly monitoring
    event TenderlyTestStart(string testName, uint256 timestamp);
    event TenderlyTestComplete(string testName, bool success, uint256 gasUsed);
    event AIActionSimulated(string action, address vault, uint256[] parameters);
    event AnomalyDetected(string anomalyType, address vault, uint256 severity);
    
    function setUp() public {
        owner = makeAddr("owner");
        feeRecipient = makeAddr("feeRecipient");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        aiController = makeAddr("aiController");
        
        // Deploy contracts for Tenderly monitoring
        vm.startPrank(owner);
        
        priceOracle = new ValkryiePriceOracle();
        console.log("Tenderly Test: PriceOracle deployed at", address(priceOracle));
        
        token = new ValkryieToken(
            "Valkryie Token (Tenderly Test)",
            "VLK-TEST",
            10000000 * 1e18,
            owner
        );
        console.log("Tenderly Test: Token deployed at", address(token));
        
        vault = new ValkryieVault(
            IERC20(address(token)),
            "Valkryie Vault (Tenderly Test)",
            "vVLK-TEST",
            owner,
            feeRecipient,
            address(priceOracle),
            address(0), // VRF disabled for testing
            address(0)  // CCIP disabled for testing
        );
        console.log("Tenderly Test: Vault deployed at", address(vault));
        
        // Set AI controller
        vault.setAIController(aiController);
        
        vm.stopPrank();
        
        // Distribute tokens for testing (simulate unlimited faucet)
        vm.startPrank(owner);
        token.transfer(user1, 1000000 * 1e18);
        token.transfer(user2, 1000000 * 1e18);
        vm.stopPrank();
    }
    
    /**
     * @dev Test AI strategy monitoring and real-time observability
     * Following Tenderly best practice: Real-time Observability and Anomaly Detection
     */
    function test_TenderlyAIMonitoring() public {
        emit TenderlyTestStart("AI_Monitoring", block.timestamp);
        uint256 gasStart = gasleft();
        
        vm.startPrank(owner);
        
        // Add strategies for AI monitoring
        vault.addStrategy(
            0x1111111111111111111111111111111111111111,
            3000, // 30%
            "Conservative Strategy",
            400,  // 4% APY
            2000, // 20% risk
            0
        );
        
        vault.addStrategy(
            0x2222222222222222222222222222222222222222,
            4000, // 40%
            "Moderate Strategy", 
            800,  // 8% APY
            5000, // 50% risk
            0
        );
        
        vault.addStrategy(
            0x3333333333333333333333333333333333333333,
            3000, // 30%
            "Aggressive Strategy",
            1200, // 12% APY
            8000, // 80% risk
            0
        );
        
        vm.stopPrank();
        
        // Test monitoring metrics
        uint256 totalAssets = vault.totalAssets();
        uint256 totalSupply = vault.totalSupply();
        
        console.log("Tenderly Monitoring - Total Assets:", totalAssets);
        console.log("Tenderly Monitoring - Total Supply:", totalSupply);
        console.log("Tenderly Monitoring - Strategies Count: 3");
        
        // Emit monitoring events for Tenderly Dashboard
        emit AIActionSimulated("AddStrategies", address(vault), new uint256[](3));
        
        uint256 gasUsed = gasStart - gasleft();
        emit TenderlyTestComplete("AI_Monitoring", true, gasUsed);
        
        assertTrue(totalAssets == 0, "Initial total assets should be 0");
        assertTrue(totalSupply == 0, "Initial total supply should be 0");
    }
    
    /**
     * @dev Test AI rebalancing simulation before execution
     * Following Tenderly best practice: Pre-Deployment Validation with Simulator
     */
    function test_TenderlySimulateAIRebalancing() public {
        emit TenderlyTestStart("AI_Rebalancing_Simulation", block.timestamp);
        uint256 gasStart = gasleft();
        
        // Setup vault with initial strategies and deposits
        setupVaultWithDeposits();
        
        // Simulate AI-driven rebalancing
        vm.startPrank(aiController);
        
        uint256[] memory newAllocations = new uint256[](3);
        newAllocations[0] = 2000; // Reduce conservative to 20%
        newAllocations[1] = 5000; // Increase moderate to 50% 
        newAllocations[2] = 3000; // Keep aggressive at 30%
        
        // Pre-rebalance state for Tenderly debugging
        uint256 totalAssetsBefore = vault.totalAssets();
        uint256 totalSupplyBefore = vault.totalSupply();
        
        console.log("Pre-rebalance state:");
        console.log("  Total Assets:", totalAssetsBefore);
        console.log("  Total Supply:", totalSupplyBefore);
        
        // Execute rebalancing
        try vault.rebalanceStrategy(newAllocations) {
            console.log("AI Rebalancing: SUCCESS");
            
            // Post-rebalance state for Tenderly analysis
            uint256 totalAssetsAfter = vault.totalAssets();
            uint256 totalSupplyAfter = vault.totalSupply();
            
            console.log("Post-rebalance state:");
            console.log("  Total Assets:", totalAssetsAfter);
            console.log("  Total Supply:", totalSupplyAfter);
            
            // Validate invariants (critical for Tenderly monitoring)
            assertEq(totalSupplyAfter, totalSupplyBefore, "Total supply should not change during rebalancing");
            
            emit AIActionSimulated("Rebalancing", address(vault), newAllocations);
            
        } catch Error(string memory reason) {
            console.log("AI Rebalancing: FAILED");
            console.log("Reason:", reason);
            emit AnomalyDetected("RebalancingFailure", address(vault), 5);
            fail();
        }
        
        vm.stopPrank();
        
        uint256 gasUsed = gasStart - gasleft();
        emit TenderlyTestComplete("AI_Rebalancing_Simulation", true, gasUsed);
    }
    
    /**
     * @dev Test gas profiling for AI-driven operations
     * Following Tenderly best practice: Gas Efficiency and Optimization
     */
    function test_TenderlyGasProfiling() public {
        emit TenderlyTestStart("Gas_Profiling", block.timestamp);
        
        setupVaultWithDeposits();
        
        // Profile gas usage for different AI operations
        uint256 gasDeposit = profileDepositOperation();
        uint256 gasWithdraw = profileWithdrawOperation();
        uint256 gasRebalance = profileRebalanceOperation();
        uint256 gasAddStrategy = profileAddStrategyOperation();
        
        console.log("=== Tenderly Gas Profiling Results ===");
        console.log("Deposit Operation Gas:", gasDeposit);
        console.log("Withdraw Operation Gas:", gasWithdraw);
        console.log("Rebalance Operation Gas:", gasRebalance);
        console.log("Add Strategy Operation Gas:", gasAddStrategy);
        
        // Validate gas efficiency thresholds
        assertTrue(gasDeposit < 200000, "Deposit should be under 200k gas");
        assertTrue(gasWithdraw < 200000, "Withdraw should be under 200k gas");
        assertTrue(gasRebalance < 500000, "Rebalance should be under 500k gas");
        assertTrue(gasAddStrategy < 300000, "Add strategy should be under 300k gas");
        
        emit TenderlyTestComplete("Gas_Profiling", true, 0);
    }
    
    /**
     * @dev Test anomaly detection and emergency responses
     * Following Tenderly best practice: Real-time Observability and Anomaly Detection
     */
    function test_TenderlyAnomalyDetection() public {
        emit TenderlyTestStart("Anomaly_Detection", block.timestamp);
        uint256 gasStart = gasleft();
        
        setupVaultWithDeposits();
        
        // Simulate various anomaly scenarios
        
        // Anomaly 1: Excessive withdrawal attempt
        vm.startPrank(user1);
        uint256 userShares = vault.balanceOf(user1);
        uint256 excessiveAmount = userShares + 1000 * 1e18; // More than user has
        
        vm.expectRevert();
        vault.redeem(excessiveAmount, user1, user1);
        
        emit AnomalyDetected("ExcessiveWithdrawal", address(vault), 3);
        console.log("Anomaly detected: Excessive withdrawal blocked");
        
        vm.stopPrank();
        
        // Anomaly 2: Unauthorized rebalancing attempt
        vm.startPrank(user2); // Not AI controller
        uint256[] memory allocations = new uint256[](3);
        allocations[0] = 3333;
        allocations[1] = 3333;
        allocations[2] = 3334;
        
        vm.expectRevert();
        vault.rebalanceStrategy(allocations);
        
        emit AnomalyDetected("UnauthorizedRebalancing", address(vault), 8);
        console.log("Anomaly detected: Unauthorized rebalancing blocked");
        
        vm.stopPrank();
        
        // Anomaly 3: Invalid strategy allocation (exceeds 100%)
        vm.startPrank(owner);
        
        vm.expectRevert();
        vault.addStrategy(
            0x4444444444444444444444444444444444444444,
            5000, // This would make total > 100%
            "Invalid Strategy",
            1000,
            9000,
            0
        );
        
        emit AnomalyDetected("InvalidAllocation", address(vault), 7);
        console.log("Anomaly detected: Invalid allocation blocked");
        
        vm.stopPrank();
        
        uint256 gasUsed = gasStart - gasleft();
        emit TenderlyTestComplete("Anomaly_Detection", true, gasUsed);
    }
    
    /**
     * @dev Test stress scenarios using Tenderly's unlimited faucet capabilities
     * Following Tenderly best practice: Unlimited Faucet for Stress Testing
     */
    function test_TenderlyStressTesting() public {
        emit TenderlyTestStart("Stress_Testing", block.timestamp);
        uint256 gasStart = gasleft();
        
        setupVaultWithDeposits();
        
        // Stress Test 1: Massive deposit (simulating whale entry)
        address whale = makeAddr("whale");
        uint256 massiveAmount = 5000000 * 1e18; // 5M tokens
        uint256 rapidOpsAmount = 5 * 10000 * 1e18; // 50k tokens for rapid ops
        
        // Simulate unlimited faucet by minting tokens
        vm.startPrank(owner);
        token.transfer(whale, massiveAmount + rapidOpsAmount);
        vm.stopPrank();
        
        vm.startPrank(whale);
        token.approve(address(vault), massiveAmount);
        
        uint256 sharesBefore = vault.totalSupply();
        vault.deposit(massiveAmount, whale);
        uint256 sharesAfter = vault.totalSupply();
        
        console.log("Stress Test - Massive Deposit:");
        console.log("  Amount deposited:", massiveAmount);
        console.log("  Shares before:", sharesBefore);
        console.log("  Shares after:", sharesAfter);
        
        assertTrue(sharesAfter > sharesBefore, "Shares should increase after massive deposit");
        
        // Stress Test 2: Rapid consecutive operations
        for (uint i = 0; i < 5; i++) {
            uint256 amount = 10000 * 1e18;
            token.approve(address(vault), amount);
            vault.deposit(amount, whale);
            uint256 shares = vault.balanceOf(whale) / 10; // Withdraw 10%
            vault.redeem(shares, whale, whale);
        }
        
        console.log("Stress Test - Rapid operations completed successfully");
        
        vm.stopPrank();
        
        emit AIActionSimulated("StressTesting", address(vault), new uint256[](2));
        
        uint256 gasUsed = gasStart - gasleft();
        emit TenderlyTestComplete("Stress_Testing", true, gasUsed);
    }
    
    // Helper functions for Tenderly testing
    
    function setupVaultWithDeposits() internal {
        vm.startPrank(owner);
        
        // Add strategies
        vault.addStrategy(0x1111111111111111111111111111111111111111, 3000, "Strategy1", 400, 2000, 0);
        vault.addStrategy(0x2222222222222222222222222222222222222222, 4000, "Strategy2", 800, 5000, 0);
        vault.addStrategy(0x3333333333333333333333333333333333333333, 3000, "Strategy3", 1200, 8000, 0);
        
        vm.stopPrank();
        
        // Make deposits from users
        vm.startPrank(user1);
        token.approve(address(vault), 100000 * 1e18);
        vault.deposit(100000 * 1e18, user1);
        vm.stopPrank();
        
        vm.startPrank(user2);
        token.approve(address(vault), 150000 * 1e18);
        vault.deposit(150000 * 1e18, user2);
        vm.stopPrank();
    }
    
    function profileDepositOperation() internal returns (uint256) {
        address testUser = makeAddr("gasTestUser");
        
        vm.startPrank(owner);
        token.transfer(testUser, 50000 * 1e18);
        vm.stopPrank();
        
        vm.startPrank(testUser);
        token.approve(address(vault), 50000 * 1e18);
        
        uint256 gasBefore = gasleft();
        vault.deposit(50000 * 1e18, testUser);
        uint256 gasUsed = gasBefore - gasleft();
        
        vm.stopPrank();
        return gasUsed;
    }
    
    function profileWithdrawOperation() internal returns (uint256) {
        uint256 shares = vault.balanceOf(user1) / 2; // Half of user1's shares
        
        vm.startPrank(user1);
        uint256 gasBefore = gasleft();
        vault.redeem(shares, user1, user1);
        uint256 gasUsed = gasBefore - gasleft();
        vm.stopPrank();
        
        return gasUsed;
    }
    
    function profileRebalanceOperation() internal returns (uint256) {
        uint256[] memory allocations = new uint256[](3);
        allocations[0] = 2500;
        allocations[1] = 4500;
        allocations[2] = 3000;
        
        vm.startPrank(aiController);
        uint256 gasBefore = gasleft();
        vault.rebalanceStrategy(allocations);
        uint256 gasUsed = gasBefore - gasleft();
        vm.stopPrank();
        
        return gasUsed;
    }
    
    function profileAddStrategyOperation() internal returns (uint256) {
        vm.startPrank(owner);
        uint256 gasBefore = gasleft();
        vault.addStrategy(
            0x5555555555555555555555555555555555555555,
            0, // 0% allocation initially
            "Gas Test Strategy",
            600,
            4000,
            0
        );
        uint256 gasUsed = gasBefore - gasleft();
        vm.stopPrank();
        
        return gasUsed;
    }
} 