pragma solidity ^0.6.2;

contract Counter{
    uint public count;

    constructor() public {
        count = 0;
    }

    function increment() public returns(uint){
        count++;
    }

    function add(uint x) public xGreaterThan0(x) checkMax() returns(uint){
        count += x;
    }

    modifier xGreaterThan0(uint x) {
     //require(msg.sender == owner, "Not owner");  
         require(x != 0, "Not a valid parameter!");
         _; //1st check than run
    }

    modifier checkMax(){
        _;  //1st run than ckeck
        require(count <= 100, "max count is 100");
    }

}