// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Counter {
  uint public count;

  function increment() external {
    count += 1;
  }
}

interface ICounter {
  function count() external view returns (uint);

  function increment() external;
}

contract MyContract {
  function incrementCounter(address _counter) external {
    ICounter(_counter).increment();
  }

  function getCount(address _counter) external view returns (uint) {
    return ICounter(_counter).count();
  }
}

interface UniswapV2Factory {
  function getPair(address tokenA, address tokenB)
    external
    view
    returns (address pair);
}

interface UniswapV2Pair {
  function getReserves()
    external
    view
    returns (
      uint112 reserve0,
      uint112 reserve1,
      uint32 blockTimestampLast
    );
}

contract UniswapExample {
  address private factory = 0x0000000000000000000000000000000000000000;
  address private dai = 0x0000000000000000000000000000000000000000;
  address private weth = 0x0000000000000000000000000000000000000000;

  function getTokenReserves() external view returns (uint, uint) {
    address pair = UniswapV2Factory(factory).getPair(dai, weth);
    (uint reserve0, uint reserve1, ) = UniswapV2Pair(pair).getReserves();
    return (reserve0, reserve1);
  }
}
