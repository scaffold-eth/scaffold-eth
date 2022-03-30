pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Phoenix is ERC721Enumerable {

  using Strings for uint256;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  // all funds go to buidlguidl.eth
  address payable public constant recipient =
    payable(0xa81a6a910FeD20374361B35C451a4a44F86CeD46);

  uint256 public constant limit = 1000;
  uint256 public price = 0.01 ether;

  constructor() ERC721("Phoenix", "PHOENIX") {
  }

  function mintItem()
      public
      payable
      returns (uint256)
  {
      require(_tokenIds.current() < limit, "DONE MINTING");
      require(msg.value >= price, "NOT ENOUGH");
      require(balanceOf(msg.sender) < 1, "ONLY ONE NFT PER ADDRESS");

      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      (bool success, ) = recipient.call{value: msg.value}("");
      require(success, "could not send");

      return id;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");

      return
        string(
          abi.encodePacked(
              '{"name":"Phoenix #',id.toString(),
              '", "description":"Phoenix #',id.toString(),
              '", "image": "https://phoenixnft2.ue.r.appspot.com/phoenix/',id.toString(),
              '"}'
          )
        );
  }
}