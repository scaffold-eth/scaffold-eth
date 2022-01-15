//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RobotoBattery is ERC20 {

  address payable public constant recipient =
    payable(0x8faC8383Bb69A8Ca43461AB99aE26834fd6D8DeC);

  uint256 public price = 0.01 ether;

  constructor() public ERC20("RobotoBattery", "ROBOTOBAT") {
  }

  function decimals() public view override returns (uint8) {
    return 0;
  }

  function mint() public payable returns (uint256) {
    require(msg.value >= price, "NOT ENOUGH");

    _mint(msg.sender, 10);

    (bool success, ) = recipient.call{value: msg.value}("");
    require(success, "could not send");
  }
}
