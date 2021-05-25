//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import { MockERC20 } from './MockERC20.sol';

/**
 * Mock ERC20
 */
contract MockOToken is MockERC20 {
  /// @notice asset that the option references
  address public underlyingAsset;

  /// @notice asset that the strike price is denominated in
  address public strikeAsset;

  /// @notice asset that is held as collateral against short/written options
  address public collateralAsset;

  /// @notice strike price with decimals = 8
  uint256 public strikePrice;

  /// @notice expiration timestamp of the option, represented as a unix timestamp
  uint256 public expiryTimestamp;

  /// @notice True if a put option, False if a call option
  bool public isPut;

  function initMockOTokenDetail(
    address _underlyingAsset,
    address _strikeAsset,
    address _collateralAsset,
    uint256 _strikePrice,
    uint256 _expiryTimestamp,
    bool _isPut
  ) external {
    underlyingAsset = _underlyingAsset;
    strikeAsset = _strikeAsset;
    collateralAsset = _collateralAsset;
    strikePrice = _strikePrice;
    expiryTimestamp = _expiryTimestamp;
    isPut = _isPut;
  }
}
