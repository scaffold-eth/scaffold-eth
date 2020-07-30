pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "./AMBMediator.sol";
import "./INiftyToken.sol";
import "./INiftyInk.sol";
import "./INiftyRegistry.sol";

contract NiftyMediator is BaseRelayRecipient, Ownable, AMBMediator {

    event tokenSentViaBridge(uint256 _tokenId, bytes32 _msgId);
    event failedMessageFixed(bytes32 _msgId, address _recipient, uint256 _tokenId);

    address public niftyRegistry;

    function setNiftyRegistry(address _address) public onlyOwner {
      niftyRegistry = _address;
    }

    function niftyToken() private view returns (INiftyToken) {
      return INiftyToken(INiftyRegistry(niftyRegistry).tokenAddress());
    }

    function niftyInk() private view returns (INiftyInk) {
      return INiftyInk(INiftyRegistry(niftyRegistry).inkAddress());
    }

    mapping (bytes32 => uint256) private msgTokenId;
    mapping (bytes32 => address) private msgRecipient;

    function relayToken(uint256 _tokenId) external returns (bytes32) {
      require(_msgSender() == niftyToken().ownerOf(_tokenId));
      niftyToken().lock(_tokenId);

      string memory _inkUrl = niftyToken().tokenInk(_tokenId);

      (, , string memory _jsonUrl, , , , ) = niftyInk().inkInfoByInkUrl(_inkUrl);

      bytes4 methodSelector = ITokenManagement(address(0)).mint.selector;
      bytes memory data = abi.encodeWithSelector(methodSelector, _msgSender(), _tokenId, _inkUrl, _jsonUrl);
      bytes32 msgId = bridgeContract().requireToPassMessage(
          mediatorContractOnOtherSide(),
          data,
          requestGasLimit
      );

      msgTokenId[msgId] = _tokenId;
      msgRecipient[msgId] = _msgSender();

      emit tokenSentViaBridge(_tokenId, msgId);

      return msgId;
    }

    function fixFailedMessage(bytes32 _msgId) external {
      require(msg.sender == address(bridgeContract()));
      require(bridgeContract().messageSender() == mediatorContractOnOtherSide());
      require(!messageFixed[_msgId]);

      address _recipient = msgRecipient[_msgId];
      uint256 _tokenId = msgTokenId[_msgId];

      messageFixed[_msgId] = true;
      niftyToken().unlock(_tokenId, _recipient);

      emit failedMessageFixed(_msgId, _recipient, _tokenId);
    }

    function versionRecipient() external virtual view override returns (string memory) {
  		return "1.0";
  	}

    function getTrustedForwarder() public view returns(address) {
  		return INiftyRegistry(niftyRegistry).trustedForwarder();
  	}

    function _msgSender() internal override(BaseRelayRecipient, Context) view returns (address payable) {
        return BaseRelayRecipient._msgSender();
    }

}
