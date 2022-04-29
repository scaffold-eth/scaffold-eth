// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

// NFTs with programmable royalties.

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MockERC721 is ERC721, ERC721Enumerable, ERC721URIStorage {
    //this lets you look up a token by the uri (assuming there is only one of each uri)
    mapping(string => uint256) public uriToTokenId;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("YourCollectible", "YC") {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    // The following functions are overrides required
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
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
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // Mint an NFT
    function mintItem(string memory _tokenURI) public returns (bool) {
        _tokenIds.increment();
        uint256 id = _tokenIds.current();

        _mint(msg.sender, id);
        _setTokenURI(id, _tokenURI);

        uriToTokenId[_tokenURI] = id;

        return true;
    }
}
