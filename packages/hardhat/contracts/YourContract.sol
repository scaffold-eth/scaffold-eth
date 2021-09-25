pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract {

  struct Commit {
    bytes32 commit;
    uint64 block;
    bool revealed;
  }

  mapping (address => Commit) public commits;
  uint8 public max = 100;

  function getHash(bytes32 data) public view returns(bytes32){
    return keccak256(abi.encodePacked(address(this), data));
  }

  function commit(bytes32 dataHash, uint64 block_number) public {
    require(block_number > block.number,"CommitReveal::reveal: Already revealed");
    commits[msg.sender].commit = dataHash;
    commits[msg.sender].block = block_number;
    commits[msg.sender].revealed = false;
    console.log(block.number, block_number);
    emit CommitHash(msg.sender,commits[msg.sender].commit,commits[msg.sender].block);
  }

  function reveal(bytes32 revealHash) public {
    require(commits[msg.sender].revealed==false,"CommitReveal::reveal: Already revealed");
    require(getHash(revealHash)==commits[msg.sender].commit,"CommitReveal::reveal: Revealed hash does not match commit");

    commits[msg.sender].revealed=true;

    bytes32 blockHash = blockhash(commits[msg.sender].block);
    uint8 random = uint8(uint(keccak256(abi.encodePacked(blockHash,revealHash))))%max;
    emit RevealHash(msg.sender,revealHash,random);
    console.log("Random: ", random);
  }

  event RevealHash(address sender, bytes32 revealHash, uint8 random);
  event CommitHash(address sender, bytes32 dataHash, uint64 block);

  constructor() {}

}
