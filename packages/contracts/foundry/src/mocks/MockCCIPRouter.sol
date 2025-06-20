// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MockCCIPRouter
 * @author Valkyrie Finance Team
 * @notice Mock Chainlink CCIP Router for testing cross-chain communication functionality
 * @dev Simplified CCIP router that simulates cross-chain message passing for development and testing
 * This contract provides basic CCIP functionality without actual cross-chain infrastructure
 * @custom:security-contact security@valkyrie.finance
 */
contract MockCCIPRouter {
    /**
     * @notice Emitted when a cross-chain message is sent
     * @param chainSelector Target chain selector for the message
     * @param receiver Address of the message receiver (simplified to router address in mock)
     * @param data Encoded message data being sent cross-chain
     */
    event CCIPSend(uint64 indexed chainSelector, address indexed receiver, bytes data);

    /**
     * @notice Sends a cross-chain message via CCIP (mock implementation)
     * @dev Simulates CCIP message sending by generating a deterministic message ID and emitting an event
     * This function allows testing of cross-chain logic without actual CCIP infrastructure
     * @param chainSelector Target blockchain's chain selector identifier
     * @param message Encoded message data to send to the target chain
     * @return messageId Unique identifier for tracking this cross-chain message
     */
    function ccipSend(
        uint64 chainSelector,
        bytes calldata message
    ) external returns (bytes32 messageId) {
        messageId = keccak256(abi.encodePacked(msg.sender, chainSelector, message, block.timestamp));
        emit CCIPSend(chainSelector, address(this), message);
    }
}
