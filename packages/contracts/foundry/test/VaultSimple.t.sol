// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ValkyrieVault} from "../src/ValkyrieVault.sol";
import {ValkyriePriceOracle} from "../src/ValkyriePriceOracle.sol";

// Simple mock ERC20 for testing
contract MockERC20 is IERC20 {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    

    
    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }
    
    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        
        emit Transfer(from, to, amount);
        return true;
    }
    
    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
}

contract VaultSimpleTest is Test {
    ValkyrieVault public vault;
    ValkyriePriceOracle public priceOracle;
    MockERC20 public asset;
    
    address public owner = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);
    address public feeRecipient = address(0x5);
    address public mockVRFCoordinator = address(0x7);
    address public mockCCIPRouter = address(0x8);
    
    uint256 public constant INITIAL_DEPOSIT = 1000 * 1e18;
    
    function setUp() public {
        asset = new MockERC20("Mock USDC", "USDC");
        
        vm.startPrank(owner);
        
        // Deploy price oracle
        priceOracle = new ValkyriePriceOracle();
        
        // Deploy vault with all required parameters
        vault = new ValkyrieVault(
            asset,
            "Valkyrie Vault",
            "vVLK",
            owner,
            feeRecipient,
            address(priceOracle)
        );
        
        vm.stopPrank();
        
        // Mint assets to users
        asset.mint(user1, 100_000 * 1e18);
        asset.mint(user2, 100_000 * 1e18);
        
        // Approve vault for spending
        vm.prank(user1);
        asset.approve(address(vault), type(uint256).max);
        
        vm.prank(user2);
        asset.approve(address(vault), type(uint256).max);
    }
    
    function test_InitialState() public view {
        assertEq(vault.name(), "Valkyrie Vault");
        assertEq(vault.symbol(), "vVLK");
        assertEq(address(vault.asset()), address(asset));
        assertEq(vault.totalAssets(), 0);
        assertEq(vault.totalSupply(), 1000); // DEAD_SHARES are minted to prevent inflation attacks
        assertEq(vault.owner(), owner);
    }
    
    function test_Deposit() public {
        vm.prank(user1);
        uint256 shares = vault.deposit(INITIAL_DEPOSIT, user1);
        
        // Shares might not be exactly 1:1 due to dead shares and potential fees
        assertGt(shares, 0);
        assertEq(vault.balanceOf(user1), shares);
        assertEq(vault.totalAssets(), INITIAL_DEPOSIT);
        assertEq(asset.balanceOf(address(vault)), INITIAL_DEPOSIT);
    }
    
    function test_Withdraw() public {
        // First deposit
        vm.prank(user1);
        uint256 initialShares = vault.deposit(INITIAL_DEPOSIT, user1);
        
        uint256 withdrawAmount = INITIAL_DEPOSIT / 2;
        uint256 balanceBefore = asset.balanceOf(user1);
        
        vm.prank(user1);
        uint256 shares = vault.withdraw(withdrawAmount, user1, user1);
        
        // Shares burned should be proportional to withdrawal
        assertGt(shares, 0);
        assertEq(asset.balanceOf(user1), balanceBefore + withdrawAmount);
        assertEq(vault.balanceOf(user1), initialShares - shares);
    }
    
    function test_MultiUserDeposit() public {
        // User 1 deposits
        vm.prank(user1);
        uint256 shares1 = vault.deposit(INITIAL_DEPOSIT, user1);
        
        // User 2 deposits
        vm.prank(user2);
        uint256 shares2 = vault.deposit(INITIAL_DEPOSIT * 2, user2);
        
        // Shares should be proportional but not necessarily 1:1 due to dead shares
        assertGt(shares1, 0);
        assertGt(shares2, 0);
        assertApproxEqRel(shares2, shares1 * 2, 0.01e18); // Allow 1% tolerance for fees
        assertEq(vault.totalAssets(), INITIAL_DEPOSIT * 3);
    }
    
    function test_AddStrategy() public {
        address strategy = address(0x6);
        
        vm.prank(owner);
        vault.addStrategy(
            strategy, 
            5000, // allocation
            bytes32("Test Strategy"), // name
            1000, // expectedApy 
            5000, // riskScore
            0     // chainSelector
        );
        
        ValkyrieVault.Strategy memory strategyData = vault.getStrategy(0);
        
        assertEq(strategyData.strategyAddress, strategy);
        assertEq(strategyData.allocation, 5000);
        assertTrue(strategyData.isActive);
        assertEq(vault.strategyCount(), 1);
    }
    
    function test_FailAddStrategyNotOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        vault.addStrategy(address(0x6), 5000, "Test Strategy", 1000, 5000, 0);
    }
    
    function test_SetAIController() public {
        address aiController = address(0x4);
        
        vm.prank(owner);
        vault.setAIController(aiController);
        
        assertEq(vault.aiController(), aiController);
    }
    
    function test_EmergencyPause() public {
        vm.prank(owner);
        vault.pauseDeposits();
        
        assertTrue(vault.paused());
        
        // Deposits should fail when paused
        vm.prank(user1);
        vm.expectRevert(ValkyrieVault.VaultPaused.selector);
        vault.deposit(INITIAL_DEPOSIT, user1);
    }
    
    function test_MaxDepositWithdraw() public {
        vm.prank(user1);
        uint256 shares = vault.deposit(INITIAL_DEPOSIT, user1);
        
        uint256 maxWithdraw = vault.maxWithdraw(user1);
        uint256 maxRedeem = vault.maxRedeem(user1);
        
        // maxRedeem should equal the shares the user owns
        assertEq(maxRedeem, shares);
        // maxWithdraw should be approximately equal to INITIAL_DEPOSIT (allowing for share calculation differences)
        assertApproxEqRel(maxWithdraw, INITIAL_DEPOSIT, 0.01e18); // 1% tolerance
    }
    
    function testFuzz_DepositWithdraw(uint256 amount) public {
        amount = bound(amount, 1e18, 50_000 * 1e18); // Respect minimum deposit
        
        vm.startPrank(user1);
        
        uint256 shares = vault.deposit(amount, user1);
        assertEq(vault.balanceOf(user1), shares);
        
        uint256 assets = vault.redeem(shares, user1, user1);
        assertEq(assets, amount);
        assertEq(vault.balanceOf(user1), 0);
        
        vm.stopPrank();
    }
} 