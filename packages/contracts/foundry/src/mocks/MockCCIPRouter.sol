// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockCCIPRouter {
    event CCIPSend(uint64 indexed chainSelector, address indexed receiver, bytes data);

    function ccipSend(
        uint64 chainSelector,
        bytes calldata message
    ) external returns (bytes32 messageId) {
        messageId = keccak256(abi.encodePacked(msg.sender, chainSelector, message, block.timestamp));
        emit CCIPSend(chainSelector, address(this), message);
    }
} 