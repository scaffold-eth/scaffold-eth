pragma solidity >=0.6.0 <0.7.0;

import "@nomiclabs/buidler/console.sol";

contract SmartContractWallet {

  string public title = "📄 Smoort Contract Wallet";
  address public owner;

  constructor(address _owner) public {
    owner = _owner;
    console.log("Smart Contract Wallet is owned by:",owner);
  }

  // using payable fallback functions for receiving Ether is not recommended, since it would not fail on interface confusions
  // fallback() external payable {
  //   console.log(msg.sender,"just deposited",msg.value);
  // }

  receive() external payable {
    console.log(msg.sender,"just deposited",msg.value);
    emit EthTransferred(msg.sender, msg.value);
  }

  // See https://solidity.readthedocs.io/en/v0.6.0/contracts.html#receive-ether-function
  function withdraw() public {
    //require(msg.sender == owner, "SmartContractWallet::updateOwner NOT THE OWNER!");
    console.log(msg.sender,"withdraws",(address(this)).balance);
    uint256 balance = (address(this)).balance;
    msg.sender.transfer(balance);
    emit DrainedBalance(msg.sender, balance);
  }

  function updateOwner(address newOwner) public {
    //require(msg.sender == owner, "SmartContractWallet::updateOwner NOT THE OWNER!");
    console.log(msg.sender,"updates owner to",newOwner);
    owner = newOwner;
    emit UpdateOwner(msg.sender,owner);
  }
  event UpdateOwner(address oldOwner, address newOwner);
  event EthTransferred(address sender, uint256 value);
  event DrainedBalance(address receiver, uint value);

}
