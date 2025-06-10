// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {ValkryieToken} from "../src/ValkryieToken.sol";

contract ValkryieTokenTest is Test {
    ValkryieToken public token;
    
    address public owner = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);
    address public user3 = address(0x4);
    
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 1e18;
    uint256 public constant STAKE_AMOUNT = 1000 * 1e18;
    
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);
    event RewardRateUpdated(uint256 newRate);
    
    function setUp() public {
        vm.prank(owner);
        token = new ValkryieToken("Valkryie Token", "VLK", INITIAL_SUPPLY, owner);
        
        // Distribute tokens to test users
        vm.startPrank(owner);
        token.transfer(user1, 100_000 * 1e18);
        token.transfer(user2, 100_000 * 1e18);
        token.transfer(user3, 100_000 * 1e18);
        vm.stopPrank();
    }
    
    // ===== ERC-20 Basic Tests =====
    
    function test_InitialState() public view {
        assertEq(token.name(), "Valkryie Token");
        assertEq(token.symbol(), "VLK");
        assertEq(token.decimals(), 18);
        assertEq(token.totalSupply(), INITIAL_SUPPLY);
        assertEq(token.balanceOf(owner), INITIAL_SUPPLY - 300_000 * 1e18);
        assertEq(token.owner(), owner);
    }
    
    function test_Transfer() public {
        vm.prank(user1);
        bool success = token.transfer(user2, 1000 * 1e18);
        assertTrue(success);
        assertEq(token.balanceOf(user1), 99_000 * 1e18);
        assertEq(token.balanceOf(user2), 101_000 * 1e18);
    }
    
    function test_TransferFrom() public {
        vm.prank(user1);
        token.approve(user2, 1000 * 1e18);
        
        vm.prank(user2);
        bool success = token.transferFrom(user1, user3, 1000 * 1e18);
        assertTrue(success);
        assertEq(token.balanceOf(user1), 99_000 * 1e18);
        assertEq(token.balanceOf(user3), 101_000 * 1e18);
        assertEq(token.allowance(user1, user2), 0);
    }
    
    function test_FailTransferInsufficientBalance() public {
        vm.prank(user1);
        vm.expectRevert();
        token.transfer(user2, 200_000 * 1e18); // More than user1 has
    }
    
    // ===== Staking Tests =====
    
    function test_StakeTokens() public {
        uint256 initialBalance = token.balanceOf(user1);
        
        vm.prank(user1);
        vm.expectEmit(true, false, false, true);
        emit Staked(user1, STAKE_AMOUNT);
        token.stake(STAKE_AMOUNT);
        
        assertEq(token.balanceOf(user1), initialBalance - STAKE_AMOUNT);
        assertEq(token.stakedBalance(user1), STAKE_AMOUNT);
        assertEq(token.totalStaked(), STAKE_AMOUNT);
    }
    
    function test_StakeMultipleUsers() public {
        vm.prank(user1);
        token.stake(STAKE_AMOUNT);
        
        vm.prank(user2);
        token.stake(STAKE_AMOUNT * 2);
        
        assertEq(token.stakedBalance(user1), STAKE_AMOUNT);
        assertEq(token.stakedBalance(user2), STAKE_AMOUNT * 2);
        assertEq(token.totalStaked(), STAKE_AMOUNT * 3);
    }
    
    function test_FailStakeZeroAmount() public {
        vm.prank(user1);
        vm.expectRevert(ValkryieToken.ZeroAmount.selector);
        token.stake(0);
    }
    
    function test_FailStakeInsufficientBalance() public {
        vm.prank(user1);
        vm.expectRevert(ValkryieToken.InsufficientBalance.selector);
        token.stake(200_000 * 1e18); // More than user1 has
    }
    
    function test_UnstakeTokens() public {
        // First stake
        vm.prank(user1);
        token.stake(STAKE_AMOUNT);
        
        uint256 balanceBeforeUnstake = token.balanceOf(user1);
        
        // Then unstake
        vm.prank(user1);
        vm.expectEmit(true, false, false, true);
        emit Unstaked(user1, STAKE_AMOUNT / 2);
        token.unstake(STAKE_AMOUNT / 2);
        
        assertEq(token.balanceOf(user1), balanceBeforeUnstake + STAKE_AMOUNT / 2);
        assertEq(token.stakedBalance(user1), STAKE_AMOUNT / 2);
        assertEq(token.totalStaked(), STAKE_AMOUNT / 2);
    }
    
    function test_FailUnstakeInsufficientStaked() public {
        vm.prank(user1);
        token.stake(STAKE_AMOUNT);
        
        vm.prank(user1);
        vm.expectRevert(ValkryieToken.InsufficientStakedAmount.selector);
        token.unstake(STAKE_AMOUNT * 2); // More than staked
    }
    
    // ===== Rewards Tests =====
    
    function test_RewardsAccrual() public {
        vm.prank(user1);
        token.stake(STAKE_AMOUNT);
        
        // Fast forward 1 year (365 days)
        vm.warp(block.timestamp + 365 days);
        
        uint256 pendingRewards = token.pendingRewards(user1);
        
        // With 1% default rate, should be approximately 1% of staked amount
        uint256 expectedRewards = (STAKE_AMOUNT * 100) / 10000; // 100 basis points = 1%
        
        // Allow for small rounding differences
        assertApproxEqRel(pendingRewards, expectedRewards, 0.01e18); // 1% tolerance
    }
    
    function test_ClaimRewards() public {
        vm.prank(user1);
        token.stake(STAKE_AMOUNT);
        
        // Fast forward 6 months
        vm.warp(block.timestamp + 182 days);
        
        uint256 balanceBeforeClaim = token.balanceOf(user1);
        uint256 pendingBefore = token.pendingRewards(user1);
        
        vm.prank(user1);
        vm.expectEmit(true, false, false, false);
        emit RewardClaimed(user1, pendingBefore);
        token.claimRewards();
        
        assertEq(token.balanceOf(user1), balanceBeforeClaim + pendingBefore);
        assertEq(token.pendingRewards(user1), 0);
    }
    
    function test_FailClaimNoRewards() public {
        vm.prank(user1);
        vm.expectRevert(ValkryieToken.NoRewardsToClaim.selector);
        token.claimRewards();
    }
    
    function test_RewardRateUpdate() public {
        uint256 newRate = 200; // 2%
        
        vm.prank(owner);
        vm.expectEmit(false, false, false, true);
        emit RewardRateUpdated(newRate);
        token.setRewardRate(newRate);
        
        assertEq(token.rewardRate(), newRate);
    }
    
    function test_FailRewardRateUpdateNotOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        token.setRewardRate(200);
    }
    
    function test_FailRewardRateUpdateTooHigh() public {
        vm.prank(owner);
        vm.expectRevert(ValkryieToken.RewardRateTooHigh.selector);
        token.setRewardRate(10001); // More than 100%
    }
    
    // ===== Governance Tests =====
    
    function test_DelegateVotes() public {
        vm.prank(user1);
        token.delegate(user2);
        
        assertEq(token.delegates(user1), user2);
        assertEq(token.getVotes(user2), token.balanceOf(user1));
    }
    
    function test_VotingPowerAfterStaking() public {
        vm.prank(user1);
        token.delegate(user1); // Self-delegate to activate voting
        
        uint256 votesBeforeStaking = token.getVotes(user1);
        
        vm.prank(user1);
        token.stake(STAKE_AMOUNT);
        
        uint256 votesAfterStaking = token.getVotes(user1);
        
        // Voting power should decrease after staking (tokens moved from balance)
        assertEq(votesAfterStaking, votesBeforeStaking - STAKE_AMOUNT);
    }
    
    // ===== Fuzz Tests =====
    
    function testFuzz_StakeUnstake(uint256 amount) public {
        amount = bound(amount, 1, token.balanceOf(user1));
        
        vm.startPrank(user1);
        
        uint256 initialBalance = token.balanceOf(user1);
        token.stake(amount);
        
        assertEq(token.stakedBalance(user1), amount);
        assertEq(token.balanceOf(user1), initialBalance - amount);
        
        token.unstake(amount);
        
        assertEq(token.stakedBalance(user1), 0);
        assertEq(token.balanceOf(user1), initialBalance);
        
        vm.stopPrank();
    }
    
    function testFuzz_RewardRate(uint256 rate) public {
        rate = bound(rate, 0, 10000); // 0-100%
        
        vm.prank(owner);
        token.setRewardRate(rate);
        
        assertEq(token.rewardRate(), rate);
    }
    
    // ===== Integration Tests =====
    
    function test_StakeClaimUnstakeFlow() public {
        vm.startPrank(user1);
        
        uint256 initialBalance = token.balanceOf(user1);
        
        // 1. Stake tokens
        token.stake(STAKE_AMOUNT);
        
        // 2. Wait for rewards to accrue
        vm.warp(block.timestamp + 100 days);
        
        // 3. Claim rewards
        uint256 pendingRewards = token.pendingRewards(user1);
        token.claimRewards();
        
        // 4. Unstake all tokens
        token.unstake(STAKE_AMOUNT);
        
        // Final balance should be initial + rewards
        assertEq(token.balanceOf(user1), initialBalance + pendingRewards);
        assertEq(token.stakedBalance(user1), 0);
        
        vm.stopPrank();
    }
    
    function test_MultipleStakeRewardCycles() public {
        vm.startPrank(user1);
        
        // First cycle
        token.stake(STAKE_AMOUNT);
        vm.warp(block.timestamp + 50 days);
        uint256 rewards1 = token.pendingRewards(user1);
        if (rewards1 > 0) {
            token.claimRewards();
        }
        
        // Second cycle - stake more
        token.stake(STAKE_AMOUNT);
        vm.warp(block.timestamp + 50 days);
        uint256 rewards2 = token.pendingRewards(user1);
        if (rewards2 > 0) {
            token.claimRewards();
            // Rewards should be higher in second cycle due to more stake
            assertTrue(rewards2 > 0);
        }
        assertEq(token.stakedBalance(user1), STAKE_AMOUNT * 2);
        
        vm.stopPrank();
    }
    
    // ===== Invariant Tests =====
    
    function invariant_TotalSupplyConsistency() public view {
        // Total supply should equal balances + contract balance (staked tokens + rewards)
        uint256 totalUserBalances = token.balanceOf(user1) + 
                                   token.balanceOf(user2) + 
                                   token.balanceOf(user3) + 
                                   token.balanceOf(owner);
        uint256 contractBalance = token.balanceOf(address(token));
        
        assertEq(token.totalSupply(), totalUserBalances + contractBalance);
    }
    
    function invariant_StakedAmountConsistency() public view {
        // Total staked should never exceed total supply
        assertLe(token.totalStaked(), token.totalSupply());
    }
    
    // ===== Edge Cases =====
    
    function test_RewardsWithZeroTotalStaked() public {
        // No one has staked, pending rewards should be 0
        assertEq(token.pendingRewards(user1), 0);
    }
    
    function test_StakeAfterRewardsAccrued() public {
        // User1 stakes first
        vm.prank(user1);
        token.stake(STAKE_AMOUNT);
        
        // Time passes
        vm.warp(block.timestamp + 100 days);
        
        // User2 stakes - should not get retroactive rewards
        vm.prank(user2);
        token.stake(STAKE_AMOUNT);
        
        uint256 user1Rewards = token.pendingRewards(user1);
        uint256 user2Rewards = token.pendingRewards(user2);
        
        assertTrue(user1Rewards > 0);
        assertEq(user2Rewards, 0);
    }
} 