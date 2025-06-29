// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import "lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ValkyrieToken
 * @author Valkyrie Finance Team
 * @notice Governance and utility token for the Valkyrie DeFi platform with staking rewards
 * @dev Valkyrie platform token with governance, staking, and reward mechanisms
 * Features:
 * - Standard ERC-20 functionality
 * - Governance voting with delegation (ERC20Votes)
 * - Staking mechanism with rewards
 * - Platform utility functions
 * @custom:security-contact security@valkyrie.finance
 */
contract ValkyrieToken is ERC20, ERC20Votes, ERC20Permit, Ownable, ReentrancyGuard {
    // Custom errors for gas optimization
    error ZeroAmount();
    error InsufficientBalance();
    error InsufficientStakedAmount();
    error NoRewardsToClaim();
    error RewardRateTooHigh();

    // Staking state (packed for maximum gas efficiency)
    struct StakeInfo {
        uint96 amount;           // Amount staked
        uint32 unlockTime;       // When tokens can be withdrawn penalty-free
        uint32 stakingPeriod;    // Chosen staking period (in months)
        uint32 lastRewardTime;   // Last time rewards were claimed
        uint32 governancePower;  // Voting power multiplier
    }

    // Staking tier configuration (packed)
    struct StakingTier {
        uint32 periodMonths;     // Staking period in months
        uint32 rewardMultiplier; // Reward multiplier (basis points)
        uint32 governanceMultiplier; // Governance power multiplier (basis points)
        uint32 penaltyRate;      // Early withdrawal penalty (basis points)
    }

    mapping(address => StakeInfo) public stakes;
    mapping(uint256 => StakingTier) public stakingTiers;

    // Staking configuration
    uint256 public totalStaked;
    uint256 public rewardRate = 100; // Base reward rate in basis points per year (1% = 100 bp)
    uint256 public lastRewardTime;
    uint256 public penaltyPool; // Pool of penalty fees

    // Governance integration
    mapping(address => uint256) private _governanceBalances;
    uint256 private _totalGovernanceSupply;

    // Events
    event Staked(address indexed user, uint256 amount, uint256 tier, uint256 unlockTime);
    event Unstaked(address indexed user, uint256 amount, uint256 penalty);
    event RewardClaimed(address indexed user, uint256 reward);
    event RewardRateUpdated(uint256 newRate);
    event EarlyWithdrawalPenalty(address indexed user, uint256 penalty);
    event StakingTierAdded(uint256 indexed tierId, uint256 periodMonths, uint256 rewardMultiplier);

    /**
     * @dev Constructor
     * @param _name Token name
     * @param _symbol Token symbol
     * @param _initialSupply Initial token supply
     * @param _owner Initial owner address
     */
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        address _owner
    )
        ERC20(_name, _symbol)
        ERC20Permit(_name)
        Ownable(_owner)
    {
        _mint(_owner, _initialSupply);
        lastRewardTime = block.timestamp;

        // Initialize staking tiers as recommended in tokenomics review
        stakingTiers[1] = StakingTier(3, 10000, 10000, 2000);   // 3 months: 1x rewards, 1x governance, 20% penalty
        stakingTiers[2] = StakingTier(6, 12500, 12500, 1500);   // 6 months: 1.25x rewards, 1.25x governance, 15% penalty
        stakingTiers[3] = StakingTier(12, 15000, 20000, 1000);  // 12 months: 1.5x rewards, 2x governance, 10% penalty
        stakingTiers[4] = StakingTier(24, 20000, 30000, 500);   // 24 months: 2x rewards, 3x governance, 5% penalty
    }

    /**
     * @notice Stake tokens for a specific period to earn tiered rewards
     * @dev Enhanced staking with tiers and governance power
     * @param amount Amount of tokens to stake
     * @param tierId Staking tier (1-4 for different periods)
     */
    function stakeWithTier(uint256 amount, uint256 tierId) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (amount > type(uint96).max) revert("Amount too large");
        if (balanceOf(msg.sender) < amount) revert InsufficientBalance();
        if (tierId == 0 || tierId > 4) revert("Invalid tier");

        // Cache storage values
        StakingTier memory tier = stakingTiers[tierId];
        StakeInfo storage userStake = stakes[msg.sender];
        uint256 currentTime = block.timestamp;

        // Handle pending rewards if any
        if (userStake.amount > 0) {
            uint256 rewards = _calculateRewards(msg.sender);
            if (rewards > 0) {
                _mint(msg.sender, rewards);
                emit RewardClaimed(msg.sender, rewards);
            }
        }

        unchecked {
            // Update governance power
            uint256 governanceAmount = (amount * tier.governanceMultiplier) / 10000;
            _governanceBalances[msg.sender] += governanceAmount;
            _totalGovernanceSupply += governanceAmount;

            // Update stake info (packed into a single storage slot)
            userStake.amount = uint96(amount);
            userStake.stakingPeriod = uint32(tier.periodMonths);
            userStake.unlockTime = uint32(currentTime + (tier.periodMonths * 30 days));
            userStake.governancePower = uint32(tier.governanceMultiplier);
            userStake.lastRewardTime = uint32(currentTime);

            totalStaked += amount;
        }

        // Transfer tokens
        _transfer(msg.sender, address(this), amount);

        emit Staked(msg.sender, amount, tierId, userStake.unlockTime);
    }

    /**
     * @notice Unstake tokens with potential early withdrawal penalty
     * @dev Enhanced unstaking with penalty mechanism
     * @param amount Amount of tokens to unstake
     */
    function unstakeWithPenalty(uint256 amount) external nonReentrant {
        StakeInfo storage userStake = stakes[msg.sender];
        if (userStake.amount < amount) revert InsufficientStakedAmount();

        // Calculate penalty for early withdrawal
        uint256 penalty = 0;
        if (block.timestamp < userStake.unlockTime) {
            StakingTier memory tier = stakingTiers[_getTierFromPeriod(userStake.stakingPeriod)];
            penalty = (amount * tier.penaltyRate) / 10000;
            penaltyPool += penalty;
            emit EarlyWithdrawalPenalty(msg.sender, penalty);
        }

        // Handle rewards
        uint256 rewards = _calculateRewards(msg.sender);
        if (rewards > 0) {
            _mint(msg.sender, rewards);
            emit RewardClaimed(msg.sender, rewards);
        }

        unchecked {
            // Update governance power
            uint256 governanceReduction = (amount * userStake.governancePower) / 10000;
            _governanceBalances[msg.sender] -= governanceReduction;
            _totalGovernanceSupply -= governanceReduction;

            // Update stake info
            userStake.amount = uint96(uint256(userStake.amount) - amount);
            userStake.lastRewardTime = uint32(block.timestamp);

            totalStaked -= amount;
        }

        // Transfer tokens back to user (minus penalty)
        uint256 withdrawAmount = amount - penalty;
        _transfer(address(this), msg.sender, withdrawAmount);

        emit Unstaked(msg.sender, amount, penalty);
    }

    /**
     * @notice Get the amount of tokens currently staked by an account
     * @dev Get staked balance of an account
     * @param account Account to check staked balance for
     * @return Staked amount in token units
     */
    function stakedBalance(address account) external view returns (uint256) {
        return stakes[account].amount;
    }

    /**
     * @notice Calculate pending staking rewards for an account without claiming them
     * @dev Get pending rewards for an account
     * @param account Account to check rewards for
     * @return Pending reward amount in token units
     */
    function getPendingRewards(address account) external view returns (uint256) {
        return _calculateRewards(account);
    }

    /**
     * @dev Update reward rate (owner only)
     * @param newRate New reward rate in basis points
     */
    function setRewardRate(uint256 newRate) external onlyOwner {
        if (newRate > 10000) revert RewardRateTooHigh();
        rewardRate = newRate;
        emit RewardRateUpdated(newRate);
    }

    /**
     * @dev Internal function to calculate rewards
     */
    function _calculateRewards(address account) internal view returns (uint256) {
        StakeInfo memory userStake = stakes[account];
        if (userStake.amount == 0) return 0;

        uint256 timeElapsed = block.timestamp - userStake.lastRewardTime;
        if (timeElapsed == 0) return 0;

        unchecked {
            uint256 baseReward = (uint256(userStake.amount) * rewardRate * timeElapsed) / (365 days * 10000);
            return (baseReward * stakingTiers[_getTierFromPeriod(userStake.stakingPeriod)].rewardMultiplier) / 10000;
        }
    }

    /**
     * @notice Claim all pending staking rewards without unstaking
     * @dev Claim pending rewards
     */
    function claimRewards() external nonReentrant {
        StakeInfo storage userStake = stakes[msg.sender];
        if (userStake.amount == 0) revert NoRewardsToClaim();

        uint256 rewards = _calculateRewards(msg.sender);
        if (rewards == 0) revert NoRewardsToClaim();

        userStake.lastRewardTime = uint32(block.timestamp);

        _mint(msg.sender, rewards);
        emit RewardClaimed(msg.sender, rewards);
    }

    /**
     * @notice Get pending rewards for a user
     * @dev Calculate pending rewards based on current pool state
     * @param user User address to check
     * @return Pending reward amount
     */
    function pendingRewards(address user) external view returns (uint256) {
        return _calculateRewards(user);
    }

    /**
     * @notice Get staking information for a user
     * @dev Returns complete staking details
     * @param user User address to check
     * @return amount Staked amount
     * @return unlockTime When tokens can be withdrawn penalty-free
     * @return stakingPeriod Staking period in months
     * @return governancePower Governance voting power multiplier
     */
    function getStakeInfo(address user) external view returns (
        uint256 amount,
        uint256 unlockTime,
        uint256 stakingPeriod,
        uint256 governancePower
    ) {
        StakeInfo memory userStake = stakes[user];
        return (
            userStake.amount,
            userStake.unlockTime,
            userStake.stakingPeriod,
            userStake.governancePower
        );
    }

    /**
     * @notice Get governance voting power for a user
     * @dev Returns enhanced voting power based on staking
     * @param account User address
     * @return Governance voting power
     */
    function getVotes(address account) public view override returns (uint256) {
        // Combine regular balance with staking governance power
        return balanceOf(account) + _governanceBalances[account];
    }

    /**
     * @notice Add or update a staking tier (only owner)
     * @dev Configure staking tier parameters
     * @param tierId Tier ID (1-4)
     * @param periodMonths Staking period in months
     * @param rewardMultiplier Reward multiplier in basis points
     * @param governanceMultiplier Governance power multiplier in basis points
     * @param penaltyRate Early withdrawal penalty in basis points
     */
    function setStakingTier(
        uint256 tierId,
        uint256 periodMonths,
        uint256 rewardMultiplier,
        uint256 governanceMultiplier,
        uint256 penaltyRate
    ) external onlyOwner {
        if (tierId == 0 || tierId > 4) revert("Invalid tier ID");
        if (penaltyRate > 5000) revert("Penalty too high"); // Max 50%

        stakingTiers[tierId] = StakingTier({
            periodMonths: uint32(periodMonths),
            rewardMultiplier: uint32(rewardMultiplier),
            governanceMultiplier: uint32(governanceMultiplier),
            penaltyRate: uint32(penaltyRate)
        });

        emit StakingTierAdded(tierId, periodMonths, rewardMultiplier);
    }

    /**
     * @dev Get tier ID from staking period
     */
    function _getTierFromPeriod(uint256 periodMonths) internal pure returns (uint256) {
        if (periodMonths <= 3) return 1;
        if (periodMonths <= 6) return 2;
        if (periodMonths <= 12) return 3;
        return 4;
    }

    // Required overrides for multiple inheritance
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
