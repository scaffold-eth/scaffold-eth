pragma solidity 0.8.4;

import "hardhat/console.sol";
import "./ExampleExternalContract.sol";

contract Staker {

  ExampleExternalContract public exampleExternalContract;
  uint256 public constant threshold = 1 ether;
  mapping ( address => uint256 ) public balances;
  event Stake(address indexed sender, uint256 amount);
  uint256 public deadline = block.timestamp + 30 seconds;

  modifier deadlineReached( bool requireReached ) {
    uint256 timeRemaining = timeLeft();
    if( requireReached ) {
      require(timeRemaining == 0, "Deadline is not reached yet");
    } else {
      require(timeRemaining > 0, "Deadline is already reached");
    }
    _;
  }

  modifier stakeNotCompleted() {
    bool completed = exampleExternalContract.completed();
    require(!completed, "staking is already completed");
    _;
  }

  constructor(address exampleExternalContractAddress) public {
      exampleExternalContract = ExampleExternalContract(exampleExternalContractAddress);
  }

  function stake() public payable deadlineReached(false) stakeNotCompleted {
    balances[msg.sender] += msg.value;
    emit Stake(msg.sender, msg.value);
  }

  function execute() public stakeNotCompleted deadlineReached(false) {
    uint256 contractBalance = address(this).balance;
    require(contractBalance >= threshold, "Threshold not reached");
    (bool sent,) = address(exampleExternalContract).call{value: contractBalance}(abi.encodeWithSignature("complete()"));
    require(sent, "exampleExternalContract.complete failed");
  }

  function withdraw() public deadlineReached(true) stakeNotCompleted {
    uint256 userBalance = balances[msg.sender];
    require(userBalance >= 0, "You do not have balance to withdraw");
    balances[msg.sender] = 0;
    (bool sent,) = msg.sender.call{value: userBalance}("");
    require(sent, "Failed to send user balance back to the user");
  }

  function timeLeft() public view returns (uint256 timeleft) {
    if(block.timestamp >= deadline) {
      return 0;
    } else {
      return deadline - block.timestamp;
    }
  }
}
