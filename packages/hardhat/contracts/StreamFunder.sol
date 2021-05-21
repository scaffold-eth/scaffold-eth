pragma solidity >=0.6.0 <0.9.0;
pragma abicoder v2;
//SPDX-License-Identifier: MIT

//https://github.com/austintgriffith/scaffold-eth/tree/simple-stream
contract SimpleStream {
  address payable public toAddress;
  uint256 public cap;
  uint256 public frequency;
  uint256 public last;

  function streamBalance() public view returns (uint256){}
  function streamDeposit(string memory reason) public payable {}
}

contract StreamFunder {

  address payable public buidlGuidl = 0x97843608a00e2bbc75ab0C1911387E002565DEDE;

  event FundStreams(address indexed sender, uint256 amount, address[] streams,string[] reasons);

  function fundStreams(address[] memory streams,string[] memory reasons) public payable {
    require(streams.length>0,"no streams");
    require(msg.value>0.001 ether,"not worth the gas");
    require(streams.length==reasons.length,"different length");
    for(uint8 a = 0;a<streams.length;a++){
      if(streams[a]==buidlGuidl){
        //buidlGuidl.transfer(msg.value/streams.length);
        buidlGuidl.call{value: msg.value/streams.length, gas: 150000}("");
      }else{
        SimpleStream thisStream = SimpleStream(streams[a]);
        thisStream.streamDeposit{value: msg.value/streams.length}(reasons[a]);
      }
    }
    emit FundStreams(msg.sender, msg.value, streams, reasons);
  }

  address public austinGriffith = 0x34aA3F359A9D614239015126635CE7732c18fDF3;
  function austinCanCleanUpDust() public {
    require(msg.sender==austinGriffith,"Not Austin");
    buidlGuidl.transfer(address(this).balance);
  }
}
