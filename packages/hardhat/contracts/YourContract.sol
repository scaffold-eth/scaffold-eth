pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol


contract MergFrac {
  function mintItem() public payable {}
  function transferFrom(address,address,uint256) public {}
  function mintCount() public returns(uint256) {}
  function getPriceNext() public view returns(uint256) {}
}

contract YourContract {

  MergFrac public mergfrac = MergFrac(0xCeaAb19BaB4AdBc831b98A4Cf54A6A85A79218a4);

  constructor() payable {
    // what should we do on deploy?
  }

  function mint(uint256 amount) public payable {
    if(amount>0){
      for(uint8 c=0;c<amount;c++){
        uint256 id = mergfrac.mintCount();
        mergfrac.mintItem{value: msg.value/amount}();
        mergfrac.transferFrom(address(this),msg.sender,id+1);
      }
    }
  }

  function price() public view returns (uint256) {
    return mergfrac.getPriceNext();
  }

  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}
}
