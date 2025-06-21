// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockERC20
 * @author Valkyrie Finance Team
 * @notice Mock ERC20 token contract for testing and development purposes
 * @dev Simple ERC20 implementation that mints 1,000,000 tokens to deployer upon construction
 * This contract is intended for testing environments only and should not be used in production
 * @custom:security-contact security@valkyrie.finance
 */
contract MockERC20 is ERC20 {
    /**
     * @notice Creates a new mock ERC20 token with specified name and symbol
     * @dev Constructor mints 1,000,000 tokens (1e24 wei) to the deployer address
     * @param name The name of the token (e.g., "Mock USDC")
     * @param symbol The symbol of the token (e.g., "mUSDC")
     */
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 1_000_000 ether);
    }
}
