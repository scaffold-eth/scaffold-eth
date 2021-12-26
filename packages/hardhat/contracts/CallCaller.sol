// // SPDX-License-Identifier: MIT
// pragma solidity >=0.8.0 <0.9.0;

// contract Caller {
//   event Response(bool success, bytes data);

//   function testCallFoo(address payable _addr) public payable {
//     (bool success, bytes memory data) = _addr.call{value: msg.value, gas: 5000}(
//       abi.encodeWithSignature("foo(string,uint256)"), "call foo", 123);

//     emit Response(success, data);
//   }

//   function testCallDoesNotExist(address _addr) public {
//     (bool success, bytes memory data) = _addr.call(
//       abi.encodeWithSignature("doesNotExist()")
//     );
//   }

//   emit Response (success, data);
// }