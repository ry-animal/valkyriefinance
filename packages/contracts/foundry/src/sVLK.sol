// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "lib/openzeppelin-contracts/contracts/access/AccessControl.sol";
import "lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title sVLK
 * @author Valkyrie Finance Team
 * @notice Liquid staking token representing staked VLK with 1:1 backing
 * @dev ERC20 token that represents liquid staking positions in the Valkyrie protocol
 */
contract sVLK is ERC20, ERC20Burnable, AccessControl {
    // Custom errors
    error UnauthorizedMinter();
    error UnauthorizedBurner();

    // Roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    // Events
    event Minted(address indexed to, uint256 amount);
    event Burned(address indexed from, uint256 amount);

    constructor(
        string memory name,
        string memory symbol,
        address admin,
        address stakingManager
    ) ERC20(name, symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, stakingManager);
        _grantRole(BURNER_ROLE, stakingManager);
    }

    /**
     * @notice Mint sVLK tokens (only callable by authorized minters)
     * @param to Address to mint tokens to
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
        emit Minted(to, amount);
    }

    /**
     * @notice Burn sVLK tokens from an address (only callable by authorized burners)
     * @param from Address to burn tokens from
     * @param amount Amount to burn
     */
    function burnFrom(address from, uint256 amount) public override onlyRole(BURNER_ROLE) {
        _burn(from, amount);
        emit Burned(from, amount);
    }

    /**
     * @notice Override burn function to require BURNER_ROLE
     * @param amount Amount to burn from caller
     */
    function burn(uint256 amount) public override {
        if (!hasRole(BURNER_ROLE, msg.sender)) {
            revert UnauthorizedBurner();
        }
        super.burn(amount);
        emit Burned(msg.sender, amount);
    }

    /**
     * @notice Get total supply of sVLK tokens
     * @return Total circulating supply
     */
    function getTotalStaked() external view returns (uint256) {
        return totalSupply();
    }
}
