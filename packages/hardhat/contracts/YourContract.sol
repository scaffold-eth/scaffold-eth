pragma solidity >=0.6.0 <0.7.0;

import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

/// @title A wallet which has inheritance built in on the Ethereum Blockchain.
/// @author Shebin John
/// @notice Use this contract as a hot wallet without any worry about passing it on to the next generation.
/// @dev This is an alpha version, it is not yet audited, use with caution.

contract YourContract {
    /* is IArbitrable, IEvidence { */
      /*  Contract Variables  */

      /* uint256 public voteCount; // This counts the yes votes for a heir claim. */
      uint256 public claimTime; // The time when the claim was started. Default is zero. Set at the time of claim call.
      /* uint256 public charityTime; // The time when the charity was initiated. Set at the time of initiation. */
      /* uint256 public disputeTime; // The time when the dispute was initiated. Set at the time of initiation. */
      /* uint256 public arbitrationFee; // The ETH required for arbitration, in wei. */
      // Below deadline can be changed at the time of contract creation.
      // Deadline also works for owner to reclaim if the heir colluded with approvers.
      uint256 public heirDeadline = 30 days; // Wait time for the heir without approvers approval. Default is 30 days.
      uint256 public heirApprovedDeadline = 7 days; // Wait time for the heir with approvers approval. Default is 7 days.
      /* uint256 public charityDeadline = 45 days; // Wait time for the charity with approver initiation. Default is 45 days. */
      /* uint256 public arbitrationFeeDepositTime = 7 days; */
      /* uint256 constant metaevidenceID = 0; // Unique identifier of meta-evidence. */
      /* uint256 constant evidenceGroupID = 0; // Unique identifier of the evidence group the evidence belongs to. */

      address public owner; // The owner of this contract wallet.
      /* address public backupOwner; // The backup owner, same as owner of this wallet, but with a different address. */
      address payable public heir; // The heir of this contract.
      uint256 public timestampDeadSwitch;
      /* address public charity; // The charity decided by the owner. */
      /* address public charityInitiator; // The approver who initiated the charity. */
      /* address payable public disputeInitiator; // The approver who initiated the dispute. */
      /* IArbitrator public arbitrator; */

      // Different types of Contract State.
      enum Status {
          Initial,
          DeadSwitchEx,
          HeirClaimed
          /* ClaimDisputed,
          DisputeResultPending,
          ApproverApproved,
          ArbitratorApproved,
          ArbitratorRejected,
          InitiatedCharity */
      }
      Status public status; // The current status of the contract.

      /* enum ClaimRulingOptions {RefusedToArbitrate, OwnerWins, HeirWins} */
      /* uint256 constant numberOfClaimRulingOptions = 2; // Notice that option 0 is reserved for RefusedToArbitrate. */

      /* mapping(address => bool) public approverStatus; // Whether the approver is valid or not. */
      /* mapping(address => bool) public voted; // Whether the approver has voted or not. */

      mapping(address => uint) public shares; // Proportional of inheritance

      address[] public approvers; // Array of approver addresses.
      bytes public arbitratorExtraData; // Extra data to set up the arbitration.

      address[] public beneficiaries;

      /*  Events  */

      ///	@dev This event is used to notify the contract creation.
      ///	@ _owner The owner of this contract.
      ///	@ _heir The heir of this contract.
      /// @ _charity The charity address preferred by Owner.
      /// @ _arbitrator The arbitrator address for this contract wallet.
      ///	@ _approverCount The no. of approvers added to the contract.
      ///	@ _heirDeadline The wait time for heir to claim without approval from approvers.
      ///	@ _heirApprovedDeadline The wait time for heir to claim with approval from approvers.
      ///	@ _charityDeadline The wait time for charity to claim with initiation from approvers.
      /// @ _arbitratorExtraData Extra data for the arbitrator.
      event contractCreated(
          address indexed _owner,
          /* address indexed _backupOwner, */
          address indexed _heir,
          uint256 timestampDeadSwitch
          /* address _charity,
          IArbitrator _arbitrator,
          uint256 _approverCount,
          uint256 _heirDeadline,
          uint256 _heirApprovedDeadline,
          uint256 _charityDeadline,
          bytes _arbitratorExtraData */
      );

      ///	@dev This event is used to notify that the backup owner has been updated.
      ///	@ _newBackupOwner The new backup owner address.
      ///	@ _owner The owner who made this change.
      /* event backupOwnerUpdated(
          address indexed _newBackupOwner,
          address indexed _owner
      ); */

      ///	@dev The event is used to notify that the heir has been updated and any claim has been reset.
      ///	@ _newHeir The new heir address.
      ///	@ _owner The owner who made this change.
      event heirUpdated(address indexed _newHeir, address indexed _owner);

      ///	@dev The event is used to notify that the charity has been updated.
      ///	@ _charity The new charity address.
      ///	@ _changer The one who made the change. It can be either owner or approver.
      /* event charityUpdated(address indexed _charity, address indexed _changer); */

      ///	@dev The event is used to notify that the arbitrator has been updated.
      ///	@ _arbitrator The new arbitrator address.
      ///	@ _owner The owner who made this change.
      /* event arbitratorUpdated(
          IArbitrator indexed _arbitrator,
          address indexed _owner
      ); */

      ///	@dev The event is used to notify that the arbitrator has been updated.
      ///	@ _arbitrationFeeDepositTime The new arbitrator fee deposit time.
      ///	@ _owner The owner who made this change.
      /* event arbitratorFeeDepositTimeUpdated(
          uint256 indexed _arbitrationFeeDepositTime,
          address indexed _owner
      ); */

      ///	@dev The event is used to notify a change in the deadline.
      ///	@ _owner The owner who made this change.
      event deadlineUpdated(
          /* uint256 indexed _heirDeadline,
          uint256 indexed _heirApprovedDeadline, */
          /* uint256 indexed _charityDeadline, */
          uint256 _timestampDeadSwitch,
          address _owner
      );

      ///	@dev The event is used to notify an addition to the approver list.
      ///	@ _newApprover The new approver address.
      ///	@ _owner The owner who made this change.
      /* event approverAdded(address indexed _newApprover, address indexed _owner); */

      ///	@dev The event is used to notify the deletion of an approver from the list.
      ///	@ _deletedApprover The approver address who got deleted.
      ///	@ _owner The owner who made this change.
      /* event approverDeleted(
          address indexed _deletedApprover,
          address indexed _owner
      ); */

      ///	@dev The event is used to notify the updation of new owner.
      ///	@ _newOwner The address of the new owner.
      ///	@ _oldOwner The address of the old owner.
      ///	@ _changer The one who made the change. It can be either owner or backupOwner.
      /* event ownerUpdated(
          address indexed _newOwner,
          address indexed _oldOwner,
          address indexed _changer
      ); */

      ///	@notice This event is used to notify the approvers to fast track approval process.
      ///	@dev This event is emitted when the heir has made a request for access to the contract.
      ///	@ _heir The address of heir who made the claim.
      ///	@ _claimTime The time heir made the claim.
      /* event ownershipClaimed(address indexed _heir, uint256 indexed _claimTime); */

      ///	@dev This event is used to notify when the heir has received the access to the contract.
      ///	@ _newOwner The new owner address of this contract (technically the previous heir).
      ///	@ _newBackupOwner The new backupOwner address of this contract.
      ///	@ _heir The new heir of this contract.
      ///	@ _approverCount The no. of new approvers added to the contract.
      ///	@ _heirDeadline The new wait time for heir to claim without approval from approvers.
      ///	@ _heirApprovedDeadline The new wait time for heir to claim with approval from approvers.
      ///	@ _charityDeadline The wait time for charity to claim with initiation from approvers.
      /* event ownershipAccessed(
          address indexed _newOwner,
          address indexed _newBackupOwner,
          address indexed _heir,
          uint256 _approverCount,
          uint256 _heirDeadline,
          uint256 _heirApprovedDeadline,
          uint256 _charityDeadline
      ); */

      /// @dev This event is used to notify the claim dispute has been started by arbitrator.
      /// @ _funder The person who funded the Heir Dispute Arbitration Fee.
      /// @ _arbitrator The Arbitrator.
      /// @ _disputeID The ID created for this dispute.
      /* event claimDisputeCreated(
          address indexed _funder,
          IArbitrator indexed _arbitrator,
          uint256 indexed _disputeID
      ); */

      ///	@dev This event is used to notify the decision by the approver.
      ///	@ _approver The address of the approver.
      ///	@ _status The decision of the approver.
      /* event heirApproval(address indexed _approver, bool indexed _status); */

      ///	@dev This event is used to notify when the approval is successful.
      ///	@ _approveCount The no. of votes received by the heir for approval.
      /* event heirApproved(uint256 indexed _approveCount); */

      /// @dev The event is used to notify the heir claim is disputed.
      ///	@ _approver The one who initiated the process.
      /* event heirDisputed(address indexed _approver); */

      /// @dev The event is used to notify the initial status is reclaimed.
      ///	@ _initiator The one who initiated the process.
      /* event initialStatusReclaimed(address indexed _initiator); */

      ///	@dev The event is used to notify that charity process has been initiated.
      ///	@ _approver The one who initiated the process.
      /* event charityInitiated(address indexed _approver); */

      ///	@dev The event is used to notify the creation of a contract.
      ///	@ _contractAddress The newly created contract address.
      ///	@ _owner The owner who created the contract.
      event contractDeployed(
          address indexed _contractAddress,
          address indexed _owner
      );

      ///	@dev The event is used to notify ether deposits.
      ///	@ _amount The amount of ether received in wei.
      ///	@ _sender The address of the sender of eth.
      event ethReceived(uint256 indexed _amount, address indexed _sender);

      ///	@dev The event is used to notify ether withdraws.
      ///	@ _amount The amount of ether withdrawed in wei.
      ///	@ _receiver The address of the receiver of eth.
      event ethWithdrawed(uint256 indexed _amount, address indexed _receiver);

      ///	@dev The event is used to notify ether transfers.
      ///	@ _amount The amount of ether transferred in wei.
      ///	@ _receiver The address of the receiver of eth.
      event ethTransferred(uint256 indexed _amount, address indexed _receiver);

      /*  Modifiers   */

      /// @notice Only Primary owner can call this function.
      modifier onlyOwner {
          require(msg.sender == owner, "Only owner can call this function.");
          _;
      }

      /// @notice Checks whether the address is valid or zero address.
      modifier checkAddress(address _addr) {
          require(_addr != address(0), "Address has to be valid.");
          _;
      }

      /// @notice Only Primary or Backup Owner can call this function.
      /* modifier onlyOwners {
          require(
              msg.sender == owner || msg.sender == backupOwner,
              "Only primary or backup owner can call this function."
          );
          _;
      } */

      /// @notice Only Heir can call this function.   TODO: check in heirs[]!
      modifier onlyHeir {
          require(msg.sender == heir, "Only heir can call this function.");
          _;
      }

      /// @notice Only an Approver can call this function.
      /* modifier onlyApprover {
          require(
              approverStatus[msg.sender],
              "Only an approver can call this function."
          );
          _;
      } */

      /// @notice Check if the contract have enough balance.
      /// @ _amount The amount which will be transferred.
      modifier checkRemaining(uint256 _amount) {
          require(
              _amount <= payable(address(this)).balance,
              "Amount requested greater than balance."
          );
          _;
      }

      /*  Constructor */

      ///	@dev Constructor
      ///	@ _owner The owner of this contract.
      ///	@ _backupOwner The backup owner of this contract.
      ///	@ _heir The heir of this contract.
      /// @ _charity The charity address preferred by Owner.
      /// @ _arbitrator The arbitrator address for this contract wallet.
      /// @ _arbitratorExtraData Extra data for the arbitrator.
      /// @ _metaevidence A link to the meta-evidence JSON.
      ///	@ _approvers The approver address array added to the contract.
      ///	@ _deadline The wait time for heir to claim without approval from approvers.
      ///	@ _approverDeadline The wait time for heir to claim with approval from approvers.
      ///	@ _charityDeadline The wait time for charity to claim with initiation from approvers.
      constructor (
          address _owner,
          /* address _backupOwner, */
          address payable _heir,
          /* address _charity,
          IArbitrator _arbitrator,
          bytes memory _arbitratorExtraData,
          string memory _metaevidence,
          address[] memory _approvers, */
          uint256 _deadline
          /* uint256 _approverDeadline,
          uint256 _charityDeadline */
      ) public {// IS PUBLIC?
          owner = _owner; // By default owner will be assigned the constructor eter.
          if (_owner == address(0)) {
              // If _owner is zero address, then msg.sender will be considered as the owner.
              owner = msg.sender;
          }

          /* require(
              _backupOwner != owner,
              "Backup owner and owner cannot be same."
          );
          if (_backupOwner != address(0)) {
              // We set backupOwner only if constructor eter is assigned with one.
              backupOwner = _backupOwner;
          }
  */
          require(
              _heir != owner, //&& _heir != backupOwner,
              "Owner and heir cannot be same."
          );
          require(
              _heir != address(0),
              "Heir has to be set at the time of contract creation."
          );
          heir = _heir;

          /* if (_charity != address(0)) {
              // We set charity address only if constructor eter is assigned with one.
              charity = _charity;
          }

          arbitrator = _arbitrator;

          arbitratorExtraData = _arbitratorExtraData;

          for (uint256 user = 0; user < _approvers.length; user++) {
              // To add approver only once.
              require(
                  !approverStatus[_approvers[user]],
                  "Approver already added."
              );
              approverStatus[_approvers[user]] = true;
          }
          approvers = _approvers; */

          if (_deadline != 0) {
              /* heirDeadline = _deadline; */
              timestampDeadSwitch = _deadline;
          }

          /* if (_approverDeadline != 0) {
              heirApprovedDeadline = _approverDeadline;
          }

          if (_charityDeadline != 0) {
              charityDeadline = _charityDeadline;
          }

          emit MetaEvidence(metaevidenceID, _metaevidence); */

          emit contractCreated(
              owner,
              /* _backupOwner, */
              _heir,
              timestampDeadSwitch
              /* _charity,
              _arbitrator,
              _approvers.length,
              heirDeadline,
              heirApprovedDeadline,
              charityDeadline,
              _arbitratorExtraData */
          );
      }

      /*  Functions   */

      /*  Primary Owner Functions */

      ///	@notice Can be used to update the backup owner.
      ///	@dev Owner and the new backup owner cannot be the same.
      ///	@ _newBackupOwner The address of the new backup owner.
      /* function updateBackupOwner(address _newBackupOwner)
          public
          onlyOwner
          checkAddress(_newBackupOwner)
      {
          require(
              msg.sender != _newBackupOwner,
              "Backup owner has to be different from Owner."
          );
          backupOwner = _newBackupOwner;
          emit backupOwnerUpdated(_newBackupOwner, msg.sender);
      } */

      ///	@notice Can be used to update the heir.
      ///	@dev Can also be used if the heir tried to access contract before the owner demise along with approvers.
      ///	@ _newHeir The address of the new heir.
      function updateHeir(address payable _newHeir)
          public
          onlyOwner
          checkAddress(_newHeir)
      {
          require(
              (_newHeir != owner),/// && (_newHeir != backupOwner),
              "Owner and heir cannot be same."
          );
          heir = _newHeir;
          /* if (voteCount > 0) {
              for (uint256 index = 0; index < approvers.length; index++) {
                  voted[approvers[index]] = false;
              }
          }
          voteCount = 0; // This resets the vote count, if the approver and colluded with the heir.
          claimTime = 0; */
          status = Status.Initial;
          emit heirUpdated(_newHeir, msg.sender);
      }

      /// @notice Can be used to update the Charity Address by the Owner. Also reset a initiated charity by Approver.
      /// @dev If the charity address is predetermined by owner, then approver cannot nominate a charity.
      /// @ _charity The address of the charity.
      /* function updateCharity(address _charity)
          public
          onlyOwner
          checkAddress(_charity)
      {
          charity = _charity;
          if (charityTime != 0) {
              // Resets the charity initiation if initiated by approver.
              status = Status.Initial;
              charityTime = 0;
              deleteApprover(charityInitiator);
          }
          emit charityUpdated(_charity, msg.sender);
      } */

      /// @notice Can be used to update the Arbitrator Address by the Owner.
      /// @dev The arbitrator should follow ERC 792 and ERC 1497 standard.
      /// @ _arbitrator The address of the Arbitrator.
      /* function updateArbitrator(IArbitrator _arbitrator)
          public
          onlyOwner
          checkAddress(address(_arbitrator))
      {
          require(
              status == Status.Initial,
              "Can only update arbitrator in Initial State."
          );
          arbitrator = _arbitrator;
          emit arbitratorUpdated(_arbitrator, msg.sender);
      } */

      /// @notice Can be used to update the Arbitrator Fee Deposit Time.
      /// @dev This is the time the heir have to deposit ETH for arbitration fee.
      /// @ _arbitrationFeeDepositTime The time provided for deposit.
      /* function updateArbitrationFeeDepositTime(uint256 _arbitrationFeeDepositTime)
          public
          onlyOwner
      {
          require(
              status == Status.Initial,
              "Can only update arbitrator in Initial State."
          );
          arbitrationFeeDepositTime = _arbitrationFeeDepositTime;
          emit arbitratorFeeDepositTimeUpdated(
              _arbitrationFeeDepositTime,
              msg.sender
          );
      } */

      ///	@notice Can be used to update the deadlines.
      ///	@dev If only one deadline has to be updated, passing the other zero is enough.
      ///	@ _deadline The deadline without approval.
      ///	@ _approverDeadline The deadline with approval.
      ///	@ _charityDeadline The wait time for charity to claim with initiation from approvers.
      function updateDeadline(
          uint256 _deadline
          /* uint256 _approverDeadline,
          uint256 _charityDeadline */
      ) public onlyOwner {
          if (_deadline != 0) {
              /* heirDeadline = _deadline; */
              timestampDeadSwitch = _deadline;
          }
          /* if (_approverDeadline != 0) {
              heirApprovedDeadline = _approverDeadline;
          }
          if (_charityDeadline != 0) {
              charityDeadline = _charityDeadline;
          } */
          emit deadlineUpdated(
              _deadline,
              /* _approverDeadline,
              _charityDeadline, */
              msg.sender
          );
      }

      ///	@notice Can be used to add an approver.
      ///	@dev Cannot add zero address or already added address.
      ///	@ _approver The new approver address.
      /* function addApprover(address _approver)
          public
          onlyOwner
          checkAddress(_approver)
      {
          require(!approverStatus[_approver], "Approver already added.");
          approverStatus[_approver] = true;
          approvers.push(_approver);
          emit approverAdded(_approver, msg.sender);
      } */

      ///	@notice Can be used to delete an approver.
      ///	@dev The approver has to be valid.
      ///	@ _approver The approver address to be removed.
      /* function deleteApprover(address _approver) public onlyOwner {
          require(approverStatus[_approver], "Approver is not valid.");
          approverStatus[_approver] = false;
          uint256 count = approvers.length;
          uint256 index;
          for (uint256 i = 0; i < count; i++) {
              if (approvers[i] == _approver) {
                  index = i;
              }
          }
          approvers[index] = approvers[count - 1];
          approvers.pop();
          emit approverDeleted(_approver, msg.sender);
      } */

      ///	@notice Fallback Function for complex calls to other contracts.
      ///	@dev Proxy Logic only owner can call.
      fallback() external payable onlyOwner {
          address contractAddr;
          uint256 begin_index = msg.data.length - 32;
          assembly {
              let ptr := mload(0x40)
              calldatacopy(ptr, begin_index, 32)
              contractAddr := mload(ptr)
          }
          require(contractAddr != address(0));

          assembly {
              let ptr := mload(0x40)
              let actualcalldatasize := sub(calldatasize(), 32)
              // (1) copy incoming call data
              calldatacopy(ptr, 0, actualcalldatasize)
              // (2) call to contract
              let result := call(
                  gas(),
                  contractAddr,
                  callvalue(), // TODO Get Value to be used from Contract as well.
                  ptr,
                  actualcalldatasize,
                  0,
                  0
              )
              let size := returndatasize()
              // (3) retrieve return data
              returndatacopy(ptr, 0, size)
              // (4) forward return data back to caller
              switch result
                  case 0 {
                      revert(ptr, size)
                  }
                  default {
                      return(ptr, size)
                  }
          }
      }

      /// @notice Can be used to receive ether from anyone.
      /// @dev This allows to receive ether from anyone unlike the fallback function.
      receive() external payable {
          emit ethReceived(msg.value, msg.sender);
      }

      /// @notice Withdraw Complete ETH balance.
      function withdrawAllETH() public onlyOwner {
          uint256 amount = payable(address(this)).balance;
          msg.sender.transfer(amount);
          emit ethWithdrawed(amount, msg.sender);
      }

      /// @notice Withdraw a particular amount of ETH.
      /// @ _amount Amount requested for withdrawal
      function withdrawSomeETH(uint256 _amount)
          public
          onlyOwner
          checkRemaining(_amount)
      {
          msg.sender.transfer(_amount);
          emit ethWithdrawed(_amount, msg.sender);
      }

      /// @notice Transfer `_amount` ETH to `_receiver`.
      /// @ _receiver The address of the receiver.
      /// @ _amount The amount to be received.
      function transferETH(address payable _receiver, uint256 _amount)
          public
          onlyOwner
          checkRemaining(_amount)
      {
          _receiver.transfer(_amount);
          emit ethTransferred(_amount, _receiver);
      }

      ///	@notice Can be used to deploy contracts.
      ///	@ _value The ether to be sent in wei.
      ///	@ _bytecode The smart contract code.
      ///	@return contractAddress The contract address created.
      function deployContract(uint256 _value, bytes memory _bytecode)
          public
          onlyOwner
          returns (address contractAddress)
      {
          assembly {
              /// the first slot of a dynamic type like bytes always holds the length of the array
              /// advance it by 32 bytes to access the actual contents
              contractAddress := create(
                  _value,
                  add(_bytecode, 0x20),
                  mload(_bytecode)
              )
          }
          emit contractDeployed(contractAddress, msg.sender);
      }

      /*  Backup Owner Functions  */

      ///	@notice Can be used to update the owner.
      ///	@dev This function can be used by either owner or backupOwner.
      ///	@ _newOwner The new owner address.
      /* function updateOwner(address _newOwner)
          public
          onlyOwners
          checkAddress(_newOwner)
      {
          address oldOwner = owner;
          owner = _newOwner;
          emit ownerUpdated(_newOwner, oldOwner, msg.sender);
      } */

      /*  Heir Functions  */

      ///	@notice Can be used to claim the contract ownership.
      ///	@dev This function starts the claim process for heir.
      /* function claimOwnership() public onlyHeir {
          require(status != Status.HeirClaimed, "Claim already started.");
          _claimOwnership();
      } */

      ///	@notice Can be used to reclaim the contract ownership after a rejected dispute from Arbitrator.
      ///	@dev Might be used when Owner in health crisis, and approver disputed and won.
      /* function reclaimOwnership() public onlyHeir {
          require(status == Status.ArbitratorRejected, "Claim already started.");
          _claimOwnership();
      } */

      /// @notice This is an internal function which takes care of the heir claim process.
      /* function _claimOwnership() internal {
          // The below is used when the owner is not able to prove he is alive due to some health issue or so.
          // And the approver disputes the claim from heir. This ensures the heir can claim once in a while.
          require(
              claimTime < block.timestamp,
              "Wait period after an arbitrator rejection or without dispute fee deposit is not over."
          );
          status = Status.HeirClaimed;
          claimTime = block.timestamp;
          if (charityTime != 0) {
              charityTime = 0; // Resets the charity initiation if initiated by approver.
              // Charity Status is automatically changed when Heir Claims.
          }
          emit ownershipClaimed(msg.sender, claimTime);
      } */

      ///	@notice Can be used by heir after approver approval.
      ///	@dev This function can only be called once majority vote is attained.
      ///	@ _backupOwner The new backup owner of this contract.
      ///	@ _heir The new heir of this contract.
      ///	@ _approvers The new approver address array added to the contract.
      ///	@ _deadline The new wait time for heir to claim without approval from approvers.
      ///	@ _approverDeadline The new wait time for heir to claim with approval from approvers.
      ///	@ _charityDeadline The wait time for charity to claim with initiation from approvers.
      /* function accessOwnershipFromApprover(
          address _backupOwner,
          address payable _heir,
          address[] memory _approvers,
          uint256 _deadline,
          uint256 _approverDeadline,
          uint256 _charityDeadline
      ) public onlyHeir {
          require(
              status == Status.ApproverApproved,
              "Majority vote required to access ownership."
          );
          require(
              block.timestamp - claimTime > heirApprovedDeadline,
              "Deadline has not passed."
          );
          _accessOwnership(
              _backupOwner,
              _heir,
              _approvers,
              _deadline,
              _approverDeadline,
              _charityDeadline
          );
      } */

      ///	@notice Can be used by heir after arbitrator approval.
      ///	@dev This function can only be called once arbitrator approval is attained.
      ///	@ _backupOwner The new backup owner of this contract.
      ///	@ _heir The new heir of this contract.
      ///	@ _approvers The new approver address array added to the contract.
      ///	@ _deadline The new wait time for heir to claim without approval from approvers.
      ///	@ _approverDeadline The new wait time for heir to claim with approval from approvers.
      ///	@ _charityDeadline The wait time for charity to claim with initiation from approvers.
      /* function accessOwnershipFromArbitrator(
          address _backupOwner,
          address payable _heir,
          address[] memory _approvers,
          uint256 _deadline,
          uint256 _approverDeadline,
          uint256 _charityDeadline
      ) public onlyHeir {
          require(
              status == Status.ArbitratorApproved,
              "Arbitrator Approval Required."
          );
          // This is just a precautionary wait time, removing it won't affect the security.
          require(
              block.timestamp - claimTime > heirApprovedDeadline,
              "Deadline has not passed."
          );
          _accessOwnership(
              _backupOwner,
              _heir,
              _approvers,
              _deadline,
              _approverDeadline,
              _charityDeadline
          );
      } */

      ///	@notice Can be used by heir after deadline has been passed.
      ///	@dev This function can be called with or without the approver approvals after the deadline.
      ///	@ _backupOwner The new backup owner of this contract.
      ///	@ _heir The new heir of this contract.
      ///	@ _approvers The new approver address array added to the contract.
      ///	@ _deadline The new wait time for heir to claim without approval from approvers.
      ///	@ _approverDeadline The new wait time for heir to claim with approval from approvers.
      ///	@ _charityDeadline The wait time for charity to claim with initiation from approvers.
      /* function accessOwnershipAfterDeadline(
          address _backupOwner,
          address payable _heir,
          address[] memory _approvers,
          uint256 _deadline,
          uint256 _approverDeadline,
          uint256 _charityDeadline
      ) public onlyHeir {
          require(
              block.timestamp - claimTime > heirDeadline,
              "Deadline has not passed."
          );
          _accessOwnership(
              _backupOwner,
              _heir,
              _approvers,
              _deadline,
              _approverDeadline,
              _charityDeadline
          );
      } */

      ///	@dev This is an internal function which takes care of the ownership transfer tasks.
      ///	@ _backupOwner The new backup owner of this contract.
      ///	@ _heir The new heir of this contract.
      ///	@ _approvers The new approver address array added to the contract.
      ///	@ _deadline The new wait time for heir to claim without approval from approvers.
      ///	@ _approverDeadline The new wait time for heir to claim with approval from approvers.
      ///	@ _charityDeadline The wait time for charity to claim with initiation from approvers.
      /* function _accessOwnership(
          address _backupOwner,
          address payable _heir,
          address[] memory _approvers,
          uint256 _deadline,
          uint256 _approverDeadline,
          uint256 _charityDeadline
      ) internal {
          status = Status.Initial;
          owner = msg.sender;
          updateBackupOwner(_backupOwner);
          updateHeir(_heir);
          address[] memory temp = approvers;
          for (uint256 user = 0; user < temp.length; user++) {
              deleteApprover(temp[user]);
          }
          for (uint256 user = 0; user < _approvers.length; user++) {
              addApprover(_approvers[user]);
          }
          updateDeadline(_deadline, _approverDeadline, _charityDeadline);
          emit ownershipAccessed(
              msg.sender,
              _backupOwner,
              _heir,
              _approvers.length,
              _deadline,
              _approverDeadline,
              _charityDeadline
          );
      } */

      /// @notice Can be used to pay the arbitration fee for Heir, if approver disputed.
      /// @dev Can be paid by anyone.
      /* function payArbitrationFeeForHeir() public payable {
          require(status == Status.ClaimDisputed, "Claim is not disputed.");
          uint256 cost = arbitrator.arbitrationCost(arbitratorExtraData);
          require(msg.value >= cost, "Arbitration Fee insufficient.");
          if (msg.value < arbitrationFee) {
              // This ensures that atleast a minimum arbitration fee is returned to winner.
              // (in case the fee changes during dispute)
              arbitrationFee = msg.value;
          }
          // The arbitrator will check if the fee send is adequate and refund the remaining.
          uint256 disputeID =
              arbitrator.createDispute{value: cost}(
                  numberOfClaimRulingOptions,
                  arbitratorExtraData
              );
          status = Status.DisputeResultPending;
          emit claimDisputeCreated(msg.sender, arbitrator, disputeID);
      } */

      /*  Approver Functions  */

      ///	@notice Can be used to approve or reject a claim request by heir.
      ///	@dev Only callable if claim has started and approver not already voted.
      ///	@ _acceptance True if approved, False otherwise.
      /* function approveHeir(bool _acceptance) public onlyApprover {
          require(status == Status.HeirClaimed, "Claim has not started yet.");
          require(!voted[msg.sender], "Already voted.");
          voted[msg.sender] = true;
          if (_acceptance) {
              voteCount++;
              if (voteCount > approvers.length / 2) {
                  status = Status.ApproverApproved;
                  emit heirApproved(voteCount);
              }
          }
          emit heirApproval(msg.sender, _acceptance);
      } */

      /// @notice Can be used to dispute a Heir Claim, or dispute incorrect heir acceptance.
      /// @dev Call scope limited to Approvers to limit spamming.
      /* function disputeHeir() public payable onlyApprover {
          require(
              status == Status.HeirClaimed || status == Status.ApproverApproved,
              "Claim has not started yet or Claim was approved incorrectly."
          );
          uint256 cost = arbitrator.arbitrationCost(arbitratorExtraData);
          require(msg.value >= cost, "Arbitration Fee not sufficient.");
          // It is the responsibility of the ethereum address to receive the remaining eth back.
          msg.sender.send(cost - msg.value);
          status = Status.ClaimDisputed;
          disputeTime = block.timestamp;
          arbitrationFee = cost;
          disputeInitiator = msg.sender;
          emit heirDisputed(msg.sender);
      } */

      /// @notice Can be used by anyone to stop the claim process by heir after arbitration fee deposit time ends.
      /// @dev Can be used only after approver made a dispute to claim.
      /* function reclaimInitialStatus() public {
          require(status == Status.ClaimDisputed, "Claim is not disputed.");
          require(
              block.timestamp - disputeTime > arbitrationFeeDepositTime,
              "The heir Arbitration fee deposit time not over."
          );
          claimTime = block.timestamp + heirDeadline; // This ensures the heir can claim once in a while.
          // It is the responsibility of the ethereum address to receive the remaining eth back.
          disputeInitiator.send(arbitrationFee);
          status = Status.Initial;
          disputeTime = 0;
          arbitrationFee = 0;
          disputeInitiator = address(0);
          emit initialStatusReclaimed(msg.sender);
      } */

      /// @notice Can be used to initiate the charity process.
      /// @dev Called when owner and heir are no more.
      /* function initiateCharity() public onlyApprover {
          require(
              status == Status.Initial,
              "Contract Status is not apt for charity initiation."
          );
          require(charity != address(0), "Charity was not set by Owner.");
          status = Status.InitiatedCharity;
          charityTime = block.timestamp;
          charityInitiator = msg.sender;
          emit charityInitiated(msg.sender);
      } */

      /* Charity Function */

      ///	@notice Can be used by charity after deadline has been passed.
      ///	@dev This function can only be called after the approver has initiated the charity.
      ///	@ _backupOwner The new backup owner of this contract.
      ///	@ _heir The new heir of this contract.
      ///	@ _approvers The new approver address array added to the contract.
      ///	@ _deadline The new wait time for heir to claim without approval from approvers.
      ///	@ _approverDeadline The new wait time for heir to claim with approval from approvers.
      ///	@ _charityDeadline The wait time for charity to claim with initiation from approvers.
      /* function accessOwnershipFromCharity(
          address _backupOwner,
          address payable _heir,
          address[] memory _approvers,
          uint256 _deadline,
          uint256 _approverDeadline,
          uint256 _charityDeadline
      ) public {
          require(
              charity == msg.sender,
              "Only the charity wallet can call this function."
          );
          require(
              status == Status.InitiatedCharity,
              "Charity is not yet initiated."
          );
          require(
              block.timestamp - charityTime > charityDeadline,
              "Deadline has not passed."
          );
          _accessOwnership(
              _backupOwner,
              _heir,
              _approvers,
              _deadline,
              _approverDeadline,
              _charityDeadline
          );
      } */

      /* Arbitrator */

      /// @notice Give a ruling for a dispute. Must be called by the arbitrator.
      /// @ _disputeID ID of the dispute in the Arbitrator contract.
      /// @ _ruling Result of arbitration (including refused to arbitrate).
      /* function rule(uint256 _disputeID, uint256 _ruling) public override {
          require(
              msg.sender == address(arbitrator),
              "Only the arbitrator can execute this."
          );
          require(
              status == Status.DisputeResultPending,
              "There should be a dispute to execute a ruling."
          );
          require(_ruling <= numberOfClaimRulingOptions, "Ruling out of bounds!");
          if (_ruling == 1) {
              status = Status.ArbitratorApproved;
              heir.send(arbitrationFee);
          } else if (_ruling == 2) {
              status = Status.ArbitratorRejected;
              disputeInitiator.send(arbitrationFee);
          } else {
              status = Status.Initial;
              // If wei is an odd number, then it will be added to the owner assets.
              uint256 half = arbitrationFee / 2;
              heir.send(half);
              disputeInitiator.send(half);
          }
          disputeTime = 0;
          arbitrationFee = 0;
          disputeInitiator = address(0);
          emit Ruling(arbitrator, _disputeID, _ruling);
      } */

      /* General Functions */

      /// @notice Can be used to submit any evidence during the Claim Dispute Period.
      /// @dev Only owner, heir or approver can call this function.
      /// @ _evidence A URI to the evidence JSON file whose name should be its keccak256 hash followed by .json.
      /* function submitEvidence(string memory _evidence) public {
          require(
              status == Status.ClaimDisputed,
              "Contract is not in Disputed state."
          );
          require(
              msg.sender == heir ||
                  msg.sender == owner ||
                  approverStatus[msg.sender],
              "Third parties are not allowed to submit evidence."
          );
          emit Evidence(arbitrator, evidenceGroupID, msg.sender, _evidence);
      } */

      /*  Read/Getter Functions  */

      ///	@notice To get the length of the approvers array.
      ///	@dev Used for testing and frontend.
      ///	@return count The no. of approvers present at the moment.
      /* function approversLength() public view returns (uint256 count) {
          return approvers.length;
      } */

}
