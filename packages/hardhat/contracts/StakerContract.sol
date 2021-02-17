pragma solidity >=0.6.0 <0.7.0;

contract StakerContract {

  bool public completed;

  function complete() public payable {
    completed = true;
  }
  function reset() public payable {
    completed = false;
  }

}
