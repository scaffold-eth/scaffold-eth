pragma solidity >=0.8.0 <0.9.0;

//SPDX-License-Identifier: MIT

contract YourContract {
    //uint256 public unsafeVar;
    uint256 public num;
    address public msgSender;
    string public purpose = "Building Unstoppable Apps!!!";

    function setPurpose(string memory _newPurpose) public {
        purpose = _newPurpose;
    }

    function setStateVars(uint256 _newNum) public {
        num = _newNum;
        msgSender = msg.sender;
    }

    //Upgraded function
    // function setStateVars(uint256 _newNum) public {
    //     num = _newNum * 100;
    //     msgSender = msg.sender;
    // }
}
