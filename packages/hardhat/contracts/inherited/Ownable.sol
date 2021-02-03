pragma solidity 0.8.0;
import "hardhat/console.sol";
import "./Storage.sol";

// SPDX-License-Identifier: UNLICENSED

contract Ownable is Storage{
    address public _owner;
    event OwnershipTransferred (address newOwner);

    modifier onlyOwner(){
        require(msg.sender == _owner,
          /* _payable['owner'], */
            'Only the contract owner can do that.');
        _;
    }

    constructor() {
  //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol
        address msgSender = payable(msg.sender);
        _owner = msgSender;
        /* _payable['owner'] = payable(msg.sender); */
    }

    function amIOwner() public view returns (bool) {
        return (address(msg.sender) == _owner);
        /* _payable['owner']); */
    }

    function transferOwnership(address payable newOwner) public onlyOwner {
        require(newOwner != _owner,
           /* _payable['owner'], */
            'Cannot transfer ownership to yourself.');
        /* _payable['owner']  */
        _owner = newOwner;
        assert(_owner == newOwner);
          /* _payable['owner'] == newOwner); */
        emit OwnershipTransferred(newOwner);
    }

}
