pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract {

    uint256 private nonce = 0;
    uint256 public prize = 0;
    uint256 public lastRoll;

    event Roll(address indexed player, uint256 roll);
    event Winner(address winner, uint256 amount);

    constructor() {}

    function rollTheDice() public payable {
        prize += msg.value;
        bytes32 prevHash = blockhash(block.number - 1);
        bytes32 hash = keccak256(abi.encodePacked(prevHash, address(this), nonce));
        uint256 roll = numberRolled(hash);
        lastRoll = roll;
        nonce++;

        emit Roll(msg.sender, roll);

        if (roll != 0) {
            return;
        }

        uint256 amount = prize;
        prize = 0;
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send Ether");
        emit Winner(msg.sender, amount);
    }

    function numberRolled(bytes32 data) internal pure returns (uint256) {
        return uint256(data) % 16;
    }
}
