pragma solidity >=0.6.0 <0.7.0;

import "hardhat/console.sol";
import "./ExampleExternalContract.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract Staker {

  ExampleExternalContract public exampleExternalContract;

  constructor(address exampleExternalContractAddress) public {
    exampleExternalContract = ExampleExternalContract(exampleExternalContractAddress);
  }

  // Collect funds in a payable `stake()` function and track individual `balances` with a mapping:
  //  ( make sure to add a `Stake(address,uint256)` event and emit it for the frontend <List/> display )



  // After some `deadline` allow anyone to call an `execute()` function
  //  It should either call complete() on ExampleExternalContract and send all the value
  //  OR, if the `threshold` was not met, allow everyone to call a `withdraw()` function
  //    solidity hint: you can get the contract's balance with `address(this).balance`



  // Add a `timeLeft()` view function that returns the time left before the deadline for the frontend



}
