// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GLDToken is ERC20 {
    address public gameContract;

    constructor(uint256 initialSupply, address _gameContract) ERC20("Gold", "GLD") {
        gameContract = _gameContract;
        _mint(_gameContract, initialSupply);
    }

    function transfer(address to, uint amount) public override returns(bool) {
        require(msg.sender == gameContract);

        _transfer(gameContract, to, amount);

        return true;
    }

    // unlock after game!
}