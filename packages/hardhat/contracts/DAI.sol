pragma solidity >=0.6.0 <0.7.0;

import { IERC20 } from "./Interfaces.sol";
import { Constants } from "./Constants.sol";

import "hardhat/console.sol";

contract DAI {
  IERC20 public dai;

  constructor() public {
    dai = IERC20(Constants.DAI_ADDRESS);
  }

  function getMyDAIBalance(address check) public view returns (uint256) {
    return dai.balanceOf(check);
  }
}
