// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/ValkyrieVault.sol";
import "../src/ValkyriePriceOracle.sol";
import "../src/ValkyrieToken.sol";
import "./MockUSDC.sol";

/**
 * @title SimpleAIVaultTest
 * @dev Simplified test suite for AI vault core functionality
 */
contract SimpleAIVaultTest is Test {
    ValkyrieVault public vault;
    ValkyriePriceOracle public priceOracle;
    ValkyrieToken public valkToken;
    MockUSDC public mockUSDC;
    
    // Test accounts
    address public owner;
    address public alice;
    address public bob;
    address public feeRecipient;
    
    // Test constants
    uint256 public constant INITIAL_SUPPLY = 1000000e18;
    uint256 public constant PRICE_PRECISION = 1e18;
    
    // Mock addresses for Chainlink services
    address public mockVRFCoordinator = address(0x1);
    address public mockCCIPRouter = address(0x2);
    
    function setUp() public {
        // Set up test accounts
        owner = makeAddr("owner");
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        feeRecipient = makeAddr("feeRecipient");
        
        vm.startPrank(owner);
        
        // Deploy mock USDC
        mockUSDC = new MockUSDC();
        mockUSDC.mint(alice, 10000e6);
        mockUSDC.mint(bob, 10000e6);
        
        // Deploy VALK token
        valkToken = new ValkyrieToken("Valkyrie Token", "VLK", INITIAL_SUPPLY, owner);
        
        // Deploy price oracle
        priceOracle = new ValkyriePriceOracle();
        
        // Deploy simplified vault (without complex Chainlink integrations for testing)
        vault = new ValkyrieVault(
            IERC20(address(mockUSDC)),
            "Valkyrie AI Vault",
            "vAI-USDC",
            owner,
            feeRecipient,
            address(priceOracle),
            mockVRFCoordinator,
            mockCCIPRouter
        );
        
        vm.stopPrank();
    }
    
    function testVaultInitialization() public {
        assertEq(address(vault.asset()), address(mockUSDC));
        assertEq(vault.owner(), owner);
        assertFalse(vault.paused());
        assertFalse(vault.emergencyMode());
        
        // Check AI configuration
        ValkyrieVault.AIStrategyConfig memory config = vault.getAIConfig();
        assertEq(config.rebalanceThreshold, 500); // 5%
        assertEq(config.riskThreshold, 7500); // 75%
        assertTrue(config.aiControlEnabled);
    }
    
    function testAddStrategy() public {
        vm.startPrank(owner);
        
        address mockStrategy = makeAddr("strategy1");
        
        vault.addStrategy(
            mockStrategy,
            2000, // 20% allocation
            bytes32("Test Strategy"),
            500,  // 5% expected APY
            5000, // 50% risk score
            0     // same chain
        );
        
        ValkyrieVault.Strategy memory strategy = vault.getStrategy(0);
        assertEq(strategy.strategyAddress, mockStrategy);
        assertEq(strategy.allocation, 2000);
        assertEq(strategy.riskScore, 5000);
        assertTrue(strategy.isActive);
        
        vm.stopPrank();
    }
    
    function testBasicDepositWithdraw() public {
        // Alice deposits
        vm.startPrank(alice);
        mockUSDC.approve(address(vault), 1000e6);
        uint256 shares = vault.deposit(1000e6, alice);
        
        assertGt(shares, 0);
        assertEq(vault.balanceOf(alice), shares);
        assertEq(vault.totalAssets(), 1000e6);
        
        // Alice withdraws
        uint256 assetsWithdrawn = vault.redeem(shares, alice, alice);
        assertEq(assetsWithdrawn, 1000e6);
        assertEq(vault.balanceOf(alice), 0);
        
        vm.stopPrank();
    }
    
    function testMultipleStrategiesAndAllocations() public {
        // Setup multiple strategies
        vm.startPrank(owner);
        
        vault.addStrategy(
            makeAddr("strategy1"),
            3000, // 30%
            bytes32("Conservative"),
            400,
            2000, // Low risk
            0
        );
        
        vault.addStrategy(
            makeAddr("strategy2"),
            4000, // 40%
            bytes32("Moderate"),
            600,
            5000, // Medium risk
            0
        );
        
        vault.addStrategy(
            makeAddr("strategy3"),
            2000, // 20%
            bytes32("Aggressive"),
            1000,
            8000, // High risk
            0
        );
        
        vm.stopPrank();
        
        // Verify total allocation
        uint256 totalAllocation = 0;
        for (uint256 i = 0; i < vault.strategyCount(); i++) {
            ValkyrieVault.Strategy memory strategy = vault.getStrategy(i);
            totalAllocation += strategy.allocation;
        }
        assertEq(totalAllocation, 9000); // 90% total allocation
        assertEq(vault.strategyCount(), 3);
    }
    
    function testAIConfigUpdate() public {
        vm.startPrank(owner);
        
        ValkyrieVault.AIStrategyConfig memory newConfig = ValkyrieVault.AIStrategyConfig({
            rebalanceThreshold: 1000,     // 10%
            riskThreshold: 8000,          // 80%
            maxLeverage: 30000,           // 3x
            confidenceThreshold: 8000,    // 80%
            aiControlEnabled: true,
            emergencyPauseEnabled: true
        });
        
        vault.updateAIConfig(newConfig);
        
        ValkyrieVault.AIStrategyConfig memory updatedConfig = vault.getAIConfig();
        assertEq(updatedConfig.rebalanceThreshold, 1000);
        assertEq(updatedConfig.riskThreshold, 8000);
        assertEq(updatedConfig.maxLeverage, 30000);
        
        vm.stopPrank();
    }
    
    function testEmergencyFunctionality() public {
        // Setup vault with assets
        vm.startPrank(alice);
        mockUSDC.approve(address(vault), 1000e6);
        vault.deposit(1000e6, alice);
        vm.stopPrank();
        
        // Test emergency pause by owner
        vm.startPrank(owner);
        vault.pauseDeposits();
        assertTrue(vault.paused());
        vm.stopPrank();
        
        // Test that deposits are blocked when paused
        vm.startPrank(bob);
        mockUSDC.approve(address(vault), 500e6);
        vm.expectRevert(ValkyrieVault.VaultPaused.selector);
        vault.deposit(500e6, bob);
        vm.stopPrank();
        
        // Test emergency withdrawal mode
        vm.startPrank(owner);
        vault.enableEmergencyWithdrawals();
        assertTrue(vault.emergencyMode());
        vm.stopPrank();
        
        // Test emergency withdrawal by Alice
        vm.startPrank(alice);
        uint256 balanceBefore = mockUSDC.balanceOf(alice);
        vault.withdraw(500e6, alice, alice);
        uint256 balanceAfter = mockUSDC.balanceOf(alice);
        assertEq(balanceAfter - balanceBefore, 500e6);
        vm.stopPrank();
    }
    
    function testVaultMetrics() public {
        // Setup vault with strategies and assets
        vm.startPrank(owner);
        vault.addStrategy(makeAddr("strategy1"), 3000, bytes32("Conservative"), 400, 2000, 0);
        vault.addStrategy(makeAddr("strategy2"), 4000, bytes32("Moderate"), 600, 5000, 0);
        vm.stopPrank();
        
        vm.startPrank(alice);
        mockUSDC.approve(address(vault), 2000e6);
        vault.deposit(2000e6, alice);
        vm.stopPrank();
        
        // Get vault metrics
        (
            uint256 totalVaultAssets,
            uint256 totalShares,
            uint256 sharePrice,
            uint256 totalRiskScore,
            uint256 lastRebalanceTime
        ) = vault.getVaultMetrics();
        
        assertEq(totalVaultAssets, 2000e6);
        assertGt(totalShares, 0);
        assertGe(sharePrice, PRICE_PRECISION / 2); // Share price shouldn't be too low
        assertLe(sharePrice, PRICE_PRECISION * 2); // Share price shouldn't be too high
        
        // Risk score calculation: (riskScore * allocation) / MAX_ALLOCATION
        // Strategy 1: (2000 * 3000) / 10000 = 600
        // Strategy 2: (5000 * 4000) / 10000 = 2000
        // Total: 600 + 2000 = 2600
        uint256 expectedRiskScore = (2000 * 3000) / 10000 + (5000 * 4000) / 10000;
        assertEq(totalRiskScore, expectedRiskScore);
        
        assertGt(lastRebalanceTime, 0);
    }
    
    function testInvariantTotalAssetsCorrect() public {
        // Setup and deposit
        vm.startPrank(alice);
        mockUSDC.approve(address(vault), 1000e6);
        vault.deposit(1000e6, alice);
        vm.stopPrank();
        
        // Total assets should equal USDC balance since no strategies are funded yet
        uint256 expectedTotal = mockUSDC.balanceOf(address(vault));
        assertEq(vault.totalAssets(), expectedTotal);
    }
    
    function testMultiUserDepositsAndWithdrawals() public {
        // Alice deposits
        vm.startPrank(alice);
        mockUSDC.approve(address(vault), 2000e6);
        uint256 aliceShares = vault.deposit(2000e6, alice);
        vm.stopPrank();
        
        // Bob deposits
        vm.startPrank(bob);
        mockUSDC.approve(address(vault), 1000e6);
        uint256 bobShares = vault.deposit(1000e6, bob);
        vm.stopPrank();
        
        // Verify total assets and individual balances
        assertEq(vault.totalAssets(), 3000e6);
        assertEq(vault.balanceOf(alice), aliceShares);
        assertEq(vault.balanceOf(bob), bobShares);
        
        // Alice partially withdraws
        vm.startPrank(alice);
        uint256 halfShares = aliceShares / 2;
        uint256 withdrawnAssets = vault.redeem(halfShares, alice, alice);
        vm.stopPrank();
        
        // Verify Alice's remaining balance and total assets
        assertEq(vault.balanceOf(alice), aliceShares - halfShares);
        assertApproxEqAbs(vault.totalAssets(), 3000e6 - withdrawnAssets, 1); // Small rounding tolerance
        
        // Bob withdraws all
        vm.startPrank(bob);
        vault.redeem(bobShares, bob, bob);
        vm.stopPrank();
        
        assertEq(vault.balanceOf(bob), 0);
    }
    
    function testFuzzDeposit(uint256 depositAmount) public {
        // Bound deposit amount to reasonable range
        depositAmount = bound(depositAmount, 1e6, 1000000e6); // $1 to $1M
        
        vm.startPrank(alice);
        deal(address(mockUSDC), alice, depositAmount);
        mockUSDC.approve(address(vault), depositAmount);
        
        uint256 sharesBefore = vault.balanceOf(alice);
        vault.deposit(depositAmount, alice);
        uint256 sharesAfter = vault.balanceOf(alice);
        
        assertGt(sharesAfter, sharesBefore);
        assertEq(vault.totalAssets(), depositAmount);
        
        vm.stopPrank();
    }
} 