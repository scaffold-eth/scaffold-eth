pragma solidity >=0.6.6 <0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Donnor is Ownable {
    mapping(address => bool) public donorAllowList;

    event DonorAllowed(address donor);
    event DonorBlocked(address donor);

    function allowDonor(address donor) public onlyOwner {
        donorAllowList[donor] = true;
        emit DonorAllowed(donor);
    }

    function blockDonor(address donor) public onlyOwner {
        delete donorAllowList[donor];
        emit DonorBlocked(donor);
    }

    modifier onlyAllowedDonor() {
        require(donorAllowList[_msgSender()], "donor not in donorAllowList");
        _;
    }
}
