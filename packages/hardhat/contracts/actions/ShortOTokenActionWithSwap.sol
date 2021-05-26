// SPDX-License-Identifier: MIT
pragma solidity >=0.7.2;
pragma experimental ABIEncoderV2;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import { AirswapBase } from '../utils/AirswapBase.sol';
import { RollOverBase } from '../utils/RollOverBase.sol';

import { SwapTypes } from '../libraries/SwapTypes.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { SafeERC20 } from '@openzeppelin/contracts/token/ERC20/SafeERC20.sol';
import { SafeMath } from '@openzeppelin/contracts/math/SafeMath.sol';

import { IController } from '../interfaces/IController.sol';
import { IAction } from '../interfaces/IAction.sol';
import { IChainlink } from '../interfaces/IChainlink.sol';
import { IOToken } from '../interfaces/IOToken.sol';

contract ShortOTokenActionWithSwap is IAction, OwnableUpgradeable, AirswapBase, RollOverBase {
  using SafeERC20 for IERC20;
  using SafeMath for uint256;

   /// @dev 100%
  uint256 constant public BASE = 10000;
  /// @dev the minimum strike price of the option chosen needs to be at least 105% of spot. 
  /// This is set expecting the contract to be a strategy selling calls. For puts should change this. 
  uint256 constant public MIN_STRIKE = 10500;
  uint256 public lockedAsset;

  address public immutable vault;
  address public immutable asset;
  IController public controller;
  IChainlink public oracle; 

  constructor(
    address _vault,
    address _asset,
    address _swap,
    address _opynWhitelist,
    address _controller,
    address _oracle,
    uint256 _vaultType
  ) {
    vault = _vault;
    asset = _asset;

    // enable vault to take all the asset back and re-distribute.
    IERC20(_asset).safeApprove(_vault, uint256(-1));

    controller = IController(_controller);
    oracle = IChainlink(_oracle);

    // enable pool contract to pull asset from this contract to mint options.
    address pool = controller.pool();
    IERC20(_asset).safeApprove(pool, uint256(-1));

    _initSwapContract(_swap);
    _initRollOverBase(_opynWhitelist);
    __Ownable_init();

    _openVault(_vaultType);
  }

  modifier onlyVault() {
    require(msg.sender == vault, "!VAULT");

    _;
  }

  /**
   * @dev return the net worth of this strategy, in terms of asset.
   * if the action has an opened gamma vault, see if there's any short position
   */
  function currentValue() external view override returns (uint256) {
    uint256 assetBalance = IERC20(asset).balanceOf(address(this));
    return assetBalance.add(lockedAsset);
    
    // todo: caclulate cash value to avoid not early withdraw to avoid loss.
  }

  /**
   * @dev the function that the vault will call when the round is over
   */
  function closePosition() external onlyVault override {
    _settleVault();

    // this function can only be called when it's `Activated`
    // go to the next step, which will enable owner to commit next oToken
    _setActionIdle();

    lockedAsset = 0;
  }

  /**
   * @dev the function that the vault will call when the new round is starting
   */
  function rolloverPosition() external onlyVault override {
    
    // this function can only be called when it's `Committed`
    _rollOverNextOTokenAndActivate();
  }

  /**
   * @dev owner only function to mint options with "assets"
   * this can only be done in "activated" state. which is achievable by calling `rolloverPosition`
   */
  function mintOToken(uint256 _collateralAmount, uint256 _otokenAmount) external onlyOwner onlyActivated {
    _mintOTokens(_collateralAmount, _otokenAmount);
  }

  /**
   * @dev owner only function to sell otokens in this contract by filling an order on AirSwap.
   */
  function swapSell(SwapTypes.Order memory _order) external onlyOwner onlyActivated {
    require(_order.sender.wallet == address(this), '!Sender');
    require(_order.sender.token == otoken, 'Can only sell otoken');
    require(_order.signer.token == asset, 'Can only sell for asset');

    IERC20(otoken).safeApprove(address(airswap), _order.sender.amount);

    _fillAirswapOrder(_order);
  }

  /**
   * @dev open vault with vaultId 1. this should only be performed once when contract is initiated
   */
  function _openVault(uint256 _vaultType) internal {

    bytes memory data;
    if (_vaultType != 0) {
      data = abi.encode(_vaultType);
    }

    // this action will always use vault id 0
    IController.ActionArgs[] memory actions = new IController.ActionArgs[](1);

    actions[0] = IController.ActionArgs(
        IController.ActionType.OpenVault,
        address(this), // owner
        address(0), // second address
        address(0), // asset, otoken
        1, // vaultId
        0, // amount
        0, // index
        data // data
    );

    controller.operate(actions);
  }

  /**
   * @dev mint otoken in vault 0
   */
  function _mintOTokens(uint256 _collateralAmount, uint256 _otokenAmount) internal {
    // this action will always use vault id 0
    IController.ActionArgs[] memory actions = new IController.ActionArgs[](2);

    actions[0] = IController.ActionArgs(
        IController.ActionType.DepositCollateral,
        address(this), // vault owner
        address(this), // deposit from this address
        asset, // collateral asset
        1, // vaultId
        _collateralAmount, // amount
        0, // index
        "" // data
    );

    actions[1] = IController.ActionArgs(
        IController.ActionType.MintShortOption,
        address(this), // vault owner
        address(this), // mint to this address
        otoken, // otoken
        1, // vaultId
        _otokenAmount, // amount
        0, // index
        "" // data
    );

    lockedAsset = lockedAsset.add(_collateralAmount);

    controller.operate(actions);
  }

  /**
   * @dev settle vault 0 and withdraw all locked collateral
   */
  function _settleVault() internal {

    IController.ActionArgs[] memory actions = new IController.ActionArgs[](1);
    // this action will always use vault id 1
    actions[0] = IController.ActionArgs(
        IController.ActionType.SettleVault,
        address(this), // owner
        address(this), // recipient
        address(0), // asset
        1, // vaultId
        0, // amount
        0, // index
        "" // data
    );

    controller.operate(actions);
  }
  
  /**
   * @dev funtion to add some custom logic to check the next otoken is valid to this strategy
   * this hook is triggered while action owner calls "commitNextOption"
   * so accessing otoken will give u the current otoken. 
   */
  function _customOTokenCheck(address _nextOToken) internal view override {
    // Can override or replace this. 
     IOToken otokenToCheck = IOToken(_nextOToken);
     require(_isValidStrike(otokenToCheck.strikePrice()), 'Strike Price Too Low');
    /**
     * e.g.
     * check otoken strike price is lower than current spot price for put.
     * check it's no more than x day til the current otoken expires. (can't commit too early)
     * check there's no previously committed otoken.
     * check otoken expiry is expected
     */
  }

  /**
   * @dev funtion to check that the otoken being sold meets a minimum valid strike price
   * this hook is triggered in the _customOtokenCheck function. 
   */
  function _isValidStrike(uint256 strikePrice) internal view returns (bool) {
    /**
     * Feel free to override this or ignore it
     */
    (
      uint80 roundId,
      int256 answer,
      uint256 startedAt,
      uint256 updatedAt,
      uint80 answeredInRound
    ) = oracle.latestRoundData();
    // checks that the strike price set is > than 105% of current price
    uint256 spotPrice = uint256(answer);
    return strikePrice >= spotPrice.mul(MIN_STRIKE).div(BASE);
  }
}
