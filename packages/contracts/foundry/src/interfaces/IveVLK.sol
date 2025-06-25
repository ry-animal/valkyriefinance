// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";
import "lib/openzeppelin-contracts/contracts/governance/utils/IVotes.sol";

/**
 * @title IveVLK
 * @notice Interface for the vote-escrowed VLK NFT positions
 */
interface IveVLK is IERC721, IVotes {
    /**
     * @notice Mint a new veVLK position NFT
     * @param to Address to mint the NFT to
     * @param amount Amount of VLK locked
     * @param unlockTime When the position can be withdrawn
     * @return tokenId The newly minted token ID
     */
    function mint(address to, uint256 amount, uint256 unlockTime) external returns (uint256 tokenId);

    /**
     * @notice Burn a veVLK position NFT
     * @param tokenId Token ID to burn
     */
    function burn(uint256 tokenId) external;

    /**
     * @notice Get position information for a token ID
     * @param tokenId Token ID to query
     * @return amount Amount of VLK locked
     * @return unlockTime When the position unlocks
     */
    function getPositionInfo(uint256 tokenId) external view returns (uint256 amount, uint256 unlockTime);

    /**
     * @notice Get all token IDs owned by an address
     * @param owner Address to query
     * @return Array of token IDs owned by the address
     */
    function getOwnedTokens(address owner) external view returns (uint256[] memory);

    /**
     * @notice Get the total voting power across all positions
     * @return Total voting power
     */
    function getTotalVotingPower() external view returns (uint256);

    /**
     * @notice Calculate veVLK balance for a given lock
     * @param amount Amount of VLK locked
     * @param unlockTime When the lock expires
     * @return veVLK balance (voting power)
     */
    function calculateVeBalance(uint256 amount, uint256 unlockTime) external view returns (uint256);
}
