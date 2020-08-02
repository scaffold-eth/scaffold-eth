pragma solidity >=0.6.0 <0.7.0;

import "./IAMB.sol";
import "./ITokenManagement.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract AMBMediator is Ownable {
    using Address for address;

    constructor() public {
    }

    address public bridgeContractAddress;
    address private otherSideContractAddress;
    uint256 public requestGasLimit;

    mapping (bytes32 => bool) public messageFixed;

    function setBridgeContract(address _bridgeContract) external onlyOwner {
        _setBridgeContract(_bridgeContract);
    }

    function _setBridgeContract(address _bridgeContract) internal {
        require(_bridgeContract.isContract(), 'provided address is not a contract');
        bridgeContractAddress = _bridgeContract;
    }

    function bridgeContract() public view returns (IAMB) {
        return IAMB(bridgeContractAddress);
    }

    function setMediatorContractOnOtherSide(address _mediatorContract) external onlyOwner {
        _setMediatorContractOnOtherSide(_mediatorContract);
    }

    function _setMediatorContractOnOtherSide(address _mediatorContract) internal {
        otherSideContractAddress = _mediatorContract;
    }

    function mediatorContractOnOtherSide() public view returns (address) {
        return otherSideContractAddress;
    }

    function setRequestGasLimit(uint256 _requestGasLimit) external onlyOwner {
        _setRequestGasLimit(_requestGasLimit);
    }

    function _setRequestGasLimit(uint256 _requestGasLimit) internal {
        require(_requestGasLimit <= bridgeContract().maxGasPerTx(),'gas limit is higher than the Bridge maximum');
        requestGasLimit = _requestGasLimit;
    }

    /**
    * @dev Tells the address that generated the message on the other network that is currently being executed by
    * the AMB bridge.
    * @return the address of the message sender.
    */
    function messageSender() internal view returns (address) {
        return bridgeContract().messageSender();
    }

    /**
    * @dev Tells the id of the message originated on the other network.
    * @return the id of the message originated on the other network.
    */
    function messageId() internal view returns (bytes32) {
        return bridgeContract().messageId();
    }


    function setMessageFixed(bytes32 _txHash) internal {
        messageFixed[_txHash] = true;
    }

    function requestFailedMessageFix(bytes32 _txHash) external {
        require(!bridgeContract().messageCallStatus(_txHash));
        require(bridgeContract().failedMessageReceiver(_txHash) == address(this));
        require(bridgeContract().failedMessageSender(_txHash) == mediatorContractOnOtherSide());
        bytes32 dataHash = bridgeContract().failedMessageDataHash(_txHash);

        bytes4 methodSelector = ITokenManagement(address(0)).fixFailedMessage.selector;
        bytes memory data = abi.encodeWithSelector(methodSelector, dataHash);
        bridgeContract().requireToPassMessage(mediatorContractOnOtherSide(), data, requestGasLimit);
    }

}
