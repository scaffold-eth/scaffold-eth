pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

// import "hardhat/console.sol";

contract DiceGame {

    uint256 public prize = 0;
    // block number / 10 -> number -> addresses
    mapping(uint256 => mapping(uint8 => address[])) public bets;
    // block number / 10 -> rolled?
    mapping(uint256 => bool) public rolled;

    event Difficulty(address indexed player, uint256 indexed blockNumber, uint256 difficulty);
    event Bet(uint256 indexed blockNumber, address indexed player, uint8 indexed number);
    event Roll(address indexed player, uint256 indexed blockNumber, uint8 indexed roll);
    event Winner(address indexed winner, uint256 indexed blockNumber, uint256 amount);
    event Tip(address indexed winner, uint256 indexed blockNumber, uint256 amount);

    constructor() payable {
    }

    function betsOnNumber(uint256 blockNumber, uint8 number) public view returns (address[] memory) {
        return bets[blockNumber][number];
    }

    // you can bet on even block number tens (like 1000, 1020, 1040, ...)
    function bet(uint8 number) public payable {
        require(msg.value >= 0.002 ether, "Failed to send enough value");
        require(number < 16, "Only numbers between 0 and 15");
        require((block.number / 10) % 2 == 0, "you can bet only on even block number tens (like 1000, 1020, 1040, ...)");

        bets[block.number / 10 * 10][number].push(msg.sender);

        prize += 0.0018 ether;

        emit Bet(block.number / 10 * 10, msg.sender, number);
    }

    function canBet() public view returns (bool) {
        return (block.number / 10) % 2 == 0;
    }

    function canRoll() public view returns (bool) {
        uint256 blockNumber = block.number / 10 * 10 - 10;

        return ((block.number / 10) % 2 == 1) && (block.number % 10 >= 5) && !rolled[blockNumber];
    }

    // the dice can be rolled on odd block number tens after 5 (like 1015 to 1019, 1035 to 1039, 1055 to 1059, ...)
    function rollTheDice() public {
        require((block.number / 10) % 2 == 1, "the dice can be rolled only on odd block number tens after 5 (like 1015 to 1019, 1035 to 1039, 1055 to 1059, ...)");
        require(block.number % 10 >= 5, "the dice can be rolled only on odd block number tens after 5 (like 1015 to 1019, 1035 to 1039, 1055 to 1059, ...)");

        uint256 blockNumber = block.number / 10 * 10 - 10;

        require(!rolled[blockNumber], "dice already rolled!");

        rolled[blockNumber] = true;

        emit Difficulty(msg.sender, blockNumber, block.difficulty);

        // console.log("difficulty: ", block.difficulty);
        bytes32 hash = keccak256(abi.encodePacked(block.difficulty, address(this), blockNumber));
        uint8 roll = uint8(uint256(hash) % 16);

        // console.log("THE ROLL IS ", roll);

        emit Roll(msg.sender, blockNumber, roll);

        uint256 winnersCount = bets[blockNumber][roll].length;

        uint256 tipAmount = prize / 10;
        (bool sentTip, ) = msg.sender.call{value: tipAmount}("");
        require(sentTip, "Failed to send Ether");

        emit Tip(msg.sender, blockNumber, tipAmount);

        prize = prize - tipAmount;

        if (winnersCount > 0) {
            uint256 amount = prize / winnersCount;

            for (uint i = 0; i < winnersCount; i++) {

                (bool sent, ) = bets[blockNumber][roll][i].call{value: amount}("");
                require(sent, "Failed to send Ether");

                emit Winner(bets[blockNumber][roll][i], blockNumber, amount);
            }

            prize = 0;
        }
    }

    receive() external payable {  }
}
