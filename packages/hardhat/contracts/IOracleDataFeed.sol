// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;


interface IOracleDataFeed {

    /**
     * @dev Returns Oracle name
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns Oracle description
     */
    function description() external view returns (string memory);

    /**
     * @dev Returns decimal multiplier used in rate
     */
    function decimals() external view returns (uint8);

    /**
     * @dev Returns latest data feed rate
     */
    function latestRate() external view returns (uint256);

    /**
     * @dev Returns rate for a give month.
     *  - Parameter month format: YYYYMM
     *    - 201901 == January 2019
     */
    function rateForMonth(uint16 month) external view returns (uint256);

}