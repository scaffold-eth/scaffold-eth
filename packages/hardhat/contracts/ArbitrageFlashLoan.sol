pragma solidity >=0.6.0 <0.7.0;

import {FlashLoanReceiverBase} from "./FlashLoanReceiverBase.sol";
import {ILendingPool, ILendingPoolAddressesProvider, IERC20} from "./Interfaces.sol";
import {SafeMath} from "./Libraries.sol";
import {IUniswapV2Router02} from "./IUniswapV2Router02.sol";

contract ArbitrageFlashLoan is FlashLoanReceiverBase {
    address public constant UNISWAP_ROUTER_ADDRESS =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address public constant SUSHISWAP_ROUTER_ADDRESS =
        0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F;
    using SafeMath for uint256;
    IUniswapV2Router02 public uniswapRouter;
    IUniswapV2Router02 public sushiswapRouter;
    IERC20 public To_Token_Contract;
    IERC20 public From_Token_Contract;
    address public From_Token;
    address public To_Token;
    uint256 public Lending_Amount;
    address public Owner;

    constructor(
        ILendingPoolAddressesProvider _addressProvider
    ) public FlashLoanReceiverBase(_addressProvider) {
        sushiswapRouter = IUniswapV2Router02(SUSHISWAP_ROUTER_ADDRESS);
        uniswapRouter = IUniswapV2Router02(UNISWAP_ROUTER_ADDRESS);
        Owner = msg.sender;
    }

    function withdrawToken(address tokenAddress) public {
        IERC20 token = IERC20(tokenAddress);
        uint256 tokenBalance = token.balanceOf(address(this));
        token.transfer(Owner, tokenBalance);
    }

    function flashloan(
        address from_Token,
        address to_Token,
        uint256 loan_amount
    ) public {
        From_Token = from_Token;
        To_Token = to_Token;
        Lending_Amount = loan_amount;
        address receiverAddress = address(this);

        address[] memory assets = new address[](1);
        assets[0] = address(From_Token);

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = Lending_Amount;

        uint256[] memory modes = new uint256[](1);
        modes[0] = 0;

        address onBehalfOf = address(this);
        bytes memory params = "";
        uint16 referralCode = 0;

        LENDING_POOL.flashLoan(
            receiverAddress,
            assets,
            amounts,
            modes,
            onBehalfOf,
            params,
            referralCode
        );
    }

    /**
    This function is called after your contract has received the flash loaned amount
  */
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        address[] memory path = new address[](2);
        path[0] = From_Token;
        path[1] = To_Token;
        From_Token_Contract = IERC20(From_Token);
        From_Token_Contract.approve(UNISWAP_ROUTER_ADDRESS, Lending_Amount);
        uniswapRouter.swapExactTokensForTokens(
            Lending_Amount,
            0,
            path,
            address(this),
            block.timestamp + 5
        );

        address[] memory revPath = new address[](2);
        revPath[0] = To_Token;
        revPath[1] = From_Token;
        To_Token_Contract = IERC20(To_Token);
        uint256 Balance = To_Token_Contract.balanceOf(address(this));

        To_Token_Contract.approve(SUSHISWAP_ROUTER_ADDRESS, Balance);
        sushiswapRouter.swapExactTokensForTokens(
            Balance,
            0,
            revPath,
            address(this),
            block.timestamp + 5
        );

        for (uint i = 0; i < assets.length; i++) {
            uint256 amountOwing = amounts[i].add(premiums[i]);
            IERC20(assets[i]).approve(address(LENDING_POOL), amountOwing);
        }

        return true;
    }
}
