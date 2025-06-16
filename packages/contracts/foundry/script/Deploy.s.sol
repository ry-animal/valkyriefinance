// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import "../src/ValkyrieToken.sol";
import "../src/ValkyrieVault.sol";
import "../src/ValkyriePriceOracle.sol";

/**
 * @title Deploy
 * @dev Deployment script for Valkyrie contracts
 */
contract Deploy is Script {
    
    // Deployment configuration
    struct DeployConfig {
        string tokenName;
        string tokenSymbol;
        uint256 initialSupply;
        string vaultName;
        string vaultSymbol;
        address feeRecipient;
        address owner;
    }
    
    function run() external {
        // Load private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying contracts with account:", deployer);
        console.log("Account balance:", deployer.balance);
        
        // Configuration
        DeployConfig memory config = getDeployConfig();
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy Price Oracle first
        console.log("Deploying ValkyriePriceOracle...");
        ValkyriePriceOracle priceOracle = new ValkyriePriceOracle();
        console.log("ValkyriePriceOracle deployed at:", address(priceOracle));
        
        // Deploy Valkyrie Token
        console.log("Deploying ValkyrieToken...");
        ValkyrieToken token = new ValkyrieToken(
            config.tokenName,
            config.tokenSymbol,
            config.initialSupply,
            config.owner
        );
        console.log("ValkyrieToken deployed at:", address(token));
        
        // Deploy Valkyrie Vault with all required parameters
        console.log("Deploying ValkyrieVault...");
        ValkyrieVault vault = new ValkyrieVault(
            IERC20(address(token)), // Use ValkyrieToken as the underlying asset
            config.vaultName,
            config.vaultSymbol,
            config.owner,
            config.feeRecipient,
            address(priceOracle)
        );
        console.log("ValkyrieVault deployed at:", address(vault));
        
        // Set up initial vault configuration
        console.log("Configuring vault...");
        
        // Add a basic strategy with all required parameters
        vault.addStrategy(
            address(0x1234567890123456789012345678901234567890), // Demo strategy address
            5000,       // 50% allocation
            "Demo Strategy",
            500,        // 5% expected APY
            5000,       // 50% risk score
            0           // Chain selector (local)
        );
        
        vm.stopBroadcast();
        
        // Save deployment addresses
        saveDeploymentInfo(address(token), address(vault), address(priceOracle));
        
        console.log("Deployment completed successfully!");
        console.log("Token address:", address(token));
        console.log("Vault address:", address(vault));
        console.log("Price Oracle address:", address(priceOracle));
    }
    
    function getDeployConfig() internal view returns (DeployConfig memory) {
        uint256 chainId = block.chainid;
        
        if (chainId == 11155111) { // Sepolia
            return DeployConfig({
                tokenName: "Valkyrie Token",
                tokenSymbol: "VLK",
                initialSupply: 1000000 * 1e18, // 1M tokens
                vaultName: "Valkyrie Vault Shares",
                vaultSymbol: "vVLK",
                feeRecipient: vm.addr(vm.envUint("PRIVATE_KEY")), // Use deployer address
                owner: vm.addr(vm.envUint("PRIVATE_KEY")) // Use deployer address
            });
        } else if (chainId == 1) { // Mainnet
            return DeployConfig({
                tokenName: "Valkyrie Token",
                tokenSymbol: "VLK",
                initialSupply: 100000000 * 1e18, // 100M tokens
                vaultName: "Valkyrie Vault Shares",
                vaultSymbol: "vVLK",
                feeRecipient: vm.addr(vm.envUint("PRIVATE_KEY")), // Use deployer address
                owner: vm.addr(vm.envUint("PRIVATE_KEY")) // Use deployer address
            });
        } else {
            // Default configuration for local/other networks
            return DeployConfig({
                tokenName: "Valkyrie Token",
                tokenSymbol: "VLK",
                initialSupply: 1000000 * 1e18, // 1M tokens
                vaultName: "Valkyrie Vault Shares",
                vaultSymbol: "vVLK",
                feeRecipient: vm.addr(vm.envUint("PRIVATE_KEY")), // Use deployer address
                owner: vm.addr(vm.envUint("PRIVATE_KEY")) // Use deployer address
            });
        }
    }
    
    function saveDeploymentInfo(address tokenAddress, address vaultAddress, address priceOracleAddress) internal {
        string memory json = "deployment_info";
        
        vm.serializeAddress(json, "token", tokenAddress);
        vm.serializeAddress(json, "vault", vaultAddress);
        vm.serializeAddress(json, "priceOracle", priceOracleAddress);
        vm.serializeUint(json, "chainId", block.chainid);
        vm.serializeUint(json, "blockNumber", block.number);
        
        string memory finalJson = vm.serializeUint(json, "timestamp", block.timestamp);
        
        string memory fileName = string.concat("deployments_", vm.toString(block.chainid), ".json");
        vm.writeJson(finalJson, fileName);
        
        console.log("Deployment info saved to:", fileName);
    }
}

/**
 * @title MockERC20
 * @dev Mock ERC20 token for testing vault with different underlying assets
 */
contract MockERC20 is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address to
    ) ERC20(name, symbol) {
        _mint(to, initialSupply);
    }
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

/**
 * @title DeployWithMockAsset
 * @dev Deployment script for testing with mock USDC
 */
contract DeployWithMockAsset is Script {
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying with mock asset...");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy mock USDC for testing
        MockERC20 mockUSDC = new MockERC20(
            "Mock USDC",
            "mUSDC",
            1000000 * 1e6, // 1M USDC (6 decimals)
            deployer
        );
        console.log("Mock USDC deployed at:", address(mockUSDC));
        
        // Deploy Price Oracle
        ValkyriePriceOracle priceOracle = new ValkyriePriceOracle();
        console.log("ValkyriePriceOracle deployed at:", address(priceOracle));
        
        // Deploy Valkyrie Token
        ValkyrieToken token = new ValkyrieToken(
            "Valkyrie Token",
            "VLK",
            1000000 * 1e18,
            deployer
        );
        console.log("ValkyrieToken deployed at:", address(token));
        
        // Deploy Vault with mock USDC as underlying asset
        ValkyrieVault vault = new ValkyrieVault(
            IERC20(address(mockUSDC)),
            "Valkyrie USDC Vault",
            "vUSDC",
            deployer,
            deployer,
            address(priceOracle)
        );
        console.log("ValkyrieVault deployed at:", address(vault));
        
        vm.stopBroadcast();
        
        console.log("Test deployment completed!");
        console.log("Mock USDC:", address(mockUSDC));
        console.log("ValkyrieToken:", address(token));
        console.log("ValkyrieVault:", address(vault));
        console.log("Price Oracle:", address(priceOracle));
    }
} 