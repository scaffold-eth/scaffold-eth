pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

import {ISplitMain} from "./ISplitMain.sol";

contract YourContract is Ownable {
  ISplitMain constant splitMain =
    ISplitMain(0x2ed6c4B5dA6378c7897AC67Ba9e43102Feb694EE);


  /**
    Project state 
   */
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
        initializeGithubURL(splitGithubURL);
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
          (splitAddresses[i], splitAddresses[j]) = (splitAddresses[j], splitAddresses[i]);
          (newPercentAllocations[i], newPercentAllocations[j]) = (newPercentAllocations[j], newPercentAllocations[i]);
        }
      }
    }

    project.splitProxyAddress = payable(splitMain.createSplit(splitAddresses, newPercentAllocations, 0, msg.sender));
  }

  function initializeGithubURL(string memory githubURL) internal {    
    Project storage project = githubURLToProject[githubURL];
    project.init = true;
    project.githubURL = githubURL;
    
    uint32[] memory initialPercentage = new uint32[](2);
    initialPercentage[0] = uint32(1e6-1);
    initialPercentage[1] = uint32(1);
    
    address[] memory initialAddresses = new address[](2);
    if (address(0xEf4D00efF106727524453A48680EA968498AFF4c) > address(this)) {
      initialAddresses[0] = address(this);
      initialAddresses[1] = 0xEf4D00efF106727524453A48680EA968498AFF4c;
    } else {
      initialAddresses[1] = address(this);
      initialAddresses[0] = 0xEf4D00efF106727524453A48680EA968498AFF4c;
    }
    
    // create split with distributor fee of 0.5%
    project.splitProxyAddress = payable(splitMain.createSplit(initialAddresses, initialPercentage, 500, address(this)));

    // reroute the payments back to the split
    if (project.splitProxyAddress > address(this)) {
      initialAddresses[0] = address(this);
      initialPercentage[0] = uint32(1);
      initialAddresses[1] = project.splitProxyAddress;
      initialPercentage[1] = uint32(1e6-1);
    } else {
      initialAddresses[1] = address(this);
      initialPercentage[1] = uint32(1);
      initialAddresses[0] = project.splitProxyAddress;
      initialPercentage[0] = uint32(1e6-1);
    }

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
