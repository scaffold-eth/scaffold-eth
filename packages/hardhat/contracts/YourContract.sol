pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; 
// import "@openzeppelin/contracts/access/Ownable.sl"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract WETH9 {
   function withdraw(uint wad) public {}
}

contract YourContract is ERC20 { 
   
  WETH9 weth = WETH9(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);

  event Curate(address who, address contractAddress, uint256 tokenId, bool like);

  constructor() payable ERC20("CURRATTOOOOR","CRTOOOR") {
    // what should we do on deploy?
  }

  function curate(address contractAddress, uint256 tokenId, bool like) public {
      _mint(msg.sender,1);
      emit Curate(msg.sender, contractAddress, tokenId, like);
  }

  function claim(uint256 amount) public {
    uint256 sendBalance = (address(this).balance * amount) / totalSupply();
    _burn(msg.sender, amount);
    (bool sent, ) = msg.sender.call{value: sendBalance}("");
    require(sent, "Failed to send Ether");
  }

 function unwrap(uint256 amount) public {
    weth.withdraw(amount);
  }

  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}
}
