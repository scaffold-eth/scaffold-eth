pragma solidity ^0.8.0;
// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract GovToken is Initializable, ERC20VotesUpgradeable, UUPSUpgradeable, OwnableUpgradeable {
	uint256 public S_MAX_SUPPLY;

	/**
	 * @dev Implementation of the ERC20 Permit extension allowing approvals to be made via signatures, 
	 as defined in https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
	 *
	 * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
	 * presenting a message signed by the account. By not relying on `{IERC20-approve}`, the token holder account doesn't
	 * need to send a transaction, and thus is not required to hold Ether at all.
	 *
	 * _Available since v3.4._
	 
	 gasless approval of tokens (standardized as ERC2612).
	 */

	/// @custom:oz-upgrades-unsafe-allow constructor
	constructor() initializer {}

	function initialize(uint256 _S_MAX_SUPPLY) public initializer {
		S_MAX_SUPPLY = _S_MAX_SUPPLY;
		__ERC20_init("PetroStakeDoa", "PTSD");
		__ERC20Permit_init("PetroStakeDoa");
		__UUPSUpgradeable_init();
		__Ownable_init();
		_mint(msg.sender, S_MAX_SUPPLY);
		console.log("deployer PTSD tokens: %s", balanceOf(msg.sender));
		console.log("deployer address: %s", msg.sender);
	}

	function _authorizeUpgrade(address) internal override onlyOwner {}
}
