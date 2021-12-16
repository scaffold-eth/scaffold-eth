// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Buzz is ERC20 {

    address oldEnglish;
    uint256 hit = 420_000_000_000_000_000_000;
    uint256 drunk = 6969_000_000_000_000_000_000;

    constructor(address _oldEnglish) ERC20("Buzz", "BUZZ") {
        oldEnglish = _oldEnglish;
    }

    function mint(address _recipient) public {
      require(msg.sender == oldEnglish, "only OldEnglish can mint");
      _mint(_recipient, hit);
    }

    function isDrunk(address sipper) public view returns (bool) {
      return balanceOf(sipper) >= drunk;
    }
}
