pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "./AMBMediator.sol";
import "./INiftyToken.sol";
import "./INiftyInk.sol";
import "./INiftyRegistry.sol";
import "./SignatureChecker.sol";

contract NiftyMediator is BaseRelayRecipient, Ownable, AMBMediator, SignatureChecker {

    constructor() public {
      setCheckSignatureFlag(true);
      setFeeReceiver(_msgSender());
    }

    event tokenSentViaBridge(uint256 _tokenId, bytes32 _msgId);
    event failedMessageFixed(bytes32 _msgId, address _recipient, uint256 _tokenId);
    event newPrice(uint256 price);

    address public niftyRegistry;
    uint256 public relayPrice;
    address payable public feeReceiver;

    function setRelayPrice(uint256 _price) public onlyOwner {
      relayPrice = _price;
      emit newPrice(_price);
    }

    function setFeeReceiver(address payable _receiver) public onlyOwner {
      feeReceiver = _receiver;
    }

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

    function _relayToken(uint256 _tokenId) internal returns (bytes32) {
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

    function relayToken(uint256 _tokenId) external payable returns (bytes32) {
      require(_msgSender() == niftyToken().ownerOf(_tokenId), 'only the owner can upgrade!');
      require(msg.value >= relayPrice, "Amount sent too small");
      feeReceiver.transfer(msg.value);

      return _relayToken(_tokenId);
    }


    function relayTokenFromSignature(uint256 _tokenId, bytes calldata signature) external returns (bytes32) {
      require(relayPrice == 0, "cannot relay from signature, price > 0");
      address _owner = niftyToken().ownerOf(_tokenId);
      bytes32 messageHash = keccak256(abi.encodePacked(byte(0x19), byte(0), address(this), _owner, _tokenId));
      bool isOwnerSignature = checkSignature(messageHash, signature, _owner);
      require(isOwnerSignature || !checkSignatureFlag, "only the owner can upgrade!");

      return _relayToken(_tokenId);
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

    function setTrustedForwarder(address _trustedForwarder) public onlyOwner {
      trustedForwarder = _trustedForwarder;
    }

    function getTrustedForwarder() public view returns(address) {
      return trustedForwarder;
    }

    function _msgSender() internal override(BaseRelayRecipient, Context) view returns (address payable) {
        return BaseRelayRecipient._msgSender();
    }

    function _msgData() internal override(BaseRelayRecipient, Context) view returns (bytes memory ret) {
        return BaseRelayRecipient._msgData();
    }

}
