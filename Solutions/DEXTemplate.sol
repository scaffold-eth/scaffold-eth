// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title
 * @notice Empty DEX.sol that just outlines what features could be part of the challenge (up to you!)
 * @dev We want to create an automatic market where our contract will hold reserves of both ETH and 🎈 Balloons. These reserves will provide liquidity that allows anyone to swap between the assets.
 */
contract DEX {
    
    /* ========== GLOBAL VARIABLES ========== */


    using SafeMath for uint256; //outlines use of SafeMath for uint256 variables
    IERC20 token; //instantiates the imported contract
    
    /* ========== EVENTS ========== */

    /**
     * @notice Emitted when ethToToken() swap transacted
     */
    event EthToTokenSwap();

    /**
     * @notice Emitted when tokenToEth() swap transacted
     */
    event TokenToEthSwap();

    /**
     * @notice Emitted when liquidity provided to DEX
     */
    event LiquidityProvided(
        
    );

    /**
     * @notice Emitted when liquidity removed from DEX
     */
    event LiquidityRemoved(
        
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
    function init(uint256 tokens) public payable returns (uint256) {}

    /**
     * @notice returns yOutput, or yDelta for xInput (or xDelta)
     * @dev Follow along with the [original tutorial](https://medium.com/@austin_48503/%EF%B8%8F-minimum-viable-exchange-d84f30bd0c90) Price section for an understanding of the DEX's pricing model and for a price function to add to your contract. You may need to update the Solidity syntax (e.g. use + instead of .add, \* instead of .mul, etc). Deploy when you are done.
     */
    function price(
        uint256 xInput,
        uint256 xReserves,
        uint256 yReserves
    ) public view returns (uint256 yOutput) {}

    /**
     * @notice sends Ether to DEX in exchange for $BAL
     */
    function ethToToken() public payable returns (uint256 tokenOutput) {}

    /**
     * @notice sends $BAL tokens to DEX in exchange for Ether
     */
    function tokenToEth(uint256 tokenInput) public returns (uint256 ethOutput) {}
    
    /**
     * @notice allows deposits of $BAL and $ETH to liquidity pool
     * NOTE: Ratio needs to be maintained.
     */
    function deposit() public payable returns (uint256 tokensDeposited) {
    }

    /**
     * @notice allows withdrawal of $BAL and $ETH from liquidity pool
     */
    function withdraw(uint256 amount) public returns (uint256 eth_amount, uint256 token_amount) {
    }
    
}