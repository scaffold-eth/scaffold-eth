pragma solidity 0.8.4;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title A title that should describe the contract/interface
/// @author jaxcoder
/// @notice Explain to an end user what this does
/// @dev Explain to a developer any extra details
contract StakingGTC is Ownable {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;
  using Counters for Counters.Counter;
  Counters.Counter private _poolIds;

  // state
  address public gtcAddress;// 0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F;

  // structs
  struct PoolInfo {
    uint256 poolid;
    address asset;
    uint256 balance;
  }

  // mappings
  mapping(uint256 => PoolInfo) public poolInfo;
  mapping(address => mapping(uint256 => PoolInfo)) public balanceInfo;


  // events
  event Stake(address indexed user, uint256 amount, uint256 timestamp);
  event Unstake(address indexed user, uint256 amount,uint256 timestamp);
  event PoolCreated(uint256 poolId, address asset, uint256 initialBalance, uint256 timestamp);

  constructor(address _gtcAddress) {
    gtcAddress = _gtcAddress;

    createPool(gtcAddress, 0);
  }

  // get pool balance
  function poolBalance(uint256 poolId) public returns(uint256) {
    PoolInfo storage pool = poolInfo[poolId];
    return pool.balance;
  }

  // create pool
  function createPool(address asset, uint256 amount) internal {
    _poolIds.increment();
    uint256 id = _poolIds.current();

    PoolInfo storage pool = poolInfo[id];
    pool.asset = asset;
    pool.balance = amount;
    pool.poolid = id;

    balanceInfo[msg.sender][id].balance = balanceInfo[msg.sender][id].balance.add(amount);

    emit PoolCreated(id, asset, amount, block.timestamp);
  }


  // initialize pool
  function initializePool() public {

  }


  // deposit/stake
  function stake(address asset, uint256 amount, uint256 poolId) public {
    PoolInfo storage pool = poolInfo[poolId];
    pool.balance = pool.balance.add(amount);

    emit Stake(msg.sender, amount, block.timestamp);
  }


  // withdrawl/unstake
  function unstake(uint256 poolId) public {
    PoolInfo storage pool = poolInfo[poolId];
    uint256 balance = balanceInfo[msg.sender][poolId].balance;

    require(IERC20(pool.asset).balanceOf(address(this)) >= balance, "Cannot withdraw more that the contract holds ser");
    balanceInfo[msg.sender][poolId].balance = balanceInfo[msg.sender][poolId].balance.sub(balance);

    IERC20(pool.asset).transferFrom(address(this), msg.sender, balance);

    emit Unstake(msg.sender, balance, block.timestamp);
  }

  
}
