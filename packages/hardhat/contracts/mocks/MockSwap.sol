//SPDX-License-Identifier: MIT
pragma solidity ^0.7.2;
pragma experimental ABIEncoderV2;

import {SwapTypes} from "../libraries/SwapTypes.sol";
import { ISwap } from "../interfaces/ISwap.sol";
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract MockSwap is ISwap {
    
  function swap(SwapTypes.Order calldata order) external override {
    address sender = order.sender.wallet;

    // only try pulling token from sender
    IERC20(order.sender.token).transferFrom(sender, address(this), order.sender.amount);

    // todo: add send token to sender
  }
}