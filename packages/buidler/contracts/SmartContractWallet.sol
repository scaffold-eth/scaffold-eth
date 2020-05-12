pragma solidity >=0.6.0 <0.7.0;

import "@nomiclabs/buidler/console.sol";

contract SmartContractWallet {

  bytes32 public mode = "init";
  uint constant threshold = 0.002 * 10**18;
  address public owner;
  uint8 public stabilityPreference;

  mapping(address => uint) public balances;

  function setPreference(uint8 percentStable) public {
    stabilityPreference = percentStable;
    console.log(msg.sender, "wants the stabilityPreference to be", percentStable);
  }

  function updateMode() public {
    if( mode=="open" && isOverThreshold() ){
      mode = "active";
    }
  }

  function isOverThreshold() public view returns (bool) {
    if( mode=="open"){
      return ( (address(this)).balance >= threshold );
    }else{
      return false;
    }
  }

  function isActiveAccount() public view returns (bool) {
    if(mode=="active" && balances[msg.sender]>0 ){
      return true;
    }
    return false;
  }

  constructor(address _owner) public {
    owner = _owner;
    console.log("Smart Contract Wallet is owned by:",owner);
    mode = "open";
  }

  uint constant limit = 0.005 * 10**18;
  fallback() external payable {
      require(((address(this)).balance + msg.value) <= limit, "WALLET LIMIT REACHED");
      require(mode=="open","WALLET IS NOT OPEN");
      balances[msg.sender] += msg.value;
      console.log(msg.sender,"just deposited",msg.value);
  }

  function withdraw() public {
    uint balance = balances[msg.sender];
    require(balance > 0, "NO FUNDS");
    balances[msg.sender] = 0;
    msg.sender.transfer(balance);
    console.log(msg.sender, "just withdrew", balance);
  }

}
