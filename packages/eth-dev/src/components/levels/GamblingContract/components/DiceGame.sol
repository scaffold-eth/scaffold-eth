//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';

contract DiceGame {

  using SafeMath for uint256;
  uint256 lastHash;
  uint256 MIN_NUMBER = 1;
  uint256 MAX_NUMBER = 6;

  event BetExecuted(uint256 _guess, uint256 _roll, bool _won);

  constructor() payable {

  }

  function getRandomNumber() private view returns (uint) {
    uint randomNumber = (uint(keccak256(abi.encodePacked(block.timestamp))) % MAX_NUMBER) + 1;
    return randomNumber;
  }

  function bet(uint256 _guess) public returns (bool) {
    uint256 blockValue = uint256(blockhash(block.number.sub(1)));
    require(_guess >= MIN_NUMBER && _guess <= MAX_NUMBER);

    if (lastHash == blockValue) {
      revert();
    }

    uint256 roll = getRandomNumber();

    if (roll == _guess) {
      (bool sent, bytes memory data) = msg.sender.call{value: 0.1 ether}("");
      emit BetExecuted(_guess, roll, true);
      return true;
    }

    emit BetExecuted(_guess, roll, false);
    return false;
  }

}
