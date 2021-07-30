pragma solidity >=0.6.0 <0.7.0;

/// @title Factory for IpNft
/// @author elocremarc

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IpNft.sol";

import "./interface/IIpNft.sol";

contract IpNftFactory is Ownable{
    constructor() public{}

    mapping(address => bool) public IpNftContracts;
    address [] IpNftContractList;
    event NewIpNft(address IpNftContractAddress , address licensee, string IpName, string IpSymbol );
    
    /**
     * @dev Manufacture IpNft
     * @param IpName Name of IP
     * @param IpSymbol Symbol of IP
     * @param IpURI URI of licensed data
     **/
    function newIpNft(string memory IpName, string memory IpSymbol, string memory IpURI) public returns (address[] memory){
        IpNft _newIpNft = new IpNft( IpName, IpSymbol,IpURI);
        IpNftContracts[address(_newIpNft)] = true;
        IpNftContractList.push(address(_newIpNft));
        IIpNft(address(_newIpNft)).changeLicensor(msg.sender);
        emit NewIpNft( address(_newIpNft),  msg.sender, IpName, IpSymbol);
        return IpNftContractList;
    }

    /// @dev Get child contracts
    function getChildren()external view returns(address[] memory){
        return IpNftContractList;
    }

    
}