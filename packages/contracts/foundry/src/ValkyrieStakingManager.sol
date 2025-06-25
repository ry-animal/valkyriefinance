// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import "lib/openzeppelin-contracts/contracts/access/AccessControl.sol";
import "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import "lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";
import "./interfaces/IsVLK.sol";
import "./interfaces/IveVLK.sol";

/**
 * @title ValkyrieStakingManager
 * @author Valkyrie Finance Team
 * @notice Central hub for all staking operations - manages both liquid (sVLK) and locked (veVLK) staking
 * @dev Implements the dual-pronged staking system from the tokenomics specification
 */
contract ValkyrieStakingManager is ReentrancyGuard, AccessControl {
    using SafeERC20 for IERC20;

    // Custom errors
    error ZeroAmount();
    error InsufficientBalance();
    error InvalidLockDuration();
    error LockNotExpired();
    error InvalidTokenId();
    error NotTokenOwner();
    error NoRewardsToClaim();

    // Constants
    bytes32 public constant REWARDS_ADMIN_ROLE = keccak256("REWARDS_ADMIN_ROLE");
    uint256 public constant MIN_LOCK_DURATION = 90 days; // 3 months
    uint256 public constant MAX_LOCK_DURATION = 4 * 365 days; // 4 years
    uint256 public constant MAX_LOCK_DAYS = 1460; // 4 years in days for veVLK calculation

    // Contracts
    IERC20 public immutable vlkToken;
    IsVLK public immutable sVlkToken;
    IveVLK public immutable veVlkToken;

    // Reward tracking
    mapping(address => uint256) public lastRewardClaim;
    uint256 public totalRewardsDistributed;
    uint256 public currentRewardEpoch;

    // Events
    event Staked(address indexed user, uint256 amount, uint256 sVlkMinted);
    event Unstaked(address indexed user, uint256 amount, uint256 sVlkBurned);
    event Locked(address indexed user, uint256 amount, uint256 duration, uint256 tokenId);
    event Withdrawn(address indexed user, uint256 tokenId, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount, string rewardType);
    event RewardsDistributed(uint256 epoch, uint256 totalAmount);

    constructor(
        address _vlkToken,
        address _sVlkToken,
        address _veVlkToken,
        address _admin
    ) {
        vlkToken = IERC20(_vlkToken);
        sVlkToken = IsVLK(_sVlkToken);
        veVlkToken = IveVLK(_veVlkToken);

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(REWARDS_ADMIN_ROLE, _admin);
    }

    /**
     * @notice Stake VLK tokens to receive liquid sVLK tokens (1:1 ratio)
     * @param amount Amount of VLK tokens to stake
     */
    function stake(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();

        // Transfer VLK from user to this contract
        vlkToken.safeTransferFrom(msg.sender, address(this), amount);

        // Mint sVLK tokens to user (1:1 ratio)
        sVlkToken.mint(msg.sender, amount);

        emit Staked(msg.sender, amount, amount);
    }

    /**
     * @notice Unstake sVLK tokens to receive VLK tokens back (1:1 ratio)
     * @param amount Amount of sVLK tokens to unstake
     */
    function unstake(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (sVlkToken.balanceOf(msg.sender) < amount) revert InsufficientBalance();

        // Burn sVLK tokens from user
        sVlkToken.burnFrom(msg.sender, amount);

        // Transfer VLK tokens back to user
        vlkToken.safeTransfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount, amount);
    }

    /**
     * @notice Lock VLK tokens for a specified duration to receive veVLK NFT
     * @param amount Amount of VLK tokens to lock
     * @param duration Lock duration in seconds (3 months to 4 years)
     */
    function lock(uint256 amount, uint256 duration) external nonReentrant returns (uint256 tokenId) {
        if (amount == 0) revert ZeroAmount();
        if (duration < MIN_LOCK_DURATION || duration > MAX_LOCK_DURATION) {
            revert InvalidLockDuration();
        }

        // Transfer VLK from user to this contract
        vlkToken.safeTransferFrom(msg.sender, address(this), amount);

        // Calculate unlock time
        uint256 unlockTime = block.timestamp + duration;

        // Mint veVLK NFT to user
        tokenId = veVlkToken.mint(msg.sender, amount, unlockTime);

        emit Locked(msg.sender, amount, duration, tokenId);
        return tokenId;
    }

    /**
     * @notice Withdraw VLK tokens from expired veVLK position
     * @param tokenId The veVLK NFT token ID to withdraw from
     */
    function withdraw(uint256 tokenId) external nonReentrant {
        if (veVlkToken.ownerOf(tokenId) != msg.sender) revert NotTokenOwner();

        (uint256 amount, uint256 unlockTime) = veVlkToken.getPositionInfo(tokenId);

        if (block.timestamp < unlockTime) revert LockNotExpired();

        // Burn the veVLK NFT
        veVlkToken.burn(tokenId);

        // Transfer VLK tokens back to user
        vlkToken.safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, tokenId, amount);
    }

    /**
     * @notice Claim rewards for both sVLK and veVLK positions
     * @dev Calculates rewards off-chain and claims via merkle proof or direct calculation
     */
    function claimRewards() external nonReentrant {
        uint256 sVlkRewards = _calculateSVlkRewards(msg.sender);
        uint256 veVlkRewards = _calculateVeVlkRewards(msg.sender);

        uint256 totalRewards = sVlkRewards + veVlkRewards;
        if (totalRewards == 0) revert NoRewardsToClaim();

        // Update last claim timestamp
        lastRewardClaim[msg.sender] = block.timestamp;

        // Transfer rewards (this would be USDC/ETH in production)
        // For now, we'll mint VLK as rewards
        vlkToken.safeTransfer(msg.sender, totalRewards);

        totalRewardsDistributed += totalRewards;

        emit RewardsClaimed(msg.sender, totalRewards, "combined");
    }

    /**
     * @notice Get user's total staking position summary
     * @param user Address to query
     * @return sVlkBalance Liquid staking balance
     * @return veVlkPositions Array of locked position token IDs
     * @return totalVotingPower Combined voting power from all positions
     */
    function getUserStakingInfo(address user) external view returns (
        uint256 sVlkBalance,
        uint256[] memory veVlkPositions,
        uint256 totalVotingPower
    ) {
        sVlkBalance = sVlkToken.balanceOf(user);
        veVlkPositions = veVlkToken.getOwnedTokens(user);
        totalVotingPower = veVlkToken.getVotes(user);
    }

    /**
     * @notice Calculate pending rewards for a user
     * @param user Address to calculate rewards for
     * @return sVlkRewards Pending liquid staking rewards
     * @return veVlkRewards Pending locked staking rewards
     */
    function getPendingRewards(address user) external view returns (
        uint256 sVlkRewards,
        uint256 veVlkRewards
    ) {
        sVlkRewards = _calculateSVlkRewards(user);
        veVlkRewards = _calculateVeVlkRewards(user);
    }

    // Internal reward calculation functions
    function _calculateSVlkRewards(address user) internal view returns (uint256) {
        uint256 balance = sVlkToken.balanceOf(user);
        if (balance == 0) return 0;

        // Simplified reward calculation - 20% of total reward pool goes to sVLK
        // This would be more sophisticated in production with proper reward distribution
        uint256 timeSinceLastClaim = block.timestamp - lastRewardClaim[user];
        uint256 baseReward = (balance * timeSinceLastClaim * 100) / (365 days * 10000); // 1% APY base

        return (baseReward * 20) / 100; // 20% allocation to sVLK
    }

    function _calculateVeVlkRewards(address user) internal view returns (uint256) {
        uint256 votingPower = veVlkToken.getVotes(user);
        if (votingPower == 0) return 0;

        // 80% of total reward pool goes to veVLK, weighted by voting power
        uint256 totalVotingPower = veVlkToken.getTotalVotingPower();
        if (totalVotingPower == 0) return 0;

        uint256 timeSinceLastClaim = block.timestamp - lastRewardClaim[user];
        uint256 baseReward = (votingPower * timeSinceLastClaim * 400) / (365 days * 10000); // 4% APY base

        return (baseReward * 80) / 100; // 80% allocation to veVLK
    }

    /**
     * @notice Admin function to distribute rewards (for testing/initial launch)
     * @param amount Amount of rewards to distribute
     */
    function distributeRewards(uint256 amount) external onlyRole(REWARDS_ADMIN_ROLE) {
        currentRewardEpoch++;
        emit RewardsDistributed(currentRewardEpoch, amount);
    }

    /**
     * @notice Emergency function to pause/unpause the contract
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        // Implementation would add pausing functionality
    }
}
