pragma solidity >=0.8.0 <0.9.0;

//SPDX-License-Identifier: MIT

import "./YourContract.sol";

contract Delegatecall {
    uint256 public num;
    address public msgSender;
    string public purpose = "Building Unstoppable Apps!!!";

    YourContract yourContract;

    error DelegatecallFailed();
    error CallFailed();

    function setTheseStateVars(address _contract, uint256 _num) public {
        (bool worked, ) = _contract.delegatecall(
            //abi.encodeWithSelector(YourContract.setStateVars.selector, _num);
            abi.encodeWithSignature("setStateVars(uint256)", _num)
        );
        if (!worked) revert DelegatecallFailed();
    }

    function setYourContractStateVars(address _contract, uint256 _num) public {
        (bool worked, ) = _contract.call(
            abi.encodeWithSignature("setStateVars(uint256)", _num)
        );
        if (!worked) revert CallFailed();
    }

    function setYourContractPurpose(address _contract, string memory _newStr)
        public
    {
        (bool worked, ) = _contract.call(
            abi.encodeWithSignature("setPurpose(string)", _newStr)
        );
        if (!worked) revert CallFailed();
    }

    function setThisPurpose(address _contract, string memory _newStr) public {
        (bool worked, ) = _contract.delegatecall(
            abi.encodeWithSignature("setPurpose(string)", _newStr)
        );
        if (!worked) revert DelegatecallFailed();
    }
}
