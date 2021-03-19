// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

interface IBalanceOf {
    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

}