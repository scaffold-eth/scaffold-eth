//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {

  AggregatorV3Interface internal priceFeed;

  constructor() {
    priceFeed = AggregatorV3Interface();
  }

  function getLatestPrice() public view returns (int) {
    (
      uint80 roundID,
      int price,
      uint startedAt,
      uint timestamp,
      uint80 answeredInRound
    ) = priceFeed.latestRoundData();

    return price;
  }
}
