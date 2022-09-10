pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/String.sol";
import "./Base64.sol"


contract NFTixBooth is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private currentId;


  bool public saleIsActive = false;
  uint256 public totalTickets = 10;
  uint256 public availableTickets = 10;
  mapping (address => uint256[]) public holderTokenIDs;

 constructor() ERC721("NFTix", "NFTX"){   
  // fisrt parameter : token name, 
  // second parameter : token symbol
  currentId.increment();
  console.log(currentId.current());
 }
 
 function mint() public {
  require(availableTickets > 0, "Not enough tickets");

  string[] memory svg;
  svg[0] = '<svg viewBox="0 0 100 100" xmlns="https://www.w3.org/2000/svg"><text y="50">'
  svg[1] = String.toString(currentId.current());
  svg[2] = '</text></svg>';

  String memory image = abi.encodePacked(svg[0], svg[1]. svg[2]);

 String memory encodedImage = Base64.encode(bytes(image));
 console.log(encodedImage)

  _safeMint(msg.sender, currentId.current());
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
