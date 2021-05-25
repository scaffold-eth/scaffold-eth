// SPDX-License-Identifier: MIT

pragma solidity >=0.7.2;

interface IWETH {
    function deposit() external payable;

    function withdraw(uint256) external;
}
