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
  
  mapping (address => uint) public refunds;

  // The V2 contract uses a pull model for the king to receive ETH back.
  function claimThrone() public payable {
    require(msg.value >= prize, "Invalid value");
    king = msg.sender;
    refunds[king] += prize;
    prize = msg.value;
    bool success = payable(address(this)).send(prize);
    if (!success) {
      IWETH9 weth = IWETH9(0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6); // Goerli WETH9 address
      weth.deposit{value: prize}();
      weth.transfer(address(this), prize);
    }
  }

  function claimRefunds() public {
    uint refund = refunds[msg.sender];
    refunds[msg.sender] = 0;
    bool success = payable(msg.sender).send(refund);
    if (!success) {
      IWETH9 weth = IWETH9(0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6);
      payable(address(weth)).transfer(refund);
      weth.transfer(msg.sender, refund);
    }
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
