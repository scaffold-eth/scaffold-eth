// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// NFTs with programmable royalties.

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract YourCollectible is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    ERC721Royalty
{
    //this lets you look up a token by the uri (assuming there is only one of each uri)
    mapping(string => uint256) public uriToTokenId;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(uint96 _feeNumerator) ERC721("RoyaltiesTest", "RT") {
        // set default royalty fee in deploy script
        //_setDefaultRoyalty(msg.sender, _feeNumerator);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage, ERC721Royalty)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721Royalty)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // Mint an NFT and set Royalty characteristics. Percentage amount and royalty reciever.
    // The Royalty reciever is whomever mints the token here.
    // _royalty numerator 2.50% is entered as 250
    function mintItem(string memory _tokenURI, uint96 _royaltyNumerator)
        public
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 id = _tokenIds.current();
        _mint(msg.sender, id);
        _setTokenURI(id, _tokenURI);

        // set individual royalty fees
        _setTokenRoyalty(id, msg.sender, _royaltyNumerator);

        uriToTokenId[_tokenURI] = id;

        return id;
    }
}
