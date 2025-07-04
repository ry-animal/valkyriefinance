// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/ValkyrieVault.sol";
import "../src/mocks/MockERC20.sol";

contract VaultInvariantTest is Test {
    ValkyrieVault vault;
    MockERC20 token;

    function setUp() public {
        token = new MockERC20("Mock Token", "MOCK");
        vault = new ValkyrieVault(
            IERC20(address(token)),
            "Test Vault",
            "TVLT",
            address(this),
            address(this),
            address(0)
        );
    }

    // Invariant: totalAssets() >= effective totalSupply() (excluding dead shares)
    function invariant_totalAssetsAlwaysGTEQTotalSupply() public {
        uint256 effectiveSupply = vault.effectiveTotalSupply();
        assertGe(vault.totalAssets(), effectiveSupply);
    }

    // Invariant: totalAllocated never exceeds MAX_ALLOCATION
    function invariant_totalAllocatedNeverExceedsMax() public {
        assertLe(vault.totalAllocated(), vault.MAX_ALLOCATION());
    }
}
