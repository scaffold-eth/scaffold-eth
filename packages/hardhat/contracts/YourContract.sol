pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol


contract NFT {
  function mint(address to) public payable {}
}

contract YourContract {

  constructor() payable {
    // what should we do on deploy?
  }

  uint256 public constant price = 0.00042 ether;

  function mint(address nftAddress, uint256 amount) public payable {
    require(msg.value>=(price * amount),"Not enough value");
    uint256 tip = msg.value - (price * amount);
    NFT nft = NFT(nftAddress);
    if(amount>0){
      for(uint8 c=0;c<amount;c++){
        nft.mint{value: price}(msg.sender);
      }
    }
    if(tip>0){
      (bool sent, ) = payable(0x817e63EcB0065D3be1C0f4EE91C1BE5291e72768).call{value: tip}("");
      require(sent, "Failed to send Ether");
    }
  }

  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}
}
