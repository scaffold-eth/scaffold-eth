pragma solidity 0.8.0;
import "hardhat/console.sol";

// SPDX-License-Identifier: UNLICENSED

contract Ownable {
    
    address payable internal owner;
    
    event OwnershipTransferred (bool torchPassed);
    
    modifier onlyOwner(){
        require(address(msg.sender) == owner,'Only the contract owner can do that.');
        _;
    }
    
    constructor() {
        owner = payable(msg.sender);
    }
    
    function amIOwner() public view returns (bool) {
        if (address(msg.sender) == owner){
            return true;
        } else {
            return false;
        }
    }
    
    function transferOwnership(address payable newOwner) public onlyOwner {
        require(newOwner != owner, 'Cannot transfer ownership to yourself.');
        owner = newOwner;
        assert(owner == newOwner); // revert if failed to assign.
        emit OwnershipTransferred(true); // Otherwise signal success.
    }
    
}