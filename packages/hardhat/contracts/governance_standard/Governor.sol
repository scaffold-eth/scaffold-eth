// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/governance/GovernorUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorSettingsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorCountingSimpleUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesQuorumFractionUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorTimelockControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract Governor is
	Initializable,
	GovernorUpgradeable,
	GovernorSettingsUpgradeable,
	GovernorCountingSimpleUpgradeable,
	GovernorVotesUpgradeable,
	GovernorVotesQuorumFractionUpgradeable,
	GovernorTimelockControlUpgradeable,
	OwnableUpgradeable,
	UUPSUpgradeable
{
	/// @custom:oz-upgrades-unsafe-allow constructor
	constructor() initializer {}

	function initialize(
		IVotesUpgradeable _token,
		TimelockControllerUpgradeable _timelock,
		uint256 _votingDelay,
		uint256 _votingPeriod,
		uint256 _quorumPercentage
	) public initializer {
		__Governor_init("MyGovernor");
		__GovernorSettings_init(
			_votingDelay, /* Voting Delay: 1 block */
			_votingPeriod, /*Voting Delay: 1 week */
			0 // Proposal Threshold
		);
		__GovernorCountingSimple_init();
		__GovernorVotes_init(_token);
		__GovernorVotesQuorumFraction_init(_quorumPercentage);
		__GovernorTimelockControl_init(_timelock);
		__Ownable_init();
		__UUPSUpgradeable_init();
	}

	function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

	// The following functions are overrides required by Solidity.

	function votingDelay() public view override(IGovernorUpgradeable, GovernorSettingsUpgradeable) returns (uint256) {
		return super.votingDelay();
	}

	function votingPeriod() public view override(IGovernorUpgradeable, GovernorSettingsUpgradeable) returns (uint256) {
		return super.votingPeriod();
	}

	function quorum(uint256 blockNumber)
		public
		view
		override(IGovernorUpgradeable, GovernorVotesQuorumFractionUpgradeable)
		returns (uint256)
	{
		return super.quorum(blockNumber);
	}

	function state(uint256 proposalId)
		public
		view
		override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
		returns (ProposalState)
	{
		return super.state(proposalId);
	}

	function propose(
		address[] memory targets,
		uint256[] memory values,
		bytes[] memory calldatas,
		string memory description
	) public override(GovernorUpgradeable, IGovernorUpgradeable) returns (uint256) {
		return super.propose(targets, values, calldatas, description);
	}

	function proposalThreshold() public view override(GovernorUpgradeable, GovernorSettingsUpgradeable) returns (uint256) {
		return super.proposalThreshold();
	}

	function _execute(
		uint256 proposalId,
		address[] memory targets,
		uint256[] memory values,
		bytes[] memory calldatas,
		bytes32 descriptionHash
	) internal override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) {
		super._execute(proposalId, targets, values, calldatas, descriptionHash);
	}

	function _cancel(
		address[] memory targets,
		uint256[] memory values,
		bytes[] memory calldatas,
		bytes32 descriptionHash
	) internal override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) returns (uint256) {
		return super._cancel(targets, values, calldatas, descriptionHash);
	}

	function _executor() internal view override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) returns (address) {
		return super._executor();
	}

	function supportsInterface(bytes4 interfaceId)
		public
		view
		override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
		returns (bool)
	{
		return super.supportsInterface(interfaceId);
	}
}
