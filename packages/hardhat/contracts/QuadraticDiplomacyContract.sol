pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract QuadraticDiplomacyContract {
    address public owner;

    struct Contributor {
        address contributorAddress;
        string name;
    }

    Contributor[] public contributors;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not allowed");
        _;
    }

    function changeOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    function addContibutor(address _contributorAddress, string memory _name) public onlyOwner {
        Contributor memory newContributor;
        newContributor.contributorAddress = _contributorAddress;
        newContributor.name = _name;
        contributors.push(newContributor);
    }

    function getContributorCount() public view returns(uint) {
        return contributors.length;
    }
}
