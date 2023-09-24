import "@unlock-protocol/contracts/dist/Unlock/IUnlockV11.sol";
pragma solidity ^0.8.0;

contract ThirdWebUnlockFactory {
  address unlockAddress;

  event ProxyDeployed(address indexed implementation, address proxy, address indexed deployer);

  constructor(address _unlockAddress) {
    unlockAddress = _unlockAddress;
  }

  function deployProxyByImplementation(address implementation, bytes calldata data, bytes32) external returns (address) {
    IUnlockV11 unlock = IUnlockV11(unlockAddress); // The version of Unlock should actually not matter.
    uint16 v = unlock.publicLockVersions(implementation);
    
    address newLockAddress = unlock.createUpgradeableLockAtVersion(data, v);
    
    emit ProxyDeployed(implementation, newLockAddress, msg.sender);

    return newLockAddress;
  }
}