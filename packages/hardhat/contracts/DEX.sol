pragma solidity >=0.8.0 <0.9.0;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title DEX
 * @author Steve P.
 * @notice this is a single token pair reserves DEX, ref: "Scaffold-ETH Challenge 2" as per https://speedrunethereum.com/challenge/token-vendor
 */
contract DEX {
    uint256 public totalLiquidity; //BAL token total liquidity in this contract
    mapping(address => uint256) public liquidity;

    using SafeMath for uint256; //outlines use of SafeMath for uint256 variables
    IERC20 token; //instantiates the imported contract

    /* ========== EVENTS ========== */

    /**
     * @notice Emitted when ethToToken() swap transacted
     */
    event EthToTokenSwap(address _swapper, uint256 tokenOutput, uint256 ethInput);

    /**
     * @notice Emitted when tokenToEth() swap transacted
     */
    event TokenToEthSwap(address _swapper, uint256 ethOutput, uint256 tokensInput);

    /**
     * @notice Emitted when liquidity provided to DEX
     */
    event LiquidityProvided(
        address _liquidityProvider,
        uint256 ethInput,
        uint256 tokensInput,
        uint256 newLiquidityPosition,
        uint256 liquidityMinted,
        uint256 totalLiquidity
    );

    /**
     * @notice Emitted when liquidity removed from DEX
     */
    event LiquidityRemoved(
        address _liquidityRemover,
        uint256 ethOutput,
        uint256 tokensOutput,
        uint256 newLiquidityPosition,
        uint256 liquidityWithdrawn,
        uint256 totalLiquidity
    );

    /* ========== CONSTRUCTOR ========== */

    constructor(address token_addr) public {
        token = IERC20(token_addr); //specifies the token address that will hook into the interface and be used through the variable 'token'
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    /**
     * @notice initializes amount of tokens that will be transferred to the DEX itself from the erc20 contract mintee (and only them based on how Balloons.sol is written). Loads contract up with both ETH and Balloons.
     * @param tokens amount to be transferred to DEX
     * @return totalLiquidity is the balance of this DEX contract
     * NOTE: since ratio is 1:1, this is fine to initialize the totalLiquidity (wrt to balloons) as equal to eth balance of contract.
     */
    function init(uint256 tokens) public payable returns (uint256) {
        require(totalLiquidity == 0, "DEX: init - already has liquidity");
        totalLiquidity = address(this).balance;
        liquidity[msg.sender] = totalLiquidity;
        require(token.transferFrom(msg.sender, address(this), tokens), "DEX: init - transfer did not transact");
        return totalLiquidity;
    }

    /**
     * @notice returns yOutput, or yDelta for xInput (or xDelta)
     */
    function price(
        uint256 xInput,
        uint256 xReserves,
        uint256 yReserves
    ) public view returns (uint256 yOutput) {
        uint256 xInputWithFee = xInput.mul(997);
        uint256 numerator = xInputWithFee.mul(yReserves);
        uint256 denominator = (xReserves.mul(1000)).add(xInputWithFee);
        return (numerator / denominator);
    }

    /**
     * @notice sends Ether to DEX in exchange for $BAL
     */
    function ethToToken() public payable returns (uint256 tokenOutput) {
        //  require(msg.value > 0, "ethToToken: can't trade 0");
        uint256 ethReserve = address(this).balance.sub(msg.value);
        uint256 token_reserve = token.balanceOf(address(this));
        uint256 tokenOutput = price(msg.value, ethReserve, token_reserve);

        //  totalLiquidity = totalLiquidity.sub(tokenOutput); //update totalLiquidity? I guess you don't because even though liquidity is changing... it isn't in a macro-scale? We still have the same amount of liquidity in "total" but just different asset ratios.
        require(token.transfer(msg.sender, tokenOutput), "ethToToken(): reverted swap.");
        return tokenOutput;
        emit EthToTokenSwap(msg.sender, tokenOutput, msg.value);
    }

    /**
     * @notice sends $BAL tokens to DEX in exchange for Ether
     */
    function tokenToEth(uint256 tokenInput) public returns (uint256 ethOutput) {
        //  require(tokenInput > 0, "tokenToEth: can't trade 0");
        uint256 token_reserve = token.balanceOf(address(this));

        uint256 ethOutput = price(tokenInput, token_reserve, address(this).balance);

        //  totalLiquidity = totalLiquidity.add(tokenInput); //update totalLiquidity
        require(token.transferFrom(msg.sender, address(this), tokenInput), "tokenToEth(): reverted swap.");
        (bool sent, ) = msg.sender.call{ value: ethOutput }("");
        require(sent, "tokenToEth: revert in transferring eth to you!");
        return ethOutput;
        emit TokenToEthSwap(msg.sender, ethOutput, tokenInput);
    }

    /**
     * @notice allows deposits of $BAL and $ETH to liquidity pool
     * NOTE: Ratio needs to be maintained.
     */
    function deposit() public payable returns (uint256 tokensDeposited) {
        uint256 ethReserve = address(this).balance.sub(msg.value);
        uint256 tokenReserve = token.balanceOf(address(this));
        uint256 tokenDeposit;

        tokenDeposit = msg.value.mul((tokenReserve / ethReserve)).add(1);
        uint256 liquidityMinted = msg.value.mul(totalLiquidity / ethReserve);
        liquidity[msg.sender] = liquidity[msg.sender].add(liquidityMinted);
        totalLiquidity = totalLiquidity.add(liquidityMinted);

        require(token.transferFrom(msg.sender, address(this), tokenDeposit));
        return tokenDeposit;
        emit LiquidityProvided(
            msg.sender,
            msg.value,
            tokenDeposit,
            liquidity[msg.sender],
            liquidityMinted,
            totalLiquidity
        );
    }

    /**
     * @notice allows withdrawal of $BAL and $ETH from liquidity pool
     */
    function withdraw(uint256 amount) public returns (uint256 eth_amount, uint256 token_amount) {
        uint256 ethReserve = address(this).balance;
        uint256 tokenReserve = token.balanceOf(address(this));
        uint256 ethWithdrawn;

        ethWithdrawn = amount.mul((ethReserve / totalLiquidity));

        uint256 tokenAmount = amount.mul(tokenReserve) / totalLiquidity;
        liquidity[msg.sender] = liquidity[msg.sender].sub(ethWithdrawn);
        totalLiquidity = totalLiquidity.sub(ethWithdrawn);
        (bool sent, ) = msg.sender.call{ value: ethWithdrawn }("");
        require(sent, "withdraw(): revert in transferring eth to you!");
        require(token.transfer(msg.sender, tokenAmount));

        return (ethWithdrawn, tokenAmount);
        emit LiquidityRemoved(
            msg.sender,
            ethWithdrawn,
            tokenAmount,
            liquidity[msg.sender],
            ethWithdrawn,
            totalLiquidity
        );
    }
}