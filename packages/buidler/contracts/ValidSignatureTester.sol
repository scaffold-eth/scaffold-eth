pragma solidity >=0.6.0 <0.7.0;

import "./IERC1271.sol";

contract ValidSignatureTester {

  bytes4 internal constant _ERC1271MAGICVALUE = 0x1626ba7e;
  bytes4 internal constant _ERC1271FAILVALUE = 0xffffffff;

  bool public setting;

  function changeSetting() public returns (bool) {
    setting = !setting;
    return setting;
  }

  function isValidSignature(
      bytes32 _hash, //bytes memory _data,
      bytes calldata _signature
  )
  external
  view
  returns (bytes4 magicValue) {
    if(setting==true) {
      return _ERC1271MAGICVALUE;
    } else {
      return _ERC1271FAILVALUE;
    }
  }
}
