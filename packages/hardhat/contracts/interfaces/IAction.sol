// SPDX-License-Identifier: MIT
pragma solidity >=0.7.2;

interface IAction {
  /**
   * The function used to determin how much asset the current action is controlling.
   * this will impact the withdraw and deposit amount calculated from the vault.
   */
  function currentValue() external view returns (uint256);

  /**
   * The function for the vault to call at the end of each vault's round.
   * after calling this function, the vault will try to pull assets back from the action and enable withdraw.
   */
  function closePosition() external;

  /**
   * The function for the vault to call when the vault is ready to start the next round.
   * the vault will push assets to action before calling this function, but the amount can change compare to 
   * the last round. So each action should check their asset balance instead of using any cached balance.
   *
   * Each action can also add additional checks and revert the `rolloverPosition` call if the action 
   * is not ready to go into the next round.
   */
  function rolloverPosition() external;
}
