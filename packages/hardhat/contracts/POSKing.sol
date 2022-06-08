pragma solidity >=0.8.0 <0.9.0;

//SPDX-License-Identifier: MIT

// import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract POSKing {

  uint256 public posBlock;
  uint256 public posTime;
  address public posKing;

  event POS(uint256 block, uint256 time, uint256 diff, uint256 payout, address king);
  event Attempt(uint256 block, uint256 time, uint256 diff, address clicker);

  function pos() public {
    if(block.difficulty>2**64){// <3 @m1guelpf https://twitter.com/m1guelpf/status/1529534722157731847?s=20&t=a1pmqBsmMThcops7ZsMfjA
      require(posBlock==0,"already set");
      posBlock = block.number;
      posTime = block.timestamp;
      posKing = msg.sender;
      emit POS(posBlock, posTime, block.difficulty, address(this).balance, posKing);
    }else{
      emit Attempt(block.number, block.timestamp, block.difficulty, msg.sender);
    }
  }

  function withdraw() public {
    require(posBlock!=0,"no king yet?");
    require(msg.sender == posKing,"Not the king");
    (bool sent, ) = msg.sender.call{value: address(this).balance}("");
    require(sent, "Failed to send Ether");
  }

  receive() external payable {
    require(posBlock==0,"already set");
  }

}
