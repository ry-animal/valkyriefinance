// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title ValkryieVault
 * @dev ERC-4626 compliant vault with AI-driven yield optimization
 * Features:
 * - Standard ERC-4626 vault functionality
 * - Multiple yield strategies
 * - AI-controlled strategy allocation
 * - Performance fee mechanism
 * - Emergency pause functionality
 */
contract ValkryieVault is ERC4626, Ownable, ReentrancyGuard {
    using Math for uint256;
    
    // Strategy configuration
    struct Strategy {
        address strategyAddress;
        uint256 allocation;          // Allocation percentage (basis points)
        uint256 totalAssets;         // Assets allocated to this strategy
        bool isActive;               // Whether strategy is active
        string name;                 // Strategy name
        uint256 expectedApy;         // Expected APY in basis points
        uint256 actualApy;           // Actual APY in basis points
    }
    
    // Vault state
    mapping(uint256 => Strategy) public strategies;
    uint256 public strategyCount;
    uint256 public totalAllocated;
    
    // Performance tracking
    uint256 public totalProfits;
    uint256 public totalLosses;
    uint256 public lastRebalance;
    uint256 public performanceFee = 200; // 2% in basis points
    address public feeRecipient;
    
    // Vault configuration
    uint256 public maxTotalAssets;
    uint256 public minDeposit = 1e18; // Minimum deposit amount
    bool public paused = false;
    
    // AI integration
    address public aiController;
    mapping(address => bool) public authorizedRebalancers;
    
    // Events
    event StrategyAdded(uint256 indexed strategyId, address strategyAddress, string name);
    event StrategyUpdated(uint256 indexed strategyId, uint256 allocation, bool isActive);
    event Rebalanced(address indexed rebalancer, uint256 timestamp);
    event PerformanceFeeCollected(uint256 amount, address recipient);
    event EmergencyPause(bool paused);
    event AIControllerUpdated(address oldController, address newController);
    
    modifier notPaused() {
        require(!paused, "Vault is paused");
        _;
    }
    
    modifier onlyRebalancer() {
        require(
            authorizedRebalancers[msg.sender] || msg.sender == owner() || msg.sender == aiController,
            "Not authorized to rebalance"
        );
        _;
    }
    
    /**
     * @dev Constructor
     * @param asset_ The underlying asset token
     * @param name_ Vault token name
     * @param symbol_ Vault token symbol
     * @param owner_ Vault owner
     * @param feeRecipient_ Fee recipient address
     */
    constructor(
        IERC20 asset_,
        string memory name_,
        string memory symbol_,
        address owner_,
        address feeRecipient_
    ) 
        ERC4626(asset_)
        ERC20(name_, symbol_)
        Ownable(owner_)
    {
        feeRecipient = feeRecipient_;
        lastRebalance = block.timestamp;
        maxTotalAssets = type(uint256).max;
    }
    
    /**
     * @dev Add a new yield strategy
     * @param strategyAddress Address of the strategy contract
     * @param allocation Initial allocation in basis points
     * @param name Strategy name
     * @param expectedApy Expected APY in basis points
     */
    function addStrategy(
        address strategyAddress,
        uint256 allocation,
        string memory name,
        uint256 expectedApy
    ) external onlyOwner {
        require(strategyAddress != address(0), "Invalid strategy address");
        require(allocation <= 10000, "Allocation cannot exceed 100%");
        require(totalAllocated + allocation <= 10000, "Total allocation exceeds 100%");
        
        uint256 strategyId = strategyCount++;
        strategies[strategyId] = Strategy({
            strategyAddress: strategyAddress,
            allocation: allocation,
            totalAssets: 0,
            isActive: true,
            name: name,
            expectedApy: expectedApy,
            actualApy: 0
        });
        
        totalAllocated += allocation;
        
        emit StrategyAdded(strategyId, strategyAddress, name);
    }
    
    /**
     * @dev Update strategy allocation
     * @param strategyId Strategy ID to update
     * @param newAllocation New allocation in basis points
     * @param isActive Whether strategy should be active
     */
    function updateStrategy(
        uint256 strategyId,
        uint256 newAllocation,
        bool isActive
    ) external onlyOwner {
        require(strategyId < strategyCount, "Strategy does not exist");
        require(newAllocation <= 10000, "Allocation cannot exceed 100%");
        
        Strategy storage strategy = strategies[strategyId];
        uint256 oldAllocation = strategy.allocation;
        
        // Update total allocated
        totalAllocated = totalAllocated - oldAllocation + newAllocation;
        require(totalAllocated <= 10000, "Total allocation exceeds 100%");
        
        strategy.allocation = newAllocation;
        strategy.isActive = isActive;
        
        emit StrategyUpdated(strategyId, newAllocation, isActive);
    }
    
    /**
     * @dev Rebalance assets across strategies (AI-controlled)
     * @param newAllocations Array of new allocations for each strategy
     */
    function rebalance(uint256[] memory newAllocations) external onlyRebalancer nonReentrant {
        require(newAllocations.length == strategyCount, "Invalid allocations length");
        
        uint256 totalAllocation = 0;
        for (uint256 i = 0; i < newAllocations.length; i++) {
            totalAllocation += newAllocations[i];
        }
        require(totalAllocation <= 10000, "Total allocation exceeds 100%");
        
        uint256 totalVaultAssets = totalAssets();
        
        // Update allocations and rebalance
        for (uint256 i = 0; i < strategyCount; i++) {
            if (strategies[i].isActive) {
                strategies[i].allocation = newAllocations[i];
                uint256 targetAssets = (totalVaultAssets * newAllocations[i]) / 10000;
                
                // Rebalance logic would go here
                // For now, just update the target allocation
                strategies[i].totalAssets = targetAssets;
            }
        }
        
        totalAllocated = totalAllocation;
        lastRebalance = block.timestamp;
        
        emit Rebalanced(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Collect performance fees
     */
    function collectPerformanceFees() external nonReentrant {
        uint256 currentAssets = totalAssets();
        uint256 totalShares = totalSupply();
        
        if (totalShares > 0 && currentAssets > 0) {
            uint256 currentShareValue = (currentAssets * 1e18) / totalShares;
            
            // Calculate performance fee if vault has grown
            // This is a simplified implementation
            if (totalProfits > 0) {
                uint256 feeAmount = (totalProfits * performanceFee) / 10000;
                if (feeAmount > 0) {
                    _mint(feeRecipient, convertToShares(feeAmount));
                    emit PerformanceFeeCollected(feeAmount, feeRecipient);
                }
            }
        }
    }
    
    /**
     * @dev Emergency pause/unpause
     * @param _paused Whether to pause the vault
     */
    function emergencyPause(bool _paused) external onlyOwner {
        paused = _paused;
        emit EmergencyPause(_paused);
    }
    
    /**
     * @dev Set AI controller address
     * @param newController New AI controller address
     */
    function setAIController(address newController) external onlyOwner {
        address oldController = aiController;
        aiController = newController;
        emit AIControllerUpdated(oldController, newController);
    }
    
    /**
     * @dev Authorize/deauthorize rebalancer
     * @param rebalancer Address to authorize/deauthorize
     * @param authorized Whether to authorize
     */
    function setAuthorizedRebalancer(address rebalancer, bool authorized) external onlyOwner {
        authorizedRebalancers[rebalancer] = authorized;
    }
    
    /**
     * @dev Set performance fee
     * @param newFee New performance fee in basis points
     */
    function setPerformanceFee(uint256 newFee) external onlyOwner {
        require(newFee <= 2000, "Fee cannot exceed 20%");
        performanceFee = newFee;
    }
    
    /**
     * @dev Set fee recipient
     * @param newRecipient New fee recipient address
     */
    function setFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Invalid recipient");
        feeRecipient = newRecipient;
    }
    
    /**
     * @dev Set minimum deposit amount
     * @param newMinDeposit New minimum deposit amount
     */
    function setMinDeposit(uint256 newMinDeposit) external onlyOwner {
        minDeposit = newMinDeposit;
    }
    
    /**
     * @dev Get strategy information
     * @param strategyId Strategy ID
     * @return Strategy struct
     */
    function getStrategy(uint256 strategyId) external view returns (Strategy memory) {
        require(strategyId < strategyCount, "Strategy does not exist");
        return strategies[strategyId];
    }
    
    /**
     * @dev Get vault performance metrics
     * @return totalAssets_ Total assets under management
     * @return totalShares_ Total shares outstanding
     * @return sharePrice_ Current share price
     * @return apy_ Current APY estimate
     */
    function getVaultMetrics() external view returns (
        uint256 totalAssets_,
        uint256 totalShares_,
        uint256 sharePrice_,
        uint256 apy_
    ) {
        totalAssets_ = totalAssets();
        totalShares_ = totalSupply();
        sharePrice_ = totalShares_ > 0 ? (totalAssets_ * 1e18) / totalShares_ : 1e18;
        
        // Simple APY calculation based on strategy expected returns
        uint256 weightedApy = 0;
        for (uint256 i = 0; i < strategyCount; i++) {
            if (strategies[i].isActive) {
                weightedApy += (strategies[i].expectedApy * strategies[i].allocation) / 10000;
            }
        }
        apy_ = weightedApy;
    }
    
    // Override ERC4626 functions to add pause and minimum deposit checks
    function deposit(uint256 assets, address receiver)
        public
        override
        notPaused
        nonReentrant
        returns (uint256)
    {
        require(assets >= minDeposit, "Below minimum deposit");
        require(totalAssets() + assets <= maxTotalAssets, "Exceeds vault capacity");
        return super.deposit(assets, receiver);
    }
    
    function mint(uint256 shares, address receiver)
        public
        override
        notPaused
        nonReentrant
        returns (uint256)
    {
        uint256 assets = convertToAssets(shares);
        require(assets >= minDeposit, "Below minimum deposit");
        require(totalAssets() + assets <= maxTotalAssets, "Exceeds vault capacity");
        return super.mint(shares, receiver);
    }
    
    function withdraw(uint256 assets, address receiver, address owner)
        public
        override
        notPaused
        nonReentrant
        returns (uint256)
    {
        return super.withdraw(assets, receiver, owner);
    }
    
    function redeem(uint256 shares, address receiver, address owner)
        public
        override
        notPaused
        nonReentrant
        returns (uint256)
    {
        return super.redeem(shares, receiver, owner);
    }
    
    /**
     * @dev Calculate total assets (base implementation for demo)
     * In production, this would aggregate assets from all strategies
     */
    function totalAssets() public view override returns (uint256) {
        // Simple implementation: just the balance held by this contract
        // In production, this would query all strategy contracts
        return IERC20(asset()).balanceOf(address(this));
    }
} 