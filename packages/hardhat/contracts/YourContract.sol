pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

import {ISplitMain} from "./ISplitMain.sol";

contract YourContract is Ownable {

  struct Project {
    string githubURL;
    address payable receiveMoneyAddress;
    address payable splitProxyAddress;
    bool init;
  }

  mapping(string => Project) public githubURLToProject;
  uint32 percentKeep;

  constructor(uint32 _percentKeep) {
    percentKeep = _percentKeep;
  }

  function addProjectToSystem(
    string memory githubURL, 
    address payable receiveMoneyAddress,
    string[] memory splitGithubURLs,
    uint32[] memory percentAllocations,
    uint32 communityPoolPercentage,
    address payable communityPoolAddress
  ) public onlyOwner {
    ISplitMain splitMain = ISplitMain(address(0x2ed6c4B5dA6378c7897AC67Ba9e43102Feb694EE)); // Ropsten

    // intialize the project
    Project storage project = githubURLToProject[githubURL];
    project.githubURL = githubURL;
    project.receiveMoneyAddress = receiveMoneyAddress;
    project.init = true;

    // convert githubURLs to addresses + fix percentages
    address[] memory splitAddresses = new address[](splitGithubURLs.length+2);
    uint32[] memory newPercentAllocations = new uint32[](splitGithubURLs.length+2);
    for (uint i = 0; i < splitGithubURLs.length; i++) {
      string memory splitGithubURL = splitGithubURLs[i];
      Project storage splitProject = githubURLToProject[splitGithubURL];
      if (!splitProject.init) {
        initializeGithubURL(splitGithubURL, splitMain);
      }
      splitAddresses[i] = splitProject.splitProxyAddress;
      newPercentAllocations[i] = percentAllocations[i] * 1e4;
    }

    // add community pool
    splitAddresses[splitGithubURLs.length] = (communityPoolAddress);
    newPercentAllocations[splitGithubURLs.length] = (communityPoolPercentage * 1e4);

    // add self + kept percentage
    splitAddresses[splitGithubURLs.length+1] = (project.receiveMoneyAddress);
    newPercentAllocations[splitGithubURLs.length+1] = (percentKeep * 1e4);

    // assert sum of percentAllocations is 1e6
    uint sum = 0;
    for (uint i = 0; i < newPercentAllocations.length; i++) {
      sum += newPercentAllocations[i];
    }
    require(sum == 1e6, "sum of percentAllocations is not 1e6");

    // sort addresses and percent allocations
    for (uint i = 0; i < splitAddresses.length; i++) {
      for (uint j = i + 1; j < splitAddresses.length; j++) {
        if (splitAddresses[i] > splitAddresses[j]) {
          address temp = splitAddresses[i];
          splitAddresses[i] = splitAddresses[j];
          splitAddresses[j] = temp;
          uint32 temp2 = newPercentAllocations[i];
          newPercentAllocations[i] = newPercentAllocations[j];
          newPercentAllocations[j] = temp2;
        }
      }
    }

    project.splitProxyAddress = payable(splitMain.createSplit(splitAddresses, newPercentAllocations, 0, msg.sender));
  }

  function initializeGithubURL(string memory githubURL, ISplitMain splitMain) public {
    Project storage project = githubURLToProject[githubURL];
    project.init = true;
    project.githubURL = githubURL;
    
    uint32[] memory initialPercentage = new uint32[](1);
    initialPercentage[0] = (1e6);
    
    address[] memory initialAddresses = new address[](1);
    initialAddresses[0] = payable(0x0);

    project.splitProxyAddress = payable(splitMain.createSplit(initialAddresses, initialPercentage, 0, payable(this)));

    initialAddresses[0] = (project.splitProxyAddress);

    splitMain.updateSplit(project.splitProxyAddress, initialAddresses, initialPercentage, 0);
  }

  function getDonationAddress(string memory githubURL) external view returns (address payable) {
    Project storage project = githubURLToProject[githubURL];
    return project.splitProxyAddress;
  }
  
  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}
}
