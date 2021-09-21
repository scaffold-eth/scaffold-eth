// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8;
import "hardhat/console.sol";

contract YourContract {
    mapping(address => bool) public play;
    mapping(uint256 => address payable[]) public numbers;
    address public owner;
    uint256 public winning_number;
    uint public voting_last_block;
    uint public lottery_result_block;
    bool public winner_picked;
    
    event log(string, uint);


    constructor (uint _number_of_blocks_to_play){
        owner = msg.sender;
        voting_last_block = block.number + _number_of_blocks_to_play;
    }
    
    function transferOwnership(address _new) external {
      require(msg.sender == owner, "only current owner can call this function ");
      owner = _new;
    }

    function set_number(uint256 val) external payable {
        require(block.number <= voting_last_block, "lottery picking is over !");
        require(msg.sender != owner, "owner cannot participate !");
        require(play[msg.sender] == false, "The participant already played !");
        require(msg.value == 0.1 ether, "Send 0.1 ether to play");
        
        play[msg.sender] = true;
        numbers[val%10].push(payable(msg.sender));
    }
    
    function pick_number() external {
        require(winner_picked == false);
        require(block.number > voting_last_block, "lottery picking still going on");
        require(msg.sender == owner, "only owner can pick winner");
        winner_picked = true;
        lottery_result_block = block.number;
        winning_number = block.number % 10;
    }
    
    function distribute_rewards() external {
        require(winner_picked == true, "Winner not yet picked");
        require(owner == msg.sender, "Only owner can distribute");
        
        uint256 balance = address(this).balance;
        emit log("balance", balance);
        uint winners = numbers[winning_number].length;
        if (winners > 0) {
            uint share = address(this).balance / (numbers[winning_number].length + 1);
            for(uint i=0; i < winners; i++) {
                (bool success, bytes memory data) = numbers[winning_number][i].call{value: share}("");
                console.log("Funds sent to %s status is  %s", numbers[winning_number][i], success);
            }
        } 
        (bool success_main, bytes memory data) = msg.sender.call{value: address(this).balance}("");
        console.log("Funds sent to owner %s status is %s", owner, success_main);
    }
    
    function get_block_number() external view returns(uint) {
        return block.number;
    }
    
    function get_current_balance() external view returns(uint256) {
        return address(this).balance;
    }
}
