pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "./hashVerifier.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract is Verifier {

  event SetPurpose(address sender, string purpose);

  string public purpose = "Testing ZK Proofs!!";
  uint256 public playerBet;
  
  uint256 public playerCommit;
  uint256 public threshold;

  constructor() public {
    // what should we do on deploy?
  }
  
  function placeBet(uint bet) public {
      require(playerCommit == 0, "You have already played.");
      uint user_block_hash = uint(
          keccak256(abi.encodePacked(blockhash(block.number - 2), block.timestamp))
      );
      playerCommit = user_block_hash % 13 + 1;
      playerBet = bet;
  }
  function dealCards() public {
        uint threshold_block_hash = uint(
            keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp))
        );
        threshold = threshold_block_hash % 13 + 1;
  }
}
