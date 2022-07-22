// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.4;

/// @notice create opcode failed
error CreateError();
/// @notice create2 opcode failed
error Create2Error();

library Clones {
  /**
   * @dev Deploys and returns the address of a clone that mimics the behaviour of `implementation`
   * except when someone calls `receive()` and then it emits an event matching
   * `SplitWallet.ReceiveETH(indexed address, amount)`
   * Inspired by OZ & 0age's minimal clone implementations based on eip 1167 found at
   * https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.3.0/contracts/proxy/Clones.sol
   * and https://medium.com/coinmonks/the-more-minimal-proxy-5756ae08ee48
   *
   * This function uses the create2 opcode and a `salt` to deterministically deploy
   * the clone. Using the same `implementation` and `salt` multiple time will revert, since
   * the clones cannot be deployed twice at the same address.
   *
   * init: 0x3d605d80600a3d3981f3
   * 3d   returndatasize  0
   * 605d push1 0x5d      0x5d 0
   * 80   dup1            0x5d 0x5d 0
   * 600a push1 0x0a      0x0a 0x5d 0x5d 0
   * 3d   returndatasize  0 0x0a 0x5d 0x5d 0
   * 39   codecopy        0x5d 0                      destOffset offset length     memory[destOffset:destOffset+length] = address(this).code[offset:offset+length]       copy executing contracts bytecode
   * 81   dup2            0 0x5d 0
   * f3   return          0                           offset length                return memory[offset:offset+length]                                                   returns from this contract call
   *
   * contract: 0x36603057343d52307f830d2d700a97af574b186c80d40429385d24241565b08a7c559ba283a964d9b160203da23d3df35b3d3d3d3d363d3d37363d73bebebebebebebebebebebebebebebebebebebebe5af43d3d93803e605b57fd5bf3
   *     0x000     36       calldatasize      cds
   *     0x001     6030     push1 0x30        0x30 cds
   * ,=< 0x003     57       jumpi
   * |   0x004     34       callvalue         cv
   * |   0x005     3d       returndatasize    0 cv
   * |   0x006     52       mstore
   * |   0x007     30       address           addr
   * |   0x008     7f830d.. push32 0x830d..   id addr
   * |   0x029     6020     push1 0x20        0x20 id addr
   * |   0x02b     3d       returndatasize    0 0x20 id addr
   * |   0x02c     a2       log2
   * |   0x02d     3d       returndatasize    0
   * |   0x02e     3d       returndatasize    0 0
   * |   0x02f     f3       return
   * `-> 0x030     5b       jumpdest
   *     0x031     3d       returndatasize    0
   *     0x032     3d       returndatasize    0 0
   *     0x033     3d       returndatasize    0 0 0
   *     0x034     3d       returndatasize    0 0 0 0
   *     0x035     36       calldatasize      cds 0 0 0 0
   *     0x036     3d       returndatasize    0 cds 0 0 0 0
   *     0x037     3d       returndatasize    0 0 cds 0 0 0 0
   *     0x038     37       calldatacopy      0 0 0 0
   *     0x039     36       calldatasize      cds 0 0 0 0
   *     0x03a     3d       returndatasize    0 cds 0 0 0 0
   *     0x03b     73bebe.. push20 0xbebe..   0xbebe 0 cds 0 0 0 0
   *     0x050     5a       gas               gas 0xbebe 0 cds 0 0 0 0
   *     0x051     f4       delegatecall      suc 0 0
   *     0x052     3d       returndatasize    rds suc 0 0
   *     0x053     3d       returndatasize    rds rds suc 0 0
   *     0x054     93       swap4             0 rds suc 0 rds
   *     0x055     80       dup1              0 0 rds suc 0 rds
   *     0x056     3e       returndatacopy    suc 0 rds
   *     0x057     605b     push1 0x5b        0x5b suc 0 rds
   * ,=< 0x059     57       jumpi             0 rds
   * |   0x05a     fd       revert
   * `-> 0x05b     5b       jumpdest          0 rds
   *     0x05c     f3       return
   *
   */
  function clone(address implementation) internal returns (address instance) {
    assembly {
      let ptr := mload(0x40)
      mstore(
        ptr,
        0x3d605d80600a3d3981f336603057343d52307f00000000000000000000000000
      )
      mstore(
        add(ptr, 0x13),
        0x830d2d700a97af574b186c80d40429385d24241565b08a7c559ba283a964d9b1
      )
      mstore(
        add(ptr, 0x33),
        0x60203da23d3df35b3d3d3d3d363d3d37363d7300000000000000000000000000
      )
      mstore(add(ptr, 0x46), shl(0x60, implementation))
      mstore(
        add(ptr, 0x5a),
        0x5af43d3d93803e605b57fd5bf300000000000000000000000000000000000000
      )
      instance := create(0, ptr, 0x67)
    }
    if (instance == address(0)) revert CreateError();
  }

  function cloneDeterministic(address implementation, bytes32 salt)
    internal
    returns (address instance)
  {
    assembly {
      let ptr := mload(0x40)
      mstore(
        ptr,
        0x3d605d80600a3d3981f336603057343d52307f00000000000000000000000000
      )
      mstore(
        add(ptr, 0x13),
        0x830d2d700a97af574b186c80d40429385d24241565b08a7c559ba283a964d9b1
      )
      mstore(
        add(ptr, 0x33),
        0x60203da23d3df35b3d3d3d3d363d3d37363d7300000000000000000000000000
      )
      mstore(add(ptr, 0x46), shl(0x60, implementation))
      mstore(
        add(ptr, 0x5a),
        0x5af43d3d93803e605b57fd5bf300000000000000000000000000000000000000
      )
      instance := create2(0, ptr, 0x67, salt)
    }
    if (instance == address(0)) revert Create2Error();
  }

  /**
   * @dev Computes the address of a clone deployed using {Clones-cloneDeterministic}.
   */
  function predictDeterministicAddress(
    address implementation,
    bytes32 salt,
    address deployer
  ) internal pure returns (address predicted) {
    assembly {
      let ptr := mload(0x40)
      mstore(
        ptr,
        0x3d605d80600a3d3981f336603057343d52307f00000000000000000000000000
      )
      mstore(
        add(ptr, 0x13),
        0x830d2d700a97af574b186c80d40429385d24241565b08a7c559ba283a964d9b1
      )
      mstore(
        add(ptr, 0x33),
        0x60203da23d3df35b3d3d3d3d363d3d37363d7300000000000000000000000000
      )
      mstore(add(ptr, 0x46), shl(0x60, implementation))
      mstore(
        add(ptr, 0x5a),
        0x5af43d3d93803e605b57fd5bf3ff000000000000000000000000000000000000
      )
      mstore(add(ptr, 0x68), shl(0x60, deployer))
      mstore(add(ptr, 0x7c), salt)
      mstore(add(ptr, 0x9c), keccak256(ptr, 0x67))
      predicted := keccak256(add(ptr, 0x67), 0x55)
    }
  }

  /**
   * @dev Computes the address of a clone deployed using {Clones-cloneDeterministic}.
   */
  function predictDeterministicAddress(address implementation, bytes32 salt)
    internal
    view
    returns (address predicted)
  {
    return predictDeterministicAddress(implementation, salt, address(this));
  }
}