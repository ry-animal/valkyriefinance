// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

/**
 * @title IsVLK
 * @notice Interface for the liquid staking VLK token (sVLK)
 */
interface IsVLK is IERC20 {
    /**
     * @notice Mint sVLK tokens to a user (only callable by StakingManager)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external;

    /**
     * @notice Burn sVLK tokens from a user (only callable by StakingManager)
     * @param from Address to burn tokens from
     * @param amount Amount of tokens to burn
     */
    function burnFrom(address from, uint256 amount) external;

    /**
     * @notice Check if an address has minter role
     * @param account Address to check
     * @return True if account has minter role
     */
    function hasRole(bytes32 role, address account) external view returns (bool);
}
