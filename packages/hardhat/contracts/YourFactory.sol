pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Create2.sol"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

import "./YourContract.sol";

contract YourFactory {

    address public latestContractAddress;

    constructor() payable {
        // what should we do on deploy?
    }

    function deployYourContract(bytes32 salt,string memory startingPurpose) public payable {
        address payable contractAddress;

        contractAddress = payable(
            Create2.deploy(
                msg.value, 
                salt, 
                abi.encodePacked(
                    type(YourContract).creationCode, 
                    abi.encode(startingPurpose)
                )
            )
        );
    
    latestContractAddress = contractAddress;
  }

  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}
}
