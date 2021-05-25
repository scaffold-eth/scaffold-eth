// SPDX-License-Identifier: MIT
pragma solidity >=0.7.2;
pragma experimental ABIEncoderV2;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import { AirswapBase } from '../utils/AirswapBase.sol';
import { RollOverBase } from '../utils/RollOverBase.sol';
import { SwapTypes } from '../libraries/SwapTypes.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { SafeERC20 } from '@openzeppelin/contracts/token/ERC20/SafeERC20.sol';

contract LongOTokenActionWithSwap is OwnableUpgradeable, AirswapBase, RollOverBase {
  address public immutable asset;

  constructor(
    address _asset,
    address _swap,
    address _opynWhitelist
  ) {
    asset = _asset;
    _initSwapContract(_swap);
    _initRollOverBase(_opynWhitelist);
  }

  function swapBuy(SwapTypes.Order memory _order) external onlyOwner {
    require(_order.sender.wallet == address(this), '!Sender');
    require(_order.signer.token == otoken, 'Can only buy otoken');
    require(_order.sender.token == asset, 'Can only sell asset');

    _fillAirswapOrder(_order);
  }

  /**
   * @dev funtion to add some custom logic to check the next otoken is valid to this strategy
   * this hook is triggered while action owner calls "commitNextOption"
   * so accessing "otoken" will give u the current otoken. 
   */
  function _customOTokenCheck(address _nextOToken) internal view override {
    /**
     * e.g.
     * check otoken strike price is lower than current spot price for put.
     * check it's no more than x day til the current otoken expires. (can't commit too early)
     * check there's no previously committed otoken.
     * check otoken expiry is expected
     */
  }

}
