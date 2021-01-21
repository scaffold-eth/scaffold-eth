pragma solidity >=0.6.0 <0.7.0;

import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract {
  address payable owner;
  uint public unlockTime;
  bool isEditable;
  address public beneficiary;

  event timelockCreated(
      address indexed owner,
      uint256 indexed timeForDethLOCK,
      uint256 amount,
      address beneficiary
  );

  event claimedTimelock(
    address beneficiary,
    uint256 amount);

  modifier onlyOwner() {
    require(msg.sender == owner, 'Only owner can do this.');
     _; }
  modifier onlyWhenUnlocked() {
     require(isUnlocked(), 'It is still locked!');
      _; }
  modifier onlyEditable(){
    require(isEditable, 'This cannot be edited');
    _;
  }
  modifier onlyBeneficiary() {
     require(msg.sender == beneficiary, 'You are not the heir!');
      _; }

  function Lock(uint _unlockTime, bool _isEditable, address _beneficiary) payable public {
    owner = msg.sender;
    isEditable = _isEditable;
    unlockTime = _unlockTime;
    beneficiary = _beneficiary;
    emit timelockCreated(owner, unlockTime, msg.value, beneficiary);
  }

  function isUnlocked() public view returns (bool) {
    return unlockTime < block.timestamp;
  }

  function withdraw() public onlyOwner {
    owner.transfer(address(this).balance);
  }

  function claim() public onlyBeneficiary onlyWhenUnlocked {
    msg.sender.transfer(address(this).balance);
    emit claimedTimelock(beneficiary, address(this).balance);
  }


  function updateTime(uint _unlockTime) public onlyOwner onlyEditable{
    unlockTime = _unlockTime;
  }
}
