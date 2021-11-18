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
  // track poolInfo from its id
  mapping(uint256 => PoolInfo) public poolInfo;
  // track user balance for each pool they belong to
  mapping(address => mapping(uint256 => PoolInfo)) public userPoolInfos;

  // events
  event Stake(address indexed user, uint256 amount, uint256 timestamp);
  event Unstake(address indexed user, uint256 amount,uint256 timestamp);
  event PoolCreated(uint256 poolId, address asset, uint256 initialBalance, uint256 timestamp);

  // For now we are passing in the gtc address for testing and different networks
  // On mainnet we will remove this parameter from the constructor
  constructor(address _gtcAddress) {
    gtcAddress = _gtcAddress;

    // for testing, create a pool on construction with 0 balance
    createPool(gtcAddress, 0);
  }

  // get pool balance
  function poolBalance(uint256 poolId) public view returns(uint256) {
    return poolInfo[poolId].balance;
  }

  // get pool details
  function poolDetails(uint256 poolId) public view returns(address, uint256) {
    return (
      poolInfo[poolId].asset,
      poolInfo[poolId].balance
    );
  }

  // create pool
  function createPool(address asset, uint256 amount) public returns(uint256) {
    _poolIds.increment();
    uint256 id = _poolIds.current();

    PoolInfo storage pool = poolInfo[id];
    pool.asset = asset;
    pool.balance = amount;
    pool.poolid = id;

    pool = userPoolInfos[msg.sender][id];

    emit PoolCreated(id, asset, amount, block.timestamp);

    return id;
  }


  // deposit/stake
  function stake(address asset, uint256 amount, uint256 poolId) public {
    PoolInfo storage pool = poolInfo[poolId];
    pool.balance = pool.balance.add(amount);

    IERC20(pool.asset).safeTransferFrom(msg.sender, address(this), amount);
    pool = userPoolInfos[msg.sender][poolId];

    emit Stake(msg.sender, amount, block.timestamp);
  }


  // withdrawl/unstake
  function unstake(uint256 poolId) public {
    PoolInfo storage pool = poolInfo[poolId];

    require(IERC20(pool.asset).balanceOf(address(this)) >= pool.balance, "Cannot withdraw more that the contract holds ser");
    pool.balance = pool.balance.sub(IERC20(pool.asset).balanceOf(address(this)));
    IERC20(pool.asset).safeTransfer(msg.sender, pool.balance);
    

    pool = userPoolInfos[msg.sender][poolId];

    emit Unstake(msg.sender, pool.balance, block.timestamp);
  }

  
}
