pragma solidity >=0.6.0 <0.7.0;

import "@nomiclabs/buidler/console.sol";

contract YourContract {

  constructor() public {
    setPurpose("🛠 Programming Unstoppable Money");
  }

  event SetPurpose(address sender, string purpose);

  uint8 public count = 1;
  function dec() public {
    count -= 1;
  }

  string public purpose;

  function setPurpose(string memory newPurpose) public {
    purpose = newPurpose;
    console.log(msg.sender,"set purpose to",purpose);
    emit SetPurpose(msg.sender, purpose);
  }

}
