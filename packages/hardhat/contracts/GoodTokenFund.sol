// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GoodTokenFund is ERC20 {

    
    constructor () ERC20("Good Token Fund", "GTF") public {

    }

    function mint() public payable {
        _mint(_msgSender(), msg.value);
    }
}
