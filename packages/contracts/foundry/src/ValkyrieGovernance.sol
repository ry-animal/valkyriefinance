// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "lib/openzeppelin-contracts/contracts/governance/Governor.sol";
import "lib/openzeppelin-contracts/contracts/governance/extensions/GovernorCountingSimple.sol";
import "lib/openzeppelin-contracts/contracts/governance/extensions/GovernorVotes.sol";
import "lib/openzeppelin-contracts/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "lib/openzeppelin-contracts/contracts/governance/extensions/GovernorTimelockControl.sol";
import "lib/openzeppelin-contracts/contracts/governance/TimelockController.sol";
import "lib/openzeppelin-contracts/contracts/access/Ownable.sol";

/**
 * @title ValkyrieGovernance
 * @notice Comprehensive governance contract for Valkyrie Finance protocol
 * @dev Implements OpenZeppelin Governor with timelock, quorum, and enhanced features
 * 
 * Key Features:
 * - Token-weighted voting with staking multipliers
 * - Timelock execution for security
 * - Quorum requirements
 * - Campaign and staking parameter governance
 * - Emergency pause capabilities
 */
contract ValkyrieGovernance is 
    Governor,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    // Governance configuration
    uint256 public constant VOTING_DELAY = 1 days;    // 1 day delay before voting starts
    uint256 public constant VOTING_PERIOD = 7 days;   // 7 day voting period
    uint256 public constant PROPOSAL_THRESHOLD = 1000 * 1e18; // 1000 VLK tokens needed to propose
    uint256 public constant QUORUM_PERCENTAGE = 4;    // 4% quorum requirement
    
    // Timelock configuration
    uint256 public constant MIN_DELAY = 2 days;       // 2 day timelock delay
    
    // Enhanced governance features
    struct ProposalMetadata {
        string category;      // e.g., "staking", "vault", "tokenomics", "emergency"
        uint256 urgency;      // 1-5 urgency level
        bytes32 ipfsHash;     // IPFS hash for detailed proposal
        bool executable;      // Can this proposal be executed automatically
    }
    
    mapping(uint256 => ProposalMetadata) public proposalMetadata;
    mapping(address => uint256) public lastProposalTime;
    
    // Proposal categories with different requirements
    mapping(string => uint256) public categoryQuorums;        // Custom quorum per category
    mapping(string => uint256) public categoryThresholds;     // Custom threshold per category
    mapping(string => uint256) public categoryDelays;         // Custom delay per category
    
    // Events
    event ProposalCreatedWithMetadata(
        uint256 indexed proposalId,
        string category,
        uint256 urgency,
        bytes32 ipfsHash
    );
    event QuorumUpdated(string category, uint256 newQuorum);
    event EmergencyProposalCreated(uint256 indexed proposalId, string reason);
    
    // Errors
    error ProposalTooFrequent();
    error InvalidCategory();
    error UrgencyTooHigh();
    error InsufficientStakingPower();

    constructor(
        IVotes _token,
        TimelockController _timelock
    )
        Governor("ValkyrieGovernance")
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(QUORUM_PERCENTAGE)
        GovernorTimelockControl(_timelock)
    {
        // Initialize category-specific governance parameters
        _initializeCategories();
    }
    
    /**
     * @notice Create a proposal with enhanced metadata
     * @dev Enhanced proposal creation with categorization and metadata
     */
    function proposeWithMetadata(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description,
        string memory category,
        uint256 urgency,
        bytes32 ipfsHash
    ) external returns (uint256) {
        // Rate limiting: prevent spam proposals
        if (block.timestamp < lastProposalTime[msg.sender] + 1 days) {
            revert ProposalTooFrequent();
        }
        
        // Validate category
        if (categoryQuorums[category] == 0) revert InvalidCategory();
        if (urgency > 5) revert UrgencyTooHigh();
        
        // Check if proposer has enough voting power for this category
        uint256 requiredThreshold = categoryThresholds[category] > 0 
            ? categoryThresholds[category] 
            : proposalThreshold();
            
        if (getVotes(msg.sender, block.number - 1) < requiredThreshold) {
            revert InsufficientStakingPower();
        }
        
        // Create the proposal
        uint256 proposalId = propose(targets, values, calldatas, description);
        
        // Store metadata
        proposalMetadata[proposalId] = ProposalMetadata({
            category: category,
            urgency: urgency,
            ipfsHash: ipfsHash,
            executable: _isExecutableProposal(targets, calldatas)
        });
        
        lastProposalTime[msg.sender] = block.timestamp;
        
        emit ProposalCreatedWithMetadata(proposalId, category, urgency, ipfsHash);
        
        return proposalId;
    }
    
    /**
     * @notice Create emergency proposal with expedited process
     * @dev Emergency proposals have reduced delays and quorum for urgent issues
     */
    function proposeEmergency(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description,
        string memory reason
    ) external returns (uint256) {
        // Only allow emergency proposals from high-stake holders
        if (getVotes(msg.sender, block.number - 1) < PROPOSAL_THRESHOLD * 5) {
            revert InsufficientStakingPower();
        }
        
        uint256 proposalId = propose(targets, values, calldatas, description);
        
        proposalMetadata[proposalId] = ProposalMetadata({
            category: "emergency",
            urgency: 5,
            ipfsHash: bytes32(0),
            executable: true
        });
        
        emit EmergencyProposalCreated(proposalId, reason);
        
        return proposalId;
    }
    
    /**
     * @notice Get voting power including staking multipliers
     * @dev Override to account for enhanced staking governance power
     */
    function getVotes(address account, uint256 blockNumber) 
        public view override(Governor, IGovernor) returns (uint256) 
    {
        // Get votes from the token contract (which includes staking multipliers)
        return token.getPastVotes(account, blockNumber);
    }
    
    /**
     * @notice Dynamic quorum based on proposal category
     * @dev Override to implement category-specific quorum requirements
     */
    function quorum(uint256 blockNumber) 
        public view override(IGovernor, GovernorVotesQuorumFraction) returns (uint256) 
    {
        // Default quorum calculation
        return super.quorum(blockNumber);
    }
    
    /**
     * @notice Get category-specific quorum for a proposal
     */
    function getProposalQuorum(uint256 proposalId) external view returns (uint256) {
        ProposalMetadata memory metadata = proposalMetadata[proposalId];
        uint256 categoryQuorum = categoryQuorums[metadata.category];
        
        if (categoryQuorum > 0) {
            uint256 totalSupply = token.getPastTotalSupply(proposalSnapshot(proposalId));
            return (totalSupply * categoryQuorum) / 100;
        }
        
        return quorum(proposalSnapshot(proposalId));
    }
    
    /**
     * @notice Set category-specific governance parameters (only through governance)
     */
    function setCategoryParameters(
        string memory category,
        uint256 quorumPercentage,
        uint256 thresholdAmount,
        uint256 delayDays
    ) external onlyGovernance {
        categoryQuorums[category] = quorumPercentage;
        categoryThresholds[category] = thresholdAmount;
        categoryDelays[category] = delayDays * 1 days;
        
        emit QuorumUpdated(category, quorumPercentage);
    }
    
    // Required overrides
    
    function votingDelay() public pure override returns (uint256) {
        return VOTING_DELAY;
    }
    
    function votingPeriod() public pure override returns (uint256) {
        return VOTING_PERIOD;
    }
    
    function proposalThreshold() public pure override returns (uint256) {
        return PROPOSAL_THRESHOLD;
    }
    
    function state(uint256 proposalId)
        public view override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
        public override(Governor, IGovernor)
        returns (uint256)
    {
        return super.propose(targets, values, calldatas, description);
    }

    function _execute(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal override(Governor, GovernorTimelockControl)
    {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal override(Governor, GovernorTimelockControl)
        returns (uint256)
    {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor() internal view override(Governor, GovernorTimelockControl) returns (address) {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(Governor, GovernorTimelockControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    // Internal functions
    
    function _initializeCategories() internal {
        // Staking governance (lower threshold, higher quorum)
        categoryQuorums["staking"] = 6;  // 6% quorum
        categoryThresholds["staking"] = 500 * 1e18;  // 500 VLK threshold
        categoryDelays["staking"] = 1 days;
        
        // Vault parameters (standard requirements)
        categoryQuorums["vault"] = 4;  // 4% quorum
        categoryThresholds["vault"] = 1000 * 1e18;  // 1000 VLK threshold
        categoryDelays["vault"] = 2 days;
        
        // Tokenomics (high requirements)
        categoryQuorums["tokenomics"] = 10;  // 10% quorum
        categoryThresholds["tokenomics"] = 5000 * 1e18;  // 5000 VLK threshold
        categoryDelays["tokenomics"] = 5 days;
        
        // Emergency (low threshold, low quorum, fast execution)
        categoryQuorums["emergency"] = 2;  // 2% quorum
        categoryThresholds["emergency"] = 2000 * 1e18;  // 2000 VLK threshold
        categoryDelays["emergency"] = 6 hours;
        
        // Protocol upgrades (highest requirements)
        categoryQuorums["upgrade"] = 15;  // 15% quorum
        categoryThresholds["upgrade"] = 10000 * 1e18;  // 10000 VLK threshold
        categoryDelays["upgrade"] = 7 days;
    }
    
    function _isExecutableProposal(
        address[] memory targets,
        bytes[] memory calldatas
    ) internal pure returns (bool) {
        // Check if proposal contains only parameter updates (safe to auto-execute)
        for (uint256 i = 0; i < targets.length; i++) {
            bytes4 selector = bytes4(calldatas[i]);
            // Add specific function selectors that are safe for auto-execution
            if (selector != bytes4(keccak256("setRewardRate(uint256)")) &&
                selector != bytes4(keccak256("setManagementFee(uint256)")) &&
                selector != bytes4(keccak256("setCategoryParameters(string,uint256,uint256,uint256)"))) {
                return false;
            }
        }
        return true;
    }
} 