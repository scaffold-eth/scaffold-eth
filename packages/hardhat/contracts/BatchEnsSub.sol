pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract ENS {
  function setSubnodeRecord(bytes32 node, bytes32 label, address owner, address resolver, uint64 ttl) public {

  }
}


contract BatchEnsSub {

  ENS ens;

  constructor() payable {
    ens = ENS(0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e);
  }

  function setMultipleSubnodeRecords(bytes32 node, bytes32[] memory labels, address owner, address resolver, uint64 ttl) public {
    for(uint i = 0; i < labels.length; i++) {
      ens.setSubnodeRecord(node, labels[i], owner, resolver, ttl);
    }
  }

}
