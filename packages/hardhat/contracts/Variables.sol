// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Variables {
    // State variables are declared outside a function, stored on the blockchain
    string public text = 'Hello';
    uint public num = 123;

    function doSomething() public {
        // Local variables are declined inside a function, not stored on the blockchain
        uint i = 456;

        // Here are some globabl variables (provide information about the blockchain)
        uint timestamp = block.timestamp; // Current block timestamp
        address sender = msg.sender; // address of the caller
    }    
}

// The above is confusing — those are not global variables per se.
// Those are local variables being assigned a value of a global variable.
