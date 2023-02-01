pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BuidlGuidlBeans is ERC20 {

  constructor() ERC20("BuidlGuidl Beans","BEANS") {
    _mint(0x34aA3F359A9D614239015126635CE7732c18fDF3, 42069 ether);
  }

}
