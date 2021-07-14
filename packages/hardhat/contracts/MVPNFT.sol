pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

interface ERC721 {
    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);
    function balanceOf(address _owner) external view returns (uint256);
    function ownerOf(uint256 _tokenId) external view returns (address);
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes memory data) external payable;
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable;
    function transferFrom(address _from, address _to, uint256 _tokenId) external payable;
    function approve(address _approved, uint256 _tokenId) external payable;
    function setApprovalForAll(address _operator, bool _approved) external;
    function getApproved(uint256 _tokenId) external view returns (address);
    function isApprovedForAll(address _owner, address _operator) external view returns (bool);
}
interface ERC165 {
    function supportsInterface(bytes4 interfaceID) external view returns (bool);
}
interface ERC721TokenReceiver {
    function onERC721Received(address _operator, address _from, uint256 _tokenId, bytes memory _data) external returns(bytes4);
}


contract MVPNFT is ERC721, ERC165 {
    /*
    The MVP NFT is a lightweight 1/1 NFT contract that conforms to the ERC721 standard in a way that makes it extremely simple for someone to understand what is going on from etherscan.
    Since the token is a 1/1, the tokenId is set to 1, however this could in theory be any value and would just need to update the rest of the contract
    */

    //arbitrary string to be stored at the top of the contract
    string public arbString = "Scaffold-eth RULES!";
    address public owner; 
    uint public tokenId = 1;
    mapping (uint => address) public approvedList;
    //currently declaring the owner as my local acct on scaffold-eth
    constructor() {
        owner = 0xC9FFEe9e34723d882CB97a6c056100661d00Bfe1;
        emit Transfer(address(0), address(0), tokenId);
    }

    function isContract(address addr) public view returns(bool) {
      uint size;
      assembly { size := extcodesize(addr) }
      return size > 0;
    }

    function balanceOf(address _queryAddress) external view override returns (uint) {
        if(_queryAddress == owner) {
            return 1;
        } else {
            return 0;
        }
    }

    function ownerOf(uint _tokenId) external view override returns (address) {
        if(_tokenId == tokenId) {
            return owner;
        } else {
            return address(0);
        }
    }

    function safeTransferFrom(address _from, address _to, uint _tokenId, bytes memory data) external override payable {
        require(msg.sender == owner || approvedList[tokenId] == msg.sender, "Msg.sender not allowed to transfer this NFT!");
        require(_from == owner && _from != address(0) && _tokenId == tokenId);
        if(isContract(_to)) {
            if(ERC721TokenReceiver(_to).onERC721Received(msg.sender, _from, _tokenId, data) == 0x150b7a02) {
                emit Transfer(_from, _to, _tokenId);
                approvedList[tokenId] = address(0);
                owner = _to;
            } else {
                revert("receiving address unable to hold ERC721!");
            }
        } else {
            emit Transfer(_from, _to, _tokenId);
            approvedList[tokenId] = address(0);
            owner = _to;
        }
    }

    function safeTransferFrom(address _from, address _to, uint _tokenId) external override payable {
        require(msg.sender == owner || approvedList[tokenId] == msg.sender, "Msg.sender not allowed to transfer this NFT!");
        require(_from == owner && _from != address(0) && _tokenId == tokenId);
        if(isContract(_to)) {
            if(ERC721TokenReceiver(_to).onERC721Received(msg.sender, _from, _tokenId, "") == 0x150b7a02) {
                emit Transfer(_from, _to, _tokenId);
                approvedList[tokenId] = address(0);
                owner = _to;
            }
            else {
                revert("receiving address unable to hold ERC721!");
            }
        }
        else {
            emit Transfer(_from, _to, _tokenId);
            approvedList[tokenId] = address(0);
            owner = _to;
        }
    }

    function transferFrom(address _from, address _to, uint _tokenId) external override payable {
        require(msg.sender == owner || approvedList[tokenId] == msg.sender, "Msg.sender not allowed to transfer this NFT!");
        require(_from == owner && _from != address(0) && _tokenId == tokenId);
        emit Transfer(_from, _to, _tokenId);
        approvedList[tokenId] = address(0);
        owner = _to;
    }

    function approve(address _approved, uint256 _tokenId) external override payable {
        require(msg.sender == owner || approvedList[tokenId] == msg.sender, "Msg.sender not allowed to approve");
        require(_tokenId == tokenId, "tokenId invald");
        emit Approval(owner, _approved, _tokenId);
        approvedList[tokenId] == _approved;
    }

    function setApprovalForAll(address _operator, bool _approved) external override {
        require(msg.sender == owner, "Msg.sender not owner!");
        if (_approved) {
            emit ApprovalForAll(owner, _operator, _approved);
            approvedList[tokenId] == _operator;
        } else {
            emit ApprovalForAll(owner, address(0), _approved);
            approvedList[tokenId] = address(0);
        }
    }

    function getApproved(uint _tokenId) external view override returns (address) {
        return approvedList[tokenId];
    }

    function isApprovedForAll(address _owner, address _operator) external view override returns (bool) {
        return approvedList[tokenId] == _operator;
    }

    function supportsInterface(bytes4 interfaceID) external pure override returns (bool) {
       return interfaceID == 0x80ac58cd ||
              interfaceID == 0x01ffc9a7;
    }
}
