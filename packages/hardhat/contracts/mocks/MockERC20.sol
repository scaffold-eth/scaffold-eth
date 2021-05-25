//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import {ERC20PermitUpgradeable} from "@openzeppelin/contracts-upgradeable/drafts/ERC20PermitUpgradeable.sol";

/**
 * Mock ERC20
 */
contract MockERC20 is ERC20PermitUpgradeable {

  function init(string memory name_, string memory symbol_, uint8 decimals_) public {
    __ERC20_init_unchained(name_, symbol_);
    _setupDecimals(decimals_);
  }

  function mint(address account, uint256 amount) public {
    _mint(account, amount);
  }  
}
