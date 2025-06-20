// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IChainlinkPriceFeed
 * @author Valkyrie Finance Team
 * @notice Interface for Chainlink price feed aggregators providing secure, decentralized price data
 * @dev Standard Chainlink aggregator interface for fetching price data with round information
 * This interface ensures compatibility with Chainlink's price feeds while providing
 * robust error handling and staleness protection mechanisms.
 * @custom:security-contact security@valkyrie.finance
 */
interface IChainlinkPriceFeed {
    /**
     * @notice Returns the number of decimals for the price feed
     * @dev Decimals represent the precision of the price data (e.g., 8 for USD pairs, 18 for ETH pairs)
     * @return Number of decimals used by the price feed
     */
    function decimals() external view returns (uint8);

    /**
     * @notice Returns a human-readable description of the price feed
     * @dev Description typically follows format "ASSET / DENOMINATION" (e.g., "ETH / USD")
     * @return Human-readable description string of the price pair
     */
    function description() external view returns (string memory);

    /**
     * @notice Returns the version of the price feed aggregator
     * @dev Version number helps identify the aggregator contract version for compatibility
     * @return Version number of the aggregator contract
     */
    function version() external view returns (uint256);

    /**
     * @notice Retrieves price data for a specific round
     * @dev Returns historical price data for a given round ID with complete metadata
     * @param _roundId The round ID to fetch data for
     * @return roundId The round ID (may differ from input if round not found)
     * @return answer The price data for the specified round
     * @return startedAt Timestamp when the round was started
     * @return updatedAt Timestamp when the round was last updated
     * @return answeredInRound The round ID in which the answer was computed
     */
    function getRoundData(uint80 _roundId) external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );

    /**
     * @notice Retrieves the latest price data from the feed
     * @dev Returns the most recent price data with complete metadata for staleness checks
     * Use this function for real-time price data with proper validation
     * @return roundId The latest round ID
     * @return answer The latest price data (may be negative for some feeds)
     * @return startedAt Timestamp when the latest round was started
     * @return updatedAt Timestamp when the latest round was last updated
     * @return answeredInRound The round ID in which the latest answer was computed
     */
    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
}
