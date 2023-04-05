// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IUniswapV2Router02 {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}

contract TokenSwap {
    address private uniswapV2RouterAddress;

    event TokensSwapped(
        address tokenIn,
        address tokenOut,
        uint tokenIn_amountInWei,
        uint tokenOut_amountInWei
    );

    constructor(address _uniswapV2RouterAddress) {
        uniswapV2RouterAddress = _uniswapV2RouterAddress;
    }

    function swap(
        address tokenIn,
        address tokenOut,
        uint tokenIn_amountInWei
    ) external {
        // Approve the UniswapV2 router to spend tokenIn
        IERC20(tokenIn).approve(uniswapV2RouterAddress, tokenIn_amountInWei);

        // Define the token swap path
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;

        // Set the minimum amount of tokenOut that must be received
        uint amountOutMin = 0;

        // Set the deadline for the token swap
        uint deadline = block.timestamp + 300; // 5 minute deadline

        // Swap the tokens on UniswapV2
        uint[] memory amounts = IUniswapV2Router02(uniswapV2RouterAddress)
            .swapExactTokensForTokens(
                tokenIn_amountInWei,
                amountOutMin,
                path,
                msg.sender,
                deadline
            );

        // Emit an event on successful swap
        emit TokensSwapped(tokenIn, tokenOut, tokenIn_amountInWei, amounts[1]);
    }
}
