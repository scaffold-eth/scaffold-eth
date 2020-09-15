pragma solidity >=0.6.6 <0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DonorManager is Ownable {
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

    function canDonate() external view returns (bool) {
        return donorAllowList[_msgSender()];
    }
}
