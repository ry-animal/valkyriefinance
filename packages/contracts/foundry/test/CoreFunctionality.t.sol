// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/ValkyrieVault.sol";
import "../src/ValkyriePriceOracle.sol";
import "../src/ValkyrieToken.sol";
import "./MockUSDC.sol";

/**
 * @title CoreFunctionalityTest
 * @dev Test suite for core AI vault functionality without complex dependencies
 */
contract CoreFunctionalityTest is Test {
    ValkyrieVault public vault;
    ValkyriePriceOracle public priceOracle;
    ValkyrieToken public valkToken;
    MockUSDC public usdc;

    // Test accounts
    address public owner;
    address public alice;
    address public bob;
    address public feeRecipient;

    // Test constants
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**6; // 1M USDC
    uint256 public constant TEST_AMOUNT = 1000 * 10**6; // 1k USDC



    function setUp() public {
        // Setup accounts
        owner = address(this);
        alice = address(0x1);
        bob = address(0x2);
        feeRecipient = address(0x3);

        // Deploy contracts
        usdc = new MockUSDC();
        valkToken = new ValkyrieToken("Valkyrie", "VALK", INITIAL_SUPPLY, owner);
        priceOracle = new ValkyriePriceOracle();

        vault = new ValkyrieVault(
            IERC20(address(usdc)),
            "Valkyrie Vault Shares",
            "VALKS",
            owner,
            feeRecipient,
            address(priceOracle)
        );

        // Setup strategies
        vault.addStrategy(
            address(0x10),
            5000, // 50%
            "Conservative DeFi",
            500,  // 5% APY
            500,  // 5% risk
            0     // Local chain
        );

        vault.addStrategy(
            address(0x20),
            3000, // 30%
            "Yield Farming",
            750,  // 7.5% APY
            750,  // 7.5% risk
            0     // Local chain
        );

        // Fund test accounts
        usdc.transfer(alice, TEST_AMOUNT * 10);
        usdc.transfer(bob, TEST_AMOUNT * 10);

        // Setup allowances
        vm.prank(alice);
        usdc.approve(address(vault), type(uint256).max);

        vm.prank(bob);
        usdc.approve(address(vault), type(uint256).max);
    }

    // ===== Basic Vault Tests =====

    function test_VaultInitialization() public {
        assertEq(vault.name(), "Valkyrie Vault Shares");
        assertEq(vault.symbol(), "VALKS");
        assertEq(address(vault.asset()), address(usdc));
        assertEq(vault.owner(), owner);
        assertEq(vault.totalAssets(), 0);
        // Vault should have dead shares minted for inflation attack protection
        assertEq(vault.totalSupply(), 1000); // DEAD_SHARES
        assertEq(vault.effectiveTotalSupply(), 0); // User-facing supply should be 0
    }

    function test_Deposit() public {
        vm.prank(alice);
        uint256 shares = vault.deposit(TEST_AMOUNT, alice);

        assertEq(vault.balanceOf(alice), shares);
        assertEq(vault.totalAssets(), TEST_AMOUNT);
        assertGt(shares, 0);
    }

    function test_Withdraw() public {
        // First deposit
        vm.prank(alice);
        uint256 shares = vault.deposit(TEST_AMOUNT, alice);

        // Then withdraw
        vm.prank(alice);
        uint256 assets = vault.redeem(shares / 2, alice, alice);

        assertGt(assets, 0);
        assertEq(vault.balanceOf(alice), shares / 2);
    }

    function test_MultipleUsers() public {
        // Alice deposits
        vm.prank(alice);
        uint256 aliceShares = vault.deposit(TEST_AMOUNT, alice);

        // Bob deposits
        vm.prank(bob);
        uint256 bobShares = vault.deposit(TEST_AMOUNT * 2, bob);

        assertEq(vault.balanceOf(alice), aliceShares);
        assertEq(vault.balanceOf(bob), bobShares);
        assertEq(vault.totalAssets(), TEST_AMOUNT * 3);
    }

    // ===== Strategy Management Tests =====

    function test_AddStrategy() public {
        uint256 strategyCount = vault.strategyCount();

        vault.addStrategy(
            address(0x30),
            2000, // 20%
            "New Strategy",
            600,  // 6% APY
            600,  // 6% risk
            0     // Local chain
        );

        assertEq(vault.strategyCount(), strategyCount + 1);

        ValkyrieVault.Strategy memory strategy = vault.getStrategy(strategyCount);
        assertEq(strategy.strategyAddress, address(0x30));
        assertEq(strategy.allocation, 2000);
        assertEq(strategy.name, "New Strategy");
        assertEq(strategy.riskScore, 600);
        assertTrue(strategy.isActive);
    }

    function test_Rebalance() public {
        // Add some assets to vault
        vm.prank(alice);
        vault.deposit(TEST_AMOUNT, alice);

        // Create new allocation
        uint256[] memory newAllocations = new uint256[](2);
        newAllocations[0] = 4000; // 40%
        newAllocations[1] = 4000; // 40%

        // Rebalance
        vault.rebalanceStrategy(newAllocations);

        // Check strategies were updated
        ValkyrieVault.Strategy memory strategy1 = vault.getStrategy(0);
        ValkyrieVault.Strategy memory strategy2 = vault.getStrategy(1);

        assertEq(strategy1.allocation, 4000);
        assertEq(strategy2.allocation, 4000);
    }

    // ===== AI Configuration Tests =====

    function test_UpdateAIConfig() public {
        ValkyrieVault.AIStrategyConfig memory newConfig = ValkyrieVault.AIStrategyConfig({
            rebalanceThreshold: 300,    // 3%
            riskThreshold: 8000,        // 80%
            maxLeverage: 20000,         // 2x
            confidenceThreshold: 7500,  // 75%
            aiControlEnabled: true,
            emergencyPauseEnabled: true
        });

        vault.updateAIConfig(newConfig);

        ValkyrieVault.AIStrategyConfig memory config = vault.getAIConfig();
        assertEq(config.rebalanceThreshold, 300);
        assertEq(config.riskThreshold, 8000);
        assertEq(config.maxLeverage, 20000);
    }

    function test_SetAIController() public {
        address newController = address(0x50);

        vm.expectEmit(true, true, false, false);
        emit ValkyrieVault.AIControllerUpdated(address(0), newController);

        vault.setAIController(newController);
        assertEq(vault.aiController(), newController);
    }

    // ===== Emergency Functions Tests =====

    function test_EmergencyPause() public {
        vault.pauseDeposits();
        assertTrue(vault.paused());

        // Should revert on deposit
        vm.prank(alice);
        vm.expectRevert();
        vault.deposit(TEST_AMOUNT, alice);
    }

    function test_EmergencyWithdrawals() public {
        // First deposit
        vm.prank(alice);
        uint256 shares = vault.deposit(TEST_AMOUNT, alice);

        // Enable emergency mode
        vault.enableEmergencyWithdrawals();
        assertTrue(vault.emergencyMode());

        // Should still allow withdrawals
        vm.prank(alice);
        vault.redeem(shares, alice, alice);
    }

    // ===== Access Control Tests =====

    function test_OnlyOwnerFunctions() public {
        vm.prank(alice);
        vm.expectRevert();
        vault.addStrategy(address(0x40), 1000, "Test", 500, 500, 0);

        vm.prank(alice);
        vm.expectRevert();
        vault.setAIController(address(0x50));
    }

    // ===== Performance Tests =====

    function test_VaultMetrics() public {
        // Add assets
        vm.prank(alice);
        vault.deposit(TEST_AMOUNT, alice);

        (
            uint256 totalVaultAssets,
            uint256 totalShares,
            uint256 sharePrice,
            uint256 totalRiskScore,
            uint256 lastRebalanceTime
        ) = vault.getVaultMetrics();

        assertEq(totalVaultAssets, TEST_AMOUNT);
        assertGt(totalShares, 0);
        assertGt(sharePrice, 0);
        assertGt(totalRiskScore, 0);
        assertGt(lastRebalanceTime, 0);
    }

    // ===== Fuzz Tests =====

    function testFuzz_Deposit(uint256 amount) public {
        // Bound to reasonable minimum to avoid security checks for tiny amounts
        amount = bound(amount, 1e6, usdc.balanceOf(alice)); // Minimum 1 USDC (6 decimals)

        vm.prank(alice);
        uint256 shares = vault.deposit(amount, alice);

        assertGt(shares, 0);
        assertEq(vault.totalAssets(), amount);
    }

    function testFuzz_Rebalance(uint256 alloc1, uint256 alloc2) public {
        alloc1 = bound(alloc1, 0, 5000);
        alloc2 = bound(alloc2, 0, 5000);

        // Ensure total allocation doesn't exceed 100%
        if (alloc1 + alloc2 > 10000) {
            alloc2 = 10000 - alloc1;
        }

        uint256[] memory allocations = new uint256[](2);
        allocations[0] = alloc1;
        allocations[1] = alloc2;

        vault.rebalanceStrategy(allocations);

        ValkyrieVault.Strategy memory strategy1 = vault.getStrategy(0);
        ValkyrieVault.Strategy memory strategy2 = vault.getStrategy(1);

        assertEq(strategy1.allocation, alloc1);
        assertEq(strategy2.allocation, alloc2);
    }

    // ===== Invariant Tests =====

    function invariant_totalAssetsMatchesBalance() public {
        assertLe(vault.totalAssets(), usdc.balanceOf(address(vault)) + 1000000); // Allow for strategy assets
    }

    function invariant_totalSupplyNeverExceedsAssets() public {
        // Account for dead shares: effective supply should not exceed assets
        uint256 effectiveSupply = vault.effectiveTotalSupply();
        if (effectiveSupply > 0) {
            assertGe(vault.totalAssets(), effectiveSupply / 1000); // Conservative bound
        }
    }
}
