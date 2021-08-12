//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenDistributor is Ownable {
    event shareCompleted(uint256 amount, uint256 share);

    // split contract's own token
    function splitToken(
        address[] memory team,
        uint256 amount,
        ERC20 token
    ) public onlyOwner {
        require(
            token.balanceOf(address(this)) >= amount,
            "You don't have enough token balance for this split"
        );
        uint256 totalMembers = team.length;
        uint256 share = amount / totalMembers;

        for (uint256 i = 0; i < team.length; i++) {
            token.transfer(team[i], share);
        }

        emit shareCompleted(amount, share);
    }

    // contract must be approved spender for selected user
    function splitTokenFromUser(
        address user,
        address[] memory team,
        uint256 amount,
        ERC20 token
    ) public onlyOwner {
        require(
            token.balanceOf(user) >= amount,
            "You don't have enough token balance for this split"
        );
        uint256 totalMembers = team.length;
        uint256 share = amount / totalMembers;

        for (uint256 i = 0; i < team.length; i++) {
            token.transferFrom(user, team[i], share);
        }

        emit shareCompleted(amount, share);
    }
}
