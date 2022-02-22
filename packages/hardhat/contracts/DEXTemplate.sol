pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DEX {

  using SafeMath for uint256;
  IERC20 token;

  constructor(address token_addr) {
    token = IERC20(token_addr);
  }

  uint256 public totalLiquidity;
  mapping (address => uint256) public liquidity;
  
  event EthToTokenSwap(address swapper, string txDetails, uint256 ethInput, uint256 tokenOutput);
  event TokenToEthSwap(address swapper, string txDetails, uint256 tokensInput, uint256 ethOutput);
  event LiquidityProvided(address liquidityProvider, uint256 liquidityMinted, uint256 tokensInput, uint256 ethInput);
  event LiquidityRemoved( address liquidityRemover, uint256 liquidityWithdrawn, uint256 ethOutput, uint256 tokensOutput);

  function init(uint256 tokens) public payable returns (uint256) {
    require(totalLiquidity==0,"DEX:init - already has liquidity");
    totalLiquidity = address(this).balance;
    liquidity[msg.sender] = totalLiquidity;
    require(token.transferFrom(msg.sender, address(this), tokens));
    return totalLiquidity;
  }
  function price(uint256 input_amount, uint256 input_reserve, uint256 output_reserve) public pure returns (uint256) {
    uint256 input_amount_with_fee = input_amount.mul(997);
    uint256 numerator = input_amount_with_fee.mul(output_reserve);
    uint256 denominator = input_reserve.mul(1000).add(input_amount_with_fee);
    return numerator / denominator;
  }

  function ethToToken() public payable returns (uint256) {
    uint256 ethReserve = address(this).balance.sub(msg.value);
    uint256 token_reserve = token.balanceOf(address(this));
    uint256 tokens_bought = price(msg.value, ethReserve, token_reserve);
    require(token.transfer(msg.sender, tokens_bought));
    emit EthToTokenSwap(msg.sender,  "Eth to Balloons", msg.value, tokens_bought);
    return tokens_bought;

  }

  function tokenToEth(uint256 tokens) public payable returns (uint256 eth_bought) {
    uint256 token_reserve = token.balanceOf(address(this));
    eth_bought = price(tokens, token_reserve, address(this).balance);
    //uint256 tokens_sold = eth_bought;
    payable(msg.sender).transfer(eth_bought);
    require(token.transferFrom(msg.sender, address(this), tokens));
    emit TokenToEthSwap(msg.sender, "Balloons to ETH", tokens, eth_bought);
    //Address | Trade | AmountIn | AmountOut
    return eth_bought;
  }

  function deposit() public payable returns (uint256 tokensDeposited) {
    uint256 ethReserve = address(this).balance.sub(msg.value);
    uint256 tokenReserve = token.balanceOf(address(this));
    uint256 tokenDeposit;

    tokenDeposit = (msg.value.mul(tokenReserve) / ethReserve).add(1);
    uint256 liquidityMinted = msg.value.mul(totalLiquidity) / ethReserve;
    liquidity[msg.sender] = liquidity[msg.sender].add(liquidityMinted);
    totalLiquidity = totalLiquidity.add(liquidityMinted);

    require(token.transferFrom(msg.sender, address(this), tokenDeposit));
    emit LiquidityProvided(msg.sender, liquidityMinted, msg.value, tokenDeposit);
    return tokenDeposit;
  }

  function withdraw(uint256 amount) public returns (uint256 eth_amount, uint256 token_amount) {
    require(liquidity[msg.sender] >= amount, "withdraw: sender does not have enough liquidity to withdraw.");
    uint256 ethReserve = address(this).balance;
    uint256 tokenReserve = token.balanceOf(address(this));
    uint256 ethWithdrawn;

    ethWithdrawn = amount.mul(ethReserve) / totalLiquidity;

    uint256 tokenAmount = amount.mul(tokenReserve) / totalLiquidity;
    liquidity[msg.sender] = liquidity[msg.sender].sub(amount);
    totalLiquidity = totalLiquidity.sub(amount);
    (bool sent, ) = payable(msg.sender).call{ value: ethWithdrawn }("");
    require(sent, "withdraw(): revert in transferring eth to you!");
    require(token.transfer(msg.sender, tokenAmount));
    emit LiquidityRemoved(msg.sender, amount, ethWithdrawn, tokenAmount);
    return (ethWithdrawn, tokenAmount);
  }

    
}
