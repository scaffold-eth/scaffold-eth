pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

import {ISplitMain} from './interfaces/ISplitMain.sol';

contract YourContract is Ownable {
  /**
   * CONTRACT STATE
   */
  struct Project {
    string githubURL;
    address payable receiveMoneyAddress;
    address payable splitProxyAddress;
    bool splitAdded;
  }
  mapping(string => Project) public githubURLToProject;
  uint32 percentKeep;
  uint32 percentDistributorFee;

  ISplitMain splitMain;

  // @notice constant to scale uints into percentages (1e6 == 100%)
  // from 0xSplit contract
  uint32 public constant PERCENTAGE_SCALE = 1e6;

  // inputted percents must use PERCENTAGE_SCALE
  constructor(uint32 _percentKeep, uint32 _percentDistributorFee, address _splitMainAddress) {
    percentKeep = _percentKeep;
    percentDistributorFee = _percentDistributorFee;
    splitMain = ISplitMain(_splitMainAddress);
  }

  /**
   * CONTRACT METHODS
   */
  function addProjectToSystem(
    string memory githubURL, 
    address payable receiveMoneyAddress,
    string[] memory splitGithubURLs,
    uint32[] memory percentAllocations,
    uint32 communityPoolPercentage,
    address payable communityPoolAddress
  ) public onlyOwner {

    // intialize the project object
    Project storage project = githubURLToProject[githubURL];
    project.githubURL = githubURL;
    project.receiveMoneyAddress = receiveMoneyAddress;

    // stores addresses of GitHub repos, address of team, and address of community pool
    address[] memory splitAddresses;
    uint32[] memory newPercentAllocations;
    if (communityPoolPercentage > 0) {
      // need an extra entry for community pool
      splitAddresses = new address[](splitGithubURLs.length+2);
      newPercentAllocations = new uint32[](splitGithubURLs.length+2);

      splitAddresses[splitGithubURLs.length+1] = communityPoolAddress;
      newPercentAllocations[splitGithubURLs.length+1] = communityPoolPercentage;
    } else {
      splitAddresses = new address[](splitGithubURLs.length+1);
      newPercentAllocations = new uint32[](splitGithubURLs.length+1);
    }

    // convert GitHub URLs to addresses
    for (uint i = 0; i < splitGithubURLs.length; i++) {
      string memory splitGithubURL = splitGithubURLs[i];
      Project storage splitProject = githubURLToProject[splitGithubURL];
      if (!splitProject.splitAdded) {
        initializePlaceholderSplit(splitGithubURL);
      }
      require(splitProject.splitAdded, "split not added");
      splitAddresses[i] = splitProject.splitProxyAddress;
      newPercentAllocations[i] = percentAllocations[i];
    }

    // add self + kept percentage
    splitAddresses[splitGithubURLs.length] = project.receiveMoneyAddress;
    newPercentAllocations[splitGithubURLs.length] = percentKeep;

    // assert sum of percentAllocations is PERCENTAGE_SCALE
    uint32 sum = 0;
    for (uint i = 0; i < newPercentAllocations.length; i++) {
      require(newPercentAllocations[i] > 0, "percentAllocations must be greater than 0");
      sum += newPercentAllocations[i];
    }
    require(sum == PERCENTAGE_SCALE, "sum of percentAllocations is not 1e6");

    // sort addresses and percent allocations
    for (uint i = 0; i < splitAddresses.length; i++) {
      for (uint j = i + 1; j < splitAddresses.length; j++) {
        if (splitAddresses[i] > splitAddresses[j]) {
          (splitAddresses[i], splitAddresses[j]) = (splitAddresses[j], splitAddresses[i]);
          (newPercentAllocations[i], newPercentAllocations[j]) = (newPercentAllocations[j], newPercentAllocations[i]);
        }
      }
    }

    // create or update split proxy for this GitHub
    if (!project.splitAdded) {
      project.splitProxyAddress = payable(splitMain.createSplit(
        splitAddresses, 
        newPercentAllocations, 
        percentDistributorFee, 
        address(this)
      ));
      project.splitAdded = true;
    } else {
      splitMain.updateSplit(
        project.splitProxyAddress, 
        splitAddresses, 
        newPercentAllocations, 
        percentDistributorFee
      );
    }
  }

  function initializePlaceholderSplit(string memory githubURL) internal {   
    Project storage project = githubURLToProject[githubURL];
    project.githubURL = githubURL;

    require(!project.splitAdded, "placeholder split already added");
    
    // set up a dummy split to start out so we can get the address of the split
    // 0xSplits requires splits are between 2 or more addresses
    uint32[] memory placeholderPercentage = new uint32[](2);
    placeholderPercentage[0] = PERCENTAGE_SCALE-1;
    placeholderPercentage[1] = uint32(1);
    
    address[] memory placeholderAddresses = new address[](2);
    if (owner() > address(this)) {
      placeholderAddresses[0] = address(this);
      placeholderAddresses[1] = owner();
    } else {
      placeholderAddresses[1] = address(this);
      placeholderAddresses[0] = owner();
    }
    
    // create initial split
    project.splitProxyAddress = payable(splitMain.createSplit(
      placeholderAddresses, 
      placeholderPercentage, 
      percentDistributorFee, 
      address(this)
    ));

    // reroute all payments back to the split
    if (project.splitProxyAddress > owner()) {
      placeholderAddresses[0] = owner();
      placeholderPercentage[0] = uint32(1);
      placeholderAddresses[1] = project.splitProxyAddress;
      placeholderPercentage[1] = PERCENTAGE_SCALE-1;
    } else {
      placeholderAddresses[1] = owner();
      placeholderPercentage[1] = uint32(1);
      placeholderAddresses[0] = project.splitProxyAddress;
      placeholderPercentage[0] = PERCENTAGE_SCALE-1;
    }

    splitMain.updateSplit(
      project.splitProxyAddress, 
      placeholderAddresses, 
      placeholderPercentage, 
      percentDistributorFee
    );
    project.splitAdded = true;
  }

  // if 0.5% is too little or too much for the system to work, owner can change it
  function changePercentageDistributorFee(uint32 _newPercentDistributorFee) public onlyOwner {
    percentDistributorFee = _newPercentDistributorFee;
  }

  /**
   * CONTRACT GETTERS
   */
  function getSplitAddress(string memory githubURL) external view returns (address payable) {
    Project storage project = githubURLToProject[githubURL];
    return project.splitProxyAddress;
  }
  
  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}
}
