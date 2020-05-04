pragma solidity >=0.6.0 <0.7.0;

import "@nomiclabs/buidler/console.sol";

contract SmartContractWallet {

  address public owner;

  constructor() public {
    owner = msg.sender;
  }

  function withdraw() public {
    require(msg.sender == owner, "NOT THE OWNER!");
    msg.sender.transfer((address(this)).balance);
  }

}
