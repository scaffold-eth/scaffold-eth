pragma solidity >=0.6.0 <0.8.4;
//SPDX-License-Identifier: MIT

/// @title Factory for IpNft
/// @author elocremarc

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IpNft.sol";

import "./interface/IIpNft.sol";

contract IpNftFactory is Ownable{
    constructor() public{}

    mapping(address => bool) public IpNftContracts;
    address [] IpNftContractList;
    event NewIpNft(address IpNftContractAddress , address licensee, string IpBrandName, string IpBrandSymbol );
    
    /**
     * @dev Manufacture IpNft
     * @param IpBrandName Name of branding for licensor
     * @param IpBrandSymbol Symbol of IP
     * @param IpURI URI of licensed data
     **/
    function newIpNft(string memory IpBrandName, string memory IpBrandSymbol, string memory IpURI) public returns (address[] memory){
        IpNft _newIpNft = new IpNft( IpBrandName, IpBrandSymbol,IpURI);
        IpNftContracts[address(_newIpNft)] = true;
        IpNftContractList.push(address(_newIpNft));
        IIpNft(address(_newIpNft)).changeLicensor(msg.sender);
        emit NewIpNft( address(_newIpNft),  msg.sender, IpBrandName, IpBrandSymbol);
        return IpNftContractList;
    }

    /// @dev Get child contracts
    function getChildren()external view returns(address[] memory){
        return IpNftContractList;
    }

    
}