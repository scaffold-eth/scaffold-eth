// SPDX-License-Identifier: UNLICENSED
// from https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2#code

pragma solidity >=0.8.0 <0.9.0;

contract WETH9 {
    event Deposit(address indexed from, uint256 amount);

    event Withdrawal(address indexed to, uint256 amount);

    function deposit() public payable virtual {
    }

    function withdraw(uint256 amount) public virtual {
    }

    receive() external payable virtual {
        deposit();
    }
}