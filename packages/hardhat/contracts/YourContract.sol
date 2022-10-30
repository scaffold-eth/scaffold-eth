pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract {

  event SetPurpose(address sender, string purpose);

  string public purpose = "Building Unstoppable Apps!!!";

  struct Testy {
    string name;
    uint256 bal;
  }

  Testy[] public testies;

  mapping(address => Testy)public testyMap;

  constructor() payable {
    // what should we do on deploy?
    testies.push(Testy({
      name: "Testy Number 1",
      bal: 10 ether
    }));

    testyMap[msg.sender] = Testy({
      name: "Testy For Deployer",
      bal: 12 ether
    });
  }

  function setPurpose(string memory newPurpose) public payable {
      purpose = newPurpose;
      console.log(msg.sender,"set purpose to",purpose);
      emit SetPurpose(msg.sender, purpose);
  }

  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}
}
