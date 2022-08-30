pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "./RLPReader.sol";

contract DiceGame {

    using RLPReader for RLPReader.RLPItem;
    using RLPReader for bytes;

    struct BetStruct {
        uint8 number;
        uint256 blockNumber;
        bool rolled;
    }

    mapping(address => BetStruct) public bets;

    uint256 public constant futureBlocks = 2;
    uint256 public constant betValue = 0.001 ether;
    uint256 public constant prize = 0.015 ether;

    event Bet(address indexed player, uint256 indexed blockNumber, uint8 number);
    event Roll(address indexed player, uint256 indexed blockNumber, uint8 number);
    event Winner(address indexed winner, uint256 indexed blockNumber, uint8 number);

    constructor() payable {
    }

    function bet(uint8 _number) public payable {
        require(msg.value >= betValue, "Failed to send enough value");

        require(_number < 16, "Number must be smaller than 16");

        BetStruct storage userBet = bets[msg.sender];

        require(userBet.blockNumber < block.number - futureBlocks, "Already played");

        userBet.blockNumber = block.number;
        userBet.number = _number;
        userBet.rolled = false;

        emit Bet(msg.sender, block.number, _number);
    }

    function rollTheDice(bytes memory rlpBytes) public {
        BetStruct storage userBet = bets[msg.sender];

        require(userBet.blockNumber > 0, "No played");
        require(!userBet.rolled, "Already rolled");
        require(block.number >= userBet.blockNumber + futureBlocks, "Future block not reached");
        require(block.number < userBet.blockNumber + futureBlocks + 256, "You miss the roll window");

        RLPReader.RLPItem[] memory ls = rlpBytes.toRlpItem().toList();

        // uint256 difficulty = ls[7].toUint();
        // we have to use mixHash on PoS networks -> https://eips.ethereum.org/EIPS/eip-4399
        bytes memory difficulty = ls[13].toBytes();

        console.log("difficulty: ", difficulty);

        uint256 blockNumber = ls[8].toUint();

        console.log("blockNumber: ", blockNumber);

        require(blockNumber == userBet.blockNumber + futureBlocks, "Wrong block");

        require(blockhash(blockNumber) == keccak256(rlpBytes), "Wrong block header");

        bytes32 hash = keccak256(abi.encodePacked(difficulty, address(this), msg.sender));
        uint8 roll = uint8(uint256(hash) % 16);

        console.log("THE ROLL IS ",roll);

        userBet.rolled = true;

        emit Roll(msg.sender, userBet.blockNumber, roll);

        if (roll == userBet.number) {
            (bool sent, ) = msg.sender.call{value: prize}("");
            require(sent, "Failed to send Ether");

            emit Winner(msg.sender, userBet.blockNumber, roll);
        }
    }

    receive() external payable {  }
}
