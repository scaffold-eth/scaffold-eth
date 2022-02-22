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
  event LiquidityProvided(address liquidityProvider, uint256 tokensInput, uint256 ethInput, uint256 liquidityMinted);
  event LiquidityRemoved( address liquidityRemover, uint256 tokensOutput, uint256 ethOutput, uint256 liquidityWithdrawn);

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

    // function ethToToken() public payable returns (uint256) {
    //     require(msg.value > 0, "cannot swap 0 ETH");
    //     uint256 ethReserve = address(this).balance.sub(msg.value);
    //     uint256 token_reserve = token.balanceOf(address(this));
    //     uint256 tokenOutput = price(msg.value, ethReserve, token_reserve);

    //     require(token.transfer(msg.sender, tokenOutput), "ethToToken(): reverted swap.");
    //     emit EthToTokenSwap(msg.sender, "Eth to Balloons", msg.value, tokenOutput);
    //     return tokenOutput;
    // }


  function tokenToEth(uint256 tokens) public payable returns (uint256 eth_bought) {
    uint256 token_reserve = token.balanceOf(address(this));
    eth_bought = price(tokens, token_reserve, address(this).balance);
    //uint256 tokens_sold = eth_bought;
    payable(msg.sender).transfer(eth_bought);
    require(token.transferFrom(msg.sender, address(this), tokens));
    emit TokenToEthSwap(msg.sender, "Balloons to ETH", eth_bought, tokens);
    //Address | Trade | AmountIn | AmountOut
    return eth_bought;
  }

  function deposit() public payable returns (uint256 liquidity_minted) {
    uint256 eth_reserve = address(this).balance.sub(msg.value);
    uint256 token_reserve = token.balanceOf(address(this));
    uint256 token_amount = (msg.value.mul(token_reserve) / eth_reserve).add(1);
    liquidity_minted = msg.value.mul(totalLiquidity) / eth_reserve;
    liquidity[msg.sender] = liquidity[msg.sender].add(liquidity_minted);
    totalLiquidity = totalLiquidity.add(liquidity_minted);
    require(token.transferFrom(msg.sender, address(this), token_amount));
    emit LiquidityProvided(msg.sender, token_amount, msg.value, liquidity_minted);
    return liquidity_minted;
  }

  function withdraw(uint256 _amount) public returns (uint256 eth_amount, uint256 token_amount) {
        uint256 tokenReserve = token.balanceOf(address(this));
        uint256 ethAmount = _amount.mul(address(this).balance) / totalLiquidity;
        uint256 tokenAmount = _amount.mul(tokenReserve) / totalLiquidity;
        
// I made changes to below two lines. Instead of eth_amount I used liquidity amount requested by sender.
        liquidity[msg.sender] = liquidity[msg.sender].sub(_amount);
        totalLiquidity = totalLiquidity.sub(_amount);
        emit LiquidityRemoved(msg.sender, _amount, ethAmount, tokenAmount);
      
  (bool sent, ) = payable(msg.sender).call{value: ethAmount}("");
        require(sent, "Eth transfer failed");
        require(token.transfer(msg.sender, tokenAmount));
        return (ethAmount, tokenAmount);
    }
}
