pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract EthereumCityERC20TokenMinter {

  event Mint(address sender);
  event Burn(address sender);
  event Transfer(address sender, uint256 amount);

  uint256 public totalSupply;
  uint256 public claimableSupply;
  mapping(address => uint256) public balances;

  function incrementSupply() public {
    totalSupply++;
    claimableSupply++;
    emit Mint(msg.sender);
  }

  function decrementSupply() public {
    totalSupply--;
    claimableSupply--;
    emit Burn(msg.sender);
  }

  function claim(uint256 _amount) public {
    assert(_amount <= claimableSupply);
    balances[msg.sender] = balances[msg.sender] + claimableSupply;
    claimableSupply = 0;
    emit Transfer(msg.sender, _amount);
  }
}
