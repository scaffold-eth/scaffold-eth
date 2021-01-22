pragma solidity 0.8.0;
import './Storage.sol';

// SPDX-License-Identifier: UNLICENSED

contract Noun is Storage {

    constructor(address _verbAddress) public {
        _address('verbAddress') = _verbAddress;
    }

    function upgrade(address _newAddress) public{
        _address('verbAddress') = _newAddress;
    }

    // Redirect everything to functional contract.
    fallback() payable external {
        address implementation = _address('verbAddress');
        require(_address('verbAddress') != address(0));
        bytes memory data = msg.data;

        assembly{
            let result := delegatecall(gas, implementation, add(data, 0x20), mload(data),0,0)
            let size := returndatasize
            let ptr := mload(0x40)
            returndatacopy(ptr,0,size)
            switch result
            case 0 {revert(ptr,size)}
            default {return(ptr,size)}
        }
        
    }
}