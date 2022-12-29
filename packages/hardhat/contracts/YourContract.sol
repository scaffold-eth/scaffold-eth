pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
// https://docs.openzeppelin.com/contracts/3.x/api/proxy#UpgradeableProxy

contract YourContract is UUPSUpgradeable, OwnableUpgradeable {

  event SetPurpose(address sender, string purpose);

  string public purpose;

  function initialize() public initializer {
    __Ownable_init();
    purpose = "Building Unstoppable Apps";
  }

  function setPurpose(string memory newPurpose) public payable {
      purpose = newPurpose;
      console.log(msg.sender,"set purpose to",purpose);
      emit SetPurpose(msg.sender, purpose);
  }

  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}

  function _authorizeUpgrade(
      address newImplementation
  ) internal override onlyOwner {}
}
