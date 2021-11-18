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
  Counters.Counter private _projectIds;
  Counters.Counter private _donorIds;

  // state
  address public gtcAddress;// 0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F;

  // structs
  struct PoolInfo {
    uint256 poolid;
    address asset;
    uint256 balance;
    mapping(uint256 => Project) projects;
  }

  struct Project {
    uint256 id;
    string name;
    string description;
    address wallet;
    uint256 poolBalance;
    mapping(address => Donor) donors;
  }

  struct Donor {
    address wallet;
    uint256 stakedAmt;
    uint256 timestamp;
    uint256 projectId;
  }

  // mappings
  // track poolInfo from its id
  mapping(uint256 => PoolInfo) public poolInfos;

  mapping(uint256 => Project) public projects;
  mapping(address => Donor) public donors;

  // track user balance for each pool they belong to
  mapping(address => mapping(uint256 => PoolInfo)) public userPoolInfos;
  
  // events
  event Stake(address indexed user, uint256 amount, uint256 timestamp, uint256 projectId);
  event Unstake(address indexed user, uint256 amount,uint256 timestamp, uint256 projectId);
  event PoolCreated(uint256 indexed poolId, address asset, uint256 initialBalance, uint256 timestamp);
  event ProjectAdded(uint256 indexed projectId);
  event ProjectFunded(uint256 indexed projectId, uint256 amount);

  // For now we are passing in the gtc address for testing and different networks
  // On mainnet we will remove this parameter from the constructor
  constructor(address _gtcAddress) {
    gtcAddress = _gtcAddress;

    // create a pool on construction with 0 balance for GTC staking on projects
    createPool(gtcAddress);
  }

  // get pool balance
  function poolBalance(uint256 poolId) public view returns(uint256) {
    return poolInfos[poolId].balance;
  }

  /// @dev get pool details
  // todo: need to add the projects under this pool
  function poolDetails(uint256 poolId) public view returns(address, uint256) {
    return (
      poolInfos[poolId].asset,
      poolInfos[poolId].balance
    );
  }

  /// @dev get the project details
  function projectDetails(uint256 projectId) public view returns(uint256, string memory, string memory, address, uint256) {
    return (
      projects[projectId].id,
      projects[projectId].name,
      projects[projectId].description,
      projects[projectId].wallet,
      projects[projectId].poolBalance
    );
  }

  /// @dev get the donor details
  function donorDetails(address donorWallet) public view returns(address, uint256, uint256, uint256) {
    return (
      donors[donorWallet].wallet,
      donors[donorWallet].stakedAmt,
      donors[donorWallet].timestamp,
      donors[donorWallet].projectId
    );
  }

  /// @dev create pool for the GTC asset
  ///      ability to add other tokens
  /// @param asset the pool token
  function createPool(address asset) public returns(uint256) {
    _poolIds.increment();
    uint256 id = _poolIds.current();

    PoolInfo storage pool = poolInfos[id];
    pool.asset = asset;
    pool.balance = 0;
    pool.poolid = id;

    pool = userPoolInfos[msg.sender][id];

    emit PoolCreated(id, asset, 0, block.timestamp);

    return id;
  }


  /// @dev deposit/stake for a project with a wallet/owner of the project
  /// @param asset the asset the user is staking, GTC for now
  /// @param amount the amount the user is staking on a project
  /// @param poolId the poolId we are using for GTC which is pool 1
  /// @param projectWallet the projects wallet address for receiving funds
  /// @param name the name of the project
  /// @param description the desctiption of the project
  function stakeForProject(address asset, uint256 amount, uint256 poolId, address projectWallet, string memory name, string memory description) public {
    PoolInfo storage pool = poolInfos[poolId];
    _projectIds.increment();
    uint projectId = _projectIds.current();
    Project storage project = projects[projectId];
    
    project.wallet = projectWallet;
    project.description = description;
    project.name = name;
    project.poolBalance = project.poolBalance.add(amount);
    project.id = projectId;

    emit ProjectAdded(projectId);
    emit ProjectFunded(projectId, amount);

    pool.balance = pool.balance.add(amount);
    project = pool.projects[projectId];

    IERC20(pool.asset).safeTransferFrom(msg.sender, address(this), amount);
    pool = userPoolInfos[msg.sender][poolId];

    emit Stake(msg.sender, amount, block.timestamp, projectId);
  }

  /// @dev withdrawl/unstake from a project and claim rewards
  /// @param poolId the pool id
  /// @param projectId the project id
  function unstakeFromProject(uint256 poolId, uint256 projectId) public {
    PoolInfo storage pool = poolInfos[poolId];

    require(IERC20(pool.asset).balanceOf(address(this)) >= pool.balance, "Cannot withdraw more that the contract holds ser");
    pool.balance = pool.balance.sub(IERC20(pool.asset).balanceOf(address(this)));
    IERC20(pool.asset).safeTransfer(msg.sender, pool.balance);
    

    pool = userPoolInfos[msg.sender][poolId];

    claimRewards();

    emit Unstake(msg.sender, pool.balance, block.timestamp, projectId);
  }

  /// @dev Claims the users rewards for staking on a project
  function claimRewards() internal {

  }
}
