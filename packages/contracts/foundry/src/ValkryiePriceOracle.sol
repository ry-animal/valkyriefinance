// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IChainlinkPriceFeed.sol";

contract ValkryiePriceOracle is Ownable, ReentrancyGuard {
    struct PriceFeedInfo {
        IChainlinkPriceFeed feed;
        uint32 stalePeriod;
        bool isActive;
    }

    mapping(address => PriceFeedInfo) public priceFeeds;
    mapping(address => string) public tokenSymbols;
    
    uint256 public constant PRICE_PRECISION = 1e18;
    uint256 public constant STALENESS_THRESHOLD = 3600; // 1 hour default

    event PriceFeedAdded(address indexed token, address indexed feed, string symbol);
    event PriceFeedUpdated(address indexed token, address indexed feed);
    event PriceFeedRemoved(address indexed token);
    event PriceRequested(address indexed token, int256 price, uint256 timestamp);

    error InvalidAddress();
    error FeedNotFound();
    error StalePrice();
    error InvalidPrice();
    error FeedInactive();

    constructor() Ownable(msg.sender) {}

    function addPriceFeed(
        address token,
        address feed,
        string calldata symbol,
        uint32 stalePeriod
    ) external onlyOwner {
        if (token == address(0) || feed == address(0)) revert InvalidAddress();
        
        priceFeeds[token] = PriceFeedInfo({
            feed: IChainlinkPriceFeed(feed),
            stalePeriod: stalePeriod > 0 ? stalePeriod : uint32(STALENESS_THRESHOLD),
            isActive: true
        });
        
        tokenSymbols[token] = symbol;
        
        emit PriceFeedAdded(token, feed, symbol);
    }

    function updatePriceFeed(address token, address newFeed) external onlyOwner {
        if (token == address(0) || newFeed == address(0)) revert InvalidAddress();
        if (address(priceFeeds[token].feed) == address(0)) revert FeedNotFound();
        
        priceFeeds[token].feed = IChainlinkPriceFeed(newFeed);
        
        emit PriceFeedUpdated(token, newFeed);
    }

    function removePriceFeed(address token) external onlyOwner {
        if (address(priceFeeds[token].feed) == address(0)) revert FeedNotFound();
        
        delete priceFeeds[token];
        delete tokenSymbols[token];
        
        emit PriceFeedRemoved(token);
    }

    function setFeedActive(address token, bool active) external onlyOwner {
        if (address(priceFeeds[token].feed) == address(0)) revert FeedNotFound();
        
        priceFeeds[token].isActive = active;
    }

    function getPrice(address token) external view returns (uint256 price, uint256 timestamp) {
        PriceFeedInfo memory feedInfo = priceFeeds[token];
        
        if (address(feedInfo.feed) == address(0)) revert FeedNotFound();
        if (!feedInfo.isActive) revert FeedInactive();

        try feedInfo.feed.latestRoundData() returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) {
            if (answer <= 0) revert InvalidPrice();
            if (block.timestamp - updatedAt > feedInfo.stalePeriod) revert StalePrice();
            
            uint8 feedDecimals = feedInfo.feed.decimals();
            price = uint256(answer) * PRICE_PRECISION / (10 ** feedDecimals);
            timestamp = updatedAt;
            
            return (price, timestamp);
        } catch {
            revert InvalidPrice();
        }
    }

    function getPriceWithFallback(address token) external view returns (uint256 price, uint256 timestamp, bool isStale) {
        PriceFeedInfo memory feedInfo = priceFeeds[token];
        
        if (address(feedInfo.feed) == address(0)) revert FeedNotFound();
        if (!feedInfo.isActive) revert FeedInactive();

        try feedInfo.feed.latestRoundData() returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) {
            if (answer <= 0) revert InvalidPrice();
            
            uint8 feedDecimals = feedInfo.feed.decimals();
            price = uint256(answer) * PRICE_PRECISION / (10 ** feedDecimals);
            timestamp = updatedAt;
            isStale = block.timestamp - updatedAt > feedInfo.stalePeriod;
            
            return (price, timestamp, isStale);
        } catch {
            revert InvalidPrice();
        }
    }

    function getRoundData(address token, uint80 roundId) external view returns (
        uint80 id,
        uint256 price,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) {
        PriceFeedInfo memory feedInfo = priceFeeds[token];
        
        if (address(feedInfo.feed) == address(0)) revert FeedNotFound();

        try feedInfo.feed.getRoundData(roundId) returns (
            uint80 _roundId,
            int256 answer,
            uint256 _startedAt,
            uint256 _updatedAt,
            uint80 _answeredInRound
        ) {
            if (answer <= 0) revert InvalidPrice();
            
            uint8 feedDecimals = feedInfo.feed.decimals();
            price = uint256(answer) * PRICE_PRECISION / (10 ** feedDecimals);
            
            return (_roundId, price, _startedAt, _updatedAt, _answeredInRound);
        } catch {
            revert InvalidPrice();
        }
    }

    function getFeedInfo(address token) external view returns (
        address feed,
        uint32 stalePeriod,
        bool isActive,
        string memory symbol
    ) {
        PriceFeedInfo memory feedInfo = priceFeeds[token];
        return (
            address(feedInfo.feed),
            feedInfo.stalePeriod,
            feedInfo.isActive,
            tokenSymbols[token]
        );
    }

    function isFeedSupported(address token) external view returns (bool) {
        return address(priceFeeds[token].feed) != address(0) && priceFeeds[token].isActive;
    }
} 