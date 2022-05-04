pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "forge-std/Test.sol";

import {YourContract} from "contracts/YourContract.sol";

contract YourContractTest is Test {
    YourContract private myContract;

    event SetPurpose(address sender, string purpose);

    function setUp() external {
        myContract = new YourContract();
    }

    function testSetPurpose() external {
        string memory newPurpose = "Test Purpose";

        myContract.setPurpose(newPurpose);

        assertEq(myContract.purpose(), newPurpose);
    }

    function testEmitSetPurpose() external {
        string memory newPurpose = "Another Test Purpose";

        vm.expectEmit(true, true, true, true);
        emit SetPurpose(address(this), newPurpose);
        myContract.setPurpose(newPurpose);
    }
}
