pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";


contract NFTixBooth is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private currentId;


  bool public saleIsActive = false;
  uint256 public totalTickets = 10;
  uint256 public availableTickets = 10;
  uint256 public mintPrice = 80000000000000000;

  mapping (address => uint256[]) public holderTokenIDs;

 constructor() ERC721("NFTix", "NFTX"){   
  // fisrt parameter : token name, 
  // second parameter : token symbol
  currentId.increment();
  console.log(currentId.current());
 }
 
 function mint() public payable {
  require(availableTickets > 0, "Not enough tickets");
  require(msg.value >= mintPrice, "Not enough mit price");

  

  string[3] memory svg;
  svg[0] = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><text y="50">';
  svg[1] = Strings.toString(currentId.current());
  svg[2] = '</text></svg>';

  string memory image = string(abi.encodePacked(svg[0], svg[1], svg[2]));

  string memory encodedImage = Base64.encode(bytes(image));
  console.log("encodedImage",encodedImage);


  string memory json = Base64.encode(
    bytes(
      string(
        abi.encodePacked(
          '{"name":"NFTix #', Strings.toString(currentId.current()), 
          '", "description":"A NFT-powered ticketing system", ',
          '"tracits": [{"trait_type":"Purchased", "value":"true"}], ',
          '"image": "data:image/svg+xml;base64,',
          encodedImage,
          '" }'
        )      
      )
    )
  );

  string memory tokenURI = string(
    abi.encodePacked("data:application/json;base64,",json)
  );

  console.log("tokenURI", tokenURI);

  _safeMint(msg.sender, currentId.current());
  _setTokenURI(currentId.current(), tokenURI);

  currentId.increment();
  availableTickets = availableTickets - 1; 
 }

 function availableTicketCount() public view returns (uint256) {
  return availableTickets;
 }

 function totalTicketCount() public view returns (uint256 ){
  return totalTickets;
 }



 function openSale() public {
  saleIsActive = true;
 }

 function closeSale() public {
   saleIsActive =false;
 }
}
