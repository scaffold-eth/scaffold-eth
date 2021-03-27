// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GoodTokenFund is ERC20 {

    address public beneficiary;
    
    constructor (string memory tokenName, string memory tokenSymbol, address beneficiaryAddress) ERC20(tokenName, tokenSymbol) public {
        beneficiary = beneficiaryAddress;
    }

    function mint() public payable {
        _mint(_msgSender(), msg.value);
        payable(beneficiary).transfer(msg.value);
    }
}
