//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import { IWhitelist } from "../interfaces/IWhitelist.sol";

/**
 * MockWhitelist
 */
contract MockWhitelist is IWhitelist{

  bool isWhitelisted = true;

  function setIsWhitelisted (bool _isWhitelisted) external {
    isWhitelisted = _isWhitelisted;
  }

  function isWhitelistedOtoken(address) external view override returns (bool) {
    return isWhitelisted;
  }

}
