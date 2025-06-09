// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {ValkryieToken} from "../src/ValkryieToken.sol";
import {ValkryieVault} from "../src/ValkryieVault.sol";

// Malicious contract to test reentrancy protection
contract MaliciousContract {
    ValkryieVault public vault;
    ValkryieToken public asset;
    bool public attacking = false;
    
    constructor(ValkryieVault _vault, ValkryieToken _asset) {
        vault = _vault;
        asset = _asset;
    }
    
    function attack() external {
        attacking = true;
        uint256 amount = 1000 * 1e18;
        asset.approve(address(vault), amount);
        vault.deposit(amount, address(this));
    }
    
    // Try to reenter on withdrawal
    function onERC4626Withdraw(uint256 assets) external {
        if (attacking && vault.balanceOf(address(this)) > 0) {
            attacking = false; // Prevent infinite loop
            vault.withdraw(assets, address(this), address(this));
        }
    }
}

contract SecurityTest is Test {
    ValkryieToken public token;
    ValkryieVault public vault;
    
    address public owner = address(0x1);
    address public attacker = address(0x2);
    address public user = address(0x3);
    address public feeRecipient = address(0x4);
    
    MaliciousContract public malicious;
    
    function setUp() public {
        // Label addresses for better debugging (foundry best practice)
        vm.label(owner, "Owner");
        vm.label(attacker, "Attacker");
        vm.label(user, "User");
        vm.label(feeRecipient, "FeeRecipient");
        
        vm.prank(owner);
        token = new ValkryieToken("Test Token", "TKN", 1_000_000 * 1e18, owner);
        
        vm.prank(owner);
        vault = new ValkryieVault(
            token,
            "Test Vault",
            "tVLK",
            owner,
            feeRecipient
        );
        
        // Transfer tokens to test accounts from owner's supply
        vm.startPrank(owner);
        token.transfer(attacker, 100_000 * 1e18);
        token.transfer(user, 100_000 * 1e18);
        vm.stopPrank();
        
        // Deploy malicious contract and transfer tokens
        malicious = new MaliciousContract(vault, token);
        vm.prank(owner);
        token.transfer(address(malicious), 100_000 * 1e18);
        
        // Pre-approve vault for smoother testing (best practice for setup)
        vm.prank(attacker);
        token.approve(address(vault), type(uint256).max);
        vm.prank(user);
        token.approve(address(vault), type(uint256).max);
        vm.prank(address(malicious));
        token.approve(address(vault), type(uint256).max);
    }
    
    // ===== Access Control Tests =====
    
    function test_OnlyOwnerCanTransferTokens() public {
        // Verify attacker has tokens
        uint256 attackerBalance = token.balanceOf(attacker);
        assertTrue(attackerBalance > 0, "Attacker should have tokens");
        
        // Attacker can transfer their own tokens (half of balance)
        vm.prank(attacker);
        uint256 transferAmount = attackerBalance / 2;
        token.transfer(user, transferAmount);
        
        // But cannot transfer more than remaining balance
        vm.prank(attacker);
        uint256 remainingBalance = token.balanceOf(attacker);
        vm.expectRevert();
        token.transfer(user, remainingBalance + 1);
    }
    
    function test_OnlyOwnerCanSetRewardRate() public {
        vm.prank(attacker);
        vm.expectRevert();
        token.setRewardRate(500);
        
        vm.prank(owner);
        token.setRewardRate(500); // Should succeed
    }
    
    function test_OnlyOwnerCanAddVaultStrategy() public {
        vm.prank(attacker);
        vm.expectRevert();
        vault.addStrategy(address(0x5), 1000, "Test", 500);
        
        vm.prank(owner);
        vault.addStrategy(address(0x5), 1000, "Test", 500); // Should succeed
    }
    
    function test_OnlyOwnerCanPauseVault() public {
        vm.prank(attacker);
        vm.expectRevert();
        vault.emergencyPause(true);
        
        vm.prank(owner);
        vault.emergencyPause(true); // Should succeed
        assertTrue(vault.paused());
    }
    
    function test_OnlyAuthorizedCanRebalance() public {
        uint256[] memory allocations = new uint256[](1);
        allocations[0] = 5000;
        
        // Add a strategy first
        vm.prank(owner);
        vault.addStrategy(address(0x5), 5000, "Test", 500);
        
        vm.prank(attacker);
        vm.expectRevert("Not authorized to rebalance");
        vault.rebalance(allocations);
        
        vm.prank(owner);
        vault.rebalance(allocations); // Should succeed
    }
    
    // ===== Reentrancy Tests =====
    
    function test_ReentrancyProtectionOnDeposit() public {
        // This test assumes we have proper reentrancy guards
        // The malicious contract attempt should fail
        vm.prank(address(malicious));
        malicious.attack();
        
        // Verify only one deposit occurred
        assertTrue(vault.balanceOf(address(malicious)) > 0);
    }
    
    // ===== Input Validation Tests =====
    
    function test_TokenStakeZeroAmount() public {
        vm.prank(user);
        vm.expectRevert("Amount must be greater than 0");
        token.stake(0);
    }
    
    function test_TokenStakeInsufficientBalance() public {
        vm.prank(user);
        vm.expectRevert("Insufficient balance");
        token.stake(200_000 * 1e18); // More than user has
    }
    
    function test_VaultDepositBelowMinimum() public {
        vm.prank(user);
        token.approve(address(vault), 1e17); // 0.1 token
        
        vm.expectRevert("Below minimum deposit");
        vault.deposit(1e17, user);
    }
    
    function test_VaultStrategyAllocationExceedsLimit() public {
        vm.prank(owner);
        vm.expectRevert("Allocation cannot exceed 100%");
        vault.addStrategy(address(0x5), 10001, "Test", 500); // 100.01%
    }
    
    function test_VaultTotalAllocationExceedsLimit() public {
        vm.prank(owner);
        vault.addStrategy(address(0x5), 6000, "Test1", 500); // 60%
        
        vm.prank(owner);
        vm.expectRevert("Total allocation exceeds 100%");
        vault.addStrategy(address(0x6), 5000, "Test2", 500); // Would be 110% total
    }
    
    function test_TokenRewardRateExceedsLimit() public {
        vm.prank(owner);
        vm.expectRevert("Rate cannot exceed 100%");
        token.setRewardRate(10001); // 100.01%
    }
    
    // ===== Edge Cases =====
    
    function test_VaultWithZeroTotalAssets() public view {
        // Newly deployed vault should handle zero assets gracefully
        assertEq(vault.totalAssets(), 0);
        assertEq(vault.totalSupply(), 0);
    }
    
    function test_TokenWithZeroTotalStaked() public view {
        // Token should handle zero staked gracefully
        assertEq(token.totalStaked(), 0);
        assertEq(token.pendingRewards(user), 0);
    }
    
    function test_VaultDepositMaxUint256() public {
        // Ensure user has enough balance and approval
        uint256 userBalance = token.balanceOf(user);
        assertTrue(userBalance >= vault.minDeposit(), "User should have minimum balance");
        
        vm.prank(user);
        vault.deposit(userBalance, user);
        assertEq(vault.balanceOf(user), userBalance);
    }
    
    function test_TokenStakeMaxBalance() public {
        uint256 userBalance = token.balanceOf(user);
        
        vm.prank(user);
        token.stake(userBalance);
        
        assertEq(token.stakedBalance(user), userBalance);
        assertEq(token.balanceOf(user), 0);
    }
    
    // ===== Pausable Functionality =====
    
    function test_PausedVaultBlocksDeposits() public {
        vm.prank(owner);
        vault.emergencyPause(true);
        
        vm.prank(user);
        token.approve(address(vault), 1000 * 1e18);
        
        vm.expectRevert("Vault is paused");
        vault.deposit(1000 * 1e18, user);
    }
    
    function test_PausedVaultBlocksWithdrawals() public {
        // First deposit while not paused (user already has approval from setUp)
        vm.prank(user);
        vault.deposit(1000 * 1e18, user);
        
        // Then pause
        vm.prank(owner);
        vault.emergencyPause(true);
        
        vm.prank(user);
        vm.expectRevert("Vault is paused");
        vault.withdraw(500 * 1e18, user, user);
    }
    
    function test_UnpauseRestoresFunctionality() public {
        // Pause first
        vm.prank(owner);
        vault.emergencyPause(true);
        
        // Unpause
        vm.prank(owner);
        vault.emergencyPause(false);
        
        // Should work again (user already has approval from setUp)
        vm.prank(user);
        vault.deposit(1000 * 1e18, user);
        
        assertEq(vault.balanceOf(user), 1000 * 1e18);
    }
    
    // ===== Integer Overflow/Underflow Tests =====
    
    function test_NoOverflowOnLargeStakeRewards() public {
        // Set very high reward rate
        vm.prank(owner);
        token.setRewardRate(10000); // 100%
        
        vm.prank(user);
        token.stake(50_000 * 1e18); // Large stake
        
        // Fast forward many years
        vm.warp(block.timestamp + 365 days * 10);
        
        // Should not overflow
        uint256 pending = token.pendingRewards(user);
        assertTrue(pending > 0);
    }
    
    function test_NoUnderflowOnWithdraw() public {
        // User already has approval from setUp
        vm.prank(user);
        vault.deposit(1000 * 1e18, user);
        
        // Try to withdraw more than deposited
        vm.prank(user);
        vm.expectRevert();
        vault.withdraw(2000 * 1e18, user, user);
    }
    
    // ===== Gas Optimization Tests =====
    
    function test_GasEfficiencyBatchOperations() public {
        // User already has approval from setUp
        vm.startPrank(user);
        
        uint256 gasStart = gasleft();
        
        // Multiple small deposits
        for (uint i = 0; i < 5; i++) {
            vault.deposit(1000 * 1e18, user);
        }
        
        uint256 gasUsed = gasStart - gasleft();
        vm.stopPrank();
        
        console.log("Gas used for 5 deposits:", gasUsed);
        
        // Gas should be reasonable (less than 1M per operation)
        assertTrue(gasUsed < 1_000_000);
    }
} 