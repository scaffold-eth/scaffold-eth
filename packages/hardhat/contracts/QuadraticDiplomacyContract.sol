pragma solidity >=0.6.7;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract QuadraticDiplomacyContract is Ownable {
    struct Contributor {
        address contributorAddress;
        string name;
    }

    Contributor[] public contributors;

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
