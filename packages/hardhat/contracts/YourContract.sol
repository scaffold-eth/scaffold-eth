pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

//NOTE: if you need to inherit other OpenZeppelin contracts, you need to add these overrides:
// https://docs.opengsn.org/faq/troubleshooting.html#my-contract-is-using-openzeppelin-how-do-i-add-gsn-support

contract YourContract is ERC2771Context {

  event SetPurpose(address sender, string purpose);

  string public purpose = "Building Unstoppable Apps";
  address public purposeSetter;

  error EmptyPurposeError(uint code, string message);

  constructor(address forwarder) ERC2771Context(forwarder) {
    // what should we do on deploy?
  }

  function setPurpose(string memory newPurpose) public {
      if(bytes(newPurpose).length == 0){
          revert EmptyPurposeError({
              code: 1,
              message: "Purpose can not be empty"
          });
      }

      purpose = newPurpose;
      console.log(_msgSender(),"set purpose to",purpose);
      purposeSetter = _msgSender();
      emit SetPurpose(_msgSender(), purpose);
  }
}
