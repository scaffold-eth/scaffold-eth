pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT
 
// import "hardhat/console.sol";
import "./hashVerifier.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract is Verifier {

  event SetPurpose(address sender, string purpose);

  string public purpose = "Testing ZK Proofs!!";
  uint256 public playerCardHash;
  uint256 public playerBet;
  uint256 public dealerCard;
  uint256 public currentStep = 0;
  bool public win = false;
  // uint256 public verifiedHash;
  // uint256 public verifiedGreater;

  constructor() public {
    // what should we do on deploy?
  }
  function commiToCard(uint256 cardHash) public {
    require(currentStep == 0, "You've already commited to a card.");
    playerCardHash = cardHash;
    currentStep ++;
  }
  
  function placeBet(uint bet) public {
      require(currentStep == 1, "You haven't chosen a card.");
      playerBet = bet;
      currentStep ++;
      // playerSeed = seedHash;
      // //TODO: Combine block hash with secret seed hash
      // uint user_block_hash = uint(
      //     keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp))
      // );
      // playerCommit = user_block_hash % 13 + 1;
  }
  function dealCard() public {
      require(currentStep == 2, "You haven't selected a bet.");
        uint dealerCardRandomness = uint(
            keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp))
        );
        dealterCard = dealerCardRandomness % 13 + 1;
        currentStep ++;
  }

  function submitProof(
      uint[2] memory a,
      uint[2][2] memory b,
      uint[2] memory c,
      uint[4] memory input
  ) public {
    require(currentStep == 3, "Dealer hasn't drawn a card.");
    require(verifyProof(a, b, c, input), "Invalid Proof");
    require(inputs[0] == cardHash, "Invalid Card");
    require(inputs[3] == dealerCard, "Invalid Card");
    if (inputs[1] == 1) win = true;
    currentStep++;
  }

  // function testVerifyProof(
  //         uint[2] memory a,
  //         uint[2][2] memory b,
  //         uint[2] memory c,
  //         uint[4] memory input
  //     ) public {
  //     require(verifyProof(a, b, c, input), "Invalid Proof");
  //     verifiedHash = input[0];
  //     verifiedGreater = input[1];
  // }
}
