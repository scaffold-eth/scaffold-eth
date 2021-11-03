//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GTC is ERC20 {
    constructor(address admin) ERC20("GTC", "GTC") {
        _mint(admin, 1000 ether);
    }

    function faucetMint() public {
        _mint(msg.sender, 1000 ether);
    }
}
