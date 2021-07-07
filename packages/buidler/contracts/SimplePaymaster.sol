pragma solidity ^0.6.10;
pragma experimental ABIEncoderV2;

// SPDX-License-Identifier: MIT OR Apache-2.0

import "@opengsn/gsn/contracts/forwarder/IForwarder.sol";
import "@opengsn/gsn/contracts/BasePaymaster.sol";

contract SimplePaymaster is BasePaymaster {
	mapping (address => bool) public targetContracts;

	// allow the owner to set ourTarget
	event TargetSet(address target, bool active);

	function setTarget(address _target, bool _active) external onlyOwner {
		targetContracts[_target] = _active;
		emit TargetSet(_target, _active);
	}

	event PreRelayed(uint);
	event PostRelayed(uint);

	function preRelayedCall(
		GsnTypes.RelayRequest calldata relayRequest,
		bytes calldata signature,
		bytes calldata approvalData,
		uint256 maxPossibleGas
	) external override virtual
	returns (bytes memory context, bool) {
		_verifyForwarder(relayRequest);
		(signature, approvalData, maxPossibleGas);

		require(targetContracts[relayRequest.request.to]);
		emit PreRelayed(now);
                return (abi.encode(now), false);
	}

	function postRelayedCall(
		bytes calldata context,
		bool success,
		uint256 gasUseWithoutPost,
		GsnTypes.RelayData calldata relayData
	) external override virtual {
                (context, success, gasUseWithoutPost, relayData);
		emit PostRelayed(abi.decode(context, (uint)));
	}

  function versionPaymaster() external virtual view override returns (string memory) {
    return "2.0.3";
  }

}
