// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol';
import '@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol';

/**
 * @notice A Chainlink VRF consumer which uses randomness to mimic the rolling
 * of a 22 sided dice
 */

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract VRFD22 is VRFConsumerBaseV2 {
    uint256 private constant ROLL_IN_PROGRESS = 42;

    VRFCoordinatorV2Interface COORDINATOR;

    // Your subscription ID.
    uint64 s_subscriptionId;

    // Goerli coordinator. For other networks,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    address vrfCoordinator = 0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D;

    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    bytes32 s_keyHash = 0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 40,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 40000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // For this example, retrieve 1 random value in one request.
    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
    uint32 numWords = 1;
    address s_owner;

    // map rollers to requestIds
    mapping(uint256 => address) private s_rollers;
    // map vrf results to rollers
    mapping(address => uint256) private s_results;

    event DiceRolled(uint256 indexed requestId, address indexed roller);
    event DiceLanded(uint256 indexed requestId, uint256 indexed result);

    /**
     * @notice Constructor inherits VRFConsumerBaseV2
     *
     * @dev NETWORK: Goerli
     *
     * @param subscriptionId subscription id that this consumer contract can use
     */
    constructor(uint64 subscriptionId) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_owner = msg.sender;
        s_subscriptionId = subscriptionId;
    }

    /**
     * @notice Requests randomness
     * @dev Warning: if the VRF response is delayed, avoid calling requestRandomness repeatedly
     * as that would give miners/VRF operators latitude about which VRF response arrives first.
     * @dev You must review your implementation details with extreme care.
     *
     * @param roller address of the roller
     */
    function rollDice(address roller) public onlyOwner returns (uint256 requestId) {
        require(s_results[roller] == 0, 'Already rolled');
        // Will revert if subscription is not set and funded.
        requestId = COORDINATOR.requestRandomWords(
            s_keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );

        s_rollers[requestId] = roller;
        s_results[roller] = ROLL_IN_PROGRESS;
        emit DiceRolled(requestId, roller);
    }

    /**
     * @notice Callback function used by VRF Coordinator to return the random number to this contract.
     *
     * @dev Some action on the contract state should be taken here, like storing the result.
     * @dev WARNING: take care to avoid having multiple VRF requests in flight if their order of arrival would result
     * in contract states with different outcomes. Otherwise miners or the VRF operator would could take advantage
     * by controlling the order.
     * @dev The VRF Coordinator will only send this function verified responses, and the parent VRFConsumerBaseV2
     * contract ensures that this method only receives randomness from the designated VRFCoordinator.
     *
     * @param requestId uint256
     * @param randomWords  uint256[] The random result returned by the oracle.
     */
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        uint256 d22Value = (randomWords[0] % 22) + 1;
        s_results[s_rollers[requestId]] = d22Value;
        emit DiceLanded(requestId, d22Value);
    }

    /**
     * @notice Get the mission assigned to the player once the address has rolled
     * @param player address
     * @return mission as a string
     */
    function mission(address player) public view returns (string memory) {
        require(s_results[player] != 0, 'Dice not rolled');
        require(s_results[player] != ROLL_IN_PROGRESS, 'Roll in progress');
        return getMission(s_results[player]);
    }

    /**
     * @notice Get the mission from the id
     * @param id uint256
     * @return mission string
     */
    function getMission(uint256 id) private pure returns (string memory) {
        string[22] memory missions = [
            'Get people to check out a thing you made',
            'Wear a disguise in public',
            'Say "Winter is coming" in an accurate but contextually ominous way',
            'Give someone a body massage',
            'Light a fire AND/OR avoid quicksand',
            'Hide during a conversation',
            'Speak at length about History',
            'Do a barrel roll!!!',
            'Have a discussion about the planes of existence',
            'Grapple with that which is much larger than yourself',
            'Make a valid point about religion',
            'Show how history is yet again repeating itself',
            'Read a stack of books just for fun',
            'Befriend an animal for the first time',
            'Heed the call of the wild',
            'Diagnose an illness',
            'Follow 55 footsteps',
            'Be an arbiter of truth',
            'Influence a creature with an idle threat',
            'Pursuade someone to jam with you',
            'Challenge and win a sporting contest',
            'Document the terrain and local flora'
        ];
        return missions[id - 1];
    }

    modifier onlyOwner() {
        require(msg.sender == s_owner);
        _;
    }
}
