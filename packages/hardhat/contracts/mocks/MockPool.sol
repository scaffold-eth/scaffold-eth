//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

/**
 * MockController
 */
contract MockPool {
  function transferFromUser(
    address _user,
    address _asset,
    uint256 _amount
  ) external {
    IERC20(_asset).transferFrom(_user, address(this), _amount);
  }

  function transferToUser(
    address _user,
    address _asset,
    uint256 _amount
  ) external {
    IERC20(_asset).transfer(_user, _amount);
  }
}
