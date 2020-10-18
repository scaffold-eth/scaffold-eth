pragma solidity >=0.6.0 <0.7.0;

import "@nomiclabs/buidler/console.sol";

contract YourContract {

  constructor() public {
    setPurpose("🛠 Programming Unstoppable Money");
  }

  event SetPurpose(address sender, string purpose);

  string public purpose;

  function setPurpose(string memory newPurpose) public {
    purpose = newPurpose;
    console.log(msg.sender,"set purpose to",purpose);
    emit SetPurpose(msg.sender, purpose);
  }

}
