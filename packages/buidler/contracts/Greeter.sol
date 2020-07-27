pragma solidity >=0.6.0 <0.7.0;

import "./IGreeter.sol";
import "./AMBMediator.sol";

contract Greeter is AMBMediator {

  constructor() public {
    transferOwnership(0x81C770BBE8f5f41b4642Ed575e630c911c94E407);
  }

  string public greeting;
  bytes32 public latestMessage;

  function setGreeting(string calldata _greeting) external {
    greeting = _greeting;
  }

  function sendGreeting(string calldata _greeting) external returns(bytes32) {

    bytes4 methodSelector = IGreeter(address(0)).setGreeting.selector;
    bytes memory data = abi.encodeWithSelector(methodSelector, _greeting);
    bytes32 msgId = bridgeContract().requireToPassMessage(
        mediatorContractOnOtherSide(),
        data,
        requestGasLimit
    );
    latestMessage = msgId;
    return msgId;
  }

  function failedMessageSender(bytes32 _messageId) external view returns (address) {
    return bridgeContract().failedMessageSender(_messageId);
  }

}
