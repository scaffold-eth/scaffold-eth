// SPDX-License-Identifier: MIT

pragma solidity ^0.7.2;
pragma experimental ABIEncoderV2;

interface IPool {
  function transferFromUser(
    address _user,
    address _asset,
    uint256 _amount
  ) external;

  function transferToUser(
    address _user,
    address _asset,
    uint256 _amount
  ) external;
}
