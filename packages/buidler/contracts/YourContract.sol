pragma solidity >=0.6.0 <0.7.0;

import "@nomiclabs/buidler/console.sol";

contract YourContract {

  string public purpose = "🛠 Programming Unstoppable Money";

  function setPurpose(string memory newPurpose) public {
    purpose = newPurpose;
    console.log(msg.sender,"set purpose to",purpose);
  }

  function eatTokens(address token, uint deadline, uint256 nonce, uint8 v, bytes32 r, bytes32 s) external {
    TestDai(token).permit(msg.sender, address(this), nonce, deadline, true /* allowed */, v, r, s);
    TestDai(token).transferFrom(msg.sender, address(this), 1 ether);
  }
}
