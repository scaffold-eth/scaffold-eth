# Understanding GnosisSafe

One of the most used Multisig wallets in the Ethereum ecosystem is the Genosis Safe.
The Genosis Safe smart contracts touch on a lot of complex and deep Ethereum and Solididty concepts.

Additionally its modular structure allows the safe to be easily incorporated into a lot of SC use cases.

This makes the Genosis Safe SC the ideal candidate for an in depth case study.

In this chapter we will be going line by line through the Genosis Safe smart contracts to gain a deep understanding of the design choices the Genosis team took. As well as touch on a multitude of advanced solidity and Ethereum concepts.

[List of Projects using GnosisSafe](https://docs.gnosis-safe.io/introduction/statistics-and-usage/dao-users)

## GnosisSafeMath.sol

`using GnosisSafeMath for uint256;`

`GnosisSafeMath` is a library for using safe math operations that prevent overflows.

Unsigned integers in solidity have a maximum and minumum value (from 0 to 2^256 (1.1579209e+77)).
If the maximum value is reached and then incremented once more the variable is set to 0. The same happens the other way. When the value of the variable is 0 and it is then substracted by 1.

The library GnosisSafeMath prevents this from happening.

NOTE: `SafeMath` is generally not needed starting with Solidity 0.8, since the compiler now has built in overflow checking.

## Variables in Solidity

```solidity
string public constant VERSION = "1.3.0";
```

See [solidity-by-example.org/variables](https://solidity-by-example.org/variables/)

## `keccak256()`

```solidity
// keccak256(
//     "EIP712Domain(uint256 chainId,address verifyingContract)"
// );
bytes32 private constant DOMAIN_SEPARATOR_TYPEHASH = 0x47e79534a245952e8b16893a336b85a3d9ea9fa8c573f3d803afb92a79469218;

// keccak256(
//     "SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)"
// );
bytes32 private constant SAFE_TX_TYPEHASH = 0xbb8310d486368db6bd6f849402fdd73ad53d316b5a4b2644ad6efe0f941286d8;
```

[Ethereums hash function](https://ethereum.stackexchange.com/questions/11572/how-does-the-keccak256-hash-function-work)
[What is a hash function?](https://resources.infosecinstitute.com/topic/hash-functions-in-blockchain/)

## `uint256 public nonce`

```solidity
uint256 public nonce;
```

[nonce](https://ethereum.stackexchange.com/a/27450)

## `mapping()`

```solidity
// Mapping to keep track of all message hashes that have been approved by ALL REQUIRED owners
mapping(bytes32 => uint256) public signedMessages;
// Mapping to keep track of all hashes (message or transaction) that have been approved by ANY owners
mapping(address => mapping(bytes32 => uint256)) public approvedHashes;
```

[mappings-in-solidity-explained-in-under-two-minutes](https://medium.com/upstate-interactive/mappings-in-solidity-explained-in-under-two-minutes-ecba88aff96e)

## `constructor()`

```solidity
// This constructor ensures that this contract can only be used as a master copy for Proxy contracts
constructor() {
    // By setting the threshold it is not possible to call setup anymore,
    // so we create a Safe with 0 owners and threshold 1.
    // This is an unusable Safe, perfect for the singleton
    threshold = 1;
}
```

[the-solidity-constructor](https://ethereum-blockchain-developer.com/028-fallback-view-constructor/03-the-solidity-constructor/)

## `function setup()`

```solidity
/// @dev Setup function sets initial storage of contract.
/// @param _owners List of Safe owners.
/// @param _threshold Number of required confirmations for a Safe transaction.
/// @param to Contract address for optional delegate call.
/// @param data Data payload for optional delegate call.
/// @param fallbackHandler Handler for fallback calls to this contract
/// @param paymentToken Token that should be used for the payment (0 is ETH)
/// @param payment Value that should be paid
/// @param paymentReceiver Address that should receive the payment (or 0 if tx.origin)
function setup(
    address[] calldata _owners,
    uint256 _threshold,
    address to,
    bytes calldata data,
    address fallbackHandler,
    address paymentToken,
    uint256 payment,
    address payable paymentReceiver
) external {
    // setupOwners checks if the Threshold is already set, therefore preventing that this method is called twice
    setupOwners(_owners, _threshold);
    if (fallbackHandler != address(0)) internalSetFallbackHandler(fallbackHandler);
    // As setupOwners can only be called if the contract has not been initialized we don't need a check for setupModules
    setupModules(to, data);

    if (payment > 0) {
        // To avoid running into issues with EIP-170 we reuse the handlePayment function (to avoid adjusting code of that has been verified we do not adjust the method itself)
        // baseGas = 0, gasPrice = 1 and gas = payment => amount = (payment + 0) * 1 = payment
        handlePayment(payment, 0, 1, paymentToken, paymentReceiver);
    }
    emit SafeSetup(msg.sender, _owners, _threshold, to, fallbackHandler);
}
```

`calldata`: (special data location that contains the function arguments, only available for external function call parameters).

`address` vs. `address payable`: https://ethereum.stackexchange.com/a/64109

`function name() external` - `modifier`
see Function Visibility Specifiers: https://docs.soliditylang.org/en/v0.8.13/cheatsheet.html?highlight=external#function-visibility-specifiers
https://www.tutorialspoint.com/solidity/solidity_function_modifiers.htm

`bytes`: https://ethereum.stackexchange.com/a/11771

`memory` vs. `calldata`: https://ethereum.stackexchange.com/a/74443

`virtual` function: https://medium.com/upstate-interactive/solidity-override-vs-virtual-functions-c0a5dfb83aaf

`if (fallbackHandler != address(0)) internalSetFallbackHandler(fallbackHandler);`
-> `FallbackManager.sol`

## `FallbackManager.sol`

```solidity
contract FallbackManager is SelfAuthorized {
 ...
}
```

### `sstore(slot, handler)`

See [evm-opcodes](https://github.com/wolflo/evm-opcodes)

| Hex   | Name          | Gas   | Stack      | Mem / Storage | Notes |
| :---: | :---          | :---: | :---       | :---          | :---  |
55      | SSTORE        |[A7](gas.md#a7-sstore)   | `key, val` => `.` | storage[key] := val | write word to storage

https://github.com/wolflo/evm-opcodes/blob/main/gas.md#a7-sstore

`assembly {}` -> Inline Assembly ([solidity docs](https://docs.soliditylang.org/en/v0.8.10/assembly.html))

```solidity
function setFallbackHandler(address handler) public authorized {
    internalSetFallbackHandler(handler);
    emit ChangedFallbackHandler(handler);
}
```

[What is a fallback handler and how does it relate to the Gnosis Safe?](https://help.gnosis-safe.io/en/articles/4738352-what-is-a-fallback-handler-and-how-does-it-relate-to-the-gnosis-safe)

TODO:
setupModules(to, data); ->
handlePayment(payment, 0, 1, paymentToken, paymentReceiver); ->

## `checkSignatures()`

```solidity
function checkSignatures(
    bytes32 dataHash,
    bytes memory data,
    bytes memory signatures
) public view {
    // Load threshold to avoid multiple storage loads
    uint256 _threshold = threshold;
    // Check that a threshold is set
    require(_threshold > 0, "GS001");
    checkNSignatures(dataHash, data, signatures, _threshold);
}
```

```solidity
function checkNSignatures(
    bytes32 dataHash,
    bytes memory data,
    bytes memory signatures,
    uint256 requiredSignatures
) public view {
  ...
}
```

``SignatureDecoder.sol``

```solidity
contract SignatureDecoder {

}
```

[The Magic of Digital Signatures on Ethereum](https://medium.com/mycrypto/the-magic-of-digital-signatures-on-ethereum-98fe184dc9c7)

[EIP1271](https://eips.ethereum.org/EIPS/eip-1271)

TODO:
question: why this?
require(currentOwner > lastOwner && owners[currentOwner] != address(0) && currentOwner != SENTINEL_OWNERS, "GS026");

## `requiredTxGas()`

```solidity
function requiredTxGas(
    address to,
    uint256 value,
    bytes calldata data,
    Enum.Operation operation
) external returns (uint256) {
    uint256 startGas = gasleft();
    // We don't provide an error message here, as we use it to return the estimate
    require(execute(to, value, data, operation, gasleft()));
    uint256 requiredGas = startGas - gasleft();
    // Convert response to string and return via error message
    revert(string(abi.encodePacked(requiredGas)));
}
```

The function `gasleft` was previously known as `msg.gas`, which was deprecated in version 0.4.21 and removed in version 0.5.0. ([source](https://docs.soliditylang.org/en/v0.8.7/units-and-global-variables.html?highlight=gasLeft))

## `delegatecall()` & `call()`

``Executor.sol``

```solidity
contract Executor {
  ...
}
```

``Enum.sol``

```solidity
contract Enum {
    enum Operation {Call, DelegateCall}
}
```

`delegatecall()` & `call()`

* [Solidity: Delegatecall vs Call vs Library](https://www.blocksism.com/solidity-delegatecall-call-library/)
* [How to use low level call for contract function calls and payments in Solidity](https://kushgoyal.com/ethereum-solidity-how-use-call-delegatecall/)

`abi.encodePacked()`
[What are ABI encoding functions in Solidity](https://medium.com/@libertylocked/what-are-abi-encoding-functions-in-solidity-0-4-24-c1a90b5ddce8)

## `approveHash()`

```solidity
function approveHash(bytes32 hashToApprove) external {
    require(owners[msg.sender] != address(0), "GS030");
    approvedHashes[msg.sender][hashToApprove] = 1;
    emit ApproveHash(hashToApprove, msg.sender);
}
```

## `getChainId()`

```solidity
function getChainId() public view returns (uint256) {}
```

## `domainSeparator()`

```solidity
function domainSeparator() public view returns (bytes32) {
    return keccak256(abi.encode(DOMAIN_SEPARATOR_TYPEHASH, getChainId(), this));
}
```

## `encodeTransactionData()`

```solidity
function encodeTransactionData(){}
```

## `getTransactionHash()`
