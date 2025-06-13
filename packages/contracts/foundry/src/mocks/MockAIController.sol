// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockAIController {
    event AIRebalanceTriggered(address indexed vault, uint256[] newAllocations);

    function triggerRebalance(address vault, uint256[] calldata newAllocations) external {
        emit AIRebalanceTriggered(vault, newAllocations);
    }
} 