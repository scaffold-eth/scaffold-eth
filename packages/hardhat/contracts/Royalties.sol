//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract Royalties is Ownable {
    address public nftContractAddress;

    mapping(address => uint256) private _royaltyTotals;

    constructor(address _nftContractAddress) {
        nftContractAddress = _nftContractAddress;
    }

    // Internal
    function _increaseRoyalty(address _recipient, uint256 _addedValue)
        internal
        returns (bool)
    {
        uint256 currentBalance = 0;
        if (_royaltyTotals[_recipient] != 0) {
            currentBalance = _royaltyTotals[_recipient];
        }
        _royaltyTotals[_recipient] = _addedValue + currentBalance;
        return true;
    }

    // Internal
    function _decreaseRoyalty(address beneficiary, uint256 subtractedValue)
        internal
        returns (bool)
    {
        uint256 currentAllowance = _royaltyTotals[beneficiary];
        require(
            currentAllowance >= subtractedValue,
            "ERC20: decreased payout below zero"
        );
        uint256 newAllowance = currentAllowance - subtractedValue;
        _royaltyTotals[beneficiary] = newAllowance;
        return true;
    }

    // Public
    function royalties(address recipient) public view returns (uint256) {
        return _royaltyTotals[recipient];
    }
}
