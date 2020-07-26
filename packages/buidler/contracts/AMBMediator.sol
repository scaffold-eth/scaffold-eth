pragma solidity >=0.6.0 <0.7.0;

import "./IAMB.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract AMBMediator is Ownable {
    using Address for address;

    constructor() public {
    }

    address private bridgeContractAddress;
    address public otherSideContractAddress;
    uint256 public requestGasLimit;

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

}
