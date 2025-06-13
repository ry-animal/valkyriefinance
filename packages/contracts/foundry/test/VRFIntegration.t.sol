// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/ValkyrieVault.sol";
import "../src/mocks/MockVRFCoordinator.sol";
import "../src/mocks/MockERC20.sol";

contract VRFIntegrationTest is Test {
    ValkyrieVault vault;
    MockVRFCoordinator mockVRF;
    MockERC20 token;

    function setUp() public {
        token = new MockERC20("Mock Token", "MOCK");
        mockVRF = new MockVRFCoordinator();
        vault = new ValkyrieVault(
            IERC20(address(token)),
            "Test Vault",
            "TVLT",
            address(this),
            address(this),
            address(0), // price oracle
            address(mockVRF),
            address(0)  // ccip router
        );
        // Set VRF config for test: keyHash is mockVRF address
        vault.setVRFConfig(bytes32(uint256(uint160(address(mockVRF)))), 1, 100000, 1);
    }

    function testRequestRandomness() public {
        // This assumes you have a requestRandomness() function in the vault
        bytes32 requestId = vault.requestRandomness();
        assertTrue(requestId != bytes32(0), "Request ID should not be zero");

        // Simulate VRF callback
        mockVRF.fulfillRandomWords(requestId, address(vault));
        // Add assertions for whatever state should change in the vault
    }
} 