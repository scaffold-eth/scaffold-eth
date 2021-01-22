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

  event Stake(address who,uint256 amount);

  uint256 public constant threshold = 1 ether;

  mapping ( address => uint256 ) public balances;

  function stake() public payable {
    emit Stake(msg.sender, msg.value);
    balances[msg.sender] += msg.value;
  }


  // After some `deadline` allow anyone to call an `execute()` function
  //  It should either call complete() on ExampleExternalContract and send all the value
  //  OR, if the `threshold` was not met, allow everyone to call a `withdraw()` function
  //    solidity hint: you can get the contract's balance with `address(this).balance`

  uint256 public deadline = now + 0.4 minutes;

  bool public completed;
  bool public failed;

  function execute() public {
    require(!completed, "Already completed");
    require(!failed, "Already failed");
    require(now>=deadline, "Have not reached deadline yet");
    if( address(this).balance >= threshold ){
      exampleExternalContract.complete{value: address(this).balance}();
      completed=true;
    }else{
      failed=true;
    }
  }

  function withdraw(address payable who) public {
    require(failed, "Cant withdraw until execute fails");
    uint256 amount = balances[who];
    balances[who] = 0;
    who.transfer(amount);
  }

  // Add a `timeLeft()` view function that returns the time left before the deadline for the frontend

  function timeLeft() public view returns (uint256) {
    if(now>deadline) return 0;
    return deadline - now;
  }

}
