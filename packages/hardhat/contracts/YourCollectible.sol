pragma solidity >=0.6.0 <0.7.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract YourCollectible is ERC721 {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor(bytes32[] memory assetsForSale) public ERC721("YourCollectible", "YCB") {
    _setBaseURI("https://ipfs.io/ipfs/");
    for(uint256 i=0;i<assetsForSale.length;i++){
      forSale[assetsForSale[i]] = true;
      forSecondarySale[assetsForSale[i]] = false;
    }
    price = startingAt;
  }

  event Action(address sender, uint256 tokenId, string action);

  uint256 public price;
  uint256 constant startingAt = 0.01 ether;
  uint16 constant numerator = 1337;
  uint16 constant denominator = 1000;

  //this marks an item in IPFS as "forsale"
  mapping (bytes32 => bool) public forSale;
  mapping (bytes32 => bool) public forSecondarySale;
  //this lets you look up a token by the uri (assuming there is only one of each uri for now)
  mapping (bytes32 => uint256) public uriToTokenId;


  function mintItem(string memory tokenURI)
      public payable
      returns (uint256)
  {
      bytes32 uriHash = keccak256(abi.encodePacked(tokenURI));

      //make sure they are only minting something that is marked "forsale"
      require(forSale[uriHash],"ALREADY MINTED");
      forSale[uriHash]=false;

      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);
      _setTokenURI(id, tokenURI);

      uriToTokenId[uriHash] = id;

      price = uint256(price * numerator) / denominator;
      return id;
  }

  function sellItem(string memory tokenURI)
      public
      returns (uint256)
  {
      bytes32 uriHash = keccak256(abi.encodePacked(tokenURI));

      require(!forSecondarySale[uriHash],"ALREADY FOR SECONDARY SALE");
      forSecondarySale[uriHash]=true;

      uint256 id = uriToTokenId[uriHash];
      emit Action(msg.sender, id, "sell");

      return id;
  }

  function cancelSellItem(string memory tokenURI)
      public
      returns (uint256)
  {
      bytes32 uriHash = keccak256(abi.encodePacked(tokenURI));

      require(forSecondarySale[uriHash],"NOT FOR SECONDARY SALE");
      forSecondarySale[uriHash]=false;

      uint256 id = uriToTokenId[uriHash];
      emit Action(msg.sender, id, "cancel sell");

      return id;
  }

  function buyItem(string memory tokenURI)
      public payable
      returns (uint256)
  {
      bytes32 uriHash = keccak256(abi.encodePacked(tokenURI));

      require(forSecondarySale[uriHash],"NOT FOR SECONDARY SALE");
      forSecondarySale[uriHash]=false;

      uint256 id = uriToTokenId[uriHash];
      address payable itemOwner = payable(ownerOf(id));

      _transfer(itemOwner, msg.sender, id);
      itemOwner.transfer(price);

      return id;
  }
}
