pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract {
  // TODO rename to ActivityRegistry
  enum AStatus {READY, LIVE, COMPLETED, DISCARDED}

  event SetPurpose(address sender, string purpose);
  event NewActivityReady(address player, uint a_id, string description);
  event ActivityLive(address player, address witness, uint a_id);
  event ActivityCompleted(address player, uint a_id);

  uint next_a_id = 0;
  struct Activity {
    AStatus status;
    string description;
    address player;
    address witness;
  }

  mapping (uint => Activity) public activities;

  constructor() {
    // what should we do on deploy?
    // TODO link to NFT-Token
    // TODO link to CommunityMemberRegistry
  }

  function createActivity(
    string memory _description
  ) 
    public 
  {
    uint a_id = ++next_a_id;
    activities[a_id] = Activity({
      status: AStatus.READY,
      description: _description,
      player: msg.sender,
      witness: address(0)
    });
    emit NewActivityReady(msg.sender, a_id, _description);

    // modifiers
    // TODO verify others are from the same community
  }

  function becomeWitness(uint a_id) public {
    Activity storage a = activities[a_id];
    // require(msg.sender == a.player, "The best memories are created with others");
    a.witness = msg.sender;
    a.status = AStatus.LIVE;
    emit ActivityLive(a.player, msg.sender, a_id);
  }

  function markCompleted( uint a_id) public {
    Activity storage a = activities[a_id];
    // require(msg.sender == a.witness, "Only witness can mark as completed");
    a.status = AStatus.COMPLETED;
    emit ActivityCompleted(a.player, a_id);
    // TODO
    // mint token with metadata from parameter
  }

}