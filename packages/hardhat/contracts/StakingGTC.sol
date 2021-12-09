pragma solidity 0.8.4;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// Todo: abstract name and description away from contract storage

/// @title GTC Staking Contract
/// @author jaxcoder, ghostffcode
/// @notice Explain to an end user what this does
/// @dev Explain to a developer any extra details
contract StakingGTC is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;

    Counters.Counter private _poolIds;

    struct Pool {
        uint256 id;
        uint256 balance;
        bool paused;
        string detailsCID;
        mapping(address => uint256) userBalance;
    }

    // state
    IERC20 public gtc; // 0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F;

    mapping(uint256 => Pool) pools;

    // events
    event PoolCreated(uint256 indexed poolId, uint256 timestamp);
    event Stake(
        address indexed user,
        uint256 amount,
        uint256 timestamp,
        uint256 indexed id
    );
    event Unstake(
        address indexed user,
        uint256 amount,
        uint256 timestamp,
        uint256 indexed id
    );

    // For now we are passing in the gtc address for testing and different networks
    // On mainnet we will remove this parameter from the constructor
    constructor(address _gtcAddress) {
        gtc = IERC20(_gtcAddress);
    }

    function getPoolBalance(uint256 id) public view returns (uint256) {
        return pools[id].balance;
    }

    function getPoolDetailsCID(uint256 id) public view returns (string memory) {
        return pools[id].detailsCID;
    }

    function getUserPoolBalance(uint256 id, address user)
        public
        view
        returns (uint256)
    {
        return pools[id].userBalance[user];
    }

    /// @dev create pool for the GTC asset
    /// @param detailsCID the CID for the details
    /// @return the pool id
    function createPool(string memory detailsCID) public returns (uint256) {
        _poolIds.increment();
        uint256 id = _poolIds.current();

        // setup pool
        pools[id].id = id;
        pools[id].detailsCID = detailsCID;
        pools[id].balance = 0;

        emit PoolCreated(id, block.timestamp);

        return id;
    }

    /// @dev stakes your GTC into a pool
    /// @param id the pool id
    /// @param amount amount to stake in GTChow
    function stakePool(uint256 id, uint256 amount) public {
        // checks
        require(id > 0, "This pool does not exist");
        require(amount > 0, "You can't stake zero balance");
        require(
            gtc.balanceOf(msg.sender) >= amount,
            "You don't have up to this amount to stake"
        );
        require(
            gtc.allowance(msg.sender, address(this)) >= amount,
            "Not enough token allowance to stake."
        );

        // transfer token to this pool
        gtc.safeTransferFrom(msg.sender, address(this), amount);

        // update the pool balance and user balance
        pools[id].balance += amount;
        pools[id].userBalance[msg.sender] += amount;

        // emit event for staking
        emit Stake(msg.sender, amount, block.timestamp, id);
    }

    function unstakePool(uint256 id) public {
        // checks
        require(id > 0, "This pool does not exist");
        uint256 poolBalance = pools[id].balance;
        uint256 userStakeBalance = pools[id].userBalance[msg.sender];
        require(
            userStakeBalance > 0,
            "You can't unstake an unexisting balance"
        );
        require(poolBalance > 0, "Nothing left to unstake.");
        require(
            poolBalance >= userStakeBalance,
            "Not enough balance to withdraw"
        );

        // update balances
        pools[id].balance -= userStakeBalance;
        pools[id].userBalance[msg.sender] = 0;

        gtc.safeTransfer(msg.sender, userStakeBalance);

        emit Unstake(msg.sender, userStakeBalance, block.timestamp, id);
    }
}
