pragma solidity >=0.6.0 <0.7.0;

import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract {

  constructor() public {
    // what should we do on deploy?
  }

  struct Commit {
    bytes32 commit;
    uint64 block;
    bool revealed;
  }

  uint8 public max = 100;
  
  mapping (address => Commit) public commits;
  
  function commit(bytes32 dataHash, uint64 block_number) public {
    commits[msg.sender].commit = dataHash;
    commits[msg.sender].block = block_number;
    commits[msg.sender].revealed = false;
    emit CommitHash(msg.sender,commits[msg.sender].commit,commits[msg.sender].block);
  }

  function getHash(bytes32 data) public view returns(bytes32){
    return keccak256(abi.encodePacked(address(this), data));
  }

  function reveal(bytes32 revealHash) public {
    require(commits[msg.sender].revealed==false,"CommitReveal::reveal: Already revealed");
    
    commits[msg.sender].revealed=true;
    
    require(getHash(revealHash)==commits[msg.sender].commit,"CommitReveal::reveal: Revealed hash does not match commit");

    bytes32 blockHash = blockhash(commits[msg.sender].block);

    uint8 random = uint8(uint(keccak256(abi.encodePacked(blockHash,revealHash))))%max;
    emit RevealHash(msg.sender,revealHash,random);
  }

  function revealAnswer(bytes32 answer,bytes32 salt) public {
    //make sure it hasn't been revealed yet and set it to revealed
    require(commits[msg.sender].revealed==false,"CommitReveal::revealAnswer: Already revealed");
    commits[msg.sender].revealed=true;
    //require that they can produce the committed hash
    require(getSaltedHash(answer,salt)==commits[msg.sender].commit,"CommitReveal::revealAnswer: Revealed hash does not match commit");
    emit RevealAnswer(msg.sender,answer,salt);
  }
  event RevealAnswer(address sender, bytes32 answer, bytes32 salt);

  function getSaltedHash(bytes32 data,bytes32 salt) public view returns(bytes32){
    return keccak256(abi.encodePacked(address(this), data, salt));
  }

  event RevealHash(address sender, bytes32 revealHash, uint8 random);
  
  event CommitHash(address sender, bytes32 dataHash, uint64 block);

}
