pragma solidity >=0.6.0 <0.7.0;

interface IGreeter {

  function setGreeting(string calldata _greeting) external;

  function sendGreeting(string calldata _greeting) external;

}
