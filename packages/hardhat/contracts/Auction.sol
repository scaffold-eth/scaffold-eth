pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Auction {
  ERC721 public nonFungibleContract;

  struct Auction {
    address seller;
    uint128 price;
  }

  mapping (uint256 => Auction) public tokenIdToAuction;

  constructor(address _nftAddress) {
    nonFungibleContract = ERC721(_nftAddress);
  }

  function createAuction(uint256 _tokenId, uint128 _price) public {
    Auction memory _auction = Auction({
       seller: msg.sender,
       price: uint128(_price)
    });
    address owner = msg.sender;
    nonFungibleContract.safeTransferFrom(owner, address(this), _tokenId);
    tokenIdToAuction[_tokenId] = _auction;
  }

  function bid(uint256 _tokenId) public payable {
    Auction memory auction = tokenIdToAuction[_tokenId];
    require(auction.seller != address(0));
    require(msg.value >= auction.price);

    address seller = auction.seller;
    uint128 price = auction.price;

    delete tokenIdToAuction[_tokenId];

    (bool success, ) = seller.call{value: price}("");
    require(success);
    address user = msg.sender;
    nonFungibleContract.safeTransferFrom(address(this), user, _tokenId);
  }

  function cancel(uint256 _tokenId) public {
    Auction memory auction = tokenIdToAuction[_tokenId];
    require(auction.seller == msg.sender);

    delete tokenIdToAuction[_tokenId];
    nonFungibleContract.safeTransferFrom(address(this), msg.sender, _tokenId);
  }
}