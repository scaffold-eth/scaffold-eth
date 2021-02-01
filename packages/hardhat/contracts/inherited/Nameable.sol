pragma solidity 0.8.0;
import "./Ownable.sol";

// SPDX-License-Identifier: UNLICENSED

contract Nameable is Ownable{

    event Renamed(string newName);
    event Resymboled(string newSymbol);

    constructor(string memory _name, string memory _symbol) {
        _string['name'] = _name;
        _string['symbol'] = _symbol;
    }

    function name() public view returns (string memory) {
        return _string['name'];
    }

    function symbol() public view returns (string memory) {
        return _string['symbol'];
    }

    function reName(string calldata newName) public onlyOwner {
        _string['name'] = newName;
        emit Renamed(newName);
    }

    function reSymbol(string calldata newSymbol) public onlyOwner {
        _string['symbol'] = newSymbol;
        emit Resymboled(newSymbol);
    }
}