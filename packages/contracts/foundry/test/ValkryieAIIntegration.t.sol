// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/ValkryieVault.sol";
import "../src/ValkryieAutomation.sol";
import "../src/ValkryiePriceOracle.sol";
import "../src/ValkryieToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title ValkryieAIIntegrationTest
 * @dev Comprehensive test suite for AI-driven vault with Chainlink integration
 * Following the chainlink-for-ai-vault framework testing methodology:
 * - Unit testing for individual components
 * - Fuzz testing for edge cases and extreme inputs
 * - Invariant testing for fundamental properties
 * - Integration testing with mock Chainlink services
 */
contract ValkryieAIIntegrationTest is Test {
    ValkryieVault public vault;
    ValkryieAutomation public automation;
    ValkryiePriceOracle public priceOracle;
    ValkryieToken public valkToken;
    ERC20 public mockUSDC;
    
    // Mock Chainlink components
    address public mockVRFCoordinator;
    address public mockFunctionsRouter;
    address public mockCCIPRouter;
    address public mockPriceFeed;
    
    // Test accounts
    address public owner;
    address public alice;
    address public bob;
    address public aiController;
    address public feeRecipient;
    
    // Test constants
    uint256 public constant INITIAL_SUPPLY = 1000000e18;
    uint256 public constant PRICE_PRECISION = 1e18;
    uint256 public constant MAX_ALLOCATION = 10000;
    
    // Events for testing
    event AIRebalanceExecuted(address indexed aiController, uint256 timestamp, uint256[] allocations);
    event RiskThresholdBreached(uint256 riskScore, uint256 threshold);
    event EmergencyPause(bool paused, string reason);
    
    function setUp() public {
        // Set up test accounts
        owner = makeAddr("owner");
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        aiController = makeAddr("aiController");
        feeRecipient = makeAddr("feeRecipient");
        
        // Deploy mock contracts
        vm.startPrank(owner);
        
        // Deploy mock USDC
        mockUSDC = new ERC20("Mock USDC", "USDC");
        deal(address(mockUSDC), alice, 10000e6);
        deal(address(mockUSDC), bob, 10000e6);
        
        // Deploy VALK token
        valkToken = new ValkryieToken(owner, INITIAL_SUPPLY);
        
        // Create mock Chainlink addresses
        mockVRFCoordinator = makeAddr("vrfCoordinator");
        mockFunctionsRouter = makeAddr("functionsRouter");
        mockCCIPRouter = makeAddr("ccipRouter");
        mockPriceFeed = makeAddr("priceFeed");
        
        // Deploy price oracle
        priceOracle = new ValkryiePriceOracle();
        
        // Deploy vault with all integrations
        vault = new ValkryieVault(
            IERC20(address(mockUSDC)),
            "Valkryie AI Vault",
            "vAI-USDC",
            owner,
            feeRecipient,
            address(priceOracle),
            mockVRFCoordinator,
            mockCCIPRouter
        );
        
        // Deploy automation system
        automation = new ValkryieAutomation(
            mockFunctionsRouter,
            address(vault),
            address(priceOracle),
            bytes32("donId"),
            1 // subscriptionId
        );
        
        // Configure vault with AI controller
        vault.setAIController(address(automation));
        
        vm.stopPrank();
    }
    
    // =================================================================
    // UNIT TESTS
    // =================================================================
    
    function testVaultInitialization() public {
        assertEq(address(vault.asset()), address(mockUSDC));
        assertEq(vault.owner(), owner);
        assertEq(vault.aiController(), address(automation));
        assertFalse(vault.paused());
        assertFalse(vault.emergencyMode());
        
        // Check AI configuration
        ValkryieVault.AIStrategyConfig memory config = vault.getAIConfig();
        assertEq(config.rebalanceThreshold, 500); // 5%
        assertEq(config.riskThreshold, 7500); // 75%
        assertEq(config.maxLeverage, 20000); // 2x
        assertTrue(config.aiControlEnabled);
        assertTrue(config.emergencyPauseEnabled);
    }
    
    function testAddStrategy() public {
        vm.startPrank(owner);
        
        address mockStrategy = makeAddr("strategy1");
        
        vm.expectEmit(true, false, false, true);
        // emit VaultBase.StrategyAdded(0, mockStrategy, "Test Strategy");
        
        vault.addStrategy(
            mockStrategy,
            2000, // 20% allocation
            "Test Strategy",
            500, // 5% expected APY
            5000, // 50% risk score
            0 // same chain
        );
        
        ValkryieVault.Strategy memory strategy = vault.getStrategy(0);
        assertEq(strategy.strategyAddress, mockStrategy);
        assertEq(strategy.allocation, 2000);
        assertEq(strategy.riskScore, 5000);
        assertTrue(strategy.isActive);
        
        vm.stopPrank();
    }
    
    function testAIRebalancing() public {
        // Setup strategy
        vm.startPrank(owner);
        vault.addStrategy(
            makeAddr("strategy1"),
            5000, // 50%
            "Strategy 1",
            500,
            4000, // Low risk
            0
        );
        vault.addStrategy(
            makeAddr("strategy2"),
            3000, // 30%
            "Strategy 2", 
            800,
            6000, // Medium risk
            0
        );
        vm.stopPrank();
        
        // Test AI rebalancing
        vm.startPrank(address(automation));
        
        uint256[] memory newAllocations = new uint256[](2);
        newAllocations[0] = 4000; // 40%
        newAllocations[1] = 4000; // 40%
        
        vm.expectEmit(true, false, false, true);
        emit AIRebalanceExecuted(address(automation), block.timestamp, newAllocations);
        
        vault.rebalanceStrategy(newAllocations);
        
        // Verify rebalancing
        ValkryieVault.Strategy memory strategy1 = vault.getStrategy(0);
        ValkryieVault.Strategy memory strategy2 = vault.getStrategy(1);
        
        assertEq(strategy1.allocation, 4000);
        assertEq(strategy2.allocation, 4000);
        
        vm.stopPrank();
    }
    
    function testRiskThresholdBreach() public {
        // Setup high-risk strategy
        vm.startPrank(owner);
        vault.addStrategy(
            makeAddr("highRiskStrategy"),
            8000, // 80%
            "High Risk Strategy",
            1500,
            9500, // 95% risk score
            0
        );
        vm.stopPrank();
        
        // Attempt rebalancing that exceeds risk threshold
        vm.startPrank(address(automation));
        
        uint256[] memory dangerousAllocations = new uint256[](1);
        dangerousAllocations[0] = 8000; // This will breach risk threshold
        
        vm.expectEmit(false, false, false, true);
        emit RiskThresholdBreached(7600, 7500); // 9500 * 0.8 = 7600 > 7500
        
        vm.expectEmit(false, false, false, true);
        emit EmergencyPause(true, "Risk threshold exceeded");
        
        vault.rebalanceStrategy(dangerousAllocations);
        
        // Verify vault is paused
        assertTrue(vault.paused());
        
        vm.stopPrank();
    }
    
    function testEmergencyMode() public {
        // Deposit some assets first
        vm.startPrank(alice);
        mockUSDC.approve(address(vault), 1000e6);
        vault.deposit(1000e6, alice);
        vm.stopPrank();
        
        // Enable emergency mode
        vm.startPrank(address(automation));
        vault.enableEmergencyWithdrawals();
        assertTrue(vault.emergencyMode());
        vm.stopPrank();
        
        // Test emergency withdrawal
        vm.startPrank(alice);
        uint256 balanceBefore = mockUSDC.balanceOf(alice);
        vault.withdraw(500e6, alice, alice);
        uint256 balanceAfter = mockUSDC.balanceOf(alice);
        
        assertEq(balanceAfter - balanceBefore, 500e6);
        vm.stopPrank();
    }
    
    // =================================================================
    // FUZZ TESTS
    // =================================================================
    
    function testFuzzDeposit(uint256 depositAmount) public {
        // Bound deposit amount to reasonable range
        depositAmount = bound(depositAmount, 1e6, 1000000e6);
        
        vm.startPrank(alice);
        deal(address(mockUSDC), alice, depositAmount);
        mockUSDC.approve(address(vault), depositAmount);
        
        uint256 sharesBefore = vault.balanceOf(alice);
        vault.deposit(depositAmount, alice);
        uint256 sharesAfter = vault.balanceOf(alice);
        
        assertGt(sharesAfter, sharesBefore);
        assertEq(vault.totalAssets(), depositAmount);
        
        vm.stopPrank();
    }
    
    function testFuzzRebalancing(uint256[3] memory allocations) public {
        // Setup three strategies
        vm.startPrank(owner);
        vault.addStrategy(makeAddr("strategy1"), 0, "Strategy 1", 500, 3000, 0);
        vault.addStrategy(makeAddr("strategy2"), 0, "Strategy 2", 700, 4000, 0);
        vault.addStrategy(makeAddr("strategy3"), 0, "Strategy 3", 400, 2000, 0);
        vm.stopPrank();
        
        // Bound allocations to valid range and ensure they don't exceed 100%
        for (uint256 i = 0; i < 3; i++) {
            allocations[i] = bound(allocations[i], 0, MAX_ALLOCATION / 3);
        }
        
        uint256 totalAllocation = allocations[0] + allocations[1] + allocations[2];
        vm.assume(totalAllocation <= MAX_ALLOCATION);
        
        // Calculate risk score
        uint256 riskScore = (3000 * allocations[0] + 4000 * allocations[1] + 2000 * allocations[2]) / MAX_ALLOCATION;
        vm.assume(riskScore <= 7500); // Don't breach risk threshold
        
        vm.startPrank(address(automation));
        
        uint256[] memory newAllocations = new uint256[](3);
        newAllocations[0] = allocations[0];
        newAllocations[1] = allocations[1];
        newAllocations[2] = allocations[2];
        
        vault.rebalanceStrategy(newAllocations);
        
        // Verify allocations were set correctly
        for (uint256 i = 0; i < 3; i++) {
            assertEq(vault.getStrategy(i).allocation, allocations[i]);
        }
        
        vm.stopPrank();
    }
    
    function testFuzzPriceOracle(uint256 price, uint256 timestamp) public {
        price = bound(price, 1e6, 1000000e18); // $1 to $1M
        timestamp = bound(timestamp, block.timestamp, block.timestamp + 365 days);
        
        vm.startPrank(owner);
        
        // Mock price feed behavior
        vm.mockCall(
            mockPriceFeed,
            abi.encodeWithSelector(IChainlinkPriceFeed.latestRoundData.selector),
            abi.encode(1, int256(price), timestamp, timestamp, 1)
        );
        
        vm.mockCall(
            mockPriceFeed,
            abi.encodeWithSelector(IChainlinkPriceFeed.decimals.selector),
            abi.encode(uint8(18))
        );
        
        priceOracle.addPriceFeed(
            address(mockUSDC),
            mockPriceFeed,
            "USDC",
            3600
        );
        
        (uint256 returnedPrice, uint256 returnedTimestamp) = priceOracle.getPrice(address(mockUSDC));
        
        assertEq(returnedPrice, price);
        assertEq(returnedTimestamp, timestamp);
        
        vm.stopPrank();
    }
    
    // =================================================================
    // INVARIANT TESTS
    // =================================================================
    
    function invariant_totalAssetsAlwaysCorrect() public {
        // Total assets should always equal the sum of strategy assets plus idle balance
        uint256 calculatedTotal = mockUSDC.balanceOf(address(vault));
        
        for (uint256 i = 0; i < vault.strategyCount(); i++) {
            ValkryieVault.Strategy memory strategy = vault.getStrategy(i);
            if (strategy.isActive) {
                calculatedTotal += strategy.totalAssets;
            }
        }
        
        assertEq(vault.totalAssets(), calculatedTotal);
    }
    
    function invariant_sharesNeverExceedAssets() public {
        // Total supply of shares should be reasonable relative to total assets
        uint256 totalShares = vault.totalSupply();
        uint256 totalAssets = vault.totalAssets();
        
        if (totalShares > 0) {
            uint256 sharePrice = (totalAssets * PRICE_PRECISION) / totalShares;
            assertGe(sharePrice, PRICE_PRECISION / 10); // Share price shouldn't be less than 0.1
            assertLe(sharePrice, PRICE_PRECISION * 1000); // Share price shouldn't exceed 1000x
        }
    }
    
    function invariant_allocationsNeverExceed100Percent() public {
        uint256 totalAllocation = 0;
        
        for (uint256 i = 0; i < vault.strategyCount(); i++) {
            ValkryieVault.Strategy memory strategy = vault.getStrategy(i);
            if (strategy.isActive) {
                totalAllocation += strategy.allocation;
            }
        }
        
        assertLe(totalAllocation, MAX_ALLOCATION);
    }
    
    function invariant_vaultNeverInsolvent() public {
        // Vault should always have enough assets to back outstanding shares
        uint256 totalShares = vault.totalSupply();
        
        if (totalShares > 0) {
            uint256 totalAssets = vault.totalAssets();
            assertGt(totalAssets, 0);
            
            // Should be able to redeem at least some shares
            if (totalAssets > 0) {
                uint256 redeemableShares = vault.previewRedeem(totalShares);
                assertGt(redeemableShares, 0);
            }
        }
    }
    
    // =================================================================
    // INTEGRATION TESTS
    // =================================================================
    
    function testFullAIWorkflow() public {
        // 1. Setup strategies
        vm.startPrank(owner);
        vault.addStrategy(makeAddr("strategy1"), 3000, "Conservative", 300, 2000, 0);
        vault.addStrategy(makeAddr("strategy2"), 4000, "Moderate", 600, 5000, 0);
        vault.addStrategy(makeAddr("strategy3"), 2000, "Aggressive", 1000, 8000, 0);
        vm.stopPrank();
        
        // 2. Users deposit
        vm.startPrank(alice);
        mockUSDC.approve(address(vault), 5000e6);
        vault.deposit(5000e6, alice);
        vm.stopPrank();
        
        vm.startPrank(bob);
        deal(address(mockUSDC), bob, 3000e6);
        mockUSDC.approve(address(vault), 3000e6);
        vault.deposit(3000e6, bob);
        vm.stopPrank();
        
        // 3. AI performs rebalancing
        vm.startPrank(address(automation));
        uint256[] memory newAllocations = new uint256[](3);
        newAllocations[0] = 4000; // Increase conservative
        newAllocations[1] = 3000; // Decrease moderate
        newAllocations[2] = 1500; // Decrease aggressive
        
        vault.rebalanceStrategy(newAllocations);
        vm.stopPrank();
        
        // 4. Verify final state
        assertEq(vault.totalAssets(), 8000e6);
        assertGt(vault.balanceOf(alice), 0);
        assertGt(vault.balanceOf(bob), 0);
        
        // Check that allocations were updated
        assertEq(vault.getStrategy(0).allocation, 4000);
        assertEq(vault.getStrategy(1).allocation, 3000);
        assertEq(vault.getStrategy(2).allocation, 1500);
    }
    
    function testCrossChainIntegration() public {
        // Setup cross-chain strategy
        vm.startPrank(owner);
        vault.addStrategy(makeAddr("arbitrumStrategy"), 2000, "Arbitrum Strategy", 800, 4000, 42161);
        vm.stopPrank();
        
        // Mock CCIP router behavior
        vm.mockCall(
            mockCCIPRouter,
            abi.encodeWithSignature("getFee(uint64,(bytes,bytes,(address,uint256)[],bytes,address))"),
            abi.encode(0.01 ether)
        );
        
        vm.mockCall(
            mockCCIPRouter,
            abi.encodeWithSignature("ccipSend(uint64,(bytes,bytes,(address,uint256)[],bytes,address))"),
            abi.encode(bytes32("messageId"))
        );
        
        vm.startPrank(address(automation));
        vm.deal(address(automation), 1 ether);
        
        bytes32 messageId = vault.rebalanceCrossChain{value: 0.01 ether}(
            42161,
            1000e6,
            abi.encode(new uint256[](0), 0)
        );
        
        assertEq(messageId, bytes32("messageId"));
        vm.stopPrank();
    }
    
    function testVRFIntegration() public {
        vm.startPrank(owner);
        
        // Configure VRF
        vault.configureVRF(
            bytes32("keyHash"),
            1,
            100000
        );
        
        // Mock VRF coordinator
        vm.mockCall(
            mockVRFCoordinator,
            abi.encodeWithSignature("requestRandomWords(bytes32,uint64,uint16,uint32,uint32)"),
            abi.encode(bytes32("requestId"))
        );
        
        bytes32 requestId = vault.requestRandomness();
        assertEq(requestId, bytes32("requestId"));
        
        vm.stopPrank();
    }
    
    // =================================================================
    // HELPER FUNCTIONS
    // =================================================================
    
    function _setupVaultWithAssets(uint256 totalAssets) internal {
        vm.startPrank(alice);
        deal(address(mockUSDC), alice, totalAssets);
        mockUSDC.approve(address(vault), totalAssets);
        vault.deposit(totalAssets, alice);
        vm.stopPrank();
    }
    
    function _addMultipleStrategies() internal {
        vm.startPrank(owner);
        vault.addStrategy(makeAddr("strategy1"), 2500, "Strategy 1", 400, 3000, 0);
        vault.addStrategy(makeAddr("strategy2"), 3000, "Strategy 2", 600, 4000, 0);
        vault.addStrategy(makeAddr("strategy3"), 2000, "Strategy 3", 800, 5000, 0);
        vault.addStrategy(makeAddr("strategy4"), 1500, "Strategy 4", 300, 2000, 0);
        vm.stopPrank();
    }
} 