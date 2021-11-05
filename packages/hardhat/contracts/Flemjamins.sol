//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

abstract contract LoogiesContract {
    mapping(uint256 => uint256) public chubbiness;

    function transferFrom(
        address from,
        address to,
        uint256 id
    ) external virtual;
}

contract Flemjamins is ERC20 {
    event Received(address, uint256);

    LoogiesContract loogies;

    constructor(address _loogies) public ERC20("Flemjamins", "FLEM") {
        loogies = LoogiesContract(_loogies);
    }

    function recieveBurnLoogie(uint256 tokenId) external payable {
        // get chubbiness
        uint256 chubiness = loogies.chubbiness(tokenId);
        // mint based on chubiness
        _mint(msg.sender, (chubiness * 1 * 10**18) / 10);
        emit Received(msg.sender, msg.value);
    }
}
