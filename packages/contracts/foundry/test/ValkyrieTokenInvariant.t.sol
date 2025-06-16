// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {StdInvariant} from "forge-std/StdInvariant.sol";
import {ValkyrieToken} from "../src/ValkyrieToken.sol";

contract ValkyrieTokenHandler is Test {
    ValkyrieToken internal token;

    constructor(ValkyrieToken _token) {
        token = _token;
    }

    function stake(uint256 amount) public {
        amount = bound(amount, 1, token.balanceOf(msg.sender));
        if (amount == 0) return;

        vm.prank(msg.sender);
        token.stakeWithTier(amount, 1);
    }

    function unstake(uint256 amount) public {
        amount = bound(amount, 1, token.stakedBalance(msg.sender));
        if (amount == 0) return;
        
        vm.prank(msg.sender);
        token.unstakeWithPenalty(amount);
    }

    function claimRewards() public {
        vm.prank(msg.sender);
        try token.claimRewards() {} catch {}
    }
}

contract ValkyrieTokenInvariantTest is StdInvariant, Test {
    ValkyrieToken internal token;
    ValkyrieTokenHandler internal handler;

    address internal user1 = address(0x2);
    address internal user2 = address(0x3);

    function setUp() public {
        token = new ValkyrieToken("Valkyrie Token", "VLK", 1_000_000e18, address(this));
        token.transfer(user1, 100_000e18);
        token.transfer(user2, 100_000e18);

        handler = new ValkyrieTokenHandler(token);

        // Target the handler and its functions
        bytes4[] memory selectors = new bytes4[](3);
        selectors[0] = ValkyrieTokenHandler.stake.selector;
        selectors[1] = ValkyrieTokenHandler.unstake.selector;
        selectors[2] = ValkyrieTokenHandler.claimRewards.selector;
        
        targetSelector(FuzzSelector({addr: address(handler), selectors: selectors}));
        targetContract(address(handler));
        
        // Target senders
        targetSender(user1);
        targetSender(user2);
    }

    function invariant_TotalSupplyConsistency() public view {
        uint256 totalUserBalances = token.balanceOf(user1) +
                                   token.balanceOf(user2) +
                                   token.balanceOf(address(this));
        uint256 contractBalance = token.balanceOf(address(token));
        
        assertEq(token.totalSupply(), totalUserBalances + contractBalance);
    }

    function invariant_StakedAmountConsistency() public view {
        assertLe(token.totalStaked(), token.totalSupply());
    }
} 