// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ValkryieToken
 * @author Valkryie Finance Team
 * @notice Governance and utility token for the Valkryie DeFi platform with staking rewards
 * @dev Valkryie platform token with governance, staking, and reward mechanisms
 * Features:
 * - Standard ERC-20 functionality
 * - Governance voting with delegation (ERC20Votes)
 * - Staking mechanism with rewards
 * - Platform utility functions
 * @custom:security-contact security@valkryie.finance
 */
contract ValkryieToken is ERC20, ERC20Votes, ERC20Permit, Ownable, ReentrancyGuard {
    // Custom errors for gas optimization
    error ZeroAmount();
    error InsufficientBalance();
    error InsufficientStakedAmount();
    error NoRewardsToClaim();
    error RewardRateTooHigh();
    
    // Staking state
    struct StakeInfo {
        uint256 amount;           // Amount staked
        uint256 rewardDebt;       // Reward debt for accurate calculation
        uint256 lastStakeTime;    // When the stake was last updated
    }
    
    mapping(address => StakeInfo) public stakes;
    
    // Staking configuration
    uint256 public totalStaked;
    uint256 public rewardRate = 100; // Basis points per year (1% = 100 bp)
    uint256 public accRewardPerShare; // Accumulated rewards per share
    uint256 public lastRewardTime;
    
    // Events
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);
    event RewardRateUpdated(uint256 newRate);
    
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
    }
    
    /**
     * @notice Stake tokens to earn rewards over time
     * @dev Stake tokens to earn rewards
     * @param amount Amount of tokens to stake (must be > 0 and <= balance)
     */
    function stake(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (balanceOf(msg.sender) < amount) revert InsufficientBalance();
        
        _updatePool();
        
        StakeInfo storage userStake = stakes[msg.sender];
        
        // Claim any pending rewards
        if (userStake.amount > 0) {
            uint256 pending = _pendingRewards(msg.sender);
            if (pending > 0) {
                _claimRewards(msg.sender, pending);
            }
        }
        
        // Transfer tokens to contract
        _transfer(msg.sender, address(this), amount);
        
        // Update stake info
        userStake.amount += amount;
        userStake.rewardDebt = (userStake.amount * accRewardPerShare) / 1e12;
        userStake.lastStakeTime = block.timestamp;
        
        totalStaked += amount;
        
        emit Staked(msg.sender, amount);
    }
    
    /**
     * @notice Unstake tokens and claim any pending rewards
     * @dev Unstake tokens
     * @param amount Amount of tokens to unstake (must be <= staked amount)
     */
    function unstake(uint256 amount) external nonReentrant {
        StakeInfo storage userStake = stakes[msg.sender];
        if (userStake.amount < amount) revert InsufficientStakedAmount();
        
        _updatePool();
        
        // Claim any pending rewards
        uint256 pending = _pendingRewards(msg.sender);
        if (pending > 0) {
            _claimRewards(msg.sender, pending);
        }
        
        // Update stake info
        userStake.amount -= amount;
        userStake.rewardDebt = (userStake.amount * accRewardPerShare) / 1e12;
        
        totalStaked -= amount;
        
        // Transfer tokens back to user
        _transfer(address(this), msg.sender, amount);
        
        emit Unstaked(msg.sender, amount);
    }
    
    /**
     * @notice Claim all pending staking rewards without unstaking
     * @dev Claim pending rewards
     */
    function claimRewards() external nonReentrant {
        StakeInfo storage userStake = stakes[msg.sender];
        
        // Early exit if no stake
        if (userStake.amount == 0) revert NoRewardsToClaim();
        
        _updatePool();
        
        // Cache accRewardPerShare to avoid multiple reads
        uint256 _accRewardPerShare = accRewardPerShare;
        uint256 pending = ((userStake.amount * _accRewardPerShare) / 1e12) - userStake.rewardDebt;
        if (pending == 0) revert NoRewardsToClaim();
        
        userStake.rewardDebt = (userStake.amount * _accRewardPerShare) / 1e12;
        
        _claimRewards(msg.sender, pending);
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
    function pendingRewards(address account) external view returns (uint256) {
        // Cache totalStaked to avoid multiple reads
        uint256 _totalStaked = totalStaked;
        if (_totalStaked == 0) return 0;
        
        uint256 accRewardPerShareTemp = accRewardPerShare;
        
        // Calculate time-based rewards - cache block.timestamp
        uint256 currentTime = block.timestamp;
        if (currentTime > lastRewardTime) {
            unchecked {
                uint256 timeElapsed = currentTime - lastRewardTime;
                uint256 reward = (_totalStaked * rewardRate * timeElapsed) / (365 days * 10000);
                accRewardPerShareTemp += (reward * 1e12) / _totalStaked;
            }
        }
        
        StakeInfo storage userStake = stakes[account];
        unchecked {
            return ((userStake.amount * accRewardPerShareTemp) / 1e12) - userStake.rewardDebt;
        }
    }
    
    /**
     * @dev Update reward rate (owner only)
     * @param newRate New reward rate in basis points
     */
    function setRewardRate(uint256 newRate) external onlyOwner {
        if (newRate > 10000) revert RewardRateTooHigh();
        _updatePool();
        rewardRate = newRate;
        emit RewardRateUpdated(newRate);
    }
    
    /**
     * @dev Internal function to update reward pool
     */
    function _updatePool() internal {
        if (block.timestamp <= lastRewardTime || totalStaked == 0) {
            lastRewardTime = block.timestamp;
            return;
        }
        
        uint256 timeElapsed = block.timestamp - lastRewardTime;
        uint256 reward = (totalStaked * rewardRate * timeElapsed) / (365 days * 10000);
        
        // Only mint and update if there are actual rewards to mint
        if (reward > 0) {
            _mint(address(this), reward);
            accRewardPerShare += (reward * 1e12) / totalStaked;
        }
        
        lastRewardTime = block.timestamp;
    }
    
    /**
     * @dev Internal function to calculate pending rewards
     */
    function _pendingRewards(address account) internal view returns (uint256) {
        StakeInfo memory userStake = stakes[account];
        return ((userStake.amount * accRewardPerShare) / 1e12) - userStake.rewardDebt;
    }
    
    /**
     * @dev Internal function to claim rewards
     */
    function _claimRewards(address account, uint256 amount) internal {
        _transfer(address(this), account, amount);
        emit RewardClaimed(account, amount);
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