// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/governance/TimelockControllerUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

//timelock is how long to wait before exection, post vote
//sets governaance roles
contract TimeLock is Initializable, UUPSUpgradeable, TimelockControllerUpgradeable {
	//
	/**

/  bytes32 public constant TIMELOCK_ADMIN_ROLE = keccak256("TIMELOCK_ADMIN_ROLE");
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    bytes32 public constant CANCELLER_ROLE = keccak256("CANCELLER_ROLE");
    function __TimelockController_init(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors
        _setRoleAdmin(TIMELOCK_ADMIN_ROLE, TIMELOCK_ADMIN_ROLE);
        _setRoleAdmin(PROPOSER_ROLE, TIMELOCK_ADMIN_ROLE);
        _setRoleAdmin(EXECUTOR_ROLE, TIMELOCK_ADMIN_ROLE);

        // deployer + self administration
        _setupRole(TIMELOCK_ADMIN_ROLE, _msgSender());
        _setupRole(TIMELOCK_ADMIN_ROLE, address(this));

        // register proposers
        for (uint256 i = 0; i < proposers.length; ++i) {
            _setupRole(PROPOSER_ROLE, proposers[i]);
        }

        // register executors
        for (uint256 i = 0; i < executors.length; ++i) {
            _setupRole(EXECUTOR_ROLE, executors[i]);
        }

        _minDelay = minDelay;
        emit MinDelayChange(0, minDelay);
    }
 */
	constructor() {}

	/***
@dev Function replaces constructor and passes values to the parent TimelockController
TimelockController iterateres through address of proposers and sets then as proposers
iterateres through address of executors and sets then as executors 
sets deployer and address(this) as timeLockAdmin, which has admin over propers and executors
 */
	function initialize(
		uint256 minDelay,
		address[] memory proposers,
		address[] memory executors
	) external initializer {
		//passing variables to init is the same as passing to the parent contract's constructor
		__UUPSUpgradeable_init();
		__TimelockController_init(minDelay, proposers, executors);
		console.log("TimeLock contract deployed by msgSender(): %s:", msg.sender);
	}

	function _authorizeUpgrade(address newImplementation) internal override onlyRole(TIMELOCK_ADMIN_ROLE) {}
}
