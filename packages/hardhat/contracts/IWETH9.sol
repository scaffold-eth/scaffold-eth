// SPDX-License-Identifier: Apache-2.0

// solhint-disable-next-line compiler-version
pragma solidity >=0.6.9 <0.9.0;

/// @notice DEPRECATED - see new repo(https://github.com/OffchainLabs/token-bridge-contracts) for new updates
interface IWETH9 {
    function deposit() external payable;

    function withdraw(uint256 _amount) external;

    function transfer(address target, uint256 amount) external;
}