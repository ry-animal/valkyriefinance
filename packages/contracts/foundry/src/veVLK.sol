// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "lib/openzeppelin-contracts/contracts/governance/utils/Votes.sol";
import "lib/openzeppelin-contracts/contracts/access/AccessControl.sol";
import "lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

/**
 * @title veVLK
 * @author Valkyrie Finance Team
 * @notice Vote-escrowed VLK positions represented as NFTs with governance voting power
 * @dev Each NFT represents a locked VLK position with voting power that decays over time
 */
contract veVLK is ERC721, ERC721Enumerable, Votes, AccessControl, ReentrancyGuard {
    // Custom errors
    error ZeroAmount();
    error InvalidTokenId();
    error UnauthorizedMinter();
    error UnauthorizedBurner();

    // Roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    // Constants for veVLK calculation
    uint256 public constant MAX_LOCK_DAYS = 1460; // 4 years in days

    // Position data
    struct Position {
        uint256 amount;      // Amount of VLK locked
        uint256 unlockTime;  // When the position unlocks
        uint256 lockStart;   // When the position was created
    }

    mapping(uint256 => Position) public positions;
    mapping(address => uint256[]) private _ownedTokens;
    uint256 private _currentTokenId;
    uint256 private _totalVotingPower;

    // Events
    event PositionCreated(uint256 indexed tokenId, address indexed owner, uint256 amount, uint256 unlockTime);
    event PositionBurned(uint256 indexed tokenId, address indexed owner, uint256 amount);

    constructor(
        string memory name,
        string memory symbol,
        address admin,
        address stakingManager
    ) ERC721(name, symbol) EIP712(name, "1") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, stakingManager);
        _grantRole(BURNER_ROLE, stakingManager);
    }

    /**
     * @notice Mint a new veVLK position NFT
     * @param to Address to mint to
     * @param amount Amount of VLK locked
     * @param unlockTime When the position unlocks
     * @return tokenId The new token ID
     */
    function mint(address to, uint256 amount, uint256 unlockTime)
        external
        onlyRole(MINTER_ROLE)
        nonReentrant
        returns (uint256 tokenId)
    {
        if (amount == 0) revert ZeroAmount();

        tokenId = ++_currentTokenId;

        positions[tokenId] = Position({
            amount: amount,
            unlockTime: unlockTime,
            lockStart: block.timestamp
        });

        _ownedTokens[to].push(tokenId);
        _mint(to, tokenId);

        // Update total voting power
        uint256 votingPower = calculateVeBalance(amount, unlockTime);
        _totalVotingPower += votingPower;

        emit PositionCreated(tokenId, to, amount, unlockTime);
        return tokenId;
    }

    /**
     * @notice Burn a veVLK position NFT
     * @param tokenId Token ID to burn
     */
    function burn(uint256 tokenId) external onlyRole(BURNER_ROLE) nonReentrant {
        address owner = ownerOf(tokenId);
        Position memory position = positions[tokenId];

        // Remove from owned tokens array
        _removeFromOwnedTokens(owner, tokenId);

        // Update total voting power
        uint256 votingPower = calculateVeBalance(position.amount, position.unlockTime);
        _totalVotingPower -= votingPower;

        delete positions[tokenId];
        _burn(tokenId);

        emit PositionBurned(tokenId, owner, position.amount);
    }

    /**
     * @notice Calculate veVLK balance (voting power) for a position
     * @param amount Amount of VLK locked
     * @param unlockTime When the lock expires
     * @return Voting power based on amount and remaining lock time
     */
    function calculateVeBalance(uint256 amount, uint256 unlockTime) public view returns (uint256) {
        if (unlockTime <= block.timestamp) return 0;

        uint256 remainingTime = unlockTime - block.timestamp;
        uint256 remainingDays = remainingTime / 1 days;

        // veVLK = amount * (remainingDays / MAX_LOCK_DAYS)
        // Maximum 1:1 ratio for 4-year lock, decays linearly
        return (amount * remainingDays) / MAX_LOCK_DAYS;
    }

    /**
     * @notice Get position information for a token ID
     * @param tokenId Token ID to query
     * @return amount Amount of VLK locked
     * @return unlockTime When the position unlocks
     */
    function getPositionInfo(uint256 tokenId) external view returns (uint256 amount, uint256 unlockTime) {
        if (!_exists(tokenId)) revert InvalidTokenId();
        Position memory position = positions[tokenId];
        return (position.amount, position.unlockTime);
    }

    /**
     * @notice Get all token IDs owned by an address
     * @param owner Address to query
     * @return Array of token IDs
     */
    function getOwnedTokens(address owner) external view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }

    /**
     * @notice Get voting power for an account
     * @param account Address to get voting power for
     * @return Total voting power from all positions
     */
    function getVotes(address account) public view override returns (uint256) {
        uint256[] memory tokenIds = _ownedTokens[account];
        uint256 totalPower = 0;

        for (uint256 i = 0; i < tokenIds.length; i++) {
            Position memory position = positions[tokenIds[i]];
            totalPower += calculateVeBalance(position.amount, position.unlockTime);
        }

        return totalPower;
    }

    /**
     * @notice Get past voting power for an account at a specific timestamp
     * @param account Address to get past voting power for
     * @param timepoint Historical timestamp
     * @return Past voting power (simplified - returns current for now)
     */
    function getPastVotes(address account, uint256 timepoint) public view override returns (uint256) {
        // Simplified implementation - in production would need historical tracking
        // For now, return current votes if timepoint is in the past, 0 if future
        if (timepoint > block.timestamp) return 0;
        return getVotes(account);
    }

    /**
     * @notice Get the total voting power across all positions
     * @return Total voting power
     */
    function getTotalVotingPower() external view returns (uint256) {
        // Recalculate total voting power to account for decay
        uint256 currentTotal = 0;

        for (uint256 i = 1; i <= _currentTokenId; i++) {
            if (_exists(i)) {
                Position memory position = positions[i];
                currentTotal += calculateVeBalance(position.amount, position.unlockTime);
            }
        }

        return currentTotal;
    }

    /**
     * @notice Get current total supply of tokens
     * @return Current token supply
     */
    function getTotalSupply() external view returns (uint256) {
        return totalSupply();
    }

    // Internal functions

    function _removeFromOwnedTokens(address owner, uint256 tokenId) internal {
        uint256[] storage tokens = _ownedTokens[owner];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == tokenId) {
                tokens[i] = tokens[tokens.length - 1];
                tokens.pop();
                break;
            }
        }
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        address from = _ownerOf(tokenId);

        // Update owned tokens tracking
        if (from != address(0) && from != to) {
            _removeFromOwnedTokens(from, tokenId);
        }
        if (to != address(0) && from != to) {
            _ownedTokens[to].push(tokenId);
        }

        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    // Override required by Solidity
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return positions[tokenId].amount > 0;
    }

    // Required by Votes
    function _getVotingUnits(address account) internal view override returns (uint256) {
        return getVotes(account);
    }
}
