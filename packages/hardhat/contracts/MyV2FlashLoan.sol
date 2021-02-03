// SPDX-License-Identifier: agpl-3.0
pragma solidity >=0.6.0 <0.7.0;

import { FlashLoanReceiverBase } from "./FlashLoanReceiverBase.sol";
import { ILendingPool, ILendingPoolAddressesProvider, IERC20 } from "./Interfaces.sol";
import { SafeMath } from "./Libraries.sol";

import "./IUniswapV2Router02.sol";
import "hardhat/console.sol";


/** 
    !!!
    Never keep funds permanently on your FlashLoanReceiverBase contract as they could be 
    exposed to a 'griefing' attack, where the stored funds are used by an attacker.
    !!!
 */
contract MyV2FlashLoan is FlashLoanReceiverBase {
    address internal constant UNISWAP_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    IUniswapV2Router02 public uniswapRouter;
    address private multiDaiKovan = 0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD;


    using SafeMath for uint256;

    constructor(ILendingPoolAddressesProvider _addressProvider) FlashLoanReceiverBase(_addressProvider) public {
          uniswapRouter = IUniswapV2Router02(UNISWAP_ROUTER_ADDRESS);
    }

    function convertEthToDai(uint daiAmount) public payable {
    uint deadline = block.timestamp + 15; // using 'now' for convenience, for mainnet pass deadline from frontend!
    uint256 lev = uniswapRouter.swapETHForExactTokens{ value: msg.value }(daiAmount, getPathForETHtoDAI(), address(this), deadline);
    require(daiToken.transfer(msg.sender, daiToken.balanceOf(address(this)));
    console.log(lev);
    
    // refund leftover ETH to user
    // (bool success,) = msg.sender.call{ value: address(this).balance }("");
    // require(success, "refund failed");
  }

    function getEstimatedETHforDAI(uint daiAmount) public view returns (uint[] memory) {
    return uniswapRouter.getAmountsIn(daiAmount, getPathForETHtoDAI());
  }

  function getPathForETHtoDAI() private view returns (address[] memory) {
    address[] memory path = new address[](2);
    path[0] = uniswapRouter.WETH();
    path[1] = multiDaiKovan;
    
    return path;
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

        //
        // This contract now has the funds requested.
        // Your logic goes here.
        //

        // At the end of your logic above, this contract owes
        // the flashloaned amounts + premiums.
        // Therefore ensure your contract has enough to repay
        // these amounts.

        // Approve the LendingPool contract allowance to *pull* the owed amount
        for (uint i = 0; i < assets.length; i++) {
            uint amountOwing = amounts[i].add(premiums[i]);
            IERC20(assets[i]).approve(address(LENDING_POOL), amountOwing);
        }

        return true;
    }

    function myFlashLoanCall() public {
        address receiverAddress = address(this);

        address[] memory assets = new address[](1);
        assets[0] = address(0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD); // Kovan DAI
        // assets[0] = address(0xB597cd8D3217ea6477232F9217fa70837ff667Af); // Kovan AAVE
        // assets[1] = address(0x2d12186Fbb9f9a8C28B3FfdD4c42920f8539D738); // Kovan BAT
        // assets[2] = address(0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD); // Kovan DAI
        // assets[3] = address(0x075A36BA8846C6B6F53644fDd3bf17E5151789DC); // Kovan UNI
        // assets[4] = address(0xb7c325266ec274fEb1354021D27FA3E3379D840d); // Kovan YFI
        // assets[5] = address(0xAD5ce863aE3E4E9394Ab43d4ba0D80f419F61789); // Kovan LINK
        // assets[6] = address(0x7FDb81B0b8a010dd4FFc57C3fecbf145BA8Bd947); // Kovan SNX

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 0.001 ether;
        // amounts[1] = 0.000 ether;
        // amounts[2] = 0.000 ether;
        // amounts[3] = 0.000 ether;
        // amounts[4] = 0.000 ether;
        // amounts[5] = 0.000 ether;
        // amounts[6] = 0.000 ether;

        // 0 = no debt, 1 = stable, 2 = variable
        uint256[] memory modes = new uint256[](1);
        modes[0] = 0;
        // modes[1] = 0;
        // modes[2] = 0;
        // modes[3] = 0;
        // modes[4] = 0;
        // modes[5] = 0;
        // modes[6] = 0;

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

    fallback() external payable {

    }
}
