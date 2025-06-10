// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {ValkryieToken} from "../src/ValkryieToken.sol";
import {ValkryieVault} from "../src/ValkryieVault.sol";
import {ValkryiePriceOracle} from "../src/ValkryiePriceOracle.sol";

contract GasOptimizationTest is Test {
    ValkryieToken public token;
    ValkryieVault public vault;
    
    address public owner = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);
    address public feeRecipient = address(0x4);
    
    address[] public users;
    
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 1e18;
    uint256 public constant TEST_AMOUNT = 1000 * 1e18;
    
    function setUp() public {
        // Label addresses for better debugging (foundry best practice)
        vm.label(owner, "Owner");
        vm.label(user1, "User1");
        vm.label(user2, "User2");
        vm.label(feeRecipient, "FeeRecipient");
        
        vm.prank(owner);
        token = new ValkryieToken("Valkryie Token", "VLK", INITIAL_SUPPLY * 10, owner);
        
        // Deploy a simple price oracle for testing
        ValkryiePriceOracle priceOracle = new ValkryiePriceOracle();
        
        vm.prank(owner);
        vault = new ValkryieVault(
            token,
            "Gas Test Vault",
            "gVLK",
            owner,
            feeRecipient,
            address(priceOracle),
            address(0), // VRF Coordinator (disabled for testing)
            address(0)  // CCIP Router (disabled for testing)
        );
        
        // Setup users with tokens (using startPrank for efficiency)
        vm.startPrank(owner);
        token.transfer(user1, INITIAL_SUPPLY);
        token.transfer(user2, INITIAL_SUPPLY);
        
        // Setup additional test users
        users.push(user1);
        users.push(user2);
        users.push(address(0x5));
        vm.label(users[2], "User3");
        
        token.transfer(users[2], INITIAL_SUPPLY);
        vm.stopPrank();
        
        // Pre-approve vault for gas testing efficiency (best practice)
        vm.prank(user1);
        token.approve(address(vault), type(uint256).max);
        vm.prank(user2);
        token.approve(address(vault), type(uint256).max);
        vm.prank(users[2]);
        token.approve(address(vault), type(uint256).max);
    }
    
    // ===== Token Gas Tests =====
    
    function test_GasTokenTransfer() public {
        vm.prank(user1);
        uint256 gasStart = gasleft();
        token.transfer(user2, TEST_AMOUNT);
        uint256 gasUsed = gasStart - gasleft();
        
        console.log("Gas used for token transfer:", gasUsed);
        assertLt(gasUsed, 100_000, "Token transfer should use less than 100k gas");
    }
    
    function test_GasTokenApprove() public {
        vm.prank(user1);
        uint256 gasStart = gasleft();
        token.approve(address(vault), TEST_AMOUNT);
        uint256 gasUsed = gasStart - gasleft();
        
        console.log("Gas used for token approval:", gasUsed);
        assertLt(gasUsed, 100_000, "Token approval should use less than 100k gas");
    }
    
    function test_GasTokenStake() public {
        vm.prank(user1);
        uint256 gasStart = gasleft();
        token.stake(TEST_AMOUNT);
        uint256 gasUsed = gasStart - gasleft();
        
        console.log("Gas used for token staking:", gasUsed);
        assertLt(gasUsed, 150_000, "Token staking should use less than 150k gas");
    }
    
    function test_GasTokenUnstake() public {
        vm.startPrank(user1);
        token.stake(TEST_AMOUNT);
        
        uint256 gasStart = gasleft();
        token.unstake(TEST_AMOUNT);
        uint256 gasUsed = gasStart - gasleft();
        vm.stopPrank();
        
        console.log("Gas used for token unstaking:", gasUsed);
        assertLt(gasUsed, 100_000, "Token unstaking should use less than 100k gas");
    }
    
    function test_GasTokenClaimRewards() public {
        vm.prank(user1);
        token.stake(TEST_AMOUNT);
        
        // Advance time to accrue rewards
        vm.warp(block.timestamp + 30 days);
        
        vm.prank(user1);
        uint256 gasStart = gasleft();
        token.claimRewards();
        uint256 gasUsed = gasStart - gasleft();
        
        console.log("Gas used for claiming rewards:", gasUsed);
        assertLt(gasUsed, 80_000, "Claiming rewards should use less than 80k gas");
    }
    
    // ===== Vault Gas Tests =====
    
    function test_GasVaultDeposit() public {
        vm.startPrank(user1);
        token.approve(address(vault), TEST_AMOUNT);
        
        uint256 gasStart = gasleft();
        vault.deposit(TEST_AMOUNT, user1);
        uint256 gasUsed = gasStart - gasleft();
        
        console.log("Gas used for vault deposit:", gasUsed);
        assertLt(gasUsed, 120_000, "Vault deposit should use less than 120k gas");
        vm.stopPrank();
    }
    
    function test_GasVaultWithdraw() public {
        vm.startPrank(user1);
        token.approve(address(vault), TEST_AMOUNT);
        vault.deposit(TEST_AMOUNT, user1);
        
        uint256 gasStart = gasleft();
        vault.withdraw(TEST_AMOUNT / 2, user1, user1);
        uint256 gasUsed = gasStart - gasleft();
        
        console.log("Gas used for vault withdrawal:", gasUsed);
        assertLt(gasUsed, 100_000, "Vault withdrawal should use less than 100k gas");
        vm.stopPrank();
    }
    
    function test_GasVaultMint() public {
        vm.startPrank(user1);
        token.approve(address(vault), TEST_AMOUNT);
        
        uint256 shares = vault.previewMint(TEST_AMOUNT);
        
        uint256 gasStart = gasleft();
        vault.mint(shares, user1);
        uint256 gasUsed = gasStart - gasleft();
        
        console.log("Gas used for vault mint:", gasUsed);
        assertLt(gasUsed, 120_000, "Vault mint should use less than 120k gas");
        vm.stopPrank();
    }
    
    function test_GasVaultRedeem() public {
        vm.startPrank(user1);
        token.approve(address(vault), TEST_AMOUNT);
        uint256 shares = vault.deposit(TEST_AMOUNT, user1);
        
        uint256 gasStart = gasleft();
        vault.redeem(shares / 2, user1, user1);
        uint256 gasUsed = gasStart - gasleft();
        
        console.log("Gas used for vault redeem:", gasUsed);
        assertLt(gasUsed, 100_000, "Vault redeem should use less than 100k gas");
        vm.stopPrank();
    }
    
    // ===== Administrative Gas Tests =====
    
    function test_GasAddStrategy() public {
        vm.prank(owner);
        uint256 gasStart = gasleft();
        vault.addStrategy(address(0x5), 5000, "Test Strategy", 1000, 5000, 0);
        uint256 gasUsed = gasStart - gasleft();
        
        console.log("Gas used for adding strategy:", gasUsed);
        assertLt(gasUsed, 200_000, "Adding strategy should use less than 200k gas");
    }
    
    function test_GasUpdateStrategy() public {
        vm.prank(owner);
        vault.addStrategy(address(0x5), 5000, "Test Strategy", 1000, 5000, 0);
        
        // Note: updateStrategy function doesn't exist in ValkryieVault
        // This test would need to be updated when that function is implemented
        // For now, we'll test adding another strategy as a workaround
        vm.prank(owner);
        uint256 gasStart = gasleft();
        vault.addStrategy(address(0x6), 3000, "Test Strategy 2", 800, 4000, 0);
        uint256 gasUsed = gasStart - gasleft();
        
        console.log("Gas used for adding second strategy:", gasUsed);
        assertLt(gasUsed, 200_000, "Adding second strategy should use less than 200k gas");
    }
    
    function test_GasRebalance() public {
        vm.startPrank(owner);
        vault.addStrategy(address(0x5), 5000, "Test Strategy 1", 1000, 5000, 0);
        vault.addStrategy(address(0x6), 3000, "Test Strategy 2", 800, 4000, 0);
        
        uint256[] memory newAllocations = new uint256[](2);
        newAllocations[0] = 4000;
        newAllocations[1] = 4000;
        
        uint256 gasStart = gasleft();
        vault.rebalanceStrategy(newAllocations);
        uint256 gasUsed = gasStart - gasleft();
        vm.stopPrank();
        
        console.log("Gas used for rebalancing 2 strategies:", gasUsed);
        assertLt(gasUsed, 200_000, "Rebalancing should use less than 200k gas");
    }
    
    function test_GasSetRewardRate() public {
        vm.prank(owner);
        uint256 gasStart = gasleft();
        token.setRewardRate(500);
        uint256 gasUsed = gasStart - gasleft();
        
        console.log("Gas used for setting reward rate:", gasUsed);
        assertLt(gasUsed, 100_000, "Setting reward rate should use less than 100k gas");
    }
    
    // ===== Batch Operations Gas Tests =====
    
    function test_GasBatchDeposits() public {
        vm.startPrank(user1);
        token.approve(address(vault), TEST_AMOUNT * 5);
        
        uint256 gasStart = gasleft();
        
        // 5 sequential deposits
        for (uint i = 0; i < 5; i++) {
            vault.deposit(TEST_AMOUNT / 5, user1);
        }
        
        uint256 gasUsed = gasStart - gasleft();
        uint256 avgGasPerDeposit = gasUsed / 5;
        
        console.log("Average gas per deposit in batch:", avgGasPerDeposit);
        console.log("Total gas for 5 deposits:", gasUsed);
        
        // First deposit is more expensive, subsequent ones should be cheaper
        assertTrue(avgGasPerDeposit < 100_000);
        vm.stopPrank();
    }
    
    function test_GasBatchStaking() public {
        vm.startPrank(user1);
        
        uint256 gasStart = gasleft();
        
        // 5 sequential stakes
        for (uint i = 0; i < 5; i++) {
            token.stake(TEST_AMOUNT / 5);
        }
        
        uint256 gasUsed = gasStart - gasleft();
        uint256 avgGasPerStake = gasUsed / 5;
        
        console.log("Average gas per stake in batch:", avgGasPerStake);
        console.log("Total gas for 5 stakes:", gasUsed);
        
        assertTrue(avgGasPerStake < 80_000);
        vm.stopPrank();
    }
    
    // ===== Complex Scenario Gas Tests =====
    
    function test_GasCompleteUserFlow() public {
        vm.startPrank(user1);
        
        uint256 gasStart = gasleft();
        
        // 1. Approve tokens
        token.approve(address(vault), TEST_AMOUNT);
        
        // 2. Deposit to vault
        vault.deposit(TEST_AMOUNT, user1);
        
        // 3. Stake some tokens separately
        token.stake(TEST_AMOUNT);
        
        // 4. Wait and claim rewards
        vm.warp(block.timestamp + 30 days);
        token.claimRewards();
        
        // 5. Withdraw from vault
        vault.withdraw(TEST_AMOUNT / 2, user1, user1);
        
        uint256 gasUsed = gasStart - gasleft();
        
        console.log("Gas used for complete user flow:", gasUsed);
        console.log("Average gas per operation:", gasUsed / 5);
        
        assertTrue(gasUsed < 500_000); // Reasonable total for all operations
        vm.stopPrank();
    }
    
    function test_GasMultiUserScenario() public {
        // Setup multiple users
        address[] memory testUsers = new address[](3);
        testUsers[0] = user1;
        testUsers[1] = user2;
        testUsers[2] = address(0x7);
        
        vm.prank(owner);
        token.transfer(testUsers[2], INITIAL_SUPPLY);
        
        uint256 gasStart = gasleft();
        
        // Each user deposits
        for (uint i = 0; i < testUsers.length; i++) {
            vm.startPrank(testUsers[i]);
            token.approve(address(vault), TEST_AMOUNT);
            vault.deposit(TEST_AMOUNT, testUsers[i]);
            vm.stopPrank();
        }
        
        uint256 gasUsed = gasStart - gasleft();
        uint256 avgGasPerUser = gasUsed / 3;
        
        console.log("Average gas per user deposit:", avgGasPerUser);
        console.log("Total gas for 3 user deposits:", gasUsed);
        
        assertTrue(avgGasPerUser < 132_000);
    }
    
    // ===== Gas Optimization Benchmarks =====
    
    function test_GasCompareDepositVsMint() public {
        vm.startPrank(user1);
        token.approve(address(vault), TEST_AMOUNT * 2);
        
        // Test deposit
        uint256 gasStart1 = gasleft();
        vault.deposit(TEST_AMOUNT, user1);
        uint256 gasDeposit = gasStart1 - gasleft();
        
        // Test mint (same economic effect)
        uint256 shares = vault.previewMint(TEST_AMOUNT);
        uint256 gasStart2 = gasleft();
        vault.mint(shares, user1);
        uint256 gasMint = gasStart2 - gasleft();
        
        console.log("Gas for deposit:", gasDeposit);
        console.log("Gas for mint:", gasMint);
        console.log("Gas difference:", gasDeposit > gasMint ? gasDeposit - gasMint : gasMint - gasDeposit);
        
        vm.stopPrank();
    }
    
    function test_GasCompareWithdrawVsRedeem() public {
        vm.startPrank(user1);
        token.approve(address(vault), TEST_AMOUNT);
        uint256 shares = vault.deposit(TEST_AMOUNT, user1);
        
        // Test withdraw half
        uint256 withdrawAmount = TEST_AMOUNT / 2;
        uint256 gasStart1 = gasleft();
        vault.withdraw(withdrawAmount, user1, user1);
        uint256 gasWithdraw = gasStart1 - gasleft();
        
        // Test redeem remaining
        uint256 remainingShares = vault.balanceOf(user1);
        uint256 gasStart2 = gasleft();
        vault.redeem(remainingShares, user1, user1);
        uint256 gasRedeem = gasStart2 - gasleft();
        
        console.log("Gas for withdraw:", gasWithdraw);
        console.log("Gas for redeem:", gasRedeem);
        console.log("Gas difference:", gasWithdraw > gasRedeem ? gasWithdraw - gasRedeem : gasRedeem - gasWithdraw);
        
        vm.stopPrank();
    }
} 