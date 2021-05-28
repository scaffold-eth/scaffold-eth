// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EMEMToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Stakeable token", "EMEM") {
        _mint(msg.sender, initialSupply);
    }

    function faucet() public {
        _mint(msg.sender, 10000000000000000000);
    }
}