//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

contract YourContract is ERC721, EIP712, Ownable {
    using ECDSA for bytes32;

    uint256 currentlyMinted;
    uint256 totalMint = 10000;

    uint256 public immutable price = 0.01 ether;

    mapping(uint256 => bool) admissions;

    event tokenAdmitted(uint256 tokenId, address holder);

    constructor()
        payable
        ERC721("Some Event Ticket", "SET")
        EIP712("Some Event Ticket", "0.0.1")
    {}

    // buy ticket
    function buyTicket() public payable returns (uint256 tokenId) {
        require(msg.value >= price, "Not enough ETH sent");
        require(balanceOf(msg.sender) < 1, "1 ticket allowed per address");
        require(currentlyMinted < totalMint, "Tickets are sold out");

        currentlyMinted += 1;
        tokenId = currentlyMinted;

        _mint(msg.sender, tokenId);
    }

    // admit holder with signature and increment nonce for readmission & avoid replay attack
    function admitHolder(
        uint256 tokenId,
        string memory challenge,
        bytes memory signature
    ) public onlyOwner {
        //
        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    keccak256(
                        "Checkin(address owner,uint256 tokenId,string challenge)"
                    ),
                    ownerOf(tokenId),
                    tokenId,
                    keccak256(bytes(challenge))
                )
            )
        );
        address signer = digest.recover(signature);

        console.log("Signer Address", ownerOf(tokenId), signer, block.chainid);

        require(ownerOf(tokenId) == signer, "You do not own this ticket");
        require(
            !admissions[tokenId],
            "This ticket has been used for admission"
        );

        admissions[tokenId] = true;

        emit tokenAdmitted(tokenId, msg.sender);
    }

    // to support receiving ETH by default
    receive() external payable {}

    fallback() external payable {}
}
