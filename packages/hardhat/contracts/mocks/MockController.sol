//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import { IPool } from "../interfaces/IPool.sol";
import { MockERC20 } from "./MockERC20.sol";

/**
 * MockController
 */
contract MockController {

  enum ActionType {
    OpenVault,
    MintShortOption,
    BurnShortOption,
    DepositLongOption,
    WithdrawLongOption,
    DepositCollateral,
    WithdrawCollateral,
    SettleVault,
    Redeem,
    Call
  }

  struct ActionArgs {
    ActionType actionType;
    address owner;
    address secondAddress;
    address asset;
    uint256 vaultId;
    uint256 amount;
    uint256 index;
    bytes data;
  }

  IPool public pool;

  bool public vaultOpened; 

  address public cacheCollateralAsset;

  uint256 public mockSettlePayout;

  function setSettlePayout(uint256 _payout) external {
    mockSettlePayout = _payout;
  }

  function setPool (address _pool) external {
    pool = IPool(_pool);
  }

  function operate(ActionArgs[] memory _actions) external {
    
    for (uint8 i =0; i < _actions.length ; i = i+1) {
      ActionArgs memory action = _actions[i];
          
      // mock open vault: set variable
      if (action.actionType == ActionType.OpenVault) {
        vaultOpened = true;
      }
      // mock deposit: transfer asset to pool
      else if (action.actionType == ActionType.DepositCollateral) {
        address owner = action.owner;
        address asset = action.asset;
        uint256 depositAmount = action.amount;
        pool.transferFromUser(owner, asset, depositAmount);

        cacheCollateralAsset = asset;
      }
      // mock mint otoken: directly mint otoken
      else if (action.actionType == ActionType.MintShortOption) {
        address owner = action.owner;
        address otoken = action.asset;
        uint256 mintAmount = action.amount;
        MockERC20(otoken).mint(owner, mintAmount);
      }
      // mock settle: user pre-set settlement amount to pay back to user
      else if (action.actionType == ActionType.SettleVault) {
        address owner = action.owner;
        pool.transferToUser(owner, cacheCollateralAsset, mockSettlePayout);
      }
    }
  }
}
