pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IContract {
  function register() external;
  function move(string memory move) external;
}

contract YourContract is Ownable {

  IContract public extContract;

  constructor(address contractAddress) payable {
    extContract = IContract(contractAddress);
    transferOwnership(0xA4ca1b15fE81F57cb2d3f686c7B13309906cd37B);
  }

  // Interactions
  function registerMyContract() public onlyOwner {
    extContract.register();
  }

  function movePlayer (string memory direction) public onlyOwner {
    extContract.move(direction);
  }

  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}
}
