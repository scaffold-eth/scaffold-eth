// SPDX-License-Identifier: MIT
pragma solidity >=0.7.2;
pragma experimental ABIEncoderV2;

import { ISwap } from "../interfaces/ISwap.sol";
import { SwapTypes } from "../libraries/SwapTypes.sol";

contract AirswapBase {
    
  ISwap public airswap;

  function _initSwapContract(address _airswap) internal {
    require(_airswap != address(0), "Invalid airswap address");
    airswap = ISwap(_airswap);
  }

  function _fillAirswapOrder(SwapTypes.Order memory _order) internal {
    airswap.swap(_order);
  }
}
