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

  function initialize() public payable initializer {
    __Ownable_init();
    king = msg.sender;
    prize = msg.value;
  }

  receive() external payable {
    // This require statement is already a huge issue: msg.sender can just be the owner
    // and the owner can literally reset everything by sending any arbitrary amount (including zero).
    require(msg.value >= prize || msg.sender == owner());
    // The real issue though is here, where the recipient of the transfer can be a contract.
    // In the case that a contract is the recipient, it can revert the transfer and DoS the game.
    // See Attacker.sol for an example implementation of this exploit.
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
