// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockVRFCoordinator {
    event RandomWordsRequested(bytes32 indexed requestId, address indexed requester);

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

    // Simulate VRF callback
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