pragma solidity >=0.6.0 <0.7.0;

import "hardhat/console.sol";

import { FlashLoanReceiverBase } from "./FlashLoanReceiverBase.sol";
import { ILendingPool, ILendingPoolAddressesProvider, IERC20 } from "./Interfaces.sol";
import { SafeMath } from "./Libraries.sol";
import { Constants } from "./Constants.sol";
import { IUniswapV2Router02 } from "./IUniswapV2Router02.sol";

contract MyV2FlashLoan is FlashLoanReceiverBase {
  uint256 private loanSize = 500 ether;

  using SafeMath for uint256;

  IUniswapV2Router02 public uniswapRouter;
  IUniswapV2Router02 public sushiswapRouter;

  IERC20 public DAI_ERC20;
  IERC20 public WETH_ERC20;

  constructor(ILendingPoolAddressesProvider _addressProvider) FlashLoanReceiverBase(_addressProvider) public {
    sushiswapRouter = IUniswapV2Router02(Constants.SUSHISWAP_ROUTER_ADDRESS);
    uniswapRouter = IUniswapV2Router02(Constants.UNISWAP_ROUTER_ADDRESS);

    DAI_ERC20 = IERC20(Constants.DAI_ADDRESS);
    WETH_ERC20 = IERC20(Constants.WETH_ADDRESS);
  }

  /**
    This is helper function to let us know how much DAI and WETH we have at some moment
  */
  function printBalances() private {
    console.log("DAI: ", DAI_ERC20.balanceOf(address(this)));
    console.log("WETH: ", WETH_ERC20.balanceOf(address(this)));
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
  )
    external
    override
    returns (bool)
  {
    printBalances();

    address[] memory path = new address[](2);
    path[0] = Constants.DAI_ADDRESS;
    path[1] = Constants.WETH_ADDRESS;

    DAI_ERC20.approve(Constants.UNISWAP_ROUTER_ADDRESS, loanSize);
    uniswapRouter.swapExactTokensForTokens(loanSize, 0, path, address(this), block.timestamp + 5);

    printBalances();

    address[] memory revPath = new address[](2);
    revPath[0] = Constants.WETH_ADDRESS;
    revPath[1] = Constants.DAI_ADDRESS;

    uint256 WETHBalance = WETH_ERC20.balanceOf(address(this));

    WETH_ERC20.approve(Constants.SUSHISWAP_ROUTER_ADDRESS, WETHBalance);
    sushiswapRouter.swapExactTokensForTokens(WETHBalance, 0, revPath, address(this), block.timestamp + 5);

    printBalances();

    for (uint i = 0; i < assets.length; i++) {
      uint256 amountOwing = amounts[i].add(premiums[i]);
      IERC20(assets[i]).approve(address(LENDING_POOL), amountOwing);
    }

    return true;
  }

  function myFlashLoanCall() public {
    address receiverAddress = address(this);

    address[] memory assets = new address[](1);
    assets[0] = address(Constants.DAI_ADDRESS);

    uint256[] memory amounts = new uint256[](1);
    amounts[0] = loanSize;

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
}
