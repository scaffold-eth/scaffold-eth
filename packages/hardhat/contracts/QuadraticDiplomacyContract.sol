pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT
import "hardhat/console.sol";

contract QuadraticDiplomacyContract {

    event Vote(address votingAddress, string name, address wallet, uint256 amount);
    event AddMember(address admin, string name, address wallet);

    mapping (address => uint256) public votes;
    mapping (address => bool) public isAdmin;

    constructor(address startingAdmin) {
        isAdmin[startingAdmin] = true;
        isAdmin[msg.sender] = true;
    }

    modifier onlyAdmin() {
        require( isAdmin[msg.sender], "NOT ADMIN");
        _;
    }

    function vote(string memory name, address wallet, uint256 amount) public {
        require(votes[msg.sender] >= amount, "Not enough votes left");
        votes[msg.sender] -= amount;
        emit Vote(msg.sender, name, wallet, amount);
    }

    function voteMultiple(string[] memory names, address[] memory wallets, uint256[] memory amounts) public {
        require(wallets.length == amounts.length, "Wrong size");
        require(wallets.length == names.length, "Wrong size");

        for (uint256 i = 0; i < wallets.length; i++) {
            vote(names[i], wallets[i], amounts[i]);
        }
    }

    function admin(address wallet, bool value) public onlyAdmin {
        isAdmin[wallet] = value;
    }

    function giveVotes(address wallet, uint256 amount) public onlyAdmin {
        votes[wallet] += amount;
    }

    function addMember(string memory name, address wallet) public onlyAdmin {
        emit AddMember(msg.sender, name, wallet);
    }
}
