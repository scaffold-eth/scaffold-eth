// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

contract X {
  string public name;

  constructor(string memory _name) {
    name = _name;
  }
}

contract Y {
  string public text;

  constructor (string memory _text) {
    text = _text;
  }
}

contract YourContract is X("Input to X"), Y("Input to Y") {

}
