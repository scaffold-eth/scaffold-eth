pragma solidity 0.8.0;
import './Pausable.sol';
import '../included/SafeMath.sol';

// SPDX-License-Identifier: UNLICENSED

// Handles raw ETH balance of a contract.
contract Accountable is Pausable {
    
    event receipt(
        address sender, 
        address reciever,
        uint256 amount);
    
    modifier costs(uint256 cost){
        require(msg.value >= cost, 'Insufficient funds sent.');
        _;
    }
    
    constructor() {
        _uint['balance'] = 0;
    }
    
    function contractBalance() public view onlyOwner returns (uint256){
        return _uint['balance'] ;
    }
    
    function credit(address from, uint256 ammount) internal {
        _uint['balance']  = SafeMath.add(_uint['balance'] , ammount);
        emit receipt(from, address(this), ammount);
    }
    
    function debt(address payable to, uint256 amount) internal Unpaused {
        require(amount <= _uint['balance'], 'Insufficient funds available.');
        _uint['balance'] = SafeMath.sub(_uint['balance'], amount);
        to.transfer(amount);  // reverts on fail.
        emit receipt(address(this), to, amount);
    }
    
    function salary(uint256 amount) public onlyOwner Paused {
        debt( _payable['owner'], amount);
    }

    // Absorb errant ETH
    receive() external payable {
        _uint['balance'] = SafeMath.add(_uint['balance'], msg.value);
        emit receipt(msg.sender, address(this), msg.value);
    }

    // Square up the books.
    function rebalance() public onlyOwner Paused {
        _uint['balance'] = address(this).balance;
    }
}