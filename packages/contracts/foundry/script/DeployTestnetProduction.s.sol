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
        
        // 1. Deploy ValkyrieToken with proper tokenomics
        console.log("\n1. Deploying ValkyrieToken with production tokenomics...");
        ValkyrieToken token = new ValkyrieToken(
            "Valkyrie Token",
            "VLK",
            1000000000 * 1e18, // 1B tokens total supply (production-like)
            deployer
        );
        deployedToken = address(token);
        console.log("ValkyrieToken deployed at:", deployedToken);
        
        // Configure token for testnet with production-like distribution
        console.log("Implementing tokenomics distribution...");
        
        // Token Allocation according to review recommendations:
        uint256 totalSupply = 1000000000 * 1e18; // 1B tokens
        uint256 communityAllocation = (totalSupply * 45) / 100;     // 45% - Community & Ecosystem
        uint256 teamAllocation = (totalSupply * 20) / 100;          // 20% - Team & Future Hires  
        uint256 investorAllocation = (totalSupply * 15) / 100;      // 15% - Strategic Investors
        uint256 treasuryAllocation = (totalSupply * 10) / 100;      // 10% - DAO Treasury
        uint256 liquidityAllocation = (totalSupply * 10) / 100;     // 10% - Liquidity & Market Making
        
        // For testnet: distribute to test accounts with proper ratios
        address[5] memory testAccounts = [
            address(0x1234567890123456789012345678901234567890),
            address(0x2234567890123456789012345678901234567890), 
            address(0x3234567890123456789012345678901234567890),
            address(0x4234567890123456789012345678901234567890),
            address(0x5234567890123456789012345678901234567890)
        ];
        
        // Distribute community allocation (scaled down for testnet)
        uint256 testCommunityAmount = 100000 * 1e18; // 100K per test account
        for (uint i = 0; i < testAccounts.length; i++) {
            token.transfer(testAccounts[i], testCommunityAmount);
            console.log("Transferred", testCommunityAmount / 1e18, "VLK to test account", i + 1);
        }
        
        // Set a production-ready reward rate (3% APY for testnet)
        token.setRewardRate(300); // 3% in basis points
        
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