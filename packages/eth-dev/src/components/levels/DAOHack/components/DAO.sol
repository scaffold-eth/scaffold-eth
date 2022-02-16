// SPDX-License-Identifier: MIT

// Simplified DAO Contract

pragma solidity 0.7.0;

contract TheDAO {
  mapping(address => uint256) public balances;

  function donate(address _to) public payable {
    balances[_to] += msg.value;
  }

  function balanceOf(address _who) public view returns (uint256 balance) {
    return balances[_who];
  }

  function withdraw(uint256 _amount) public {
    if (balances[msg.sender] >= _amount) {
      (bool result, bytes memory data) = msg.sender.call{value: _amount}("");
      if (result) {
        _amount;
      }
      balances[msg.sender] -= _amount;
    }
  }

  fallback() external payable {}
}
