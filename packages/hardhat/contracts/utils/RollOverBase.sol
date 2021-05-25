// SPDX-License-Identifier: MIT
pragma solidity >=0.7.2;
pragma experimental ABIEncoderV2;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import { AirswapBase } from './AirswapBase.sol';
import { SwapTypes } from '../libraries/SwapTypes.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { SafeERC20 } from '@openzeppelin/contracts/token/ERC20/SafeERC20.sol';
import { IWhitelist } from '../interfaces/IWhitelist.sol';

contract RollOverBase is OwnableUpgradeable {
  address public otoken;
  address public nextOToken;

  uint256 constant public MIN_COMMIT_PERIOD = 18 hours;
  uint256 public commitStateStart;

  enum ActionState {
    // action will go "idle" after the vault close this position, and before the next otoken is committed. 
    Idle,

    // onwer already set the next otoken this vault is trading.
    // during this phase, all funds are already back in the vault and waiting for re-distribution
    // users who don't agree with the setting of next round can withdraw.
    Committed,

    // after vault calls "rollover", owner can start minting / buying / selling according to each action.
    Activated
  }

  ActionState public state;

  IWhitelist public opynWhitelist;

  modifier onlyCommitted () {
    require(state == ActionState.Committed, "!COMMITED");
    _;
  }

  modifier onlyActivated () {
    require(state == ActionState.Activated, "!Activated");
    _;
  }


  function _initRollOverBase(address _opynWhitelist) internal {
    state = ActionState.Idle;
    opynWhitelist = IWhitelist(_opynWhitelist);
  }

  /**
   * owner can commit the next otoken, if it's in idle state.
   * or re-commit it if needed during the commit phase.
   */
  function commitOToken(address _nextOToken) external onlyOwner {
    require(state != ActionState.Activated, "Activated");
    _checkOToken(_nextOToken);
    nextOToken = _nextOToken;

    state = ActionState.Committed;
    
    commitStateStart = block.timestamp;
  }

  function _setActionIdle() internal onlyActivated {
    // wait for the owner to set the next option
    state = ActionState.Idle;
  }

  function _rollOverNextOTokenAndActivate() internal onlyCommitted {
    require(block.timestamp - commitStateStart > MIN_COMMIT_PERIOD, "COMMIT_PHASE_NOT_OVER");

    otoken = nextOToken;
    nextOToken = address(0);

    state = ActionState.Activated;
  }

  function _checkOToken(address _nextOToken) private view {
    require(opynWhitelist.isWhitelistedOtoken(_nextOToken), '!OTOKEN');
    _customOTokenCheck(_nextOToken);
  }

  /**
   * cutom otoken check hook to be overriden by each 
   */
  function _customOTokenCheck(address _nextOToken) internal view virtual {}
}
