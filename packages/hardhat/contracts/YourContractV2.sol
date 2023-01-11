pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

import './IWETH9.sol';
// https://docs.openzeppelin.com/contracts/3.x/api/proxy#UpgradeableProxy

contract YourContractV2 is UUPSUpgradeable, OwnableUpgradeable {

  event SetPurpose(address sender, string purpose);

  address king;
  uint public prize;

  function initialize() public payable initializer {
    __Ownable_init();
    king = msg.sender;
    prize = msg.value;
  }

  receive() external payable {
    require(msg.value >= prize || msg.sender == owner());
    // In order to fix the issue, we use a low-level call to send the prize to the king.
    // Generally speaking, pull-over-push designs should be favored, where the old king should be able to call a withdraw function to get funds
    // However, 
    bool success = payable(king).send(prize) ;
    if (!success) {
      IWETH9 weth = IWETH9(0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6);
      weth.deposit{value: prize}();
      weth.transfer(king, prize);
    }
    king = msg.sender;
    prize = msg.value;
  }

  function _king() public view returns (address) {
    return king;
  }

  function version() public pure returns(string memory) {
    return "v2.0.0";
  }

  function _authorizeUpgrade(
      address newImplementation
  ) internal override onlyOwner {}
}
