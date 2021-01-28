pragma solidity 0.8.0;
import './DethLock.sol';
import './included/SafeMath.sol';

// SPDX-License-Identifier: UNLICENSED

contract Verb is DethLock {

    event WillCreated(
        address owner, 
        address beneficiary,
        uint256 index);

    event BeneficiarySet(
        address  beneficiary
    );

    event WillFunded(
        address sender,
        uint256 index,
        uint256 amount
    );

    event WillDeFunded(
        address reciever,
        uint256 index,
        uint256 amount
    );

    event TokensDepositedToWill(
        address sender,
        address tokenAddress,
        uint256 willIndex,
        uint256 value
    );

    event TokensWithdrawnFromWill(
        address sender,
        address tokenAddress,
        uint256 willIndex,
        uint256 value
    );

    event BenifitedTokens(
        address sender,
        address tokenAddress,
        uint256 willIndex,
        uint256 value
    );

    event DeadlineUpdated(
        uint256 old_value,
        uint256 new_value
    );

    modifier onlyWillOwner(uint index) {
        require(_masterWillList[index].owner == msg.sender,
        'Only the will owner can do that.');
        _;
    }

    modifier onlyBeneficiary(uint index) {
        require(_masterWillList[index].beneficiary == msg.sender,
        'Only the beneficiary can do that.');
        _;
    }

    modifier beforeDeadline(uint index) {
        require(_masterWillList[index].deadline >= block.timestamp,
        'Its too late to use this function.');
        _;
    }

    modifier afterDeadline(uint index) {
        require(_masterWillList[index].deadline <= block.timestamp,
        'Its too early to use this function.');
        _;
    }

    function createWill
        (address payable owner,address payable beneficiary) 
        public returns(uint256){
        _uint['willsCreated'] = SafeMath.add(_uint['willsCreated'], 1);
        _masterWillList[_uint['willsCreated']].owner = payable(msg.sender);
        _masterWillList[_uint['willsCreated']].beneficiary = beneficiary;
        _owners[owner].push(_uint['willsCreated']);
        _beneficiaries[beneficiary].push(_uint['willsCreated']);
        emit WillCreated(owner, beneficiary, _uint['willsCreated']);
        return _uint['willsCreated'];
    }

    function setBeneficiary
        (uint256 index, address payable benificiary) 
        public onlyWillOwner(index) beforeDeadline(index) {
        _masterWillList[index].beneficiary = benificiary;
    }

    function setDeadline
        (uint256 index, uint256 value) 
        public onlyWillOwner(index) returns (bool) {
        require(value >= block.timestamp,'Must set deadline to a future time.');
        _uint['old deadline'] = _masterWillList[index].deadline;
        _masterWillList[index].deadline = value;
        emit DeadlineUpdated(_uint['old deadline'], _masterWillList[index].deadline);
        return true;
    }

    function fundWill
        (uint256 index) payable public returns (bool){
        _masterWillList[index].ethBalance = 
            SafeMath.add(_masterWillList[index].ethBalance,msg.value);
        credit(msg.sender, msg.value);
        emit WillFunded(msg.sender,index,msg.value);
        return true;
    }

    function defundWill (uint256 index, address payable toAddress, uint256 value)
        public onlyWillOwner(index) beforeDeadline(index) returns (bool) {
        require(address(this).balance >= value, 'Dethlock does not have that much ETH.');
        require(_uint['balance'] >= value, 'Dethlock does not think it has that much ETH');
        require(_masterWillList[index].ethBalance >= value, 'Will does not have that much ETH.');
        _masterWillList[index].ethBalance = 
            SafeMath.sub(_masterWillList[index].ethBalance,value);
        debt(toAddress, value);
        emit WillDeFunded(msg.sender, index, value);
        return true;
    }

    function BenefitETH (uint256 index, address payable toAddress, uint256 value)
        public onlyBeneficiary(index) afterDeadline(index) returns (bool) {
        require(address(this).balance >= value, 'Dethlock does not have that much ETH.');
        require(_uint['balance'] >= value, 'Dethlock does not think it has that much ETH');
        require(_masterWillList[index].ethBalance >= value, 'Will does not have that much ETH.');
        _masterWillList[index].ethBalance = 
            SafeMath.sub(_masterWillList[index].ethBalance,value);
        debt(toAddress, value);
        emit WillDeFunded(msg.sender, index, value);
        return true;
    }

    function depositTokens2Will 
        (uint256 index, address payable tokenAddress, uint256 value) 
        public returns (bytes memory) {
        require(_masterWillList[index].tokenAddress == address(0) || 
                 _masterWillList[index].tokenAddress == tokenAddress, 
                 'Will contains a different token.');
        bytes memory payload = abi.encodeWithSignature(
            'transferFrom(address payable, address payable, uint256)', 
            msg.sender, address(this), value);
        (bool success, bytes memory returnData) = address(
            _masterWillList[index].tokenAddress).call(payload);
        require(success, 'failed to transfer tokens.');
        _masterWillList[index].tokenAddress = tokenAddress;
        _masterWillList[index].tokenBalance = SafeMath.add(_masterWillList[index].ethBalance, value);
        emit TokensDepositedToWill(msg.sender, tokenAddress, index, value);
        return returnData;
    }

    function withdrawTokensFromWill
        (uint256 index, address payable benifitAddress, uint256 value)
        public onlyWillOwner(index) beforeDeadline(index) returns (bytes memory) {
        require(_masterWillList[index].tokenBalance >= value,
            'Will does not contain that many tokens.');
        _masterWillList[index].tokenBalance = SafeMath.sub(_masterWillList[index].tokenBalance, value);
        bytes memory payload = abi.encodeWithSignature(
            'transferFrom(address payable, address payable, uint256)', 
            address(this), msg.sender, value);
        (bool success, bytes memory returnData) = address(
            _masterWillList[index].tokenAddress).call(payload);
        require(success, 'failed to transfer tokens.');
        emit TokensWithdrawnFromWill(benifitAddress,_masterWillList[index].tokenAddress,index,value);
        return returnData;
    }

    function benefitTokensFromWill
        (uint256 index, address payable benifitAddress, uint256 value)
        public onlyBeneficiary(index) afterDeadline(index) returns (bytes memory) {
        require(_masterWillList[index].tokenBalance >= value,
            'Will does not contain that many tokens.');
        _masterWillList[index].tokenBalance = SafeMath.sub(_masterWillList[index].tokenBalance, value);
        bytes memory payload = abi.encodeWithSignature(
            'transferFrom(address payable, address payable, uint256)', 
            address(this), msg.sender, value);
        (bool success, bytes memory returnData) = address(
            _masterWillList[index].tokenAddress).call(payload);
        require(success, 'failed to transfer tokens.');
        emit BenifitedTokens(benifitAddress,_masterWillList[index].tokenAddress,index,value);
        return returnData;
    }

}