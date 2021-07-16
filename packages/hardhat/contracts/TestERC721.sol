pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT
import "./Interfaces.sol";

contract TestERC721 is ERC165, ERC721 {
    //Points toward the NFT contract to coniditionally mint from
    mapping(uint256 => address) public owner;
    mapping(address => mapping(address => bool)) public operatorList;
    mapping(uint256 => address) public approved;
    mapping(address => uint256) public balances;
    mapping(uint256 => bool) hasMinted;

    constructor() {
        owner[69] = 0xC9FFEe9e34723d882CB97a6c056100661d00Bfe1;
        owner[420] = 0xC9FFEe9e34723d882CB97a6c056100661d00Bfe1;
    }

    function isContract(address addr) public view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }

    function balanceOf(address _owner)
        external
        view
        override
        returns (uint256)
    {
        return balances[_owner];
    }

    function ownerOf(uint256 _tokenId)
        external
        view
        override
        returns (address)
    {
        return owner[_tokenId];
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory data
    ) external payable override {
        require(
            msg.sender == owner[_tokenId] ||
                approved[_tokenId] == msg.sender ||
                operatorList[owner[_tokenId]][msg.sender] == true,
            "Msg.sender not allowed to transfer this NFT!"
        );
        require(_from == owner[_tokenId] && _from != address(0));
        if (isContract(_to)) {
            if (
                ERC721TokenReceiver(_to).onERC721Received(
                    msg.sender,
                    _from,
                    _tokenId,
                    data
                ) == 0x150b7a02
            ) {
                emit Transfer(_from, _to, _tokenId);
                balances[_from]--;
                balances[_to]++;
                approved[_tokenId] = address(0);
                owner[_tokenId] = _to;
            } else {
                revert("receiving address unable to hold ERC721!");
            }
        } else {
            emit Transfer(_from, _to, _tokenId);
            balances[_from]--;
            balances[_to]++;
            approved[_tokenId] = address(0);
            owner[_tokenId] = _to;
        }
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable override {
        require(
            msg.sender == owner[_tokenId] ||
                approved[_tokenId] == msg.sender ||
                operatorList[owner[_tokenId]][msg.sender] == true,
            "Msg.sender not allowed to transfer this NFT!"
        );
        require(_from == owner[_tokenId] && _from != address(0));
        if (isContract(_to)) {
            if (
                ERC721TokenReceiver(_to).onERC721Received(
                    msg.sender,
                    _from,
                    _tokenId,
                    ""
                ) == 0x150b7a02
            ) {
                emit Transfer(_from, _to, _tokenId);
                balances[_from]--;
                balances[_to]++;
                approved[_tokenId] = address(0);
                owner[_tokenId] = _to;
            } else {
                revert("receiving address unable to hold ERC721!");
            }
        } else {
            emit Transfer(_from, _to, _tokenId);
            balances[_from]--;
            balances[_to]++;
            approved[_tokenId] = address(0);
            owner[_tokenId] = _to;
        }
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable override {
        require(
            msg.sender == owner[_tokenId] ||
                approved[_tokenId] == msg.sender ||
                operatorList[owner[_tokenId]][msg.sender] == true,
            "Msg.sender not allowed to transfer this NFT!"
        );
        require(_from == owner[_tokenId] && _from != address(0));
        emit Transfer(_from, _to, _tokenId);
        balances[_from]--;
        balances[_to]++;
        approved[_tokenId] = address(0);
        owner[_tokenId] = _to;
    }

    function approve(address _approved, uint256 _tokenId)
        external
        payable
        override
    {
        require(
            msg.sender == owner[_tokenId] ||
                approved[_tokenId] == msg.sender ||
                operatorList[owner[_tokenId]][msg.sender] == true,
            "Msg.sender not allowed to approve this NFT!"
        );
        emit Approval(owner[_tokenId], _approved, _tokenId);
        approved[_tokenId] = _approved;
    }

    function setApprovalForAll(address _operator, bool _approved)
        external
        override
    {
        emit ApprovalForAll(msg.sender, _operator, _approved);
        operatorList[msg.sender][_operator] = _approved;
    }

    function getApproved(uint256 _tokenId)
        external
        view
        override
        returns (address)
    {
        return approved[_tokenId];
    }

    function isApprovedForAll(address _owner, address _operator)
        external
        view
        override
        returns (bool)
    {
        return operatorList[_owner][_operator];
    }

    function supportsInterface(bytes4 interfaceID)
        external
        pure
        override
        returns (bool)
    {
        return interfaceID == 0x80ac58cd || interfaceID == 0x01ffc9a7;
    }
}
