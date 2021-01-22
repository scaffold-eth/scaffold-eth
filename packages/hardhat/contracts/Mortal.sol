pragma solidity 0.8.0;
import "./Ownable.sol";

// SPDX-License-Identifier: UNLICENSED

contract Mortal is Ownable{
    
    event imploding(string msg);
    
    function implode() public onlyOwner {
        emit imploding('!MOOB');
        selfdestruct(owner);
    }
}