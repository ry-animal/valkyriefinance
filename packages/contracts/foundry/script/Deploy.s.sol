// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import "../src/ValkryieToken.sol";
import "../src/ValkryieVault.sol";

/**
 * @title Deploy
 * @dev Deployment script for Valkryie contracts
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
        
        // Deploy Valkryie Token
        console.log("Deploying ValkryieToken...");
        ValkryieToken token = new ValkryieToken(
            config.tokenName,
            config.tokenSymbol,
            config.initialSupply,
            config.owner
        );
        console.log("ValkryieToken deployed at:", address(token));
        
        // Deploy Valkryie Vault
        console.log("Deploying ValkryieVault...");
        ValkryieVault vault = new ValkryieVault(
            IERC20(address(token)), // Use ValkryieToken as the underlying asset
            config.vaultName,
            config.vaultSymbol,
            config.owner,
            config.feeRecipient
        );
        console.log("ValkryieVault deployed at:", address(vault));
        
        // Set up initial vault configuration
        console.log("Configuring vault...");
        
        // Add a basic strategy (simplified for demo)
        vault.addStrategy(
            address(0), // No actual strategy contract for demo
            5000,       // 50% allocation
            "Demo Strategy",
            500         // 5% expected APY
        );
        
        vm.stopBroadcast();
        
        // Save deployment addresses
        saveDeploymentInfo(address(token), address(vault));
        
        console.log("Deployment completed successfully!");
        console.log("Token address:", address(token));
        console.log("Vault address:", address(vault));
    }
    
    function getDeployConfig() internal view returns (DeployConfig memory) {
        uint256 chainId = block.chainid;
        
        if (chainId == 11155111) { // Sepolia
            return DeployConfig({
                tokenName: "Valkryie Token",
                tokenSymbol: "VLK",
                initialSupply: 1000000 * 1e18, // 1M tokens
                vaultName: "Valkryie Vault Shares",
                vaultSymbol: "vVLK",
                feeRecipient: 0x742D35cc674C4532A93a5c18D6f8C0c2A16055a8, // Example address
                owner: 0x742D35cc674C4532A93a5c18D6f8C0c2A16055a8 // Example address
            });
        } else if (chainId == 1) { // Mainnet
            return DeployConfig({
                tokenName: "Valkryie Token",
                tokenSymbol: "VLK",
                initialSupply: 100000000 * 1e18, // 100M tokens
                vaultName: "Valkryie Vault Shares",
                vaultSymbol: "vVLK",
                feeRecipient: 0x742D35cc674C4532A93a5c18D6f8C0c2A16055a8, // Update with real address
                owner: 0x742D35cc674C4532A93a5c18D6f8C0c2A16055a8 // Update with real address
            });
        } else {
            // Default configuration for local/other networks
            return DeployConfig({
                tokenName: "Valkryie Token",
                tokenSymbol: "VLK",
                initialSupply: 1000000 * 1e18, // 1M tokens
                vaultName: "Valkryie Vault Shares",
                vaultSymbol: "vVLK",
                feeRecipient: 0x742D35cc674C4532A93a5c18D6f8C0c2A16055a8,
                owner: 0x742D35cc674C4532A93a5c18D6f8C0c2A16055a8
            });
        }
    }
    
    function saveDeploymentInfo(address tokenAddress, address vaultAddress) internal {
        string memory json = "deployment_info";
        
        vm.serializeAddress(json, "token", tokenAddress);
        vm.serializeAddress(json, "vault", vaultAddress);
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
        
        // Deploy Valkryie Token
        ValkryieToken token = new ValkryieToken(
            "Valkryie Token",
            "VLK",
            1000000 * 1e18,
            deployer
        );
        console.log("ValkryieToken deployed at:", address(token));
        
        // Deploy Vault with mock USDC as underlying asset
        ValkryieVault vault = new ValkryieVault(
            IERC20(address(mockUSDC)),
            "Valkryie USDC Vault",
            "vUSDC",
            deployer,
            deployer
        );
        console.log("ValkryieVault deployed at:", address(vault));
        
        vm.stopBroadcast();
        
        console.log("Test deployment completed!");
        console.log("Mock USDC:", address(mockUSDC));
        console.log("ValkryieToken:", address(token));
        console.log("ValkryieVault:", address(vault));
    }
} 