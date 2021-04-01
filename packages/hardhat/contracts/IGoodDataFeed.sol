// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

interface IGoodDataFeed {

    /**
     * @dev Gets the latest data for a given data feed.
     */
    function latestDataForFeed(string calldata feedId) external view returns (uint256); 

    /**
     * @dev Returns the number of decimals used to multiply the dataFeed queries.
     */
    function decimals() external view returns (uint8);

}