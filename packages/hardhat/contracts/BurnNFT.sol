// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./MetaDataGenerator.sol";

contract BurnNFT is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event NewToken(address _minter, uint256 _tokenId, uint256 _baseFee);

    uint public limit;
    uint256 public price;
    address public beneficiary;
    uint256 public minBaseFee = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    uint256 public maxBaseFee = 1;

    mapping(uint256 => uint256) public tokenBaseFee;

    constructor(uint _limit, uint256 _price, address _beneficiary) ERC721("BurnyBanner", "BURN") {
      limit = _limit;
      price = _price;
      beneficiary = _beneficiary;
    }

    function mint() public payable returns (uint256) {

        require(msg.value >= price, "price too low");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        require(newItemId <= limit, "at limit");

        _safeMint(msg.sender, newItemId);

        uint256 baseFee = block.basefee;
        tokenBaseFee[newItemId] = baseFee;

        if(baseFee > maxBaseFee) {
          maxBaseFee = baseFee;
        }
        if(baseFee < minBaseFee) {
          minBaseFee = baseFee;
        }

        emit NewToken(msg.sender, newItemId, baseFee);

        return newItemId;
    }

    function withdrawFunds() public {
      require(msg.sender == beneficiary, 'only beneficiary');
      uint amount = address(this).balance;

      (bool success,) = beneficiary.call{value: amount}("");
      require(success, "Failed");
    }

    function totalSupply() public view returns (uint256) {
      return _tokenIds.current();
    }

    function tokenURI(uint256 id) public view override returns (string memory) {

        require(_exists(id), "not exist");

        return MetaDataGenerator.tokenURI(id, tokenBaseFee[id], ownerOf(id), minBaseFee, maxBaseFee);

    }
}
