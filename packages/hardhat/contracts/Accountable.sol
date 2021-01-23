pragma solidity 0.8.0;
import './Pausable.sol';
import './SafeMath.sol';

// SPDX-License-Identifier: UNLICENSED


contract Accountable is Pausable {
    
    uint256 internal balance_;
    
    event receipt(
        address sender, 
        address reciever,
        uint256 amount);
    
    modifier costs(uint256 cost){
        require(msg.value >= cost, 'Insufficient funds sent.');
        _;
    }
    
    constructor() {
        balance_ = 0;
    }
    
    function contractBalance() public view onlyOwner returns (uint256){
        return balance_;
    }
    
    function credit(address from, uint256 ammount) internal {
        balance_ = SafeMath.add(balance_, ammount);
        emit receipt(from, address(this), ammount);
    }
    
    function debt(address payable to, uint256 amount) internal Unpaused {
        require(amount <= balance_, 'Insufficient funds available.');
        balance_ = SafeMath.sub(balance_, amount);
        to.transfer(amount);  // revert on fail.
        emit receipt(address(this), to, amount);
    }
    
    function salary(uint256 amount) public onlyOwner Paused {
        debt(owner, amount);
    }

    // Absorb errant ETH
    receive() external payable {
        emit receipt(msg.sender, address(this), msg.value);
    }

    // Square up the books.
    function rebalance() public onlyOwner {
        balance_ = address(this).balance;
    }
}