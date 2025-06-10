// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/ValkryieVault.sol";
import "../src/ValkryieAutomation.sol";
import "../src/ValkryiePriceOracle.sol";
import "../src/ValkryieToken.sol";

/**
 * @title DeployAIVault
 * @dev Deployment script for AI-driven Valkryie Vault with Chainlink integration
 * Implements the complete architecture from chainlink-for-ai-vault framework
 */
contract DeployAIVault is Script {
    // Network configurations
    struct NetworkConfig {
        address vrfCoordinator;
        address functionsRouter;
        address ccipRouter;
        address linkToken;
        address ethUsdPriceFeed;
        address usdcToken;
        bytes32 vrfKeyHash;
        uint64 vrfSubscriptionId;
        bytes32 donId;
        uint64 functionsSubscriptionId;
    }
    
    // Deployment addresses
    struct DeploymentAddresses {
        address valkToken;
        address priceOracle;
        address vault;
        address automation;
        address owner;
        address feeRecipient;
    }
    
    NetworkConfig public networkConfig;
    DeploymentAddresses public deploymentAddresses;
    
    // Constants
    uint256 public constant INITIAL_VALK_SUPPLY = 1000000e18; // 1M VALK tokens
    uint256 public constant VAULT_MAX_ASSETS = 10000000e6; // 10M USDC max
    string public constant VAULT_NAME = "Valkryie AI Vault";
    string public constant VAULT_SYMBOL = "vAI-USDC";
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying AI-driven Valkryie Vault...");
        console.log("Deployer:", deployer);
        console.log("Chain ID:", block.chainid);
        
        // Load network configuration
        _loadNetworkConfig();
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy core contracts
        _deployCore(deployer);
        
        // Configure integrations
        _configureIntegrations();
        
        // Setup initial strategies
        _setupInitialStrategies();
        
        // Verify deployment
        _verifyDeployment();
        
        vm.stopBroadcast();
        
        // Log deployment summary
        _logDeploymentSummary();
    }
    
    function _loadNetworkConfig() internal {
        if (block.chainid == 1) {
            // Ethereum Mainnet
            networkConfig = NetworkConfig({
                vrfCoordinator: 0x271682DEB8C4E0901D1a1550aD2e64D568E69909,
                functionsRouter: 0x65C939b26cb1A5EF2e0E3b5b2E8F7a3B9c16b1a2,
                ccipRouter: 0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D,
                linkToken: 0x514910771AF9Ca656af840dff83E8264EcF986CA,
                ethUsdPriceFeed: 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419,
                usdcToken: 0xA0b86A33E6411C22b9CE6e4Dc5A3a0d3E6b4f30f,
                vrfKeyHash: 0x9fe0eebf5e446e3c998ec9bb19951541aee00bb90ea201ae456421a2ded86805,
                vrfSubscriptionId: uint64(vm.envUint("CHAINLINK_SUBSCRIPTION_ID")),
                donId: bytes32(vm.envBytes32("CHAINLINK_DON_ID")),
                functionsSubscriptionId: uint64(vm.envUint("CHAINLINK_FUNCTIONS_SUBSCRIPTION_ID"))
            });
        } else if (block.chainid == 11155111) {
            // Sepolia Testnet
            networkConfig = NetworkConfig({
                vrfCoordinator: 0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625,
                functionsRouter: 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0,
                ccipRouter: 0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59,
                linkToken: 0x779877A7B0D9E8603169DdbD7836e478b4624789,
                ethUsdPriceFeed: 0x694AA1769357215DE4FAC081bf1f309aDC325306,
                usdcToken: 0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8,
                vrfKeyHash: 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c,
                vrfSubscriptionId: uint64(vm.envUint("CHAINLINK_SUBSCRIPTION_ID")),
                donId: bytes32(vm.envBytes32("CHAINLINK_DON_ID")),
                functionsSubscriptionId: uint64(vm.envUint("CHAINLINK_FUNCTIONS_SUBSCRIPTION_ID"))
            });
        } else if (block.chainid == 31337) {
            // Local Anvil - use Tenderly Virtual TestNet
            networkConfig = NetworkConfig({
                vrfCoordinator: address(0x1), // Mock for local testing
                functionsRouter: address(0x2),
                ccipRouter: address(0x3),
                linkToken: address(0x4),
                ethUsdPriceFeed: address(0x5),
                usdcToken: 0x5FbDB2315678afecb367f032d93F642f64180aa3, // From previous deployment
                vrfKeyHash: bytes32("mockKeyHash"),
                vrfSubscriptionId: 1,
                donId: bytes32("mockDonId"),
                functionsSubscriptionId: 1
            });
        } else {
            revert("Network not supported");
        }
    }
    
    function _deployCore(address deployer) internal {
        console.log("Deploying core contracts...");
        
        // Set deployment addresses
        deploymentAddresses.owner = deployer;
        deploymentAddresses.feeRecipient = makeAddr("feeRecipient");
        
        // Deploy VALK governance token
        console.log("Deploying ValkryieToken...");
        ValkryieToken valkToken = new ValkryieToken(
            "Valkryie Token",
            "VLK",
            INITIAL_VALK_SUPPLY,
            deploymentAddresses.owner
        );
        deploymentAddresses.valkToken = address(valkToken);
        console.log("ValkryieToken deployed at:", address(valkToken));
        
        // Deploy Price Oracle
        console.log("Deploying ValkryiePriceOracle...");
        ValkryiePriceOracle priceOracle = new ValkryiePriceOracle();
        deploymentAddresses.priceOracle = address(priceOracle);
        console.log("ValkryiePriceOracle deployed at:", address(priceOracle));
        
        // Deploy AI-driven Vault
        console.log("Deploying ValkryieVault...");
        ValkryieVault vault = new ValkryieVault(
            IERC20(networkConfig.usdcToken),
            VAULT_NAME,
            VAULT_SYMBOL,
            deploymentAddresses.owner,
            deploymentAddresses.feeRecipient,
            deploymentAddresses.priceOracle,
            networkConfig.vrfCoordinator,
            networkConfig.ccipRouter
        );
        deploymentAddresses.vault = address(vault);
        console.log("ValkryieVault deployed at:", address(vault));
        
        // Deploy Automation System
        console.log("Deploying ValkryieAutomation...");
        ValkryieAutomation automation = new ValkryieAutomation(
            networkConfig.functionsRouter,
            deploymentAddresses.vault,
            deploymentAddresses.priceOracle,
            networkConfig.donId,
            networkConfig.functionsSubscriptionId
        );
        deploymentAddresses.automation = address(automation);
        console.log("ValkryieAutomation deployed at:", address(automation));
    }
    
    function _configureIntegrations() internal {
        console.log("Configuring Chainlink integrations...");
        
        ValkryieVault vault = ValkryieVault(deploymentAddresses.vault);
        ValkryiePriceOracle priceOracle = ValkryiePriceOracle(deploymentAddresses.priceOracle);
        ValkryieAutomation automation = ValkryieAutomation(deploymentAddresses.automation);
        
        // Configure Price Oracle with Chainlink Price Feeds
        if (networkConfig.ethUsdPriceFeed != address(0)) {
            priceOracle.addPriceFeed(
                networkConfig.usdcToken,
                networkConfig.ethUsdPriceFeed,
                "ETH/USD",
                3600 // 1 hour staleness threshold
            );
            console.log("Added ETH/USD price feed to oracle");
        }
        
        // Configure VRF for vault
        vault.configureVRF(
            networkConfig.vrfKeyHash,
            networkConfig.vrfSubscriptionId,
            100000 // callback gas limit
        );
        console.log("Configured VRF for vault");
        
        // Set AI controller
        vault.setAIController(deploymentAddresses.automation);
        console.log("Set automation as AI controller");
        
        // Configure automation parameters
        ValkryieAutomation.StrategyConfig memory strategyConfig = ValkryieAutomation.StrategyConfig({
            rebalanceThreshold: 500,     // 5%
            riskThreshold: 7500,         // 75%
            maxLeverage: 20000,          // 2x
            cooldownPeriod: 3600,        // 1 hour
            autoRebalanceEnabled: true,
            emergencyPauseEnabled: true
        });
        
        automation.updateStrategyConfig(strategyConfig);
        console.log("Updated automation strategy configuration");
        
        // Update Functions configuration
        automation.updateFunctionsConfig(
            networkConfig.donId,
            networkConfig.functionsSubscriptionId,
            300000, // gas limit
            bytes32("jobId")
        );
        console.log("Updated Functions configuration");
    }
    
    function _setupInitialStrategies() internal {
        console.log("Setting up initial AI strategies...");
        
        ValkryieVault vault = ValkryieVault(deploymentAddresses.vault);
        
        // Strategy 1: Conservative DeFi (Low risk, stable yield)
        vault.addStrategy(
            makeAddr("conservativeStrategy"),
            3000, // 30% allocation
            "Conservative DeFi",
            400,  // 4% expected APY
            2000, // 20% risk score
            0     // Same chain
        );
        console.log("Added Conservative DeFi strategy");
        
        // Strategy 2: Yield Farming (Medium risk, higher yield)
        vault.addStrategy(
            makeAddr("yieldFarmingStrategy"),
            4000, // 40% allocation
            "Yield Farming",
            800,  // 8% expected APY
            5000, // 50% risk score
            0     // Same chain
        );
        console.log("Added Yield Farming strategy");
        
        // Strategy 3: Cross-chain Arbitrage (Higher risk, variable yield)
        vault.addStrategy(
            makeAddr("arbitrageStrategy"),
            2000, // 20% allocation
            "Cross-chain Arbitrage",
            1200, // 12% expected APY
            7000, // 70% risk score
            42161 // Arbitrum
        );
        console.log("Added Cross-chain Arbitrage strategy");
        
        // Strategy 4: AI-driven Market Making (Dynamic risk/reward)
        vault.addStrategy(
            makeAddr("marketMakingStrategy"),
            1000, // 10% allocation
            "AI Market Making",
            600,  // 6% expected APY (variable)
            4500, // 45% risk score
            0     // Same chain
        );
        console.log("Added AI Market Making strategy");
    }
    
    function _verifyDeployment() internal view {
        console.log("Verifying deployment...");
        
        ValkryieVault vault = ValkryieVault(deploymentAddresses.vault);
        ValkryieAutomation automation = ValkryieAutomation(deploymentAddresses.automation);
        ValkryiePriceOracle priceOracle = ValkryiePriceOracle(deploymentAddresses.priceOracle);
        
        // Verify vault configuration
        require(vault.owner() == deploymentAddresses.owner, "Invalid vault owner");
        require(vault.aiController() == deploymentAddresses.automation, "Invalid AI controller");
        require(address(vault.priceOracle()) == deploymentAddresses.priceOracle, "Invalid price oracle");
        require(vault.strategyCount() == 4, "Invalid strategy count");
        
        // Verify automation configuration
        ValkryieAutomation.StrategyConfig memory config = automation.getStrategyConfig();
        require(config.autoRebalanceEnabled, "Auto rebalance not enabled");
        require(config.emergencyPauseEnabled, "Emergency pause not enabled");
        
        // Verify price oracle
        require(priceOracle.owner() == deploymentAddresses.owner, "Invalid oracle owner");
        
        console.log("Deployment verification completed successfully");
    }
    
    function _logDeploymentSummary() internal view {
        console.log("\n=== AI-DRIVEN VALKRYIE VAULT DEPLOYMENT SUMMARY ===");
        console.log("Network:", _getNetworkName());
        console.log("Chain ID:", block.chainid);
        console.log("");
        console.log("CORE CONTRACTS:");
        console.log("ValkryieToken:", deploymentAddresses.valkToken);
        console.log("ValkryiePriceOracle:", deploymentAddresses.priceOracle);
        console.log("ValkryieVault:", deploymentAddresses.vault);
        console.log("ValkryieAutomation:", deploymentAddresses.automation);
        console.log("");
        console.log("CONFIGURATION:");
        console.log("Owner:", deploymentAddresses.owner);
        console.log("Fee Recipient:", deploymentAddresses.feeRecipient);
        console.log("Underlying Asset:", networkConfig.usdcToken);
        console.log("Initial Strategies: 4");
        console.log("");
        console.log("CHAINLINK INTEGRATION:");
        console.log("VRF Coordinator:", networkConfig.vrfCoordinator);
        console.log("Functions Router:", networkConfig.functionsRouter);
        console.log("CCIP Router:", networkConfig.ccipRouter);
        console.log("LINK Token:", networkConfig.linkToken);
        console.log("");
        console.log("NEXT STEPS:");
        console.log("1. Fund Chainlink subscriptions with LINK tokens");
        console.log("2. Register vault with Chainlink Automation");
        console.log("3. Configure external strategy contracts");
        console.log("4. Set up monitoring and alerting");
        console.log("5. Begin initial deposits and AI-driven operations");
        console.log("==========================================");
    }
    
    function _getNetworkName() internal view returns (string memory) {
        if (block.chainid == 1) return "Ethereum Mainnet";
        if (block.chainid == 11155111) return "Sepolia Testnet";
        if (block.chainid == 31337) return "Local Anvil / Tenderly Virtual TestNet";
        return "Unknown Network";
    }
    
    // Utility function to create deterministic addresses for testing
    function makeAddr(string memory name) internal pure override returns (address) {
        return address(uint160(uint256(keccak256(abi.encodePacked(name)))));
    }
} 