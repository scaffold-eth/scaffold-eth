pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
// https://docs.openzeppelin.com/contracts/3.x/api/proxy#UpgradeableProxy

contract YourContract is UUPSUpgradeable, OwnableUpgradeable {

  event SetPurpose(address sender, string purpose);

  address king;
  uint public prize;

  function initialize() public initializer {
    __Ownable_init();
    king = msg.sender;
    prize = msg.value;
  }

  receive() external payable {
    require(msg.value >= prize || msg.sender == owner);
    payable(king).transfer(msg.value);
    king = msg.sender;
    prize = msg.value;
  }

  function _king() public view returns (address) {
    return king;
  }

  function version() public pure returns(string memory) {
    return "v1.0.0";
  }

  function _authorizeUpgrade(
      address newImplementation
  ) internal override onlyOwner {}
}
