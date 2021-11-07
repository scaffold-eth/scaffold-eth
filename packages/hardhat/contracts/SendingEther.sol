// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract ReceiveEther {
  receive() external payable {}

  fallback() external payable {}

  function getBalance() public view returns (uint) {
    return address(this).balance;
  }
}

contract sendEther {
  function sendViaTransfer(address payable _to) public payable {
    // not recommended
    _to.transfer(msg.value);
  }

  function sendViaSend(address payable _to) public payable {
    // not recommended
    bool sent = _to.send(msg.value);
    require(sent, "Failed to send Ether");
  }

  function sendViaCall(address payable _to) public payable {
    // currently recommended
    (bool sent, bytes memory data) = _to.call{value: msg.value}("");
    require(sent, "Failed to send Ether");
  }
}
