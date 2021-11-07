//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

abstract contract LoogiesContract {
    mapping(uint256 => uint256) public chubbiness;

    function safeTransferFrom(
        address from,
        address to,
        uint256 id
    ) external virtual;
}

contract Flemjamins is ERC20 {
    LoogiesContract loogies;

    uint256 percentOfChubbiness = 10;

    constructor(address _loogies) ERC20("Flemjamins", "FLEM") {
        loogies = LoogiesContract(_loogies);
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 loogieTokenId,
        bytes memory
    ) external payable returns (bytes4) {
        // get chubbiness
        uint256 chub = loogies.chubbiness(loogieTokenId);
        // mint based on chubiness
        _mint(from, (chub * 1 * 10**18) / percentOfChubbiness);

        return this.onERC721Received.selector;
    }
}
