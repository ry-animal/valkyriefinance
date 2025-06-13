// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/mocks/MockCCIPRouter.sol";

contract CCIPIntegrationTest is Test {
    MockCCIPRouter mockCCIP;

    function setUp() public {
        mockCCIP = new MockCCIPRouter();
    }

    function testCCIPSendEmitsEvent() public {
        uint64 chainSelector = 1234;
        bytes memory message = abi.encode("cross-chain-payload");
        vm.expectEmit(true, true, false, true);
        emit MockCCIPRouter.CCIPSend(chainSelector, address(mockCCIP), message);
        mockCCIP.ccipSend(chainSelector, message);
    }
} 