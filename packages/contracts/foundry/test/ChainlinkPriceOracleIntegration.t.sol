// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/ValkyriePriceOracle.sol";

// Minimal mock for Chainlink price feed
contract MockPriceFeed {
    int256 public answer;
    uint256 public updatedAt;
    constructor(int256 _answer, uint256 _updatedAt) {
        answer = _answer;
        updatedAt = _updatedAt;
    }
    function latestRoundData() external view returns (
        uint80, int256, uint256, uint256, uint80
    ) {
        return (0, answer, 0, updatedAt, 0);
    }
    function decimals() external pure returns (uint8) {
        return 8;
    }
}

contract ChainlinkPriceOracleIntegrationTest is Test {
    ValkyriePriceOracle oracle;
    MockPriceFeed mockFeed;
    address constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    function setUp() public {
        oracle = new ValkyriePriceOracle();
        mockFeed = new MockPriceFeed(2000e8, block.timestamp);
        oracle.addPriceFeed(WETH, address(mockFeed), "ETH", 3600);
    }

    function testGetPriceReturnsValidPrice() public view {
        (uint256 price, uint256 updatedAt) = oracle.getPrice(WETH);
        assertGt(price, 0);
        assertGt(updatedAt, 0);
    }
}