pragma solidity >=0.6.0 <0.7.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract NextJSTicket is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() public ERC721("Guillermo’s Ticket", "GT") {
        _setBaseURI("https://gateway.pinata.cloud/ipfs/");
    }

    function mintItem() public returns (uint256) {
        require(_tokenIds.current() < 100, "All 100 tickets have been minted");

        _tokenIds.increment();

        uint256 id = _tokenIds.current();
        _mint(msg.sender, id);
        _setTokenURI(id, "QmUfQaJQuqQZNhyKDmgxFtqo6oEdo8s9peXjTenz9cPm4m");

        return id;
    }
}
