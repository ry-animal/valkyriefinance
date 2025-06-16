// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/ValkyrieToken.sol";
import "../src/ValkyrieVault.sol";
import "../src/ValkyriePriceOracle.sol";

/**
 * @title DeployTestnetProduction
 * @notice Production-like deployment for Sepolia testnet with real protocol integrations
 * @dev This script deploys contracts with real testnet protocol addresses for comprehensive testing
 */
contract DeployTestnetProduction is Script {
    
    // Sepolia testnet addresses for real protocols
    struct SepoliaConfig {
        address weth;           // WETH on Sepolia
        address usdc;           // USDC on Sepolia  
        address aavePool;       // Aave V3 Pool on Sepolia
        address compoundUsdc;   // Compound USDC on Sepolia
        address uniswapRouter;  // Uniswap V3 Router on Sepolia
        address chainlinkEthUsd; // Chainlink ETH/USD on Sepolia
        address chainlinkUsdcUsd; // Chainlink USDC/USD on Sepolia
    }
    
    SepoliaConfig public sepoliaConfig = SepoliaConfig({
        weth: 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14,
        usdc: 0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8, // Sepolia USDC
        aavePool: 0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951, // Aave V3 Pool Sepolia
        compoundUsdc: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238, // Compound USDC Sepolia
        uniswapRouter: 0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E, // Uniswap V3 Router Sepolia
        chainlinkEthUsd: 0x694AA1769357215DE4FAC081bf1f309aDC325306, // ETH/USD Sepolia
        chainlinkUsdcUsd: 0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E // USDC/USD Sepolia
    });
    
    // Deployment addresses
    address public deployedToken;
    address public deployedVault;
    address public deployedOracle;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("=== Valkyrie Finance Testnet Production Deployment ===");
        console.log("Deployer:", deployer);
        console.log("Chain ID:", block.chainid);
        console.log("Balance:", deployer.balance);
        
        require(block.chainid == 11155111, "This script is for Sepolia testnet only");
        require(deployer.balance > 0.1 ether, "Insufficient ETH for deployment");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // 1. Deploy ValkyrieToken with governance features
        console.log("\n1. Deploying ValkyrieToken...");
        ValkyrieToken token = new ValkyrieToken(
            "Valkyrie Token",
            "VLK",
            1000000 * 1e18, // 1M tokens for testnet
            deployer
        );
        deployedToken = address(token);
        console.log("ValkyrieToken deployed at:", deployedToken);
        
        // Configure token for testnet
        console.log("Configuring ValkyrieToken for testnet...");
        
        // Set a reasonable reward rate for staking (5% APY for testnet)
        token.setRewardRate(500); // 5% in basis points
        
        // Distribute tokens for testing purposes
        uint256 testAmount = 10000 * 1e18; // 10K tokens per test account
        
        // Create test accounts for comprehensive testing
        address[] memory testAccounts = new address[](5);
        testAccounts[0] = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8; // Test account 1
        testAccounts[1] = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC; // Test account 2  
        testAccounts[2] = 0x90F79bf6EB2c4f870365E785982E1f101E93b906; // Test account 3
        testAccounts[3] = 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65; // Test account 4
        testAccounts[4] = 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc; // Test account 5
        
        for (uint i = 0; i < testAccounts.length; i++) {
            if (token.balanceOf(deployer) >= testAmount) {
                token.transfer(testAccounts[i], testAmount);
                console.log("Distributed", testAmount / 1e18, "VLK to test account:", testAccounts[i]);
            }
        }
        
        // Reserve tokens for vault rewards and incentives
        uint256 vaultReserve = 100000 * 1e18; // 100K tokens for vault
        // These will be transferred to vault after deployment
        
        // 2. Deploy Price Oracle with real Chainlink feeds
        console.log("\n2. Deploying ValkyriePriceOracle...");
        ValkyriePriceOracle oracle = new ValkyriePriceOracle();
        deployedOracle = address(oracle);
        console.log("ValkyriePriceOracle deployed at:", deployedOracle);
        
        // 3. Deploy ValkyrieVault with USDC as underlying asset
        console.log("\n3. Deploying ValkyrieVault...");
        ValkyrieVault vault = new ValkyrieVault(
            IERC20(sepoliaConfig.usdc),
            "Valkyrie USDC Vault",
            "vUSDC",
            deployer,                    // owner
            deployer,                    // feeRecipient
            deployedOracle,              // priceOracle
            address(0),                  // vrfCoordinator (will add later)
            address(0)                   // ccipRouter (will add later)
        );
        deployedVault = address(vault);
        console.log("ValkyrieVault deployed at:", deployedVault);
        
        // 4. Configure vault with real yield strategies
        console.log("\n4. Configuring yield strategies...");
        
        // Add Aave lending strategy
        vault.addStrategy(
            sepoliaConfig.aavePool,
            3000, // 30% allocation
            "Aave V3 USDC Lending",
            400,  // 4% expected APY
            2000, // 20% risk score (low risk)
            0     // Chain selector
        );
        
        // Add Compound lending strategy
        vault.addStrategy(
            sepoliaConfig.compoundUsdc,
            2000, // 20% allocation
            "Compound USDC Lending",
            350,  // 3.5% expected APY
            2500, // 25% risk score (low risk)
            0     // Chain selector
        );
        
        // Reserve allocation for future strategies
        vault.addStrategy(
            address(0x1), // Placeholder for future strategy
            5000, // 50% allocation (will be updated)
            "Reserved for AI Strategies",
            0,    // TBD APY
            5000, // Medium risk
            0     // Chain selector
        );
        
        // 5. Set up token-vault integration
        console.log("\n5. Setting up token-vault integration...");
        
        // Transfer tokens to vault for rewards and incentives
        uint256 vaultReserve = 100000 * 1e18; // 100K tokens for vault
        if (token.balanceOf(deployer) >= vaultReserve) {
            token.transfer(deployedVault, vaultReserve);
            console.log("Transferred", vaultReserve / 1e18, "VLK to vault for rewards");
        }
        
        // Set up initial permissions and configurations
        console.log("\n6. Setting up permissions...");
        
        // Grant necessary roles (if using AccessControl)
        // token.grantRole(token.MINTER_ROLE(), deployedVault);
        
        vm.stopBroadcast();
        
        // 6. Save deployment information
        saveDeploymentInfo();
        
        console.log("\n=== Deployment Summary ===");
        console.log("ValkyrieToken (VLK):", deployedToken);
        console.log("ValkyrieVault (vUSDC):", deployedVault);
        console.log("ValkyriePriceOracle:", deployedOracle);
        console.log("Underlying Asset (USDC):", sepoliaConfig.usdc);
        console.log("\n=== Token Configuration ===");
        console.log("Total Supply: 1,000,000 VLK");
        console.log("Staking Reward Rate: 5% APY");
        console.log("Test Accounts: 5 accounts with 10K VLK each");
        console.log("Vault Reserve: 100K VLK for rewards");
        console.log("\n=== Next Steps ===");
        console.log("1. Verify contracts on Etherscan");
        console.log("2. Set up Tenderly monitoring");
        console.log("3. Configure frontend with new addresses");
        console.log("4. Begin integration testing");
        console.log("5. Test token staking and governance features");
        
        // 7. Verification commands
        console.log("\n=== Verification Commands ===");
        console.log("forge verify-contract", deployedToken, "src/ValkyrieToken.sol:ValkyrieToken --chain sepolia");
        console.log("forge verify-contract", deployedVault, "src/ValkyrieVault.sol:ValkyrieVault --chain sepolia");
        console.log("forge verify-contract", deployedOracle, "src/ValkyriePriceOracle.sol:ValkyriePriceOracle --chain sepolia");
    }
    
    function saveDeploymentInfo() internal {
        string memory deploymentInfo = string(abi.encodePacked(
            "{\n",
            '  "network": "sepolia",\n',
            '  "chainId": 11155111,\n',
            '  "timestamp": "', vm.toString(block.timestamp), '",\n',
            '  "deployer": "', vm.toString(msg.sender), '",\n',
            '  "contracts": {\n',
            '    "ValkyrieToken": "', vm.toString(deployedToken), '",\n',
            '    "ValkyrieVault": "', vm.toString(deployedVault), '",\n',
            '    "ValkyriePriceOracle": "', vm.toString(deployedOracle), '",\n',
            '    "UnderlyingAsset": "', vm.toString(sepoliaConfig.usdc), '"\n',
            '  },\n',
            '  "configuration": {\n',
            '    "vaultName": "Valkyrie USDC Vault",\n',
            '    "vaultSymbol": "vUSDC",\n',
            '    "tokenSupply": "1000000000000000000000000",\n',
            '    "strategiesCount": 3\n',
            '  }\n',
            '}'
        ));
        
        vm.writeFile("./deployments/sepolia-production.json", deploymentInfo);
        console.log("Deployment info saved to: ./deployments/sepolia-production.json");
    }
} 