//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import { IAction } from "../interfaces/IAction.sol";
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract MockAction is IAction() {

  address public vault;
  address public asset;

  uint8 public rolloverCounter;

  constructor(
    address _vault,
    address _asset
  ) {
    vault = _vault;
    asset = _asset;
    IERC20(_asset).approve(_vault, uint256(-1));
  }

  /**
   * The function used to determin how much asset the current action is controlling.
   * this will impact the withdraw and deposit amount calculated from the vault.
   */
  function currentValue() external override view returns (uint256) {
    require(msg.sender == vault, "MockAction: sender is not vault");
    return IERC20(asset).balanceOf(address(this));
  }

  /**
   * The function for the vault to call at the end of each vault's round.
   * after calling this function, the vault will try to pull assets back from the action and enable withdraw.
   */
  function closePosition() external override  {
    require(msg.sender == vault, "MockAction: sender is not vault");
    // uint256 balance = IERC20(asset).balanceOf(address(this));
  }

  /**
   * The function for the vault to call when the vault is ready to start the next round.
   * the vault will push assets to action before calling this function, but the amount can change compare to 
   * the last round. So each action should check their asset balance instead of using any cached balance.
   *
   * Each action can also add additional checks and revert the `rolloverPosition` call if the action 
   * is not ready to go into the next round.
   */
  function rolloverPosition() external override {
    require(msg.sender == vault, "MockAction: sender is not vault");
    rolloverCounter = rolloverCounter + 1;
  }
}