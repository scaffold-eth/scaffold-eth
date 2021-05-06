pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./IERC1271.sol";

contract SignatureChecker is Ownable {
    using ECDSA for bytes32;
    using Address for address;
    bool public checkSignatureFlag;

    bytes4 internal constant _INTERFACE_ID_ERC1271 = 0x1626ba7e;
    bytes4 internal constant _ERC1271FAILVALUE = 0xffffffff;

    function setCheckSignatureFlag(bool newFlag) public onlyOwner {
      checkSignatureFlag = newFlag;
    }

    function getSigner(bytes32 signedHash, bytes memory signature) public pure returns (address)
    {
        return signedHash.toEthSignedMessageHash().recover(signature);
    }

    function checkSignature(bytes32 signedHash, bytes memory signature, address checkAddress) public view returns (bool) {
      if(checkAddress.isContract()) {
        return IERC1271(checkAddress).isValidSignature(signedHash, signature) == _INTERFACE_ID_ERC1271;
      } else {
        return getSigner(signedHash, signature) == checkAddress;
      }
    }

}
