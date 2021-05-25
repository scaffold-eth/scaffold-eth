// SPDX-License-Identifier: MIT
pragma solidity >=0.7.2;

interface IWhitelist {
  function isWhitelistedOtoken(address _otoken) external view returns (bool);
}
