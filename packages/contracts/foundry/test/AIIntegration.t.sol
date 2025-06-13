// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/mocks/MockAIController.sol";

contract AIIntegrationTest is Test {
    MockAIController ai;

    function setUp() public {
        ai = new MockAIController();
    }

    function testAIRebalanceEmitsEvent() public {
        address vault = address(0x1234);
        uint256[] memory allocations = new uint256[](2);
        allocations[0] = 6000;
        allocations[1] = 4000;
        vm.expectEmit(true, false, false, true);
        emit MockAIController.AIRebalanceTriggered(vault, allocations);
        ai.triggerRebalance(vault, allocations);
    }
} 