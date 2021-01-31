pragma solidity 0.8.0;
import "./Ownable.sol";

// SPDX-License-Identifier: UNLICENSED

contract Nameable is Ownable{

    event Renamed(string newName);
    event Resymboled(string newSymbol);

    constructor(string name, string symbol) {
        _string['name'] = name;
        _string['symbol'] = symbol;
    }

    function name() public view returns (string) {
        return _string['name'];
    }

    function symbol() public view returns (string) {
        return _string['symbol'];
    }

    function reName(string newName) public ownerOnly {
        _string['name'] = newName;
        emit Renamed(newName);
    }

    function reSymbol(string newSymbol) public ownerOnly {
        _string['symbol'] = newSymbol;
        emit Resymboled(newSymbol);
    }
}