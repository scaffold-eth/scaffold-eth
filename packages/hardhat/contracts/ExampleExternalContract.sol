pragma solidity >=0.6.0 <0.7.0;

contract ExampleExternalContract {

  bool public completed;

  function complete() public payable {
    completed = true;
  }

}
