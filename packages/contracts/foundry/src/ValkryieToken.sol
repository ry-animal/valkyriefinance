// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ValkryieToken
 * @dev Valkryie platform token with governance, staking, and reward mechanisms
 * Features:
 * - Standard ERC-20 functionality
 * - Governance voting with delegation (ERC20Votes)
 * - Staking mechanism with rewards
 * - Platform utility functions
 */
contract ValkryieToken is ERC20, ERC20Votes, ERC20Permit, Ownable, ReentrancyGuard {
    
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
     * @dev Stake tokens to earn rewards
     * @param amount Amount of tokens to stake
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
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
     * @dev Unstake tokens
     * @param amount Amount of tokens to unstake
     */
    function unstake(uint256 amount) external nonReentrant {
        StakeInfo storage userStake = stakes[msg.sender];
        require(userStake.amount >= amount, "Insufficient staked amount");
        
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
     * @dev Claim pending rewards
     */
    function claimRewards() external nonReentrant {
        _updatePool();
        
        uint256 pending = _pendingRewards(msg.sender);
        require(pending > 0, "No rewards to claim");
        
        StakeInfo storage userStake = stakes[msg.sender];
        userStake.rewardDebt = (userStake.amount * accRewardPerShare) / 1e12;
        
        _claimRewards(msg.sender, pending);
    }
    
    /**
     * @dev Get staked balance of an account
     * @param account Account to check
     * @return Staked amount
     */
    function stakedBalance(address account) external view returns (uint256) {
        return stakes[account].amount;
    }
    
    /**
     * @dev Get pending rewards for an account
     * @param account Account to check
     * @return Pending reward amount
     */
    function pendingRewards(address account) external view returns (uint256) {
        if (totalStaked == 0) return 0;
        
        uint256 accRewardPerShareTemp = accRewardPerShare;
        
        // Calculate time-based rewards
        if (block.timestamp > lastRewardTime && totalStaked > 0) {
            uint256 timeElapsed = block.timestamp - lastRewardTime;
            uint256 reward = (totalStaked * rewardRate * timeElapsed) / (365 days * 10000);
            accRewardPerShareTemp += (reward * 1e12) / totalStaked;
        }
        
        StakeInfo memory userStake = stakes[account];
        return ((userStake.amount * accRewardPerShareTemp) / 1e12) - userStake.rewardDebt;
    }
    
    /**
     * @dev Update reward rate (owner only)
     * @param newRate New reward rate in basis points
     */
    function setRewardRate(uint256 newRate) external onlyOwner {
        require(newRate <= 10000, "Rate cannot exceed 100%");
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
        
        // Mint rewards
        _mint(address(this), reward);
        
        accRewardPerShare += (reward * 1e12) / totalStaked;
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