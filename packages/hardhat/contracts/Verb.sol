pragma solidity 0.8.0;
import './inherited/DethLock.sol';
import './included/SafeMath.sol';

// SPDX-License-Identifier: UNLICENSED

contract Verb is DethLock {

    event NewWillCreated(
      address owner,
      address beneficiary,
      address tokenAddress,
      uint256 index,
      uint256 value,
      uint256 deadline
      );

    event WillCreated(
        address owner,
        uint256 index,
        uint256 value
        );

    event BeneficiarySet(
        uint256  index,
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
        uint256 index,
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

    function createNewWill
        (address payable _owner,address payable _beneficiary,address payable _tokenAddress, uint256 _deadline)
        public payable returns(uint256){
        will memory newWill;
        newWill.owner = _owner;
        newWill.beneficiary = _beneficiary;
        newWill.deadline = _deadline;
        newWill.tokenAddress = _tokenAddress;
        if (msg.value > 0) {
            newWill.ethBalance = SafeMath.add(newWill.ethBalance,msg.value);
            credit(msg.sender, msg.value);
        }
        _masterWillList.push(newWill);
        _owners[_owner].push(_masterWillList.length);
        _beneficiaries[_beneficiary].push(_masterWillList.length);
        emit NewWillCreated(_owner, _beneficiary, _tokenAddress, _masterWillList.length, msg.value, _deadline);
        return _masterWillList.length;
    }


    function createWill
        (address payable beneficiary, uint256 _deadline)
        public payable returns(uint256){
        uint256 newWillIndex = initializeWill(payable(msg.sender));
        setDeadline(newWillIndex, _deadline);
        setBeneficiary(newWillIndex, beneficiary);
        if (msg.value > 0) {
            fundWillETH(newWillIndex);
        }
        return newWillIndex;
    }

    function initializeWill
        (address payable owner)
        internal returns(uint256){
        will memory newWill = _masterWillList.push();
        newWill.owner = owner;
        if (msg.value > 0) {
            newWill.ethBalance = SafeMath.add(newWill.ethBalance,msg.value);
            credit(msg.sender, msg.value);
        }
        emit WillCreated(owner, _masterWillList.length, msg.value);
        return _masterWillList.length;
    }

    function setDeadline
        (uint256 index, uint256 value)
        public onlyWillOwner(index) returns (bool) {
        require(value >= block.timestamp,'Must set deadline to a future time.');
        uint oldDeadline = _masterWillList[index].deadline;
        _masterWillList[index].deadline = value;
        emit DeadlineUpdated(index, oldDeadline, _masterWillList[index].deadline);
        return true;
    }

    function setBeneficiary
        (uint256 index, address payable benificiary)
        public onlyWillOwner(index) beforeDeadline(index) {
        _masterWillList[index].beneficiary = benificiary;
        emit BeneficiarySet(index,benificiary);
    }

    function fundWillETH
        (uint256 index) payable public returns (bool){
        _masterWillList[index].ethBalance =
            SafeMath.add(_masterWillList[index].ethBalance,msg.value);
        credit(msg.sender, msg.value);
        emit WillFunded(msg.sender,index,msg.value);
        return true;
    }

    function defundWillETH (uint256 index, address payable toAddress, uint256 value)
        public onlyWillOwner(index) beforeDeadline(index) returns (bool) {
        require(address(this).balance >= value,
            'Dethlock does not have that much ETH.');
        require(_uint['balance'] >= value,
            'Dethlock does not think it has that much ETH');
        require(_masterWillList[index].ethBalance >= value,
            'Will does not have that much ETH.');
        _masterWillList[index].ethBalance =
            SafeMath.sub(_masterWillList[index].ethBalance,value);
        debt(toAddress, value);
        emit WillDeFunded(msg.sender, index, value);
        return true;
    }

    function BenefitETH (uint256 index, address payable toAddress, uint256 value)
        public onlyBeneficiary(index) afterDeadline(index) returns (bool) {
        require(address(this).balance >= value,
            'Dethlock does not have that much ETH.');
        require(_uint['balance'] >= value,
            'Dethlock does not think it has that much ETH');
        require(_masterWillList[index].ethBalance >= value,
            'Will does not have that much ETH.');
        _masterWillList[index].ethBalance =
            SafeMath.sub(_masterWillList[index].ethBalance,value);
        debt(toAddress, value);
        emit WillDeFunded(msg.sender, index, value);
        return true;
    }

    function depositTokensToWill
        (uint256 index, address payable _tokenAddress, uint256 value)
        public returns (bytes memory) {
        require(_masterWillList[index].tokenAddress == address(0) ||
                 _masterWillList[index].tokenAddress == _tokenAddress,
                 'Will contains a different token.');
        bytes memory payload = abi.encodeWithSignature(
            'transferFrom(address payable, address payable, uint256)',
            msg.sender, address(this), value);
        (bool success, bytes memory returnData) = address(
            _masterWillList[index].tokenAddress).call(payload);
        require(success, 'failed to transfer tokens.');
        _masterWillList[index].tokenAddress = _tokenAddress;
        _masterWillList[index].tokenBalance =
            SafeMath.add(_masterWillList[index].ethBalance, value);
        emit TokensDepositedToWill(msg.sender, _tokenAddress, index, value);
        return returnData;
    }

    function withdrawTokensFromWill
        (uint256 index, address payable benifitAddress, uint256 value)
        public onlyWillOwner(index) beforeDeadline(index) returns (bytes memory) {
        require(_masterWillList[index].tokenBalance >= value,
            'Will does not contain that many tokens.');
        _masterWillList[index].tokenBalance =
            SafeMath.sub(_masterWillList[index].tokenBalance, value);
        bytes memory payload = abi.encodeWithSignature(
            'transferFrom(address payable, address payable, uint256)',
            address(this), msg.sender, value);
        (bool success, bytes memory returnData) = address(
            _masterWillList[index].tokenAddress).call(payload);
        require(success, 'failed to transfer tokens.');
        emit TokensWithdrawnFromWill(benifitAddress,
            _masterWillList[index].tokenAddress,index,value);
        return returnData;
    }

    function benefitTokensFromWill
        (uint256 index, address payable benifitAddress, uint256 value)
        public onlyBeneficiary(index) afterDeadline(index) returns (bytes memory) {
        require(_masterWillList[index].tokenBalance >= value,
            'Will does not contain that many tokens.');
        _masterWillList[index].tokenBalance =
            SafeMath.sub(_masterWillList[index].tokenBalance, value);
        bytes memory payload = abi.encodeWithSignature(
            'transferFrom(address payable, address payable, uint256)',
            address(this), msg.sender, value);
        (bool success, bytes memory returnData) = address(
            _masterWillList[index].tokenAddress).call(payload);
        require(success, 'failed to transfer tokens.');
        emit BenifitedTokens(benifitAddress,
            _masterWillList[index].tokenAddress,index,value);
        return returnData;
    }

    function willsIOwn()
        public view returns(uint[] memory){
        return _owners[msg.sender];
    }

    function willsBenefittingMe()
        public view returns (uint[] memory){
        return _beneficiaries[msg.sender];
    }

    function willsAddressOwns(address doxAddress)
        public view returns (uint[] memory){
        return _owners[doxAddress];
    }

    function willsAddressBenefitsFrom(address doxAddress)
        public view returns (uint[] memory){
        return _beneficiaries[doxAddress];
    }

    function whoOwns(uint256 index)
        public view returns(address){
        return _masterWillList[index].owner;
    }

    function whoBenefits(uint256 index)
        public view returns(address){
        return _masterWillList[index].beneficiary;
    }

    function ethBalance(uint256 index)
        public view returns(uint256){
        return _masterWillList[index].ethBalance;
    }

    function tokenAddress(uint256 index)
        public view returns(address){
        return _masterWillList[index].tokenAddress;
    }

    function tokenBalance(uint256 index)
        public view returns(uint256){
        return _masterWillList[index].tokenBalance;
    }

    function deadline(uint256 index)
        public view returns(uint256){
        return _masterWillList[index].deadline;
    }
}
