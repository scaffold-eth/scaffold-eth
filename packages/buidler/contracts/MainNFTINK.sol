pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "./AMBMediator.sol";
import "./ITokenManagement.sol";
import "./IAMB.sol";

contract NFTINK is BaseRelayRecipient, ERC721, Ownable, AMBMediator {

    constructor() ERC721("🎨 Nifty Ink", "NFTINK") public {
      _setBaseURI('ipfs://ipfs/');
    }

    event mintedInk(uint256 id, string inkUrl, string jsonUrl, address to, bytes32 msgId);
    event burnedInk(uint256 id, bytes32 msgId);

    mapping (string => EnumerableSet.UintSet) private _inkTokens;
    mapping (uint256 => string) public tokenInk;

    mapping (bytes32 => uint256) private msgTokenId;
    mapping (bytes32 => address) private msgRecipient;

    function mint(address to, uint256 tokenId, string calldata inkUrl, string calldata jsonUrl) external returns (uint256) {
      _inkTokens[inkUrl].add(tokenId);
      tokenInk[tokenId] = inkUrl;
      _safeMint(to, tokenId);
      _setTokenURI(tokenId, jsonUrl);
      bytes32 msgId = messageId();

      emit mintedInk(tokenId, inkUrl, jsonUrl, to, msgId);

      return tokenId;
    }

    function burn(uint256 _tokenId) internal returns (uint256)   {
      require(_isApprovedOrOwner(_msgSender(), _tokenId), "Caller is not owner nor approved");
      string storage inkUrl = tokenInk[_tokenId];
      _inkTokens[inkUrl].remove(_tokenId);
      delete tokenInk[_tokenId];
      _burn(_tokenId);
  }

  function relayToken(uint256 _tokenId) external returns (bytes32) {

    address _recipient = _msgSender();
    burn(_tokenId);

    bytes4 methodSelector = ITokenManagement(address(0)).unlock.selector;
    bytes memory data = abi.encodeWithSelector(methodSelector, _msgSender(), _tokenId);
    bytes32 msgId = bridgeContract().requireToPassMessage(
        mediatorContractOnOtherSide(),
        data,
        requestGasLimit
    );

    msgTokenId[msgId] = _tokenId;
    msgRecipient[msgId] = _recipient;

    emit burnedInk(_tokenId, msgId);

    return msgId;
  }

    function inkTokenByIndex(string memory inkUrl, uint256 index) public view returns (uint256) {
      return _inkTokens[inkUrl].at(index);
    }

    function versionRecipient() external virtual view override returns (string memory) {
  		return "1.0";
  	}

    function setTrustedForwarder(address _trustedForwarder) public onlyOwner {
      trustedForwarder = _trustedForwarder;
  	}

  	function getTrustedForwarder() public view returns(address) {
  		return trustedForwarder;
  	}

    function _msgSender() internal override(BaseRelayRecipient, Context) view returns (address payable) {
        return BaseRelayRecipient._msgSender();
    }

}
