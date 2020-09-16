pragma solidity >=0.6.6 <0.7.0;

import "@nomiclabs/buidler/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IDonorManager.sol";
import "./Math.sol";

/// Capital-constrained Liberal Radicalism
contract CLR is Ownable {
    using SafeMath for uint256;

    struct Recipient {
        address payable addr;
        // could be name or hash of other useful information
        string data;
        uint256 totalDonation;
        // help with quadratic matching calculation
        uint256 sumOfSqrtDonation;
        // matchingWeight = sumOfSqrtDonation * sumOfSqrtDonation
        // matching = matchingPool * matchingWeight / totalMatchingWeight
        uint256 matchingWeight;
        bool withdrawn;
    }

    Recipient[] public recipients;

    uint256 public matchingPool;

    IDonorManager public donorManager;

    uint256 public roundStart;
    uint256 public roundDuration = 2 minutes;

    // used to calculate matching
    uint256 public calculatedToIndex;
    uint256 public totalMatchingWeight;

    event RoundStarted(uint256 roundStart, uint256 roundDuration);
    event RecipientAdded(address addr, string data, uint256 index);
    event MatchingPoolDonated(uint256 matchingPool);
    event MatchingCalculated();

    modifier beforeRoundOpen() {
        require(roundStart == 0, "Round already opened");
        _;
    }

    modifier isRoundOpen() {
        require(
            getBlockTimestamp() < roundStart.add(roundDuration),
            "Round is not open"
        );
        _;
    }

    modifier isRoundClosed() {
        require(
            roundStart != 0 &&
                getBlockTimestamp() >= roundStart.add(roundDuration),
            "Round is not closed"
        );
        _;
    }

    constructor(address donorManager_) public {
        donorManager = IDonorManager(donorManager_);
    }

    function startRound(uint256 _roundDuration)
        public
        onlyOwner
        beforeRoundOpen
    {
        roundStart = getBlockTimestamp();
        roundDuration = _roundDuration;
        emit RoundStarted(roundStart, roundDuration);
    }

    function getBlockTimestamp() public view returns (uint256) {
        return block.timestamp;
    }

    function addRecipient(address payable addr, string memory data)
        public
        onlyOwner
        beforeRoundOpen
        returns (uint256)
    {
        Recipient memory r = Recipient({
            addr: addr,
            data: data,
            totalDonation: 0,
            sumOfSqrtDonation: 0,
            matchingWeight: 0,
            withdrawn: false
        });
        recipients.push(r);

        uint256 index = recipients.length - 1;
        emit RecipientAdded(addr, data, index);
        return index;
    }

    function donate(uint256 index) public payable isRoundOpen {
        if (!donorManager.canDonate()) return;

        recipients[index].totalDonation = recipients[index].totalDonation.add(
            msg.value
        );
        recipients[index].sumOfSqrtDonation = recipients[index]
            .sumOfSqrtDonation
            .add(Math.sqrt(msg.value));
    }

    // this function could be run in multiple steps paying attention to msg.gas (remaining gas)
    function calculateMatching(uint256 toIndex) public isRoundClosed {
        require(
            calculatedToIndex < recipients.length,
            "CLR:calculate already finished calculating"
        );

        if (toIndex > recipients.length) {
            toIndex = recipients.length;
        }
        for (uint256 i = calculatedToIndex; i < toIndex; i++) {
            recipients[i].matchingWeight = recipients[i].sumOfSqrtDonation.mul(
                recipients[i].sumOfSqrtDonation
            );
            totalMatchingWeight = totalMatchingWeight.add(
                recipients[i].matchingWeight
            );
        }

        calculatedToIndex = toIndex;
        if (calculatedToIndex >= recipients.length) {
            emit MatchingCalculated();
        }
    }

    function recipientWithdraw(uint16 index)
        public
        isRoundClosed
        returns (uint256)
    {
        require(
            calculatedToIndex >= recipients.length,
            "CLR:withdraw haven't finished calculating yet"
        );
        require(!recipients[index].withdrawn, "CLR:withdraw already withdrawn");

        recipients[index].withdrawn = true;

        // TODO: I'm not sure this adds up to the contract's balance
        uint256 matching = (matchingPool * recipients[index].matchingWeight) /
            totalMatchingWeight;
        uint256 payout = recipients[index].totalDonation + matching;
        recipients[index].addr.transfer(payout);
        return payout;
    }

    // receive donation for the matching pool
    receive() external payable isRoundOpen {
        matchingPool = matchingPool.add(msg.value);
        emit MatchingPoolDonated(matchingPool);
        console.log(
            _msgSender(),
            "contributed to the matching pool",
            msg.value
        );
    }
}
