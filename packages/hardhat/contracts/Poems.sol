//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

contract Poems is Ownable, EIP712, ERC721, ReentrancyGuard {
    struct MintData {
        address poet;
        uint256 amount;
        string title;
        string poem;
    }

    uint256 public tokenId;

    mapping(bytes32 => MintData) minted;
    mapping(uint256 => bytes32) tokens;

    constructor() payable ERC721("POEMS", "POEM") EIP712("POEMS", "1") {}

    function mintPoem(bytes calldata signature, MintData calldata data)
        public
        payable
        nonReentrant
    {
        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    keccak256("Poem(address poet,uint256 amount,string poem)"),
                    data.poet,
                    data.amount,
                    data.poem
                )
            )
        );

        require(
            minted[digest].poet == address(0),
            "This poem has been minted already"
        );

        address poet = ECDSA.recover(digest, signature);

        require(poet == data.poet, "Wrong Poet signature");
        require(msg.value >= data.amount, "Not enough ETH sent to the Poet");

        minted[digest] = data;

        tokenId += 1;

        _mint(msg.sender, tokenId);

        // send ETH to Poet
        (bool success, ) = data.poet.call{value: msg.value}("");

        require(success, "Unable to send ETH to Poet");
    }

    function tokenURI(uint256 id)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(id), "ERC721Metadata: URI query for nonexistent token");

        MintData memory data = minted[tokens[id]];

        // create JSON on chain
        return
            Base64.encode(
                bytes(
                    string(
                        abi.encodePacked(
                            '{"name": "Poem: ',
                            data.title,
                            '", "description": "',
                            data.title,
                            '", "image": "',
                            data.poem,
                            '"}, "attributes": [',
                            '{ "poet": "',
                            data.poet,
                            '" },',
                            "]"
                        )
                    )
                )
            );
    }

    // to support receiving ETH by default
    receive() external payable {}

    fallback() external payable {}
}
