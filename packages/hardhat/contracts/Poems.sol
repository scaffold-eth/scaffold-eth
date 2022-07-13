//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// import "hardhat/console.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Poems is Ownable, EIP712, ERC721, ReentrancyGuard {
    struct MintData {
        uint256 id;
        address poet;
        uint256 amount;
        string title;
        string poem;
    }

    uint256 public tokenId;

    mapping(bytes32 => MintData) minted;
    mapping(uint256 => bytes32) tokens;

    constructor() payable ERC721("POEMS", "POEM") EIP712("POEMS", "1") {}

    function mintPoem(bytes calldata signature, MintData memory data)
        public
        payable
        nonReentrant
        returns (uint256)
    {
        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    keccak256(
                        "Poem(address poet,uint256 amount,string title,string poem)"
                    ),
                    data.poet,
                    data.amount,
                    keccak256(bytes(data.title)),
                    keccak256(bytes(data.poem))
                )
            )
        );
        bytes32 mintId = keccak256(abi.encode(data.poet, data.poem));

        require(
            minted[mintId].poet == address(0),
            "This poem has been minted already"
        );

        address poet = ECDSA.recover(digest, signature);

        require(poet == data.poet, "Wrong Poet signature");
        require(msg.value >= data.amount, "Not enough ETH sent to the Poet");

        tokenId += 1;

        data.id = tokenId;
        minted[mintId] = data;
        tokens[tokenId] = mintId;

        _mint(msg.sender, tokenId);

        // send ETH to Poet
        (bool success, ) = data.poet.call{value: msg.value}("");

        require(success, "Unable to send ETH to Poet");

        return tokenId;
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

    function mintedBy(address poet, string memory poem)
        public
        view
        returns (address)
    {
        uint256 id = minted[keccak256(abi.encode(poet, poem))].id;
        if (_exists(id)) {
            return ownerOf(id);
        }

        return address(0);
    }

    // to support receiving ETH by default
    receive() external payable {}

    fallback() external payable {}
}
