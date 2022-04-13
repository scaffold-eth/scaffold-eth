// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Game.sol";

contract Keeper is KeeperCompatibleInterface, Ownable, VRFConsumerBaseV2 {
    uint public interval;
    uint public lastTimeStamp;
    Game public gameContract;

    VRFCoordinatorV2Interface immutable coordinator;
    address vrfCoordinator = 0x6168499c0cFfCaCD319c818142124B7A15E857ab;
    uint64 immutable subscriptionId;
    bytes32 immutable keyHash;
    uint32 immutable callbackGasLimit;
    uint16 immutable requestConfirmations;
    uint32 immutable numWords;

    constructor(uint updateInterval, address _gameContract, uint64 _subscriptionId) VRFConsumerBaseV2(vrfCoordinator) {
      interval = updateInterval;
      lastTimeStamp = block.timestamp;
      gameContract = Game(_gameContract);

      subscriptionId = _subscriptionId;
      // params for Rinkeby
      coordinator = VRFCoordinatorV2Interface(vrfCoordinator);
      keyHash = 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
      callbackGasLimit = 100000;
      requestConfirmations = 3;
      numWords = 2;
    }

    function setInterval(uint updateInterval) public onlyOwner {
        interval = updateInterval;
    }

    function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool upkeepNeeded, bytes memory /* performData */) {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        // request random number
        coordinator.requestRandomWords(keyHash, subscriptionId, requestConfirmations, callbackGasLimit, numWords);   
    }

    function fulfillRandomWords(uint256 /*requestId*/, uint256[] memory randomWords) internal override {
        gameContract.shufflePrizes(randomWords[0], randomWords[1]);
    }
}

