pragma solidity 0.8.0;
import './DethLock.sol';

// SPDX-License-Identifier: UNLICENSED

contract Verb is DethLock {

    function getNumberOfDogs() public view returns(uint256) {
        return _uint["Dogs"];
    }

    function setNumberOfDogs(uint256 toSet) public {
        _uint["Dogs"] = toSet;
    }
}