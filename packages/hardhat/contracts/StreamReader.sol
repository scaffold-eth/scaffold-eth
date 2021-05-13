pragma solidity >=0.6.0 <0.9.0;
//https://github.com/austintgriffith/scaffold-eth/tree/buidl-guidl-round-two

//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";

contract SimpleStream {
  address payable public toAddress;
  uint256 public cap;
  uint256 public frequency;
  uint256 public last;

  function streamBalance() public view returns (uint256){}
}

contract StreamReader {

  function readStreams(address[] memory streams) public view returns(uint256[] memory) {
    uint256[] memory results = new uint256[](streams.length*4);
    for(uint8 a = 0;a<streams.length;a++){
      SimpleStream thisStream = SimpleStream(streams[a]);
      results[(a*4)] = thisStream.cap();
      results[(a*4)+1] = thisStream.frequency();
      results[(a*4)+2] = thisStream.streamBalance();
      results[(a*4)+3] = streams[a].balance;
    }
    return results;
  }

}
