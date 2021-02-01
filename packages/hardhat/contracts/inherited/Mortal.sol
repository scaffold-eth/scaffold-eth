pragma solidity 0.8.0;
import "./Pausable.sol";

// SPDX-License-Identifier: UNLICENSED

contract Mortal is Pausable{
    
    event imploding(string msg);
    
    function implode() public onlyOwner Paused {
        emit imploding('!MOOB');
        selfdestruct(_payable['owner']);
    }
}