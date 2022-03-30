// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Token2 is ERC20 {
  constructor() ERC20('Token B', 'TKB') {
    _mint(msg.sender, 2000000000000000000000000);
  }
}