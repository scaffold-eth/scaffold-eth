//SPDX-License-Identifier: Unlicense
pragma solidity 0.6.7;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


contract PowDAO {
    
     using SafeMath for uint256;

    /***************
    GLOBAL CONSTANTS
    ***************/
    uint256 public periodDuration; // default = 17280 = 4.8 hours in seconds (5 periods per day)
    uint256 public votingPeriodLength; // default = 35 periods (7 days)
    uint256 public summoningTime; // needed to determine the current period
    address[] public approvedTokens; 

    // HARD-CODED LIMITS
    // These numbers are quite arbitrary; they are small enough to avoid overflows when doing calculations
    // with periods or shares, yet big enough to not limit reasonable use cases.
    uint256 constant MAX_VOTING_PERIOD_LENGTH = 10**18; // maximum length of voting period
    uint256 constant MAX_GRACE_PERIOD_LENGTH = 10**18; // maximum length of grace period
    uint256 constant MAX_DILUTION_BOUND = 10**18; // maximum dilution bound
    uint256 constant MAX_NUMBER_OF_SHARES_AND_LOOT = 10**18; // maximum number of shares that can be minted
    uint256 constant MAX_TOKEN_WHITELIST_COUNT = 400; // maximum number of whitelisted tokens
    uint256 constant MAX_TOKEN_GUILDBANK_COUNT = 200; // maximum number of tokens with non-zero balance in guildbank

    // ***************
    // EVENTS
    // ***************
    event SubmitProposal(uint256 paymentRequested, address paymentToken, string details, bool[6] flags, uint256 proposalId, address indexed delegateKey, address indexed memberAddress);
    event SubmitVote(uint256 indexed proposalIndex, address indexed delegateKey, address indexed memberAddress, uint8 uintVote);
    event Ragequit(address indexed memberAddress, uint256 sharesToBurn, uint256 lootToBurn);
    event CancelProposal(uint256 indexed proposalId, address applicantAddress);
    event Withdraw(address indexed memberAddress, address token, uint256 amount);

    // *******************
    // INTERNAL ACCOUNTING
    // *******************
    uint256 public proposalCount = 0; // total proposals submitted
    uint256 public totalShares = 0; // total shares across all members
    uint256 public totalLoot = 0; // total loot across all members

    uint256 public totalGuildBankTokens = 0; // total tokens with non-zero balance in guild bank

    uint256[] public proposalQueue;

    mapping (address => mapping(address => uint256)) public userTokenBalances; // userTokenBalances[userAddress][tokenAddress]


    mapping(address => Member) public members;
    mapping (uint256 => Proposal) public proposals;

    struct Member {
        uint256 shares; // the # of voting shares assigned to this member
        uint256 loot; // the loot amount available to this member (combined with shares on ragequit)
        bool exists; // always true once a member has been created
        uint256 jailed; // set to proposalIndex of a passing guild kick proposal for this member, prevents voting on and sponsoring proposals
    }

    struct Proposal {
        address proposer; // the account that submitted the proposal (can be non-member)
        uint256 paymentRequested; // amount of tokens requested as payment
        address paymentToken; // payment token contract reference
        uint256 startingPeriod; // the period in which voting can start for this proposal
        uint256 yesVotes; // the total number of YES votes for this proposal
        uint256 noVotes; // the total number of NO votes for this proposal
        bool[6] flags; // [sponsored, processed, didPass, cancelled, whitelist, guildkick]
        string details; // proposal details - could be IPFS hash, plaintext, or JSON
        mapping(address => Vote) votesByMember; // the votes on this proposal by each member
    }

    enum Vote {
        Null, // default value, counted as abstention
        Yes,
        No
    }

    modifier onlyMember {
        require(members[msg.sender].shares > 0 || members[msg.sender].loot > 0, "not a member");
        _;
    }
    
    constructor(address[] memory approvedMembers) public {
        for(uint256 i=0; i < approvedMembers.length; i++) {
             members[approvedMembers[i]] = Member(1, 0, true, 0);
        }
    }
    

    // SUBMIT PROPOSAL, public function
    // set Applicant, 
    function submitProposal(
        address applicant,
        uint256 paymentRequested,
        address paymentToken,
        string memory details
    ) public returns (uint256 proposalId) {
        require(applicant != address(0), "applicant cannot be 0");
        require(members[applicant].jailed == 0, "proposal applicant must not be jailed");
        bool[6] memory flags; // [sponsored, processed, didPass, cancelled, whitelist, guildkick]
        _submitProposal(paymentRequested, paymentToken, details, flags);
        return proposalCount - 1; // return proposalId - contracts calling submit might want it
    }

    // Internal submit function
    function _submitProposal(
        uint256 paymentRequested,
        address paymentToken,
        string memory details,
        bool[6] memory flags
    ) internal {
        Proposal storage prop = proposals[proposalCount];
        prop.proposer = msg.sender;
        prop.paymentRequested = paymentRequested;
        prop.paymentToken = paymentToken;
        prop.flags = flags;
        prop.details =details;
        //address memberAddress = memberAddressByDelegateKey[msg.sender];
        address memberAddress = msg.sender;
        // NOTE: argument order matters, avoid stack too deep
        emit SubmitProposal(paymentRequested, paymentToken, details, flags, proposalCount, msg.sender, memberAddress);
        proposalCount += 1;
    }

    // NOTE: requires that delegate key which sent the original proposal cancels, msg.sender == proposal.proposer
    function cancelProposal(uint256 proposalId) public {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.flags[0], "proposal has already been sponsored");
        require(!proposal.flags[3], "proposal has already been cancelled");
        require(msg.sender == proposal.proposer, "solely the proposer can cancel");

        proposal.flags[3] = true; // cancelled
        
        emit CancelProposal(proposalId, msg.sender);
    }

    // NOTE: proposalIndex !== proposalId
    function submitVote(uint256 proposalIndex, uint8 uintVote) public onlyMember {
        //address memberAddress = memberAddressByDelegateKey[msg.sender];
        address memberAddress = msg.sender;
        Member storage member = members[memberAddress];
        
        Proposal storage proposal = proposals[proposalIndex];

        require(uintVote < 3, "must be less than 3");
        Vote vote = Vote(uintVote);

        //require(getCurrentPeriod() >= proposal.startingPeriod, "voting period has not started");
        //require(!hasVotingPeriodExpired(proposal.startingPeriod), "proposal voting period has expired");
        require(proposal.votesByMember[memberAddress] == Vote.Null, "member has already voted");
        require(vote == Vote.Yes || vote == Vote.No, "vote must be either Yes or No");

        proposal.votesByMember[memberAddress] = vote;

        if (vote == Vote.Yes) {
            proposal.yesVotes = proposal.yesVotes.add(member.shares);

        } 
        else if (vote == Vote.No) {
            proposal.noVotes = proposal.noVotes.add(member.shares);
        }
     
        // NOTE: subgraph indexes by proposalId not proposalIndex since proposalIndex isn't set untill it's been sponsored but proposal is created on submission
        emit SubmitVote(proposalIndex, msg.sender, memberAddress, uintVote);
    }

    // Withdraw your balance, public function
    function withdrawBalance(address token, uint256 amount) public {
        _withdrawBalance(token, amount);
    }

    // Withdraw your balance, internal function
    function _withdrawBalance(address token, uint256 amount) internal {
        require(userTokenBalances[msg.sender][token] >= amount, "insufficient balance");
        unsafeSubtractFromBalance(msg.sender, token, amount);
        require(IERC20(token).transfer(msg.sender, amount), "transfer failed");
        emit Withdraw(msg.sender, token, amount);
    }


    /***************
    GETTER FUNCTIONS
    ***************/

    function max(uint256 x, uint256 y) internal pure returns (uint256) {
        return x >= y ? x : y;
    }

    function getCurrentPeriod() public view returns (uint256) {
        return block.timestamp.sub(summoningTime).div(periodDuration);
    }

    function getProposalQueueLength() public view returns (uint256) {
        return proposalQueue.length;
    }

    function getProposalFlags(uint256 proposalId) public view returns (bool[6] memory) {
        return proposals[proposalId].flags;
    }

    function getUserTokenBalance(address user, address token) public view returns (uint256) {
        return userTokenBalances[user][token];
    }

    function getMemberProposalVote(address memberAddress, uint256 proposalIndex) public view returns (Vote) {
        require(members[memberAddress].exists, "member does not exist");
        require(proposalIndex < proposalQueue.length, "proposal does not exist");
        return proposals[proposalQueue[proposalIndex]].votesByMember[memberAddress];
    }

    function getTokenCount() public view returns (uint256) {
        return approvedTokens.length;
    }


    /***************
    HELPER FUNCTIONS
    ***************/
    function unsafeAddToBalance(address user, address token, uint256 amount) internal {
        userTokenBalances[user][token] += amount;
    }

    function unsafeSubtractFromBalance(address user, address token, uint256 amount) internal {
        userTokenBalances[user][token] -= amount;
    }

    function unsafeInternalTransfer(address from, address to, address token, uint256 amount) internal {
        unsafeSubtractFromBalance(from, token, amount);
        unsafeAddToBalance(to, token, amount);
    }

    function hasVotingPeriodExpired(uint256 startingPeriod) public view returns (bool) {
        return getCurrentPeriod() >= startingPeriod.add(votingPeriodLength);
    }
    
}