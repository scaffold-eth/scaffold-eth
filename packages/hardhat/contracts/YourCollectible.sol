pragma solidity >=0.6.0 <0.7.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./EIP2771Context.sol";
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract YourCollectible is ERC721, Ownable, EIP2771Context {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor(address trustedForwarder) public ERC721("YourCollectible", "YCB") EIP2771Context(trustedForwarder) {
    _setBaseURI("https://ipfs.io/ipfs/");
  }

  function _msgSender() internal view override(Context, EIP2771Context) returns (address payable) {
    return EIP2771Context._msgSender();
  }

  function mintItem(address to, string memory tokenURI)
      public
      onlyOwner
      returns (uint256)
  {
      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(to, id);
      _setTokenURI(id, tokenURI);

      return id;
  }
}
