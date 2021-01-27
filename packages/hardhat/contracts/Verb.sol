pragma solidity 0.8.0;
import './DethLock.sol';

// SPDX-License-Identifier: UNLICENSED

contract Verb is DethLock {

    event WillCreated(
    	address payable owner,
    	address payable beneficiary,
    	uint256 index);

    event WillFunded(
    	address payable sender,
    	uint256 index,
    	uint256 amount);

    event DeadlineUpdated(
        uint256 old_value;
        uint256 new_value;
    )

    modifier onlyWillOwner(index) {
        require(_masterWillList[index].owner == msg.sender, 'Only the will owner can do that.');
        _;
    }

    modifier onlyBeneficiary(index) {
        require(_masterWillList[index].beneficiary == msg.sender,
            'Only the beneficiary can do that');
        _;
    }

    modifier afterDeadline(index) {
        require (_masterWillList[index].deadline < block.timestamp, 'Function is locked for now.');
        
    }

    //creates a will between two addresses.
	function createWill (
		address payable owner, address payable beneficiary) public returns(uint256) {
		_uint['willsCreated'] =SafeMath.add(_uint['willsCreated'],1);
		_owners[owner].push(_uint['willsCreated']);
		_beneficiaries[beneficiary].push(_uint['willsCreated']);
		emit WillCreated(owner, beneficiary, _uint['willsCreated']);
    }

    function setBeneficiary (uint256 index, address payable beneficiary) public onlyWillOwner(index) {
        _masterWillList[index].beneficiary = beneficiary;
    }

	//Deposits raw ETH into a will

	function fundWill (uint256 index) public {
		_masterWillList[index].ethBalance = SafeMath.add(_masterWillList[index].ethBalance,msg.amount);
		credit(msg.sender, msg.amount);
		emit WillFunded(msg.sender, index, msg.amount);
	}

    function setTokenAddress (uint256 index, address payable tokenAddress) public {
    	_masterWillList[index].tokenAddress = tokenAddress;
    }

    function depositTokens2Will (uint index, address payable tokenAddress, uint256 value) public returns (bool) {
    	require (_masterWillList[index].tokenAddress == 0 || _masterWillList[index].tokenAddress == tokenAddress, 'Will contains a different token.');
    	require (transferFrom(msg.sender, this.address,value) == true, 'Failed to transfer tokens.');
    	_masterWillList[index].tokenBalance = SafeMath.add(_masterWillList[index].tokenBalance, msg.amount);
    	_masterWillList[index].tokenAddress = tokenAddress;
    	emit TokensDepositedToWill(msg.sender, tokenAddress, index, value);
    	return true;
    }

    function setDeadline(uint256 index, uint256 value) public returns (bool) {

    	require (value >= block.timestamp, 'Must set time to a future time.');
    	_uint['old deadline'] = _masterWillList[index].deadline;
    	_masterWillList[index].deadline = value;
    	emit DeadlineUpdated(_uint['old deadline'], _masterWillList[index].deadline);
    	
    	
    }
}		