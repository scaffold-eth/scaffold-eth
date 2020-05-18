pragma solidity >=0.6.0 <0.7.0;

import "@nomiclabs/buidler/console.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";

contract SmartContractWallet is BaseRelayRecipient {

  string public title = "Smart Contract Wallet";
  address public owner;

  constructor(address _owner) public {
    owner = _owner;
    console.log("Smart Contract Wallet is owned by:",owner);
  }

  fallback() external payable {
    console.log(_msgSender(),"just deposited",msg.value);
  }

  function withdraw() public {
    //require(msg.sender == owner, "SmartContractWallet::updateOwner NOT THE OWNER!");
    console.log(_msgSender(),"withdraws",(address(this)).balance);
    _msgSender().transfer((address(this)).balance);
  }

  function updateOwner(address newOwner) public {
    //require(msg.sender == owner, "SmartContractWallet::updateOwner NOT THE OWNER!");
    console.log(_msgSender(),"updates owner to",newOwner);
    owner = newOwner;
    emit UpdateOwner(_msgSender(),owner);
  }
  event UpdateOwner(address oldOwner, address newOwner);

  function setTrustedForwarder(address _trustedForwarder) public {
  trustedForwarder = _trustedForwarder;
}

}
