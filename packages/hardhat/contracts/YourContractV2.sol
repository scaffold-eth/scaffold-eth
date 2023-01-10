pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
// https://docs.openzeppelin.com/contracts/3.x/api/proxy#UpgradeableProxy

contract YourContractV2 is UUPSUpgradeable, OwnableUpgradeable {

  event SetPurpose(address sender, string purpose);

  // States are preserved as a part of an upgrade. 
  // Function implmeentations change, but this should be whatever it is you set previously.
  string public purpose;

  function initialize() public initializer {
    // This doesn't actually do anything. 
    // Changing the initialization implementation of a contract that has already been initialized doesn't really make sense.
    // As a result, purpose should still be "Building Unstoppable Apps", or whatever it was changed to from V1.
    __Ownable_init();
    purpose = "Building Stoppable Apps";
  }

  function setPurpose(string memory newPurpose) public payable {
      purpose = newPurpose;
      console.log(msg.sender,"set purpose to",purpose);
      emit SetPurpose(msg.sender, purpose);
  }

  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}

  function version() public pure returns(string memory) {
    return "v2.0.0";
  }

  function _authorizeUpgrade(
      address newImplementation
  ) internal override onlyOwner {}
}
