pragma solidity >=0.6.0 <0.7.0;

import "hardhat/console.sol";
import "./ExampleExternalContract.sol";

contract Staker {

  // this contract holds staked funds
  ExampleExternalContract public exampleExternalContract;

  // shows balances of address participating
  mapping ( address => uint256 ) public balances;

  // staking threshold
  uint256 public constant threshold = 1 ether;


  // Contract's Events
  event Stake(address indexed sender, uint256 amount);

  constructor(address exampleExternalContractAddress) public {
      exampleExternalContract = ExampleExternalContract(exampleExternalContractAddress);
  }

  // stake method that update the user's balance
  function stake() public payable {
    // update the user's balance
    balances[msg.sender] += msg.value;

    // emit the event to notify the blockchain that we have correctly staked funds from the user
    emit Stake(msg.sender, msg.value);
  }

  // Collect funds in a payable `stake()` function and track individual `balances` with a mapping:
  //  ( make sure to add a `Stake(address,uint256)` event and emit it for the frontend <List/> display )


  // After some `deadline` allow anyone to call an `execute()` function
  //  It should either call `exampleExternalContract.complete{value: address(this).balance}()` to send all the value

  // if the `threshold` was not met, allow everyone to call a `withdraw()` function


  // Add a `timeLeft()` view function that returns the time left before the deadline for the frontend


  // Add the `receive()` special function that receives eth and calls stake()


}
