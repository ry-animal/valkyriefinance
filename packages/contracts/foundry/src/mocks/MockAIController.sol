// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MockAIController
 * @author Valkyrie Finance Team
 * @notice Mock AI controller for testing automated vault rebalancing functionality
 * @dev Simple mock that simulates AI-driven rebalancing triggers for development and testing
 * This contract provides a minimal interface for testing vault rebalancing without actual AI logic
 * @custom:security-contact security@valkyrie.finance
 */
contract MockAIController {
    /**
     * @notice Emitted when AI triggers a rebalancing operation
     * @param vault Address of the vault being rebalanced
     * @param newAllocations Array of new allocation percentages for each strategy
     */
    event AIRebalanceTriggered(address indexed vault, uint256[] newAllocations);

    /**
     * @notice Triggers a mock rebalancing operation for testing purposes
     * @dev Simulates AI decision-making by emitting a rebalance event with new allocations
     * This function allows testing of vault rebalancing logic without complex AI integration
     * @param vault Address of the vault to rebalance
     * @param newAllocations Array of new allocation percentages (in basis points) for each strategy
     */
    function triggerRebalance(address vault, uint256[] calldata newAllocations) external {
        emit AIRebalanceTriggered(vault, newAllocations);
    }
}
