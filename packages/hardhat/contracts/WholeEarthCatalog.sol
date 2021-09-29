pragma solidity >=0.6.0 <0.7.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721



// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract WholeEarthCatalog is ERC721  {

  uint256 public constant limit = 100;

  string[] public ages = [
    /*'QmcQKYE8xAcVaQutPrfY72RiR4fFkZka8qtbmdHmEaXhbx',
    'QmUtTh4P4Hhtxyq2Lif3eBfv7aeFRBEbhoudvGxMc5SHmM',
    'QmNtCVifwab5nhGEwTp56imoNbLgFeuuqfjvv87bxv48Rw',
    'QmeosNEjrrNzPnLfg9k1ojMKbtmXFdL33EpUMkJRxBYSaS',
    'QmUFpn1e8fQnDSY3jJftYXJwvjHdFGBSbUwD2w8STAPKGu',
    'QmTfE2A6pqvPZRuTh5AG77sr2oi3gvfnziE6hKZQCanTE1',
    'QmPPrz8j61s8gRinvovum1bWAXiodeT2K4hmfV15ucTaaa',
    'QmRTpMsvhBNHnYfYZ3oQb2bbV559jCebrDSvE2PbpwKSb6',
    'QmSUAUwHjyURwyTKG95iWdkVvs3kM28PtERmmt1GsJNFDv',
    'QmbWXtjQoF4QfqZazj4jUo8AoEKm6no62kLkptb5bWMy7d',
    'QmTdzAULotGdTrSmTd3QVyRyLW6PFnQuAebFkd8EV68mdU',
    'QmQZg4ZwzeWd4xnLvmxzs2FyAVNPFW5V3pJFoDHmj7Ufjx',
    'QmeSDB6fgiKHjhPHaJBqLEwWyXitC8dJaw2se1Jw9mruQG',
    'QmXJH4XZrhjykXQTfpJwdBtaUAGE8VztqGUP1jK8UDYGo9',
    'QmWHiLUP5BnMr1T2Pja2KRB8hw51TWU1W4uMwYwUHmLtkA',
    'QmXriD2rKn4za9KmuMkuQT8K5EP9koyGttZ6w1tmGA1sSK',
    'QmUxqzsEz5YjdCPtQUEH197ZZTCMMEN257RgSfoWiSAnWK',
    'QmZ8WDNyZziccjDj9BybY2FXr5BqP3bc1rmaH58NMVNQcY',
    'QmVLyzKm5bFfFKjXEfEXYBUwFWnvvsJhPt2FPppxzmJFDs',
    'QmR6TXRsCcxosUEH9N7yu3sZGASjhhjsSaVFLtxyb9wsc3'*/
    'QmcQKYE8xAcVaQutPrfY72RiR4fFkZka8qtbmdHmEaXhbx',
    'QmUFpn1e8fQnDSY3jJftYXJwvjHdFGBSbUwD2w8STAPKGu',
    'QmR6TXRsCcxosUEH9N7yu3sZGASjhhjsSaVFLtxyb9wsc3'
  ];

  address payable public constant wholeearthcatalogNFT = 0xbf7ab5009533f88Dca32C41558E0a8d4967d5d18;

  mapping (uint256 => uint256) public birth;

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() public ERC721("WholeEarthCatalogNFT", "WECN") {
    _setBaseURI("https://ipfs.io/ipfs/");
  }

  function mint()
      public
      payable
      returns (uint256)
  {
      require( _tokenIds.current() < limit , "DONE MINTING");
      require( msg.value >= price, "NOT ENOUGH");

      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      birth[id] = block.timestamp;

      (bool success,) = buidlguidl.call{value:msg.value}("");
      require( success, "could not send");

      return id;
  }

  function age(uint256 tokenId) public view returns (uint256) {
      require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
      return (block.timestamp - birth[tokenId]);
  }

  function videoIndex(uint256 tokenId) public view returns (uint256) {
      require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
      uint256 ageStep = age(tokenId)/600; //every 10 minutes
      return ageStep%ages.length;
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
      require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
      return string(abi.encodePacked(baseURI(), ages[videoIndex(tokenId)]));
  }

}
