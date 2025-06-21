// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MockVRFCoordinator
 * @author Valkyrie Finance Team
 * @notice Mock Chainlink VRF Coordinator for testing verifiable random number generation
 * @dev Simplified VRF coordinator that provides deterministic randomness for testing purposes
 * This contract simulates Chainlink VRF behavior without requiring actual VRF subscriptions
 * @custom:security-contact security@valkyrie.finance
 */
contract MockVRFCoordinator {
    /**
     * @notice Emitted when randomness is requested
     * @param requestId Unique identifier for the randomness request
     * @param requester Address that requested the randomness
     */
    event RandomWordsRequested(bytes32 indexed requestId, address indexed requester);

    /**
     * @notice Requests verifiable random words (mock implementation)
     * @dev Simulates Chainlink VRF request and returns a deterministic request ID
     * Parameters: keyHash (unused), subId (unused), minConfirmations (unused),
     * callbackGasLimit (unused), numWords (unused - always returns 1)
     * @return requestId Unique identifier for tracking this randomness request
     */
    function requestRandomWords(
        bytes32, // keyHash
        uint64,  // subId
        uint16,  // minConfirmations
        uint32,  // callbackGasLimit
        uint32   // numWords
    ) external returns (bytes32 requestId) {
        requestId = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        emit RandomWordsRequested(requestId, msg.sender);
        return requestId;
    }

    /**
     * @notice Simulates VRF fulfillment by calling the consumer contract
     * @dev Manually triggers the randomness fulfillment for testing purposes
     * This function generates pseudo-random words and calls the consumer's callback
     * @param requestId The request ID to fulfill
     * @param consumer The contract address that requested randomness
     */
    function fulfillRandomWords(bytes32 requestId, address consumer) external {
        uint256[] memory randomWords = new uint256[](1);
        randomWords[0] = uint256(keccak256(abi.encodePacked(requestId, blockhash(block.number - 1))));
        (bool ok,) = consumer.call(
            abi.encodeWithSignature(
                "rawFulfillRandomWords(bytes32,uint256[])", requestId, randomWords
            )
        );
        require(ok, "Callback failed");
    }
}
