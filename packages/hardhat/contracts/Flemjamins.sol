//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

abstract contract LoogiesContract {
  mapping(uint256 => bytes32) public genes;
  function renderTokenById(uint256 id) external virtual view returns (string memory);
  function transferFrom(address from, address to, uint256 id) external virtual;
}

contract Flemjamins is ERC20 {
  
    constructor() public ERC20("Flemjamins", "FLEM") {
        _mint(msg.sender, 10000000000000000000);
    }

    recieve(
      // get chubbiness
      uint256 cubbiness = getChubbiness()
      // mint based on chubiness
      _mint(msg.sender, (chubiness * 1*10**18)/10);
    )

}
