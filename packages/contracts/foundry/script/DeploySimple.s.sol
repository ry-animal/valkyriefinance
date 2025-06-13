// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/ValkyrieToken.sol";
import "../src/ValkyrieVault.sol";
import "../src/ValkyriePriceOracle.sol";
import "../test/MockUSDC.sol";

/**
 * @title DeploySimple
 * @notice Simplified deployment script for testing core functionality
 */
contract DeploySimple is Script {
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying with address:", deployer);
        console.log("Balance:", deployer.balance);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // 1. Deploy Mock USDC
        MockUSDC usdc = new MockUSDC();
        console.log("Mock USDC deployed at:", address(usdc));
        
        // 2. Deploy ValkyrieToken
        ValkyrieToken valkToken = new ValkyrieToken(
            "Valkyrie",
            "VALK",
            1000000 * 10**18, // 1M tokens
            deployer
        );
        console.log("ValkyrieToken deployed at:", address(valkToken));
        
        // 3. Deploy Price Oracle
        ValkyriePriceOracle priceOracle = new ValkyriePriceOracle();
        console.log("PriceOracle deployed at:", address(priceOracle));
        
        // 4. Deploy Vault
        ValkyrieVault vault = new ValkyrieVault(
            IERC20(address(usdc)),
            "Valkyrie Vault Shares",
            "VALKS",
            deployer,                    // owner
            deployer,                    // feeRecipient  
            address(priceOracle),        // priceOracle
            address(0),                  // vrfCoordinator (disabled)
            address(0)                   // ccipRouter (disabled)
        );
        console.log("ValkyrieVault deployed at:", address(vault));
        
        // 5. Setup initial strategies
        vault.addStrategy(
            address(0x1),     // mock strategy address
            5000,             // 50% allocation
            "Conservative DeFi",
            500,              // 5% expected APY
            500,              // 5% risk score
            0                 // local chain
        );
        
        vault.addStrategy(
            address(0x2),     // mock strategy address  
            3000,             // 30% allocation
            "Yield Farming",
            750,              // 7.5% expected APY
            750,              // 7.5% risk score
            0                 // local chain
        );
        
        // 6. Configure price oracle with mock feeds
        // In a real deployment, these would be actual Chainlink price feed addresses
        priceOracle.updatePriceFeed(
            address(usdc),
            address(0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6) // ETH/USD feed
        );
        
        // 7. Transfer some tokens to vault for testing
        usdc.transfer(address(vault), 100000 * 10**6); // 100k USDC
        
        vm.stopBroadcast();
        
        console.log("=== Deployment Summary ===");
        console.log("Mock USDC:", address(usdc));
        console.log("ValkyrieToken:", address(valkToken));
        console.log("PriceOracle:", address(priceOracle));
        console.log("ValkyrieVault:", address(vault));
        console.log("=========================");
    }
} 