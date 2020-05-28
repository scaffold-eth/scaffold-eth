pragma solidity ^0.6.6;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MVD is ERC20 {

  IERC20 token; // address of the ERC20 token traded on this contract

  constructor(address token_addr) ERC20("MVD","MVD") public {
    token = IERC20(token_addr);
  }

  fallback() external payable {
    ethToToken(msg.value, 1, block.timestamp, msg.sender, msg.sender);
  }

  function getPrice(uint256 input_amount, uint256 input_reserve, uint256 output_reserve) public view returns (uint256) {
    require(input_reserve > 0 && output_reserve > 0, "INVALID_VALUE");
    uint256 input_amount_with_fee = input_amount.mul(997);
    uint256 numerator = input_amount_with_fee.mul(output_reserve);
    uint256 denominator = input_reserve.mul(1000).add(input_amount_with_fee);
    return numerator / denominator;
  }

  function ethToToken(uint256 eth_sold, uint256 min_tokens, uint256 deadline, address buyer, address recipient) private returns (uint256) {
    require(deadline >= block.timestamp && eth_sold > 0 && min_tokens > 0);
    uint256 token_reserve = token.balanceOf(address(this));
    uint256 tokens_bought = getPrice(eth_sold, address(this).balance.sub(eth_sold), token_reserve);
    require(tokens_bought >= min_tokens);
    require(token.transfer(recipient, tokens_bought));
    //emit TokenPurchase(buyer, eth_sold, tokens_bought);
    return tokens_bought;
  }

  function tokenPrice(uint256 eth_sold) public view returns (uint256) {
    require(eth_sold > 0);
    uint256 token_reserve = token.balanceOf(address(this));
    return getPrice(eth_sold, address(this).balance, token_reserve);
  }

  function init(uint256 tokens) public payable returns (uint256) {
    require(msg.value > 0, 'MVD#init: YOU MUST INIT WITH VALUE');
    uint256 initial_liquidity = address(this).balance;
    _mint(msg.sender,initial_liquidity);
    require(token.transferFrom(msg.sender, address(this), tokens));
    //emit AddLiquidity(msg.sender, msg.value, token_amount);
    emit Transfer(address(0), msg.sender, initial_liquidity);
    return initial_liquidity;
  }

  function deposit(uint256 tokens) public payable returns (uint256) {
    require(msg.value > 0, 'MVD#deposit: YOU MUST DEPOSIT VALUE');
    uint256 total_liquidity = totalSupply();
    uint256 eth_reserve = address(this).balance.sub(msg.value);
    uint256 token_reserve = token.balanceOf(address(this));
    uint256 token_amount = (msg.value.mul(token_reserve) / eth_reserve).add(1);
    uint256 liquidity_minted = msg.value.mul(total_liquidity) / eth_reserve;
    _mint(msg.sender,liquidity_minted);
    require(token.transferFrom(msg.sender, address(this), token_amount));
    //emit AddLiquidity(msg.sender, msg.value, token_amount);
    //emit Transfer(address(0), msg.sender, liquidity_minted);
    return liquidity_minted;
  }

  function withdraw(uint256 amount) public returns (uint256, uint256) {
    require(amount > 0, "MVD#withdraw: you must specify an amount");
    uint256 total_liquidity = totalSupply();
    require(total_liquidity > 0);
    uint256 token_reserve = token.balanceOf(address(this));
    uint256 eth_amount = amount.mul(address(this).balance) / total_liquidity;
    uint256 token_amount = amount.mul(token_reserve) / total_liquidity;
    _burn(msg.sender,amount);
    msg.sender.transfer(eth_amount);
    require(token.transfer(msg.sender, token_amount));
    //emit RemoveLiquidity(msg.sender, eth_amount, token_amount);
    // emit Transfer(msg.sender, address(0), amount);
    return (eth_amount, token_amount);
  }


}
