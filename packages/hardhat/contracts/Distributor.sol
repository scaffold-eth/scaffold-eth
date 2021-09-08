pragma solidity >=0.6.7 <0.9.0;

//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Distributor {
    // utilize safemath for solidity <0.8.0
    using SafeMath for uint256;

    // validate 1-1 relationship between users and shares
    modifier accurateUserSharesRatio(
        address[] memory users,
        uint256[] memory shares
    ) {
        require(users.length == shares.length, "Incorrect distribution ratio");
        _;
    }

    // check provided balance >= total number of shares to distribute
    modifier hasEnoughBalance(uint256[] memory shares, uint256 balance) {
        uint256 totalShares;
        for (uint256 i = 0; i < shares.length; i++) {
            totalShares = totalShares.add(shares[i]);
        }
        // make sure specified balance is greater than totalShares specified
        require(balance >= totalShares, "Not enough eth for distribution");
        _;
    }

    // escrow management functions
    // share ETH from contract account balance
    function _shareETH(address[] memory users, uint256[] memory shares)
        internal
        accurateUserSharesRatio(users, shares)
        hasEnoughBalance(shares, address(this).balance)
    {
        _distribute(users, shares, address(0), address(0));
    }

    // share ERC-20 token from contract balance
    function _shareToken(
        address[] memory users,
        uint256[] memory shares,
        IERC20 token
    )
        internal
        accurateUserSharesRatio(users, shares)
        hasEnoughBalance(shares, token.balanceOf(address(this)))
    {
        _distribute(users, shares, address(token), address(this));
    }

    // user balance management functions
    // share ETH from amount payed by user
    function _sharePayedETH(address[] memory users, uint256[] memory shares)
        internal
        accurateUserSharesRatio(users, shares)
        hasEnoughBalance(shares, msg.value)
    {
        _distribute(users, shares, address(0), address(0));
    }

    // share tokens from approved spender account
    function _sharePayedToken(
        address[] memory users,
        uint256[] memory shares,
        IERC20 token,
        address spender
    )
        internal
        accurateUserSharesRatio(users, shares)
        hasEnoughBalance(shares, token.balanceOf(spender))
    {
        require(
            spender == msg.sender,
            "You can't distribute someone else's token balance"
        );
        require(
            spender != address(this),
            "Use other shareToken method for contract token distribution"
        );

        _distribute(users, shares, address(token), spender);
    }

    function _distribute(
        address[] memory users,
        uint256[] memory shares,
        address token,
        address spender
    ) internal {
        bool isToken = token != address(0) && spender != address(0);
        bool spenderIsContract = address(this) == spender;

        for (uint256 i = 0; i < users.length; i++) {
            // make sure user is not genesis account and shares is greater than 0
            if (users[i] != address(0) && shares[i] > 0) {
                if (isToken) {
                    // send ERC20 token
                    if (spenderIsContract) {
                        // from contract if spender is contract
                        IERC20(token).transfer(users[i], shares[i]);
                    } else {
                        // from spender if spender is not contract
                        IERC20(token).transferFrom(
                            spender,
                            users[i],
                            shares[i]
                        );
                    }
                } else {
                    // transfer ETH otherwise (we do not care if the transfer is successful 
                    // or not, as this would block all other transfers)
                    users[i].call{value: shares[i]}("");
                }
            }
        }
    }
}
