pragma solidity >=0.6.0 <0.8.4;
//SPDX-License-Identifier: MIT

/// @title NFT contract for licensening IP
/// @author elocremarc

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract IpNft is ERC721, ERC721URIStorage, Ownable {
    address licensor = owner();
    uint256 licenseCost = 10000000000000000;
    string[] IP;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(
        string memory IpBrandName,
        string memory IpBrandSymbol,
        string memory IpURI
    ) public ERC721(IpBrandName, IpBrandSymbol) {
        _baseURI();
        IP.push(IpURI);
    }

    // @dev push a new IP to the contract
    function _pushIP(string memory IpURI) public {
        IP.push(IpURI);
    }


    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }
  
    /** @dev disable Transfer of NFT to ensure no secondary market can function */ 
    function transferFrom(address from, address to, uint256 tokenId) public override {
        revert("Transfer Disabled Buy new License");
    }
    /** @dev disable Transfer of NFT to ensure no secondary market can function */ 
    function safeTransferFrom(address from, address to,uint256 tokenId) public override {
        revert("Transfer Disabled Buy new License");
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    /**
     * @dev Mint Licensee a License
     * @return token id of license
     **/
    function licenseIP() public payable returns (uint256) {
        require(msg.value == licenseCost);
        _tokenIds.increment();
        uint256 id = _tokenIds.current();
        _mint(msg.sender, id);
        _setTokenURI(id, IP[0]);
        return id;
    }

    /**
     * @dev Change the licensor and owner of the contract
     * @param newLicensor address of the new licensor
     **/
    function changeLicensor(address newLicensor) public onlyOwner {
        transferOwnership(newLicensor);
    }

    /**
     * @dev Change cost of License
     * @param newLicenseCost New price for license
     **/
    function changeLicenseCost(uint256 newLicenseCost)
        public
        onlyOwner
        returns (uint256)
    {
        licenseCost = newLicenseCost;
        return licenseCost;
    }
}
