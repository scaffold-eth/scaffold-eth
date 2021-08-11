pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

contract QuadraticDiplomacyContract {

    event Vote(address votingAddress, string name, address wallet, uint256 amount);
    event AddEntry(address admin, string name, address wallet);

    mapping (address => uint256) public votes;
    mapping (address => bool) public isAdmin;

    constructor(address startingAdmin) {
        isAdmin[startingAdmin] = true;
    }

    modifier onlyAdmin() {
        require( isAdmin[msg.sender], "NOT ADMIN");
        _;
    }

    // Question: Can we pass an array of on memory structs with name / wallet / address tuples?
    // so we only need to make 1 tx?
    function vote(string memory name, address wallet, uint256 amount) public {
        require(votes[msg.sender] >= amount, "Not enough votes left");
        votes[msg.sender] -= amount;
        emit Vote(msg.sender, name, wallet, amount);
    }

    function admin(address wallet, bool value) public onlyAdmin {
        isAdmin[wallet] = value;
    }

    function giveVotes(address wallet, uint256 amount) public onlyAdmin {
        votes[wallet] += amount;
    }

    function addEntry(string memory name, address wallet) public onlyAdmin {
        emit AddEntry(msg.sender, name, wallet);
    }
}
