// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

contract MockOracle {

  function latestRoundData()
    external
    view
    returns (
      uint80 roundId,
      int256 answer,
      uint256 startedAt,
      uint256 updatedAt,
      uint80 answeredInRound
    ) {
        return (1, 100, 108778998, 108778998, 60);
    }
}