// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

interface IToken {
    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);
    function balanceOf(address account, uint256 tokenId) external view returns (uint256);
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
}