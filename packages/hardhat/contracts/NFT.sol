// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol"; // our contract NFT inherits from openzeppelin's ERC721URIStorage Contract

contract NFT is ERC721URIStorage {
    // importing and then declaring a counter
    // to keep a track of total tokens minted
    using Counters for Counters.Counter;
    Counters.Counter private tokenId; // our constructor function calls the ERC721

    // passing two arguments for name and symbol respectively
    constructor() ERC721("UVLabs", "UVL") {} // defining a function mint which takes a recipient's address and a tokenURI as an argument

    function mint(
        address recipientAddress,
        string memory tokenURI_
    ) public returns (uint256 newItemId) {
        // increments tokenId value by one
        tokenId.increment();
        newItemId = tokenId.current(); // _safeMint is a private method
        // which mints the next value of the counter
        _safeMint(recipientAddress, newItemId);
        _setTokenURI(newItemId, tokenURI_);
    }
}
