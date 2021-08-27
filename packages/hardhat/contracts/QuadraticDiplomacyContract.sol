pragma solidity >=0.6.7 <0.9.0;
pragma experimental ABIEncoderV2;
//SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Distributor.sol";

contract QuadraticDiplomacyContract is Distributor, AccessControl {
    event Vote(address votingAddress, address wallet, uint256 amount);
    event AddMember(address admin, address wallet);

    bytes32 public constant VOTER_ROLE = keccak256("VOTER_ROLE");

    mapping(address => uint256) public votes;

    constructor(address startingAdmin) public {
        _setupRole(DEFAULT_ADMIN_ROLE, startingAdmin);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
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

    function addMember(address wallet) public onlyAdmin {
        grantRole(VOTER_ROLE, wallet);
        emit AddMember(msg.sender, wallet);
    }

    function addMembersWithVotes(
        address[] memory wallets,
        uint256 voteAllocation
    ) public onlyAdmin {
        for (uint256 i = 0; i < wallets.length; i++) {
            addMember(wallets[i]);
            giveVotes(wallets[i], voteAllocation);
        }
    }

    // expose distributor functions
    function shareETH(address[] memory users, uint256[] memory shares)
        public
        onlyAdmin
    {
        _shareETH(users, shares);
    }

    function sharePayedETH(address[] memory users, uint256[] memory shares)
        public
        payable
        onlyAdmin
    {
        // makes sure msg.value has some eth in it
        _sharePayedETH(users, shares);
    }

    function shareToken(
        address[] memory users,
        uint256[] memory shares,
        IERC20 token
    ) public onlyAdmin {
        _shareToken(users, shares, token);
    }

    function sharePayedToken(
        address[] memory users,
        uint256[] memory shares,
        IERC20 token,
        address spender
    ) public onlyAdmin {
        _sharePayedToken(users, shares, token, spender);
    }

    function deposit() public payable {}

    // payable fallback function
    receive() external payable {}

    fallback() external payable {}
}
