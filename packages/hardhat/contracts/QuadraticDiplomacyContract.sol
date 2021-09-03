pragma solidity >=0.6.7 <0.9.0;
pragma experimental ABIEncoderV2;
//SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Distributor.sol";

contract QuadraticDiplomacyContract is Distributor, AccessControl {
    event Vote(address votingAddress, address wallet, uint256 amount);
    event AddMember(address admin, address wallet);
    event NewElection(uint256 blockNumber);

    bytes32 public constant VOTER_ROLE = keccak256("VOTER_ROLE");

    mapping(address => uint256) public votes;

    uint256 public currentElectionStartBlock;

    constructor(address startingAdmin) public {
        _setupRole(DEFAULT_ADMIN_ROLE, startingAdmin);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        currentElectionStartBlock = block.number; 
    }

    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "NOT ADMIN");
        _;
    }

    modifier canVote() {
        require(
            hasRole(VOTER_ROLE, msg.sender),
            "You don't have the permission to vote."
        );
        _;
    }

    modifier startNewElectionAfter(address tokenAddress) {
        _;

        // remove all voter roles
        // an alternative (and less gas heavy?) way to do this would be to change the VOTER_ROLE to keccak256(abi.encodePacked(block.number));

        uint256 memberCount = getRoleMemberCount(VOTER_ROLE);
        for (uint256 i = 0; i < memberCount; i++) {
            revokeRole(VOTER_ROLE, getRoleMember(VOTER_ROLE, 0));
        }

        currentElectionStartBlock = block.number;
        emit NewElection(block.number);
    }

    function vote(address wallet, uint256 amount) private {
        require(votes[msg.sender] >= amount, "Not enough votes left");
        votes[msg.sender] -= amount;
        emit Vote(msg.sender, wallet, amount);
    }

    function voteMultiple(address[] memory wallets, uint256[] memory amounts)
        public
        canVote
    {
        require(wallets.length == amounts.length, "Wrong size");

        for (uint256 i = 0; i < wallets.length; i++) {
            vote(wallets[i], amounts[i]);
        }
    }

    function admin(address wallet, bool value) public onlyAdmin {
        if (value) {
            grantRole(DEFAULT_ADMIN_ROLE, wallet);
        } else {
            revokeRole(DEFAULT_ADMIN_ROLE, wallet);
        }
    }

    function giveVotes(address wallet, uint256 amount) public onlyAdmin {
        votes[wallet] += amount;
    }

    function addSingleMemberWithVotes(address wallet, uint256 voteAmount) public onlyAdmin {
        votes[wallet] = voteAmount;
        grantRole(VOTER_ROLE, wallet);
        emit AddMember(msg.sender, wallet);
    }

    function addMembersWithVotes(
        address[] memory wallets,
        uint256 voteAllocation
    ) public onlyAdmin {
        for (uint256 i = 0; i < wallets.length; i++) {
            addSingleMemberWithVotes(wallets[i], voteAllocation);
        }
    }

    // expose distributor functions
    function shareETH(address[] memory users, uint256[] memory shares)
        public
        onlyAdmin
        startNewElectionAfter(address(0))
    {
        _shareETH(users, shares);
    }

    function sharePayedETH(address[] memory users, uint256[] memory shares)
        public
        payable
        onlyAdmin
        startNewElectionAfter(address(0))
    {
        // makes sure msg.value has some eth in it
        _sharePayedETH(users, shares);
    }

    function shareToken(
        address[] memory users,
        uint256[] memory shares,
        IERC20 token
    ) public onlyAdmin startNewElectionAfter(address(token)) {
        _shareToken(users, shares, token);
    }

    function sharePayedToken(
        address[] memory users,
        uint256[] memory shares,
        IERC20 token,
        address spender
    ) public onlyAdmin startNewElectionAfter(address(token)) {
        _sharePayedToken(users, shares, token, spender);
    }

    function deposit() public payable {}

    // payable fallback function
    receive() external payable {}

    fallback() external payable {}
}
