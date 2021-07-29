// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

// This contract processes a transaction with a percentage of the transaction going to charity. 
// The charity will be represented by a wallet address predefined by this contract.
// This example shows three separate wallets which addresses and percentages can be configured in the constructor. 
// Your can add and remove beneficiaries in the constructor. Just be sure to add a mapping and update sendFundz function.

contract DefiSmile {

    address[] approvedBeneficiaries;
    uint256 benePayoutPercent1;
    uint256 benePayoutPercent2;
    uint256 benePayoutPercent3;
    uint256 totalDistributed;

    constructor() {
        // Set Beneficiary wallet address and payout percentage for each here:
        // ex. ( UNICEF (1%), MUMA (5%), USAID (10%) )
        approvedBeneficiaries = [0x7Fd8898fBf22Ba18A50c0Cb2F8394a15A182a07d, 0xF08E19B6f75686f48189601Ac138032EBBd997f2, 0x93eb95075A8c49ef1BF3edb56D0E0fac7E3c72ac];
        benePayoutPercent1 = 1;
        benePayoutPercent2 = 5;
        benePayoutPercent3 = 10;
        benePayout1[approvedBeneficiaries[0]] = true; // Add beneficiaries to their respective payout mappings. This is important to verify the address during payout. 
        benePayout2[approvedBeneficiaries[1]] = true;
        benePayout3[approvedBeneficiaries[2]] = true;
    }

    event Withdraw( address indexed to, uint256 amount );       // Emitted when funds are sent to this smart contract to be divided up.
    event Deposit( address indexed from, uint256 amount );      // Emitted when funds are sent from this smart contract to the beneficiaries.
    mapping (address => uint256) private _payoutTotals;         // The beneficiaries address and how much they are approved for.
    mapping (address => bool) public benePayout1;              // 1% // Benficiaries percent payout mappings for verification.
    mapping (address => bool) public benePayout2;              // 5%
    mapping (address => bool) public benePayout3;              // 10%

   //-----------------------------------------Beneficiary-Allowance----------------------------------------------------
    // An allowance system was chosen to reduce the amount of gas used by the contract and to preserve the maximum number of funds as possible to be retrieved. 
    // If transfer calls are made on every transaction there is a larger net value that is used in gas as opposed to one lump sum. At the call of the reciever. 
    // One option available is afront end trigger which could  send out an email notifications to beneficiaries when their balance is over a certain threshold. 
    // This can direct them to a front end getPayout function call. 

    // Internal
    function increasePayout(address recipient, uint256 addedValue) internal returns (bool) {
        uint256 currentBalance = 0;
        if(_payoutTotals[recipient] != 0) {
            currentBalance = _payoutTotals[recipient];
        }
        _payoutTotals[recipient] = addedValue + currentBalance;
        return true;
    }

    // Internal
    function decreasePayout(address beneficiary, uint256 subtractedValue) internal returns (bool) {
        uint256 currentAllowance = _payoutTotals[beneficiary];
        require(currentAllowance >= subtractedValue, "ERC20: decreased payout below zero");
        uint256 newAllowance = currentAllowance - subtractedValue;
        _payoutTotals[beneficiary] = newAllowance;
        return true;
    }

    // Public
    function payout(address recipient) public view returns (uint256) {
        return _payoutTotals[recipient];
    }


   //---------------------------------------------Transfer Fundz---------------------------------------------------------
   // Buyer (msg.sender) transfers total amount to be paid to this contract. 
   // The contract stores X% of the funds to be allocated for beneficiaries.
   // Remaining percentage goes to the 'seller' in the transaction.

    function sendFundz(address payable recipient) public payable {

        deposit();    // This integer can be specified in the frontend based on the transaction type. 

        for (uint256 i=0; i < approvedBeneficiaries.length; i++) {

            // UNICEF 1% of total
            if (benePayout1[approvedBeneficiaries[i]] == true){
                increasePayout(approvedBeneficiaries[i], msg.value*benePayoutPercent1/100);
            }
            // MUMA 5% of total
            if (benePayout2[approvedBeneficiaries[i]] == true){
                increasePayout(approvedBeneficiaries[i], msg.value*benePayoutPercent2/100);
            }
            // DevSol 10% of total
            if (benePayout3[approvedBeneficiaries[i]] == true){
                increasePayout(approvedBeneficiaries[i], msg.value*benePayoutPercent3/100); 
            }
        }
        recipient.transfer(msg.value*( 100-(benePayoutPercent1+benePayoutPercent2+benePayoutPercent3)) /100 );
    }

    // Contract to recieve funds and emit event
    function deposit() public payable {
      emit Deposit( msg.sender, msg.value );
    }

    receive() external payable { 
        deposit();
    }

    // Balance of funds in this contract.
    function contractBalance() public view returns(uint256) {
        uint256 balance = address(this).balance;
        return balance;
    }

    function totalToCharity() public view returns(uint256) {
        return(totalDistributed);
    }

    // Beneficiary calls function to receive their total allowance.
    function getPayout() public returns (bool) {
        address sender = msg.sender;
        for (uint256 i=0; i < approvedBeneficiaries.length; i++) {
            if (approvedBeneficiaries[i] == msg.sender) {
                uint256 allowanceAvailable = _payoutTotals[msg.sender];
                if (allowanceAvailable != 0 && allowanceAvailable > 0) {
                    payable(sender).transfer(allowanceAvailable);
                    decreasePayout(msg.sender, allowanceAvailable);
                    totalDistributed = totalDistributed + allowanceAvailable;
                    emit Withdraw(msg.sender, allowanceAvailable);
                    return(true);
                }
                else{
                    return(false);
                }
            }
        } 
        
        

    }
}