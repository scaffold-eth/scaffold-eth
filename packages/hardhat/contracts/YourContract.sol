pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol
import "./YourToken.sol";

contract YourContract {

  event MakeVote(uint256 voteID, address voter, uint256 amount, string vote, uint256 timestamp);

  YourToken yourToken;

  struct Vote {
    string vote;
    address voter;
    uint256 amount;
    uint256 timestamp;
    bool open;
  }

  Vote[] public votes;

  constructor(address tokenAddress) payable {
    // what should we do on deploy?
    yourToken = YourToken(tokenAddress);
  }

  function currentTimestamp() public view returns (uint256) {
    return block.timestamp;
  }

  function voteStatus(uint256 voteID) public view returns (bool) {
    return votes[voteID].open;
  }

  function vote(string memory voteString, uint256 amount) public {
    yourToken.transferFrom(msg.sender, address(this), amount);

    uint256 voteID = votes.length;
    votes.push(Vote({
      vote: voteString,
      voter: msg.sender,
      amount: amount,
      timestamp: block.timestamp,
      open: true
    }));

    console.log(msg.sender,voteString);
    emit MakeVote(voteID, msg.sender, amount, voteString, block.timestamp);
  }

  function withdraw(uint256 voteID) public {
    require(votes[voteID].voter == msg.sender, "not your vote");
    require(votes[voteID].open, "not open");
    votes[voteID].open = false;
    yourToken.transfer(msg.sender, votes[voteID].amount);
  }

}
