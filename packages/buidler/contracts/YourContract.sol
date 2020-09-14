pragma solidity >=0.6.0 <0.7.0;

import "@nomiclabs/buidler/console.sol";

contract YourContract {

  string public purpose = "🛠 Programming Unstoppable Money";

  function setPurpose(string memory newPurpose) public payable {
    require(msg.value>=0.001 ether,"not enough");
    purpose = newPurpose;
    console.log(msg.sender,"set purpose to",purpose);
    //emit SetPurpose(msg.sender, purpose);
  }

  //event SetPurpose(address sender, string purpose);

}
