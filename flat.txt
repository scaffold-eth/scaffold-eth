// Sources flattened with buidler v1.3.3-rc.0 https://buidler.dev

// File contracts/IAMB.sol

pragma solidity >=0.6.0 <0.7.0;

interface IAMB {
    function messageSender() external view returns (address);
    function maxGasPerTx() external view returns (uint256);
    function transactionHash() external view returns (bytes32);
    function messageId() external view returns (bytes32);
    function messageSourceChainId() external view returns (bytes32);
    function messageCallStatus(bytes32 _messageId) external view returns (bool);
    function failedMessageDataHash(bytes32 _messageId) external view returns (bytes32);
    function failedMessageReceiver(bytes32 _messageId) external view returns (address);
    function failedMessageSender(bytes32 _messageId) external view returns (address);
    function requireToPassMessage(address _contract, bytes calldata _data, uint256 _gas) external returns (bytes32);
}


// File contracts/ITokenManagement.sol

pragma solidity >=0.6.0 <0.7.0;

interface ITokenManagement {

  function mint(address to, uint256 tokenId, string calldata inkUrl, string calldata jsonUrl) external returns (uint256);
  function fixFailedMessage(bytes32 _dataHash) external;

}


// File @openzeppelin/contracts/GSN/Context.sol@v3.0.2

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

/*
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with GSN meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
contract Context {
    // Empty internal constructor, to prevent people from mistakenly deploying
    // an instance of this contract, which should be used via inheritance.
    constructor () internal { }

    function _msgSender() internal view virtual returns (address payable) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}


// File @openzeppelin/contracts/access/Ownable.sol@v3.0.2

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor () internal {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(_owner == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}


// File @openzeppelin/contracts/utils/Address.sol@v3.0.2

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.2;

/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // According to EIP-1052, 0x0 is the value returned for not-yet created accounts
        // and 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470 is returned
        // for accounts without code, i.e. `keccak256('')`
        bytes32 codehash;
        bytes32 accountHash = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
        // solhint-disable-next-line no-inline-assembly
        assembly { codehash := extcodehash(account) }
        return (codehash != accountHash && codehash != 0x0);
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        // solhint-disable-next-line avoid-low-level-calls, avoid-call-value
        (bool success, ) = recipient.call{ value: amount }("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }
}


// File contracts/AMBMediator.sol

pragma solidity >=0.6.0 <0.7.0;





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


// File @openzeppelin/contracts/math/SafeMath.sol@v3.0.2

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * `SafeMath` restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts with custom message when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}


// File @openzeppelin/contracts/utils/Counters.sol@v3.0.2

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;


/**
 * @title Counters
 * @author Matt Condon (@shrugs)
 * @dev Provides counters that can only be incremented or decremented by one. This can be used e.g. to track the number
 * of elements in a mapping, issuing ERC721 ids, or counting request ids.
 *
 * Include with `using Counters for Counters.Counter;`
 * Since it is not possible to overflow a 256 bit integer with increments of one, `increment` can skip the {SafeMath}
 * overflow check, thereby saving gas. This does assume however correct usage, in that the underlying `_value` is never
 * directly accessed.
 */
library Counters {
    using SafeMath for uint256;

    struct Counter {
        // This variable should never be directly accessed by users of the library: interactions must be restricted to
        // the library's function. As of Solidity v0.5.2, this cannot be enforced, though there is a proposal to add
        // this feature: see https://github.com/ethereum/solidity/issues/4637
        uint256 _value; // default: 0
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        // The {SafeMath} overflow check can be skipped here, see the comment at the top
        counter._value += 1;
    }

    function decrement(Counter storage counter) internal {
        counter._value = counter._value.sub(1);
    }
}


// File @opengsn/gsn/contracts/0x/errors/LibBytesRichErrorsV06.sol@v0.10.0

// SPDX-License-Identifier:APACHE-2.0
/*

  Copyright 2020 ZeroEx Intl.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

*/

pragma solidity ^0.6.2;


library LibBytesRichErrorsV06 {

    enum InvalidByteOperationErrorCodes {
        FromLessThanOrEqualsToRequired,
        ToLessThanOrEqualsLengthRequired,
        LengthGreaterThanZeroRequired,
        LengthGreaterThanOrEqualsFourRequired,
        LengthGreaterThanOrEqualsTwentyRequired,
        LengthGreaterThanOrEqualsThirtyTwoRequired,
        LengthGreaterThanOrEqualsNestedBytesLengthRequired,
        DestinationLengthGreaterThanOrEqualSourceLengthRequired
    }

    // bytes4(keccak256("InvalidByteOperationError(uint8,uint256,uint256)"))
    bytes4 internal constant INVALID_BYTE_OPERATION_ERROR_SELECTOR =
        0x28006595;

    // solhint-disable func-name-mixedcase
    function InvalidByteOperationError(
        InvalidByteOperationErrorCodes errorCode,
        uint256 offset,
        uint256 required
    )
        internal
        pure
        returns (bytes memory)
    {
        return abi.encodeWithSelector(
            INVALID_BYTE_OPERATION_ERROR_SELECTOR,
            errorCode,
            offset,
            required
        );
    }
}


// File @opengsn/gsn/contracts/0x/errors/LibRichErrorsV06.sol@v0.10.0

// SPDX-License-Identifier:APACHE-2.0
/*

  Copyright 2020 ZeroEx Intl.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

*/

pragma solidity ^0.6.2;


library LibRichErrorsV06 {

    // bytes4(keccak256("Error(string)"))
    bytes4 internal constant STANDARD_ERROR_SELECTOR = 0x08c379a0;

    // solhint-disable func-name-mixedcase
    /// @dev ABI encode a standard, string revert error payload.
    ///      This is the same payload that would be included by a `revert(string)`
    ///      solidity statement. It has the function signature `Error(string)`.
    /// @param message The error string.
    /// @return The ABI encoded error.
    function StandardError(string memory message)
        internal
        pure
        returns (bytes memory)
    {
        return abi.encodeWithSelector(
            STANDARD_ERROR_SELECTOR,
            bytes(message)
        );
    }
    // solhint-enable func-name-mixedcase

    /// @dev Reverts an encoded rich revert reason `errorData`.
    /// @param errorData ABI encoded error data.
    function rrevert(bytes memory errorData)
        internal
        pure
    {
        assembly {
            revert(add(errorData, 0x20), mload(errorData))
        }
    }
}


// File @opengsn/gsn/contracts/0x/LibBytesV06.sol@v0.10.0

// SPDX-License-Identifier:APACHE-2.0
/*

  Copyright 2020 ZeroEx Intl.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

*/

pragma solidity ^0.6.2;




library LibBytesV06 {

    using LibBytesV06 for bytes;

    /// @dev Gets the memory address for a byte array.
    /// @param input Byte array to lookup.
    /// @return memoryAddress Memory address of byte array. This
    ///         points to the header of the byte array which contains
    ///         the length.
    function rawAddress(bytes memory input)
        internal
        pure
        returns (uint256 memoryAddress)
    {
        assembly {
            memoryAddress := input
        }
        return memoryAddress;
    }

    /// @dev Gets the memory address for the contents of a byte array.
    /// @param input Byte array to lookup.
    /// @return memoryAddress Memory address of the contents of the byte array.
    function contentAddress(bytes memory input)
        internal
        pure
        returns (uint256 memoryAddress)
    {
        assembly {
            memoryAddress := add(input, 32)
        }
        return memoryAddress;
    }

    /// @dev Copies `length` bytes from memory location `source` to `dest`.
    /// @param dest memory address to copy bytes to.
    /// @param source memory address to copy bytes from.
    /// @param length number of bytes to copy.
    function memCopy(
        uint256 dest,
        uint256 source,
        uint256 length
    )
        internal
        pure
    {
        if (length < 32) {
            // Handle a partial word by reading destination and masking
            // off the bits we are interested in.
            // This correctly handles overlap, zero lengths and source == dest
            assembly {
                let mask := sub(exp(256, sub(32, length)), 1)
                let s := and(mload(source), not(mask))
                let d := and(mload(dest), mask)
                mstore(dest, or(s, d))
            }
        } else {
            // Skip the O(length) loop when source == dest.
            if (source == dest) {
                return;
            }

            // For large copies we copy whole words at a time. The final
            // word is aligned to the end of the range (instead of after the
            // previous) to handle partial words. So a copy will look like this:
            //
            //  ####
            //      ####
            //          ####
            //            ####
            //
            // We handle overlap in the source and destination range by
            // changing the copying direction. This prevents us from
            // overwriting parts of source that we still need to copy.
            //
            // This correctly handles source == dest
            //
            if (source > dest) {
                assembly {
                    // We subtract 32 from `sEnd` and `dEnd` because it
                    // is easier to compare with in the loop, and these
                    // are also the addresses we need for copying the
                    // last bytes.
                    length := sub(length, 32)
                    let sEnd := add(source, length)
                    let dEnd := add(dest, length)

                    // Remember the last 32 bytes of source
                    // This needs to be done here and not after the loop
                    // because we may have overwritten the last bytes in
                    // source already due to overlap.
                    let last := mload(sEnd)

                    // Copy whole words front to back
                    // Note: the first check is always true,
                    // this could have been a do-while loop.
                    // solhint-disable-next-line no-empty-blocks
                    for {} lt(source, sEnd) {} {
                        mstore(dest, mload(source))
                        source := add(source, 32)
                        dest := add(dest, 32)
                    }

                    // Write the last 32 bytes
                    mstore(dEnd, last)
                }
            } else {
                assembly {
                    // We subtract 32 from `sEnd` and `dEnd` because those
                    // are the starting points when copying a word at the end.
                    length := sub(length, 32)
                    let sEnd := add(source, length)
                    let dEnd := add(dest, length)

                    // Remember the first 32 bytes of source
                    // This needs to be done here and not after the loop
                    // because we may have overwritten the first bytes in
                    // source already due to overlap.
                    let first := mload(source)

                    // Copy whole words back to front
                    // We use a signed comparisson here to allow dEnd to become
                    // negative (happens when source and dest < 32). Valid
                    // addresses in local memory will never be larger than
                    // 2**255, so they can be safely re-interpreted as signed.
                    // Note: the first check is always true,
                    // this could have been a do-while loop.
                    // solhint-disable-next-line no-empty-blocks
                    for {} slt(dest, dEnd) {} {
                        mstore(dEnd, mload(sEnd))
                        sEnd := sub(sEnd, 32)
                        dEnd := sub(dEnd, 32)
                    }

                    // Write the first 32 bytes
                    mstore(dest, first)
                }
            }
        }
    }

    /// @dev Returns a slices from a byte array.
    /// @param b The byte array to take a slice from.
    /// @param from The starting index for the slice (inclusive).
    /// @param to The final index for the slice (exclusive).
    /// @return result The slice containing bytes at indices [from, to)
    function slice(
        bytes memory b,
        uint256 from,
        uint256 to
    )
        internal
        pure
        returns (bytes memory result)
    {
        // Ensure that the from and to positions are valid positions for a slice within
        // the byte array that is being used.
        if (from > to) {
            LibRichErrorsV06.rrevert(LibBytesRichErrorsV06.InvalidByteOperationError(
                LibBytesRichErrorsV06.InvalidByteOperationErrorCodes.FromLessThanOrEqualsToRequired,
                from,
                to
            ));
        }
        if (to > b.length) {
            LibRichErrorsV06.rrevert(LibBytesRichErrorsV06.InvalidByteOperationError(
                LibBytesRichErrorsV06.InvalidByteOperationErrorCodes.ToLessThanOrEqualsLengthRequired,
                to,
                b.length
            ));
        }

        // Create a new bytes structure and copy contents
        result = new bytes(to - from);
        memCopy(
            result.contentAddress(),
            b.contentAddress() + from,
            result.length
        );
        return result;
    }

    /// @dev Returns a slice from a byte array without preserving the input.
    ///      When `from == 0`, the original array will match the slice.
    ///      In other cases its state will be corrupted.
    /// @param b The byte array to take a slice from. Will be destroyed in the process.
    /// @param from The starting index for the slice (inclusive).
    /// @param to The final index for the slice (exclusive).
    /// @return result The slice containing bytes at indices [from, to)
    function sliceDestructive(
        bytes memory b,
        uint256 from,
        uint256 to
    )
        internal
        pure
        returns (bytes memory result)
    {
        // Ensure that the from and to positions are valid positions for a slice within
        // the byte array that is being used.
        if (from > to) {
            LibRichErrorsV06.rrevert(LibBytesRichErrorsV06.InvalidByteOperationError(
                LibBytesRichErrorsV06.InvalidByteOperationErrorCodes.FromLessThanOrEqualsToRequired,
                from,
                to
            ));
        }
        if (to > b.length) {
            LibRichErrorsV06.rrevert(LibBytesRichErrorsV06.InvalidByteOperationError(
                LibBytesRichErrorsV06.InvalidByteOperationErrorCodes.ToLessThanOrEqualsLengthRequired,
                to,
                b.length
            ));
        }

        // Create a new bytes structure around [from, to) in-place.
        assembly {
            result := add(b, from)
            mstore(result, sub(to, from))
        }
        return result;
    }

    /// @dev Pops the last byte off of a byte array by modifying its length.
    /// @param b Byte array that will be modified.
    /// @return result The byte that was popped off.
    function popLastByte(bytes memory b)
        internal
        pure
        returns (bytes1 result)
    {
        if (b.length == 0) {
            LibRichErrorsV06.rrevert(LibBytesRichErrorsV06.InvalidByteOperationError(
                LibBytesRichErrorsV06.InvalidByteOperationErrorCodes.LengthGreaterThanZeroRequired,
                b.length,
                0
            ));
        }

        // Store last byte.
        result = b[b.length - 1];

        assembly {
            // Decrement length of byte array.
            let newLen := sub(mload(b), 1)
            mstore(b, newLen)
        }
        return result;
    }

    /// @dev Tests equality of two byte arrays.
    /// @param lhs First byte array to compare.
    /// @param rhs Second byte array to compare.
    /// @return equal True if arrays are the same. False otherwise.
    function equals(
        bytes memory lhs,
        bytes memory rhs
    )
        internal
        pure
        returns (bool equal)
    {
        // Keccak gas cost is 30 + numWords * 6. This is a cheap way to compare.
        // We early exit on unequal lengths, but keccak would also correctly
        // handle this.
        return lhs.length == rhs.length && keccak256(lhs) == keccak256(rhs);
    }

    /// @dev Reads an address from a position in a byte array.
    /// @param b Byte array containing an address.
    /// @param index Index in byte array of address.
    /// @return result address from byte array.
    function readAddress(
        bytes memory b,
        uint256 index
    )
        internal
        pure
        returns (address result)
    {
        if (b.length < index + 20) {
            LibRichErrorsV06.rrevert(LibBytesRichErrorsV06.InvalidByteOperationError(
                LibBytesRichErrorsV06.InvalidByteOperationErrorCodes.LengthGreaterThanOrEqualsTwentyRequired,
                b.length,
                index + 20 // 20 is length of address
            ));
        }

        // Add offset to index:
        // 1. Arrays are prefixed by 32-byte length parameter (add 32 to index)
        // 2. Account for size difference between address length and 32-byte storage word (subtract 12 from index)
        index += 20;

        // Read address from array memory
        assembly {
            // 1. Add index to address of bytes array
            // 2. Load 32-byte word from memory
            // 3. Apply 20-byte mask to obtain address
            result := and(mload(add(b, index)), 0xffffffffffffffffffffffffffffffffffffffff)
        }
        return result;
    }

    /// @dev Writes an address into a specific position in a byte array.
    /// @param b Byte array to insert address into.
    /// @param index Index in byte array of address.
    /// @param input Address to put into byte array.
    function writeAddress(
        bytes memory b,
        uint256 index,
        address input
    )
        internal
        pure
    {
        if (b.length < index + 20) {
            LibRichErrorsV06.rrevert(LibBytesRichErrorsV06.InvalidByteOperationError(
                LibBytesRichErrorsV06.InvalidByteOperationErrorCodes.LengthGreaterThanOrEqualsTwentyRequired,
                b.length,
                index + 20 // 20 is length of address
            ));
        }

        // Add offset to index:
        // 1. Arrays are prefixed by 32-byte length parameter (add 32 to index)
        // 2. Account for size difference between address length and 32-byte storage word (subtract 12 from index)
        index += 20;

        // Store address into array memory
        assembly {
            // The address occupies 20 bytes and mstore stores 32 bytes.
            // First fetch the 32-byte word where we'll be storing the address, then
            // apply a mask so we have only the bytes in the word that the address will not occupy.
            // Then combine these bytes with the address and store the 32 bytes back to memory with mstore.

            // 1. Add index to address of bytes array
            // 2. Load 32-byte word from memory
            // 3. Apply 12-byte mask to obtain extra bytes occupying word of memory where we'll store the address
            let neighbors := and(
                mload(add(b, index)),
                0xffffffffffffffffffffffff0000000000000000000000000000000000000000
            )

            // Make sure input address is clean.
            // (Solidity does not guarantee this)
            input := and(input, 0xffffffffffffffffffffffffffffffffffffffff)

            // Store the neighbors and address into memory
            mstore(add(b, index), xor(input, neighbors))
        }
    }

    /// @dev Reads a bytes32 value from a position in a byte array.
    /// @param b Byte array containing a bytes32 value.
    /// @param index Index in byte array of bytes32 value.
    /// @return result bytes32 value from byte array.
    function readBytes32(
        bytes memory b,
        uint256 index
    )
        internal
        pure
        returns (bytes32 result)
    {
        if (b.length < index + 32) {
            LibRichErrorsV06.rrevert(LibBytesRichErrorsV06.InvalidByteOperationError(
                LibBytesRichErrorsV06.InvalidByteOperationErrorCodes.LengthGreaterThanOrEqualsThirtyTwoRequired,
                b.length,
                index + 32
            ));
        }

        // Arrays are prefixed by a 256 bit length parameter
        index += 32;

        // Read the bytes32 from array memory
        assembly {
            result := mload(add(b, index))
        }
        return result;
    }

    /// @dev Writes a bytes32 into a specific position in a byte array.
    /// @param b Byte array to insert <input> into.
    /// @param index Index in byte array of <input>.
    /// @param input bytes32 to put into byte array.
    function writeBytes32(
        bytes memory b,
        uint256 index,
        bytes32 input
    )
        internal
        pure
    {
        if (b.length < index + 32) {
            LibRichErrorsV06.rrevert(LibBytesRichErrorsV06.InvalidByteOperationError(
                LibBytesRichErrorsV06.InvalidByteOperationErrorCodes.LengthGreaterThanOrEqualsThirtyTwoRequired,
                b.length,
                index + 32
            ));
        }

        // Arrays are prefixed by a 256 bit length parameter
        index += 32;

        // Read the bytes32 from array memory
        assembly {
            mstore(add(b, index), input)
        }
    }

    /// @dev Reads a uint256 value from a position in a byte array.
    /// @param b Byte array containing a uint256 value.
    /// @param index Index in byte array of uint256 value.
    /// @return result uint256 value from byte array.
    function readUint256(
        bytes memory b,
        uint256 index
    )
        internal
        pure
        returns (uint256 result)
    {
        result = uint256(readBytes32(b, index));
        return result;
    }

    /// @dev Writes a uint256 into a specific position in a byte array.
    /// @param b Byte array to insert <input> into.
    /// @param index Index in byte array of <input>.
    /// @param input uint256 to put into byte array.
    function writeUint256(
        bytes memory b,
        uint256 index,
        uint256 input
    )
        internal
        pure
    {
        writeBytes32(b, index, bytes32(input));
    }

    /// @dev Reads an unpadded bytes4 value from a position in a byte array.
    /// @param b Byte array containing a bytes4 value.
    /// @param index Index in byte array of bytes4 value.
    /// @return result bytes4 value from byte array.
    function readBytes4(
        bytes memory b,
        uint256 index
    )
        internal
        pure
        returns (bytes4 result)
    {
        if (b.length < index + 4) {
            LibRichErrorsV06.rrevert(LibBytesRichErrorsV06.InvalidByteOperationError(
                LibBytesRichErrorsV06.InvalidByteOperationErrorCodes.LengthGreaterThanOrEqualsFourRequired,
                b.length,
                index + 4
            ));
        }

        // Arrays are prefixed by a 32 byte length field
        index += 32;

        // Read the bytes4 from array memory
        assembly {
            result := mload(add(b, index))
            // Solidity does not require us to clean the trailing bytes.
            // We do it anyway
            result := and(result, 0xFFFFFFFF00000000000000000000000000000000000000000000000000000000)
        }
        return result;
    }

    /// @dev Writes a new length to a byte array.
    ///      Decreasing length will lead to removing the corresponding lower order bytes from the byte array.
    ///      Increasing length may lead to appending adjacent in-memory bytes to the end of the byte array.
    /// @param b Bytes array to write new length to.
    /// @param length New length of byte array.
    function writeLength(bytes memory b, uint256 length)
        internal
        pure
    {
        assembly {
            mstore(b, length)
        }
    }
}


// File @opengsn/gsn/contracts/interfaces/IRelayRecipient.sol@v0.10.0

// SPDX-License-Identifier:MIT
pragma solidity ^0.6.2;

/**
 * a contract must implement this interface in order to support relayed transaction.
 * It is better to inherit the BaseRelayRecipient as its implementation.
 */
abstract contract IRelayRecipient {

    /**
     * return if the forwarder is trusted to forward relayed transactions to us.
     * the forwarder is required to verify the sender's signature, and verify
     * the call is not a replay.
     */
    function isTrustedForwarder(address forwarder) public virtual view returns(bool);

    /**
     * return the sender of this call.
     * if the call came through our trusted forwarder, then the real sender is appended as the last 20 bytes
     * of the msg.data.
     * otherwise, return `msg.sender`
     * should be used in the contract anywhere instead of msg.sender
     */
    function _msgSender() internal virtual view returns (address payable);

    function versionRecipient() external virtual view returns (string memory);
}


// File @opengsn/gsn/contracts/BaseRelayRecipient.sol@v0.10.0

// SPDX-License-Identifier:MIT
pragma solidity ^0.6.2;



/**
 * A base contract to be inherited by any contract that want to receive relayed transactions
 * A subclass must use "_msgSender()" instead of "msg.sender"
 */
abstract contract BaseRelayRecipient is IRelayRecipient {

    /// the TrustedForwarder singleton we accept calls from.
    // we trust it to verify the caller's signature, and pass the caller's address as last 20 bytes
    address internal trustedForwarder;

    /*
     * require a function to be called through GSN only
     */
    modifier trustedForwarderOnly() {
        require(msg.sender == address(trustedForwarder), "Function can only be called through trustedForwarder");
        _;
    }

    function isTrustedForwarder(address forwarder) public override view returns(bool) {
        return forwarder == trustedForwarder;
    }

    /**
     * return the sender of this call.
     * if the call came through our trusted forwarder, return the original sender.
     * otherwise, return `msg.sender`.
     * should be used in the contract anywhere instead of msg.sender
     */
    function _msgSender() internal override virtual view returns (address payable) {
        if (msg.data.length >= 24 && isTrustedForwarder(msg.sender)) {
            // At this point we know that the sender is a trusted forwarder,
            // so we trust that the last bytes of msg.data are the verified sender address.
            // extract sender address from the end of msg.data
            return address(uint160(LibBytesV06.readAddress(msg.data, msg.data.length - 20)));
        }
        return msg.sender;
    }
}


// File @openzeppelin/contracts/utils/EnumerableSet.sol@v3.0.2

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

/**
 * @dev Library for managing
 * https://en.wikipedia.org/wiki/Set_(abstract_data_type)[sets] of primitive
 * types.
 *
 * Sets have the following properties:
 *
 * - Elements are added, removed, and checked for existence in constant time
 * (O(1)).
 * - Elements are enumerated in O(n). No guarantees are made on the ordering.
 *
 * ```
 * contract Example {
 *     // Add the library methods
 *     using EnumerableSet for EnumerableSet.AddressSet;
 *
 *     // Declare a set state variable
 *     EnumerableSet.AddressSet private mySet;
 * }
 * ```
 *
 * As of v3.0.0, only sets of type `address` (`AddressSet`) and `uint256`
 * (`UintSet`) are supported.
 */
library EnumerableSet {
    // To implement this library for multiple types with as little code
    // repetition as possible, we write it in terms of a generic Set type with
    // bytes32 values.
    // The Set implementation uses private functions, and user-facing
    // implementations (such as AddressSet) are just wrappers around the
    // underlying Set.
    // This means that we can only create new EnumerableSets for types that fit
    // in bytes32.

    struct Set {
        // Storage of set values
        bytes32[] _values;

        // Position of the value in the `values` array, plus 1 because index 0
        // means a value is not in the set.
        mapping (bytes32 => uint256) _indexes;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function _add(Set storage set, bytes32 value) private returns (bool) {
        if (!_contains(set, value)) {
            set._values.push(value);
            // The value is stored at length-1, but we add 1 to all indexes
            // and use 0 as a sentinel value
            set._indexes[value] = set._values.length;
            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function _remove(Set storage set, bytes32 value) private returns (bool) {
        // We read and store the value's index to prevent multiple reads from the same storage slot
        uint256 valueIndex = set._indexes[value];

        if (valueIndex != 0) { // Equivalent to contains(set, value)
            // To delete an element from the _values array in O(1), we swap the element to delete with the last one in
            // the array, and then remove the last element (sometimes called as 'swap and pop').
            // This modifies the order of the array, as noted in {at}.

            uint256 toDeleteIndex = valueIndex - 1;
            uint256 lastIndex = set._values.length - 1;

            // When the value to delete is the last one, the swap operation is unnecessary. However, since this occurs
            // so rarely, we still do the swap anyway to avoid the gas cost of adding an 'if' statement.

            bytes32 lastvalue = set._values[lastIndex];

            // Move the last value to the index where the value to delete is
            set._values[toDeleteIndex] = lastvalue;
            // Update the index for the moved value
            set._indexes[lastvalue] = toDeleteIndex + 1; // All indexes are 1-based

            // Delete the slot where the moved value was stored
            set._values.pop();

            // Delete the index for the deleted slot
            delete set._indexes[value];

            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function _contains(Set storage set, bytes32 value) private view returns (bool) {
        return set._indexes[value] != 0;
    }

    /**
     * @dev Returns the number of values on the set. O(1).
     */
    function _length(Set storage set) private view returns (uint256) {
        return set._values.length;
    }

   /**
    * @dev Returns the value stored at position `index` in the set. O(1).
    *
    * Note that there are no guarantees on the ordering of values inside the
    * array, and it may change when more values are added or removed.
    *
    * Requirements:
    *
    * - `index` must be strictly less than {length}.
    */
    function _at(Set storage set, uint256 index) private view returns (bytes32) {
        require(set._values.length > index, "EnumerableSet: index out of bounds");
        return set._values[index];
    }

    // AddressSet

    struct AddressSet {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(AddressSet storage set, address value) internal returns (bool) {
        return _add(set._inner, bytes32(uint256(value)));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(AddressSet storage set, address value) internal returns (bool) {
        return _remove(set._inner, bytes32(uint256(value)));
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(AddressSet storage set, address value) internal view returns (bool) {
        return _contains(set._inner, bytes32(uint256(value)));
    }

    /**
     * @dev Returns the number of values in the set. O(1).
     */
    function length(AddressSet storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

   /**
    * @dev Returns the value stored at position `index` in the set. O(1).
    *
    * Note that there are no guarantees on the ordering of values inside the
    * array, and it may change when more values are added or removed.
    *
    * Requirements:
    *
    * - `index` must be strictly less than {length}.
    */
    function at(AddressSet storage set, uint256 index) internal view returns (address) {
        return address(uint256(_at(set._inner, index)));
    }


    // UintSet

    struct UintSet {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(UintSet storage set, uint256 value) internal returns (bool) {
        return _add(set._inner, bytes32(value));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(UintSet storage set, uint256 value) internal returns (bool) {
        return _remove(set._inner, bytes32(value));
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(UintSet storage set, uint256 value) internal view returns (bool) {
        return _contains(set._inner, bytes32(value));
    }

    /**
     * @dev Returns the number of values on the set. O(1).
     */
    function length(UintSet storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

   /**
    * @dev Returns the value stored at position `index` in the set. O(1).
    *
    * Note that there are no guarantees on the ordering of values inside the
    * array, and it may change when more values are added or removed.
    *
    * Requirements:
    *
    * - `index` must be strictly less than {length}.
    */
    function at(UintSet storage set, uint256 index) internal view returns (uint256) {
        return uint256(_at(set._inner, index));
    }
}


// File @openzeppelin/contracts/cryptography/ECDSA.sol@v3.0.2

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

/**
 * @dev Elliptic Curve Digital Signature Algorithm (ECDSA) operations.
 *
 * These functions can be used to verify that a message was signed by the holder
 * of the private keys of a given address.
 */
library ECDSA {
    /**
     * @dev Returns the address that signed a hashed message (`hash`) with
     * `signature`. This address can then be used for verification purposes.
     *
     * The `ecrecover` EVM opcode allows for malleable (non-unique) signatures:
     * this function rejects them by requiring the `s` value to be in the lower
     * half order, and the `v` value to be either 27 or 28.
     *
     * IMPORTANT: `hash` _must_ be the result of a hash operation for the
     * verification to be secure: it is possible to craft signatures that
     * recover to arbitrary addresses for non-hashed data. A safe way to ensure
     * this is by receiving a hash of the original message (which may otherwise
     * be too long), and then calling {toEthSignedMessageHash} on it.
     */
    function recover(bytes32 hash, bytes memory signature) internal pure returns (address) {
        // Check the signature length
        if (signature.length != 65) {
            revert("ECDSA: invalid signature length");
        }

        // Divide the signature in r, s and v variables
        bytes32 r;
        bytes32 s;
        uint8 v;

        // ecrecover takes the signature parameters, and the only way to get them
        // currently is to use assembly.
        // solhint-disable-next-line no-inline-assembly
        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
        }

        // EIP-2 still allows signature malleability for ecrecover(). Remove this possibility and make the signature
        // unique. Appendix F in the Ethereum Yellow paper (https://ethereum.github.io/yellowpaper/paper.pdf), defines
        // the valid range for s in (281): 0 < s < secp256k1n ÷ 2 + 1, and for v in (282): v ∈ {27, 28}. Most
        // signatures from current libraries generate a unique signature with an s-value in the lower half order.
        //
        // If your library generates malleable signatures, such as s-values in the upper range, calculate a new s-value
        // with 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141 - s1 and flip v from 27 to 28 or
        // vice versa. If your library also generates signatures with 0/1 for v instead 27/28, add 27 to v to accept
        // these malleable signatures as well.
        if (uint256(s) > 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) {
            revert("ECDSA: invalid signature 's' value");
        }

        if (v != 27 && v != 28) {
            revert("ECDSA: invalid signature 'v' value");
        }

        // If the signature is valid (and not malleable), return the signer address
        address signer = ecrecover(hash, v, r, s);
        require(signer != address(0), "ECDSA: invalid signature");

        return signer;
    }

    /**
     * @dev Returns an Ethereum Signed Message, created from a `hash`. This
     * replicates the behavior of the
     * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign[`eth_sign`]
     * JSON-RPC method.
     *
     * See {recover}.
     */
    function toEthSignedMessageHash(bytes32 hash) internal pure returns (bytes32) {
        // 32 is the length in bytes of hash,
        // enforced by the type signature above
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }
}


// File contracts/IERC1271.sol

// SPDX-License-Identifier: CC0-1.0
pragma solidity >=0.5.0 <0.7.0;

/**
 * @notice ERC-1271: Standard Signature Validation Method for Contracts
 */
interface IERC1271 {

//    bytes4 internal constant _ERC1271MAGICVALUE = 0x1626ba7e;
//    bytes4 internal constant _ERC1271FAILVALUE = 0xffffffff;

    /**
     * @dev Should return whether the signature provided is valid for the provided data
     * @param _hash hash of the data signed//Arbitrary length data signed on the behalf of address(this)
     * @param _signature Signature byte array associated with _data
     *
     * @return magicValue either 0x1626ba7e on success or 0xffffffff failure
     */
    function isValidSignature(
        bytes32 _hash, //bytes memory _data,
        bytes calldata _signature
    )
    external
    view
    returns (bytes4 magicValue);
}


// File contracts/SignatureChecker.sol

pragma solidity >=0.6.0 <0.7.0;





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


// File contracts/Liker.sol

pragma solidity >=0.6.0 <0.7.0;







contract Liker is Ownable, BaseRelayRecipient, SignatureChecker {
  using ECDSA for bytes32;
  using Counters for Counters.Counter;
  using EnumerableSet for EnumerableSet.UintSet;
  using SafeMath for uint256;

  Counters.Counter public totalLikes;

  event liked(uint256 LikeId, address targetContract, uint256 target, uint256 targetId, address liker);
  event contractAdded(address targetContract, address contractOwner);
  event contractRemoved(address targetContract, address contractOwner);

  struct Like {
    uint256 id;
    address liker;
    uint256 targetId;
    address contractAddress;
    uint256 target;
    bool exists;
  }

  EnumerableSet.UintSet private likeIds;
  mapping(address => bool) public registeredContracts;
  mapping(address => address) public contractOwner;
  mapping(uint256 => Like) private likeById;
  mapping(address => EnumerableSet.UintSet) private addressLikes;
  mapping(uint256 => EnumerableSet.UintSet) private targetLikes;
  mapping(address => EnumerableSet.UintSet) private contractLikes;

  function getTargetId(address contractAddress, uint256 target) public view returns (uint256) {
    return uint256(keccak256(
        abi.encodePacked(
            byte(0x19),
            byte(0),
            address(this),
            contractAddress,
            target
    )));
  }

  function _newLike(address contractAddress, uint256 target, address liker) internal returns (uint256) {
    require(registeredContracts[contractAddress],"this contract is not registered");
    uint256 targetId = getTargetId(contractAddress, target);
    uint256 likeId = uint256(keccak256(abi.encodePacked(byte(0x19),byte(0),address(this),contractAddress,target,liker)));
    require(!likeById[likeId].exists,"this like has already been liked");

    totalLikes.increment();

    Like memory _like = Like({
      id: likeId,
      liker: liker,
      targetId: targetId,
      contractAddress: contractAddress,
      target: target,
      exists: true
    });

    likeIds.add(likeId);
    likeById[likeId] = _like;
    addressLikes[liker].add(likeId);
    targetLikes[targetId].add(likeId);
    contractLikes[contractAddress].add(likeId);

    emit liked(likeId, contractAddress, target, targetId, liker);
  }

  function like(address contractAddress, uint256 target) public returns (uint256) {
    return _newLike(contractAddress, target, _msgSender());
  }

  function likeWithSignature(address contractAddress, uint256 target, address liker, bytes memory signature) public returns (uint256) {
    bytes32 messageHash = keccak256(abi.encodePacked(byte(0x19),byte(0),address(this),contractAddress,target,liker));
    bool isArtistSignature = checkSignature(messageHash, signature, liker);
    require(isArtistSignature || !checkSignatureFlag, "Unable to verify the artist signature");
    return _newLike(contractAddress, target, liker);
  }

  function checkLike(address contractAddress, uint256 target, address liker) public view returns (bool) {
    require(registeredContracts[contractAddress],"this contract is not registered");
    uint256 likeId = uint256(keccak256(abi.encodePacked(byte(0x19),byte(0),address(this),contractAddress,target,liker)));
    return likeById[likeId].exists;
  }

  function getLikeIdByIndex(uint256 index) public view returns (uint256) {
    return likeIds.at(index);
  }

  function getLikeInfoById(uint256 likeId) public view returns (uint256, address, uint256, address, uint256) {
    require(likeById[likeId].exists, 'like does not exist');
    Like storage _like = likeById[likeId];
    return (likeId, _like.liker, _like.targetId, _like.contractAddress, _like.target);
  }

  function getLikesByTargetId(uint256 targetId) public view returns (uint256) {
    return targetLikes[targetId].length();
  }

  function getLikesByTarget(address contractAddress, uint256 target) public view returns (uint256) {
    uint256 targetId = getTargetId(contractAddress, target);
    return targetLikes[targetId].length();
  }

  function getLikesByContract(address contractAddress) public view returns (uint256) {
    require(registeredContracts[contractAddress],"this contract is not registered");
    return contractLikes[contractAddress].length();
  }

  function getLikesByLiker(address liker) public view returns (uint256) {
    return addressLikes[liker].length();
  }

  function addContract(address contractAddress) public returns (bool) {
    require(!registeredContracts[contractAddress],"this contract is already registered");
    registeredContracts[contractAddress] = true;
    address _contractOwner = _msgSender();
    contractOwner[contractAddress] = _contractOwner;
    emit contractAdded(contractAddress, _contractOwner);
    return true;
  }

  function removeContract(address contractAddress) public returns (bool) {
    require(registeredContracts[contractAddress],"this contract is not registered");
    address _contractOwner = _msgSender();
    require(contractOwner[contractAddress] == _contractOwner, 'only the contract owner can remove');
    registeredContracts[contractAddress] = false;
    emit contractRemoved(contractAddress, _contractOwner);
    return false;
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


// File @openzeppelin/contracts/introspection/IERC165.sol@v3.0.2

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

/**
 * @dev Interface of the ERC165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[EIP].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 */
interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}


// File @openzeppelin/contracts/token/ERC721/IERC721.sol@v3.0.2

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.2;


/**
 * @dev Required interface of an ERC721 compliant contract.
 */
interface IERC721 is IERC165 {
    /**
     * @dev Emitted when `tokenId` token is transfered from `from` to `to`.
     */
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    /**
     * @dev Emitted when `owner` enables `approved` to manage the `tokenId` token.
     */
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    /**
     * @dev Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets.
     */
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function balanceOf(address owner) external view returns (uint256 balance);

    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function ownerOf(uint256 tokenId) external view returns (address owner);

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
     *
     * Requirements:
     *
     * - `from`, `to` cannot be zero.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must be have been allowed to move this token by either {approve} or {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId) external;

    /**
     * @dev Transfers `tokenId` token from `from` to `to`.
     *
     * WARNING: Usage of this method is discouraged, use {safeTransferFrom} whenever possible.
     *
     * Requirements:
     *
     * - `from`, `to` cannot be zero.
     * - `tokenId` token must be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 tokenId) external;

    /**
     * @dev Gives permission to `to` to transfer `tokenId` token to another account.
     * The approval is cleared when the token is transferred.
     *
     * Only a single account can be approved at a time, so approving the zero address clears previous approvals.
     *
     * Requirements:
     *
     * - The caller must own the token or be an approved operator.
     * - `tokenId` must exist.
     *
     * Emits an {Approval} event.
     */
    function approve(address to, uint256 tokenId) external;

    /**
     * @dev Returns the account approved for `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function getApproved(uint256 tokenId) external view returns (address operator);

    /**
     * @dev Approve or remove `operator` as an operator for the caller.
     * Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
     *
     * Requirements:
     *
     * - The `operator` cannot be the caller.
     *
     * Emits an {ApprovalForAll} event.
     */
    function setApprovalForAll(address operator, bool _approved) external;

    /**
     * @dev Returns if the `operator` is allowed to manage all of the assets of `owner`.
     *
     * See {setApprovalForAll}
     */
    function isApprovedForAll(address owner, address operator) external view returns (bool);

    /**
      * @dev Safely transfers `tokenId` token from `from` to `to`.
      *
      * Requirements:
      *
      * - `from`, `to` cannot be zero.
      * - `tokenId` token must exist and be owned by `from`.
      * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
      * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
      *
      * Emits a {Transfer} event.
      */
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;
}


// File @openzeppelin/contracts/token/ERC721/IERC721Metadata.sol@v3.0.2

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.2;


/**
 * @title ERC-721 Non-Fungible Token Standard, optional metadata extension
 * @dev See https://eips.ethereum.org/EIPS/eip-721
 */
interface IERC721Metadata is IERC721 {

    /**
     * @dev Returns the token collection name.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the token collection symbol.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the Uniform Resource Identifier (URI) for `tokenId` token.
     */
    function tokenURI(uint256 tokenId) external view returns (string memory);
}


// File @openzeppelin/contracts/token/ERC721/IERC721Enumerable.sol@v3.0.2

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.2;


/**
 * @title ERC-721 Non-Fungible Token Standard, optional enumeration extension
 * @dev See https://eips.ethereum.org/EIPS/eip-721
 */
interface IERC721Enumerable is IERC721 {

    /**
     * @dev Returns the total amount of tokens stored by the contract.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns a token ID owned by `owner` at a given `index` of its token list.
     * Use along with {balanceOf} to enumerate all of ``owner``'s tokens.
     */
    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256 tokenId);

    /**
     * @dev Returns a token ID at a given `index` of all the tokens stored by the contract.
     * Use along with {totalSupply} to enumerate all tokens.
     */
    function tokenByIndex(uint256 index) external view returns (uint256);
}


// File @openzeppelin/contracts/token/ERC721/IERC721Receiver.sol@v3.0.2

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

/**
 * @title ERC721 token receiver interface
 * @dev Interface for any contract that wants to support safeTransfers
 * from ERC721 asset contracts.
 */
abstract contract IERC721Receiver {
    /**
     * @notice Handle the receipt of an NFT
     * @dev The ERC721 smart contract calls this function on the recipient
     * after a {IERC721-safeTransferFrom}. This function MUST return the function selector,
     * otherwise the caller will revert the transaction. The selector to be
     * returned can be obtained as `this.onERC721Received.selector`. This
     * function MAY throw to revert and reject the transfer.
     * Note: the ERC721 contract address is always the message sender.
     * @param operator The address which called `safeTransferFrom` function
     * @param from The address which previously owned the token
     * @param tokenId The NFT identifier which is being transferred
     * @param data Additional data with no specified format
     * @return bytes4 `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
     */
    function onERC721Received(address operator, address from, uint256 tokenId, bytes memory data)
    public virtual returns (bytes4);
}


// File @openzeppelin/contracts/introspection/ERC165.sol@v3.0.2

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;


/**
 * @dev Implementation of the {IERC165} interface.
 *
 * Contracts may inherit from this and call {_registerInterface} to declare
 * their support of an interface.
 */
contract ERC165 is IERC165 {
    /*
     * bytes4(keccak256('supportsInterface(bytes4)')) == 0x01ffc9a7
     */
    bytes4 private constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;

    /**
     * @dev Mapping of interface ids to whether or not it's supported.
     */
    mapping(bytes4 => bool) private _supportedInterfaces;

    constructor () internal {
        // Derived contracts need only register support for their own interfaces,
        // we register support for ERC165 itself here
        _registerInterface(_INTERFACE_ID_ERC165);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     *
     * Time complexity O(1), guaranteed to always use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        return _supportedInterfaces[interfaceId];
    }

    /**
     * @dev Registers the contract as an implementer of the interface defined by
     * `interfaceId`. Support of the actual ERC165 interface is automatic and
     * registering its interface id is not required.
     *
     * See {IERC165-supportsInterface}.
     *
     * Requirements:
     *
     * - `interfaceId` cannot be the ERC165 invalid interface (`0xffffffff`).
     */
    function _registerInterface(bytes4 interfaceId) internal virtual {
        require(interfaceId != 0xffffffff, "ERC165: invalid interface id");
        _supportedInterfaces[interfaceId] = true;
    }
}


// File @openzeppelin/contracts/utils/EnumerableMap.sol@v3.0.2

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

/**
 * @dev Library for managing an enumerable variant of Solidity's
 * https://solidity.readthedocs.io/en/latest/types.html#mapping-types[`mapping`]
 * type.
 *
 * Maps have the following properties:
 *
 * - Entries are added, removed, and checked for existence in constant time
 * (O(1)).
 * - Entries are enumerated in O(n). No guarantees are made on the ordering.
 *
 * ```
 * contract Example {
 *     // Add the library methods
 *     using EnumerableMap for EnumerableMap.UintToAddressMap;
 *
 *     // Declare a set state variable
 *     EnumerableMap.UintToAddressMap private myMap;
 * }
 * ```
 *
 * As of v3.0.0, only maps of type `uint256 -> address` (`UintToAddressMap`) are
 * supported.
 */
library EnumerableMap {
    // To implement this library for multiple types with as little code
    // repetition as possible, we write it in terms of a generic Map type with
    // bytes32 keys and values.
    // The Map implementation uses private functions, and user-facing
    // implementations (such as Uint256ToAddressMap) are just wrappers around
    // the underlying Map.
    // This means that we can only create new EnumerableMaps for types that fit
    // in bytes32.

    struct MapEntry {
        bytes32 _key;
        bytes32 _value;
    }

    struct Map {
        // Storage of map keys and values
        MapEntry[] _entries;

        // Position of the entry defined by a key in the `entries` array, plus 1
        // because index 0 means a key is not in the map.
        mapping (bytes32 => uint256) _indexes;
    }

    /**
     * @dev Adds a key-value pair to a map, or updates the value for an existing
     * key. O(1).
     *
     * Returns true if the key was added to the map, that is if it was not
     * already present.
     */
    function _set(Map storage map, bytes32 key, bytes32 value) private returns (bool) {
        // We read and store the key's index to prevent multiple reads from the same storage slot
        uint256 keyIndex = map._indexes[key];

        if (keyIndex == 0) { // Equivalent to !contains(map, key)
            map._entries.push(MapEntry({ _key: key, _value: value }));
            // The entry is stored at length-1, but we add 1 to all indexes
            // and use 0 as a sentinel value
            map._indexes[key] = map._entries.length;
            return true;
        } else {
            map._entries[keyIndex - 1]._value = value;
            return false;
        }
    }

    /**
     * @dev Removes a key-value pair from a map. O(1).
     *
     * Returns true if the key was removed from the map, that is if it was present.
     */
    function _remove(Map storage map, bytes32 key) private returns (bool) {
        // We read and store the key's index to prevent multiple reads from the same storage slot
        uint256 keyIndex = map._indexes[key];

        if (keyIndex != 0) { // Equivalent to contains(map, key)
            // To delete a key-value pair from the _entries array in O(1), we swap the entry to delete with the last one
            // in the array, and then remove the last entry (sometimes called as 'swap and pop').
            // This modifies the order of the array, as noted in {at}.

            uint256 toDeleteIndex = keyIndex - 1;
            uint256 lastIndex = map._entries.length - 1;

            // When the entry to delete is the last one, the swap operation is unnecessary. However, since this occurs
            // so rarely, we still do the swap anyway to avoid the gas cost of adding an 'if' statement.

            MapEntry storage lastEntry = map._entries[lastIndex];

            // Move the last entry to the index where the entry to delete is
            map._entries[toDeleteIndex] = lastEntry;
            // Update the index for the moved entry
            map._indexes[lastEntry._key] = toDeleteIndex + 1; // All indexes are 1-based

            // Delete the slot where the moved entry was stored
            map._entries.pop();

            // Delete the index for the deleted slot
            delete map._indexes[key];

            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Returns true if the key is in the map. O(1).
     */
    function _contains(Map storage map, bytes32 key) private view returns (bool) {
        return map._indexes[key] != 0;
    }

    /**
     * @dev Returns the number of key-value pairs in the map. O(1).
     */
    function _length(Map storage map) private view returns (uint256) {
        return map._entries.length;
    }

   /**
    * @dev Returns the key-value pair stored at position `index` in the map. O(1).
    *
    * Note that there are no guarantees on the ordering of entries inside the
    * array, and it may change when more entries are added or removed.
    *
    * Requirements:
    *
    * - `index` must be strictly less than {length}.
    */
    function _at(Map storage map, uint256 index) private view returns (bytes32, bytes32) {
        require(map._entries.length > index, "EnumerableMap: index out of bounds");

        MapEntry storage entry = map._entries[index];
        return (entry._key, entry._value);
    }

    /**
     * @dev Returns the value associated with `key`.  O(1).
     *
     * Requirements:
     *
     * - `key` must be in the map.
     */
    function _get(Map storage map, bytes32 key) private view returns (bytes32) {
        return _get(map, key, "EnumerableMap: nonexistent key");
    }

    /**
     * @dev Same as {_get}, with a custom error message when `key` is not in the map.
     */
    function _get(Map storage map, bytes32 key, string memory errorMessage) private view returns (bytes32) {
        uint256 keyIndex = map._indexes[key];
        require(keyIndex != 0, errorMessage); // Equivalent to contains(map, key)
        return map._entries[keyIndex - 1]._value; // All indexes are 1-based
    }

    // UintToAddressMap

    struct UintToAddressMap {
        Map _inner;
    }

    /**
     * @dev Adds a key-value pair to a map, or updates the value for an existing
     * key. O(1).
     *
     * Returns true if the key was added to the map, that is if it was not
     * already present.
     */
    function set(UintToAddressMap storage map, uint256 key, address value) internal returns (bool) {
        return _set(map._inner, bytes32(key), bytes32(uint256(value)));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the key was removed from the map, that is if it was present.
     */
    function remove(UintToAddressMap storage map, uint256 key) internal returns (bool) {
        return _remove(map._inner, bytes32(key));
    }

    /**
     * @dev Returns true if the key is in the map. O(1).
     */
    function contains(UintToAddressMap storage map, uint256 key) internal view returns (bool) {
        return _contains(map._inner, bytes32(key));
    }

    /**
     * @dev Returns the number of elements in the map. O(1).
     */
    function length(UintToAddressMap storage map) internal view returns (uint256) {
        return _length(map._inner);
    }

   /**
    * @dev Returns the element stored at position `index` in the set. O(1).
    * Note that there are no guarantees on the ordering of values inside the
    * array, and it may change when more values are added or removed.
    *
    * Requirements:
    *
    * - `index` must be strictly less than {length}.
    */
    function at(UintToAddressMap storage map, uint256 index) internal view returns (uint256, address) {
        (bytes32 key, bytes32 value) = _at(map._inner, index);
        return (uint256(key), address(uint256(value)));
    }

    /**
     * @dev Returns the value associated with `key`.  O(1).
     *
     * Requirements:
     *
     * - `key` must be in the map.
     */
    function get(UintToAddressMap storage map, uint256 key) internal view returns (address) {
        return address(uint256(_get(map._inner, bytes32(key))));
    }

    /**
     * @dev Same as {get}, with a custom error message when `key` is not in the map.
     */
    function get(UintToAddressMap storage map, uint256 key, string memory errorMessage) internal view returns (address) {
        return address(uint256(_get(map._inner, bytes32(key), errorMessage)));
    }
}


// File @openzeppelin/contracts/utils/Strings.sol@v3.0.2

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

/**
 * @dev String operations.
 */
library Strings {
    /**
     * @dev Converts a `uint256` to its ASCII `string` representation.
     */
    function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT licence
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        uint256 index = digits - 1;
        temp = value;
        while (temp != 0) {
            buffer[index--] = byte(uint8(48 + temp % 10));
            temp /= 10;
        }
        return string(buffer);
    }
}


// File @openzeppelin/contracts/token/ERC721/ERC721.sol@v3.0.2

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;












/**
 * @title ERC721 Non-Fungible Token Standard basic implementation
 * @dev see https://eips.ethereum.org/EIPS/eip-721
 */
contract ERC721 is Context, ERC165, IERC721, IERC721Metadata, IERC721Enumerable {
    using SafeMath for uint256;
    using Address for address;
    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableMap for EnumerableMap.UintToAddressMap;
    using Strings for uint256;

    // Equals to `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
    // which can be also obtained as `IERC721Receiver(0).onERC721Received.selector`
    bytes4 private constant _ERC721_RECEIVED = 0x150b7a02;

    // Mapping from holder address to their (enumerable) set of owned tokens
    mapping (address => EnumerableSet.UintSet) private _holderTokens;

    // Enumerable mapping from token ids to their owners
    EnumerableMap.UintToAddressMap private _tokenOwners;

    // Mapping from token ID to approved address
    mapping (uint256 => address) private _tokenApprovals;

    // Mapping from owner to operator approvals
    mapping (address => mapping (address => bool)) private _operatorApprovals;

    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    // Base URI
    string private _baseURI;

    /*
     *     bytes4(keccak256('balanceOf(address)')) == 0x70a08231
     *     bytes4(keccak256('ownerOf(uint256)')) == 0x6352211e
     *     bytes4(keccak256('approve(address,uint256)')) == 0x095ea7b3
     *     bytes4(keccak256('getApproved(uint256)')) == 0x081812fc
     *     bytes4(keccak256('setApprovalForAll(address,bool)')) == 0xa22cb465
     *     bytes4(keccak256('isApprovedForAll(address,address)')) == 0xe985e9c5
     *     bytes4(keccak256('transferFrom(address,address,uint256)')) == 0x23b872dd
     *     bytes4(keccak256('safeTransferFrom(address,address,uint256)')) == 0x42842e0e
     *     bytes4(keccak256('safeTransferFrom(address,address,uint256,bytes)')) == 0xb88d4fde
     *
     *     => 0x70a08231 ^ 0x6352211e ^ 0x095ea7b3 ^ 0x081812fc ^
     *        0xa22cb465 ^ 0xe985e9c ^ 0x23b872dd ^ 0x42842e0e ^ 0xb88d4fde == 0x80ac58cd
     */
    bytes4 private constant _INTERFACE_ID_ERC721 = 0x80ac58cd;

    /*
     *     bytes4(keccak256('name()')) == 0x06fdde03
     *     bytes4(keccak256('symbol()')) == 0x95d89b41
     *     bytes4(keccak256('tokenURI(uint256)')) == 0xc87b56dd
     *
     *     => 0x06fdde03 ^ 0x95d89b41 ^ 0xc87b56dd == 0x5b5e139f
     */
    bytes4 private constant _INTERFACE_ID_ERC721_METADATA = 0x5b5e139f;

    /*
     *     bytes4(keccak256('totalSupply()')) == 0x18160ddd
     *     bytes4(keccak256('tokenOfOwnerByIndex(address,uint256)')) == 0x2f745c59
     *     bytes4(keccak256('tokenByIndex(uint256)')) == 0x4f6ccce7
     *
     *     => 0x18160ddd ^ 0x2f745c59 ^ 0x4f6ccce7 == 0x780e9d63
     */
    bytes4 private constant _INTERFACE_ID_ERC721_ENUMERABLE = 0x780e9d63;

    constructor (string memory name, string memory symbol) public {
        _name = name;
        _symbol = symbol;

        // register the supported interfaces to conform to ERC721 via ERC165
        _registerInterface(_INTERFACE_ID_ERC721);
        _registerInterface(_INTERFACE_ID_ERC721_METADATA);
        _registerInterface(_INTERFACE_ID_ERC721_ENUMERABLE);
    }

    /**
     * @dev Gets the balance of the specified address.
     * @param owner address to query the balance of
     * @return uint256 representing the amount owned by the passed address
     */
    function balanceOf(address owner) public view override returns (uint256) {
        require(owner != address(0), "ERC721: balance query for the zero address");

        return _holderTokens[owner].length();
    }

    /**
     * @dev Gets the owner of the specified token ID.
     * @param tokenId uint256 ID of the token to query the owner of
     * @return address currently marked as the owner of the given token ID
     */
    function ownerOf(uint256 tokenId) public view override returns (address) {
        return _tokenOwners.get(tokenId, "ERC721: owner query for nonexistent token");
    }

    /**
     * @dev Gets the token name.
     * @return string representing the token name
     */
    function name() public view override returns (string memory) {
        return _name;
    }

    /**
     * @dev Gets the token symbol.
     * @return string representing the token symbol
     */
    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the URI for a given token ID. May return an empty string.
     *
     * If a base URI is set (via {_setBaseURI}), it is added as a prefix to the
     * token's own URI (via {_setTokenURI}).
     *
     * If there is a base URI but no token URI, the token's ID will be used as
     * its URI when appending it to the base URI. This pattern for autogenerated
     * token URIs can lead to large gas savings.
     *
     * .Examples
     * |===
     * |`_setBaseURI()` |`_setTokenURI()` |`tokenURI()`
     * | ""
     * | ""
     * | ""
     * | ""
     * | "token.uri/123"
     * | "token.uri/123"
     * | "token.uri/"
     * | "123"
     * | "token.uri/123"
     * | "token.uri/"
     * | ""
     * | "token.uri/<tokenId>"
     * |===
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory _tokenURI = _tokenURIs[tokenId];

        // If there is no base URI, return the token URI.
        if (bytes(_baseURI).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(_baseURI, _tokenURI));
        }
        // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
        return string(abi.encodePacked(_baseURI, tokenId.toString()));
    }

    /**
    * @dev Returns the base URI set via {_setBaseURI}. This will be
    * automatically added as a prefix in {tokenURI} to each token's URI, or
    * to the token ID if no specific URI is set for that token ID.
    */
    function baseURI() public view returns (string memory) {
        return _baseURI;
    }

    /**
     * @dev Gets the token ID at a given index of the tokens list of the requested owner.
     * @param owner address owning the tokens list to be accessed
     * @param index uint256 representing the index to be accessed of the requested tokens list
     * @return uint256 token ID at the given index of the tokens list owned by the requested address
     */
    function tokenOfOwnerByIndex(address owner, uint256 index) public view override returns (uint256) {
        return _holderTokens[owner].at(index);
    }

    /**
     * @dev Gets the total amount of tokens stored by the contract.
     * @return uint256 representing the total amount of tokens
     */
    function totalSupply() public view override returns (uint256) {
        // _tokenOwners are indexed by tokenIds, so .length() returns the number of tokenIds
        return _tokenOwners.length();
    }

    /**
     * @dev Gets the token ID at a given index of all the tokens in this contract
     * Reverts if the index is greater or equal to the total number of tokens.
     * @param index uint256 representing the index to be accessed of the tokens list
     * @return uint256 token ID at the given index of the tokens list
     */
    function tokenByIndex(uint256 index) public view override returns (uint256) {
        (uint256 tokenId, ) = _tokenOwners.at(index);
        return tokenId;
    }

    /**
     * @dev Approves another address to transfer the given token ID
     * The zero address indicates there is no approved address.
     * There can only be one approved address per token at a given time.
     * Can only be called by the token owner or an approved operator.
     * @param to address to be approved for the given token ID
     * @param tokenId uint256 ID of the token to be approved
     */
    function approve(address to, uint256 tokenId) public virtual override {
        address owner = ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");

        require(_msgSender() == owner || isApprovedForAll(owner, _msgSender()),
            "ERC721: approve caller is not owner nor approved for all"
        );

        _approve(to, tokenId);
    }

    /**
     * @dev Gets the approved address for a token ID, or zero if no address set
     * Reverts if the token ID does not exist.
     * @param tokenId uint256 ID of the token to query the approval of
     * @return address currently approved for the given token ID
     */
    function getApproved(uint256 tokenId) public view override returns (address) {
        require(_exists(tokenId), "ERC721: approved query for nonexistent token");

        return _tokenApprovals[tokenId];
    }

    /**
     * @dev Sets or unsets the approval of a given operator
     * An operator is allowed to transfer all tokens of the sender on their behalf.
     * @param operator operator address to set the approval
     * @param approved representing the status of the approval to be set
     */
    function setApprovalForAll(address operator, bool approved) public virtual override {
        require(operator != _msgSender(), "ERC721: approve to caller");

        _operatorApprovals[_msgSender()][operator] = approved;
        emit ApprovalForAll(_msgSender(), operator, approved);
    }

    /**
     * @dev Tells whether an operator is approved by a given owner.
     * @param owner owner address which you want to query the approval of
     * @param operator operator address which you want to query the approval of
     * @return bool whether the given operator is approved by the given owner
     */
    function isApprovedForAll(address owner, address operator) public view override returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    /**
     * @dev Transfers the ownership of a given token ID to another address.
     * Usage of this method is discouraged, use {safeTransferFrom} whenever possible.
     * Requires the msg.sender to be the owner, approved, or operator.
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     */
    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");

        _transfer(from, to, tokenId);
    }

    /**
     * @dev Safely transfers the ownership of a given token ID to another address
     * If the target address is a contract, it must implement {IERC721Receiver-onERC721Received},
     * which is called upon a safe transfer, and return the magic value
     * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
     * the transfer is reverted.
     * Requires the msg.sender to be the owner, approved, or operator
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     */
    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override {
        safeTransferFrom(from, to, tokenId, "");
    }

    /**
     * @dev Safely transfers the ownership of a given token ID to another address
     * If the target address is a contract, it must implement {IERC721Receiver-onERC721Received},
     * which is called upon a safe transfer, and return the magic value
     * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
     * the transfer is reverted.
     * Requires the _msgSender() to be the owner, approved, or operator
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     * @param _data bytes data to send along with a safe transfer check
     */
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public virtual override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        _safeTransfer(from, to, tokenId, _data);
    }

    /**
     * @dev Safely transfers the ownership of a given token ID to another address
     * If the target address is a contract, it must implement `onERC721Received`,
     * which is called upon a safe transfer, and return the magic value
     * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
     * the transfer is reverted.
     * Requires the msg.sender to be the owner, approved, or operator
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     * @param _data bytes data to send along with a safe transfer check
     */
    function _safeTransfer(address from, address to, uint256 tokenId, bytes memory _data) internal virtual {
        _transfer(from, to, tokenId);
        require(_checkOnERC721Received(from, to, tokenId, _data), "ERC721: transfer to non ERC721Receiver implementer");
    }

    /**
     * @dev Returns whether the specified token exists.
     * @param tokenId uint256 ID of the token to query the existence of
     * @return bool whether the token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _tokenOwners.contains(tokenId);
    }

    /**
     * @dev Returns whether the given spender can transfer a given token ID.
     * @param spender address of the spender to query
     * @param tokenId uint256 ID of the token to be transferred
     * @return bool whether the msg.sender is approved for the given token ID,
     * is an operator of the owner, or is the owner of the token
     */
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        require(_exists(tokenId), "ERC721: operator query for nonexistent token");
        address owner = ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }

    /**
     * @dev Internal function to safely mint a new token.
     * Reverts if the given token ID already exists.
     * If the target address is a contract, it must implement `onERC721Received`,
     * which is called upon a safe transfer, and return the magic value
     * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
     * the transfer is reverted.
     * @param to The address that will own the minted token
     * @param tokenId uint256 ID of the token to be minted
     */
    function _safeMint(address to, uint256 tokenId) internal virtual {
        _safeMint(to, tokenId, "");
    }

    /**
     * @dev Internal function to safely mint a new token.
     * Reverts if the given token ID already exists.
     * If the target address is a contract, it must implement `onERC721Received`,
     * which is called upon a safe transfer, and return the magic value
     * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
     * the transfer is reverted.
     * @param to The address that will own the minted token
     * @param tokenId uint256 ID of the token to be minted
     * @param _data bytes data to send along with a safe transfer check
     */
    function _safeMint(address to, uint256 tokenId, bytes memory _data) internal virtual {
        _mint(to, tokenId);
        require(_checkOnERC721Received(address(0), to, tokenId, _data), "ERC721: transfer to non ERC721Receiver implementer");
    }

    /**
     * @dev Internal function to mint a new token.
     * Reverts if the given token ID already exists.
     * @param to The address that will own the minted token
     * @param tokenId uint256 ID of the token to be minted
     */
    function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        _beforeTokenTransfer(address(0), to, tokenId);

        _holderTokens[to].add(tokenId);

        _tokenOwners.set(tokenId, to);

        emit Transfer(address(0), to, tokenId);
    }

    /**
     * @dev Internal function to burn a specific token.
     * Reverts if the token does not exist.
     * @param tokenId uint256 ID of the token being burned
     */
    function _burn(uint256 tokenId) internal virtual {
        address owner = ownerOf(tokenId);

        _beforeTokenTransfer(owner, address(0), tokenId);

        // Clear approvals
        _approve(address(0), tokenId);

        // Clear metadata (if any)
        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }

        _holderTokens[owner].remove(tokenId);

        _tokenOwners.remove(tokenId);

        emit Transfer(owner, address(0), tokenId);
    }

    /**
     * @dev Internal function to transfer ownership of a given token ID to another address.
     * As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     */
    function _transfer(address from, address to, uint256 tokenId) internal virtual {
        require(ownerOf(tokenId) == from, "ERC721: transfer of token that is not own");
        require(to != address(0), "ERC721: transfer to the zero address");

        _beforeTokenTransfer(from, to, tokenId);

        // Clear approvals from the previous owner
        _approve(address(0), tokenId);

        _holderTokens[from].remove(tokenId);
        _holderTokens[to].add(tokenId);

        _tokenOwners.set(tokenId, to);

        emit Transfer(from, to, tokenId);
    }

    /**
     * @dev Internal function to set the token URI for a given token.
     *
     * Reverts if the token ID does not exist.
     *
     * TIP: If all token IDs share a prefix (for example, if your URIs look like
     * `https://api.myproject.com/token/<id>`), use {_setBaseURI} to store
     * it and save gas.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    /**
     * @dev Internal function to set the base URI for all token IDs. It is
     * automatically added as a prefix to the value returned in {tokenURI},
     * or to the token ID if {tokenURI} is empty.
     */
    function _setBaseURI(string memory baseURI_) internal virtual {
        _baseURI = baseURI_;
    }

    /**
     * @dev Internal function to invoke {IERC721Receiver-onERC721Received} on a target address.
     * The call is not executed if the target address is not a contract.
     *
     * @param from address representing the previous owner of the given token ID
     * @param to target address that will receive the tokens
     * @param tokenId uint256 ID of the token to be transferred
     * @param _data bytes optional data to send along with the call
     * @return bool whether the call correctly returned the expected magic value
     */
    function _checkOnERC721Received(address from, address to, uint256 tokenId, bytes memory _data)
        private returns (bool)
    {
        if (!to.isContract()) {
            return true;
        }
        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = to.call(abi.encodeWithSelector(
            IERC721Receiver(to).onERC721Received.selector,
            _msgSender(),
            from,
            tokenId,
            _data
        ));
        if (!success) {
            if (returndata.length > 0) {
                // solhint-disable-next-line no-inline-assembly
                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert("ERC721: transfer to non ERC721Receiver implementer");
            }
        } else {
            bytes4 retval = abi.decode(returndata, (bytes4));
            return (retval == _ERC721_RECEIVED);
        }
    }

    function _approve(address to, uint256 tokenId) private {
        _tokenApprovals[tokenId] = to;
        emit Approval(ownerOf(tokenId), to, tokenId);
    }

    /**
     * @dev Hook that is called before any token transfer. This includes minting
     * and burning.
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero, ``from``'s `tokenId` will be
     * transferred to `to`.
     * - when `from` is zero, `tokenId` will be minted for `to`.
     * - when `to` is zero, ``from``'s `tokenId` will be burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual { }
}


// File contracts/NFTINK.sol

pragma solidity >=0.6.0 <0.7.0;







contract NFTINK is BaseRelayRecipient, ERC721, Ownable, SignatureChecker {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter public totalInks;
    using SafeMath for uint256;

    uint artistTake;

    function setArtistTake(uint _take) public onlyOwner {
      artistTake = _take;
    }

    constructor() ERC721("🎨 Nifty.Ink", "🎨") public {
      _setBaseURI('ipfs://ipfs/');
      setCheckSignatureFlag(true);
      setArtistTake(1);
    }

    event newInk(uint256 id, address indexed artist, string inkUrl, string jsonUrl, uint256 limit);
    event mintedInk(uint256 id, string inkUrl, address to);
    event boughtInk(uint256 id, string inkUrl, address buyer, uint256 price);

    struct Ink {
      uint256 id;
      address payable artist;
      address patron;
      string jsonUrl;
      string inkUrl;
      uint256 limit;
      uint256 count;
      bool exists;
      uint256 price;
    }

    mapping (string => uint256) private _inkIdByUrl;
    mapping (uint256 => Ink) private _inkById;
    mapping (string => EnumerableSet.UintSet) private _inkTokens;
    mapping (address => EnumerableSet.UintSet) private _artistInks;
    mapping (string => bytes) private _inkSignatureByUrl;
    mapping (uint256 => uint256) private _inkIdByTokenId;

    mapping (uint256 => uint256) public tokenPrice;

    mapping (bytes32 => uint256) private msgTokenId;
    mapping (bytes32 => address) private msgRecipient;

    function _createInk(string memory inkUrl, string memory jsonUrl, uint256 limit, address payable artist, address patron) internal returns (uint256) {

      totalInks.increment();

      Ink memory _ink = Ink({
        id: totalInks.current(),
        artist: artist,
        patron: patron,
        inkUrl: inkUrl,
        jsonUrl: jsonUrl,
        limit: limit,
        count: 0,
        exists: true,
        price: 0
        });

        _inkIdByUrl[inkUrl] = _ink.id;
        _inkById[_ink.id] = _ink;
        _artistInks[artist].add(_ink.id);

        emit newInk(_ink.id, _ink.artist, _ink.inkUrl, _ink.jsonUrl, _ink.limit);

        return _ink.id;
    }

    function createInk(string memory inkUrl, string memory jsonUrl, uint256 limit) public returns (uint256) {
      require(!(_inkIdByUrl[inkUrl] > 0), "this ink already exists!");

      uint256 inkId = _createInk(inkUrl, jsonUrl, limit, _msgSender(), _msgSender());

      _mintInkToken(_msgSender(), inkId, inkUrl, jsonUrl);

      return inkId;
    }

    function _mintInkToken(address to, uint256 inkId, string memory inkUrl, string memory jsonUrl) internal returns (uint256) {
      _inkById[inkId].count += 1;

      _tokenIds.increment();
      uint256 id = _tokenIds.current();
      _inkTokens[inkUrl].add(id);
      _inkIdByTokenId[id] = inkId;

      _mint(to, id);
      _setTokenURI(id, jsonUrl);

      emit mintedInk(id, inkUrl, to);

      return id;
    }

    function mint(address to, string memory inkUrl) public returns (uint256) {
        uint256 _inkId = _inkIdByUrl[inkUrl];
        require(_inkId > 0, "this ink does not exist!");
        Ink storage _ink = _inkById[_inkId];
        require(_ink.artist == _msgSender(), "only the artist can mint!");
        require(_ink.count < _ink.limit || _ink.limit == 0, "this ink is over the limit!");

        uint256 tokenId = _mintInkToken(to, _inkId, _ink.inkUrl, _ink.jsonUrl);

        return tokenId;
    }


    function setPrice(string memory inkUrl, uint256 price) public returns (uint256) {
      uint256 _inkId = _inkIdByUrl[inkUrl];
      require(_inkId > 0, "this ink does not exist!");
      Ink storage _ink = _inkById[_inkId];
      require(_ink.artist == _msgSender(), "only the artist can set the price!");
      require(_ink.count < _ink.limit || _ink.limit == 0, "this ink is over the limit!");

      _inkById[_inkId].price = price;

      return price;
    }

    function buyInk(string memory inkUrl) public payable returns (uint256) {
      uint256 _inkId = _inkIdByUrl[inkUrl];
      require(_inkId > 0, "this ink does not exist!");
      Ink storage _ink = _inkById[_inkId];
      require(_ink.count < _ink.limit || _ink.limit == 0, "this ink is over the limit!");
      require(_ink.price > 0, "this ink does not have a price set");
      require(msg.value >= _ink.price, "Amount of Ether sent too small");
      address buyer = _msgSender();
      uint256 tokenId = _mintInkToken(buyer, _inkId, inkUrl, _ink.jsonUrl);
      //Note: a pull mechanism would be safer here: https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment
      _ink.artist.transfer(msg.value);
      emit boughtInk(tokenId, inkUrl, buyer, msg.value);
      return tokenId;
    }


    function setTokenPrice(uint256 _tokenId, uint256 _price) public returns (uint256) {
      require(_exists(_tokenId), "this token does not exist!");
      require(ownerOf(_tokenId) == _msgSender(), "only the owner can set the price!");

      tokenPrice[_tokenId] = _price;

      return _price;
    }

    function buyToken(uint256 _tokenId) public payable {
      uint256 _price = tokenPrice[_tokenId];
      require(_price > 0, "this token is not for sale");
      require(msg.value >= _price, "Amount of Ether sent too small");
      address _buyer = _msgSender();
      address payable _seller = address(uint160(ownerOf(_tokenId)));
      _transfer(_seller, _buyer, _tokenId);
      //Note: a pull mechanism would be safer here: https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment

      uint256 _artistTake = artistTake.mul(msg.value).div(100);
      uint256 _sellerTake = msg.value.sub(_artistTake);

      Ink storage _ink = _inkById[_inkIdByTokenId[_tokenId]];

      _ink.artist.transfer(_artistTake);
      _seller.transfer(_sellerTake);
      delete tokenPrice[_tokenId];
      emit boughtInk(_tokenId, _ink.inkUrl, _buyer, msg.value);
    }

    function createInkFromSignature(string memory inkUrl, string memory jsonUrl, uint256 limit, address payable artist, bytes memory signature) public returns (uint256) {
      require(!(_inkIdByUrl[inkUrl] > 0), "this ink already exists!");

      require(artist!=address(0), "Artist must be specified.");
      bytes32 messageHash = getHash(artist,inkUrl,jsonUrl,limit);
      bool isArtistSignature = checkSignature(messageHash, signature, artist);
      require(isArtistSignature, "Unable to verify the artist signature");

      uint256 inkId = _createInk(inkUrl, jsonUrl, limit, artist, _msgSender());

      _mintInkToken(_msgSender(), inkId, inkUrl, jsonUrl);

      _inkSignatureByUrl[inkUrl] = signature;

      return inkId;
    }

    function getHash(address artist, string memory inkUrl, string memory jsonUrl, uint256 limit) public view returns (bytes32)
    {
        return keccak256(
            abi.encodePacked(
                byte(0x19),
                byte(0),
                address(this),
                artist,
                inkUrl,
                jsonUrl,
                limit
        ));
    }

    function inkTokenByIndex(string memory inkUrl, uint256 index) public view returns (uint256) {
      uint256 _inkId = _inkIdByUrl[inkUrl];
      require(_inkId > 0, "this ink does not exist!");
      Ink storage _ink = _inkById[_inkId];
      require(_ink.count >= index + 1, "this token index does not exist!");
      return _inkTokens[inkUrl].at(index);
    }

    function inkInfoByInkUrl(string memory inkUrl) public view returns (uint256, address, uint256, string memory, bytes memory, uint256) {
      uint256 _inkId = _inkIdByUrl[inkUrl];
      require(_inkId > 0, "this ink does not exist!");
      Ink storage _ink = _inkById[_inkId];
      bytes memory signature = _inkSignatureByUrl[inkUrl];

      return (_inkId, _ink.artist, _ink.count, _ink.jsonUrl, signature, _ink.price);
    }

    function inkIdByUrl(string memory inkUrl) public view returns (uint256) {
      return _inkIdByUrl[inkUrl];
    }

    function inksCreatedBy(address artist) public view returns (uint256) {
      return _artistInks[artist].length();
    }

    function inkOfArtistByIndex(address artist, uint256 index) public view returns (uint256) {
        return _artistInks[artist].at(index);
    }

    function inkInfoById(uint256 id) public view returns (string memory, address, uint256, string memory, bytes memory, uint256) {
      require(_inkById[id].exists, "this ink does not exist!");
      Ink storage _ink = _inkById[id];
      bytes memory signature = _inkSignatureByUrl[_ink.inkUrl];

      return (_ink.jsonUrl, _ink.artist, _ink.count, _ink.inkUrl, signature, _ink.price);
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


// File contracts/INiftyToken.sol

pragma solidity >=0.6.0 <0.7.0;

interface INiftyToken {
    function inkTokenCount(string calldata) external view returns (uint256);
    function firstMint(address, string calldata, string calldata) external returns (uint256);
    function mint(address, string calldata) external returns (uint256);
    function buyInk(string calldata) external payable returns (uint256);
    function buyToken(uint256) external payable;
    function lock(uint256) external;
    function unlock(uint256, address) external;
    function ownerOf(uint256) external view returns (address);
    function tokenInk(uint) external view returns (string memory);
}


// File contracts/INiftyRegistry.sol

pragma solidity ^0.6.6;

interface INiftyRegistry {
    function inkAddress() external view returns (address);
    function tokenAddress() external view returns (address);
    function bridgeMediatorAddress() external view returns (address);
    function trustedForwarder() external view returns (address);
}


// File contracts/NiftyInk.sol

pragma solidity >=0.6.0 <0.7.0;








contract NiftyInk is BaseRelayRecipient, Ownable, SignatureChecker {

    constructor() public {
      setCheckSignatureFlag(true);
      setArtistTake(1);
    }

    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;

    Counters.Counter public totalInks;

    uint public artistTake;

    function setArtistTake(uint _take) public onlyOwner {
      require(_take < 100, 'take is more than 99 percent');
      artistTake = _take;
    }

    address public niftyRegistry;

    function setNiftyRegistry(address _address) public onlyOwner {
      niftyRegistry = _address;
    }

    function niftyToken() private view returns (INiftyToken) {
      return INiftyToken(INiftyRegistry(niftyRegistry).tokenAddress());
    }

    event newInk(uint256 id, address indexed artist, string inkUrl, string jsonUrl, uint256 limit);

    struct Ink {
      uint256 id;
      address payable artist;
      string jsonUrl;
      string inkUrl;
      uint256 limit;
      bytes signature;
      uint256 price;
      Counters.Counter priceNonce;
    }

    mapping (string => uint256) public inkIdByInkUrl;
    mapping (uint256 => Ink) private _inkById;
    mapping (address => EnumerableSet.UintSet) private _artistInks;

    function _createInk(string memory inkUrl, string memory jsonUrl, uint256 limit, address payable artist) internal returns (uint256) {

      totalInks.increment();
      uint256 _inkId = totalInks.current();

      Ink storage _ink = _inkById[_inkId];

      _ink.id = _inkId;
      _ink.artist = artist;
      _ink.inkUrl = inkUrl;
      _ink.jsonUrl = jsonUrl;
      _ink.limit = limit;

      inkIdByInkUrl[inkUrl] = _inkId;
      _artistInks[artist].add(_inkId);

      emit newInk(_ink.id, _ink.artist, _ink.inkUrl, _ink.jsonUrl, _ink.limit);

      return _ink.id;
    }

    function createInk(string memory inkUrl, string memory jsonUrl, uint256 limit) public returns (uint256) {
      require(!(inkIdByInkUrl[inkUrl] > 0), "this ink already exists!");

      uint256 inkId = _createInk(inkUrl, jsonUrl, limit, _msgSender());

      niftyToken().firstMint(_msgSender(), inkUrl, jsonUrl);

      return inkId;
    }

    function createInkFromSignature(string memory inkUrl, string memory jsonUrl, uint256 limit, address payable artist, bytes memory signature) public returns (uint256) {
      require(!(inkIdByInkUrl[inkUrl] > 0), "this ink already exists!");

      require(artist!=address(0), "Artist must be specified.");
      bytes32 messageHash = keccak256(abi.encodePacked(byte(0x19), byte(0), address(this), artist, inkUrl, jsonUrl, limit));
      bool isArtistSignature = checkSignature(messageHash, signature, artist);
      require(isArtistSignature || !checkSignatureFlag, "Artist did not sign this ink");

      uint256 inkId = _createInk(inkUrl, jsonUrl, limit, artist);

      _inkById[inkId].signature = signature;

      niftyToken().firstMint(artist, inkUrl, jsonUrl);

      return inkId;
    }

    function _setPrice(uint256 _inkId, uint256 price) private returns (uint256) {

      _inkById[_inkId].price = price;
      _inkById[_inkId].priceNonce.increment();

      return price;
    }

    function setPrice(string memory inkUrl, uint256 price) public returns (uint256) {
      uint256 _inkId = inkIdByInkUrl[inkUrl];
      require(_inkId > 0, "this ink does not exist!");
      Ink storage _ink = _inkById[_inkId];
      require(_ink.artist == _msgSender(), "only the artist can set the price!");

      return _setPrice(_ink.id, price);
    }

    function setPriceFromSignature(string memory inkUrl, uint256 price, bytes memory signature) public returns (uint256) {
      uint256 _inkId = inkIdByInkUrl[inkUrl];
      require(_inkId > 0, "this ink does not exist!");
      Ink storage _ink = _inkById[_inkId];
      bytes32 messageHash = keccak256(abi.encodePacked(byte(0x19), byte(0), address(this), inkUrl, price, _ink.priceNonce.current()));
      bool isArtistSignature = checkSignature(messageHash, signature, _ink.artist);
      require(isArtistSignature || !checkSignatureFlag, "Artist did not sign this price");

      return _setPrice(_ink.id, price);
    }


    function inkInfoById(uint256 id) public view returns (uint256, address, string memory, bytes memory, uint256, uint256, string memory, uint256) {
      require(id > 0 && id <= totalInks.current(), "this ink does not exist!");
      Ink storage _ink = _inkById[id];

      return (id, _ink.artist, _ink.jsonUrl, _ink.signature, _ink.price, _ink.limit, _ink.inkUrl, _ink.priceNonce.current());
    }

    function inkInfoByInkUrl(string memory inkUrl) public view returns (uint256, address, string memory, bytes memory, uint256, uint256, string memory, uint256) {
      uint256 _inkId = inkIdByInkUrl[inkUrl];

      return inkInfoById(_inkId);
    }

    function inksCreatedBy(address artist) public view returns (uint256) {
      return _artistInks[artist].length();
    }

    function inkOfArtistByIndex(address artist, uint256 index) public view returns (uint256) {
        return _artistInks[artist].at(index);
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


// File contracts/NiftyMain.sol

pragma solidity >=0.6.0 <0.7.0;






contract NiftyMain is ERC721, Ownable, AMBMediator {

    constructor() ERC721("🎨 Nifty.Ink", "🎨") public {
      _setBaseURI('ipfs://ipfs/');
    }

    event mintedInk(uint256 id, string inkUrl, string jsonUrl, address to, bytes32 msgId);

    mapping (string => EnumerableSet.UintSet) private _inkTokens;
    mapping (uint256 => string) public tokenInk;

    function mint(address to, uint256 tokenId, string calldata inkUrl, string calldata jsonUrl) external returns (uint256) {
      require(msg.sender == address(bridgeContract()));
      require(bridgeContract().messageSender() == mediatorContractOnOtherSide());

      _inkTokens[inkUrl].add(tokenId);
      tokenInk[tokenId] = inkUrl;
      _safeMint(to, tokenId);
      _setTokenURI(tokenId, jsonUrl);
      bytes32 msgId = messageId();

      emit mintedInk(tokenId, inkUrl, jsonUrl, to, msgId);

      return tokenId;
    }

    function inkTokenCount(string memory _inkUrl) public view returns(uint256) {
      uint256 _inkTokenCount = _inkTokens[_inkUrl].length();
      return _inkTokenCount;
    }

    function inkTokenByIndex(string memory inkUrl, uint256 index) public view returns (uint256) {
      return _inkTokens[inkUrl].at(index);
    }

}


// File contracts/INiftyInk.sol

pragma solidity >=0.6.0 <0.7.0;

interface INiftyInk {
    function artistTake() external view returns (uint);
    function inkInfoById(uint256) external view returns (uint256, address payable, string memory, bytes memory, uint256, uint256, string memory);
    function inkInfoByInkUrl(string calldata) external view returns (uint256, address payable, string memory, bytes memory, uint256, uint256, string memory);
    function inkIdByInkUrl(string calldata) external view returns (uint256);
}


// File contracts/NiftyMediator.sol

pragma solidity >=0.6.0 <0.7.0;








contract NiftyMediator is BaseRelayRecipient, Ownable, AMBMediator, SignatureChecker {

    constructor() public {
      setCheckSignatureFlag(true);
    }

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

    function relayToken(uint256 _tokenId) external returns (bytes32) {
      require(_msgSender() == niftyToken().ownerOf(_tokenId), 'only the owner can upgrade!');

      return _relayToken(_tokenId);
    }


    function relayTokenFromSignature(uint256 _tokenId, bytes calldata signature) external returns (bytes32) {
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

}


// File contracts/NiftyRegistry.sol

pragma solidity >=0.6.0 <0.7.0;


contract NiftyRegistry is Ownable {

    address public inkAddress;
    address public tokenAddress;
    address public bridgeMediatorAddress;
    address public trustedForwarder;

    function setInkAddress(address _address) public onlyOwner {
      inkAddress = _address;
  	}

    function setTokenAddress(address _address) public onlyOwner {
      tokenAddress = _address;
    }

    function setBridgeMediatorAddress(address _address) public onlyOwner {
      bridgeMediatorAddress = _address;
    }

    function setTrustedForwarder(address _trustedForwarder) public onlyOwner {
      trustedForwarder = _trustedForwarder;
  	}

}


// File contracts/NiftyToken.sol

pragma solidity >=0.6.0 <0.7.0;









contract NiftyToken is BaseRelayRecipient, ERC721, SignatureChecker {

    constructor() ERC721("🎨 Nifty.Ink", "🎨") public {
      _setBaseURI('ipfs://ipfs/');
      setCheckSignatureFlag(true);
    }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    using SafeMath for uint256;

    address public niftyRegistry;

    function setNiftyRegistry(address _address) public onlyOwner {
      niftyRegistry = _address;
    }

    function niftyInk() private view returns (INiftyInk) {
      return INiftyInk(INiftyRegistry(niftyRegistry).inkAddress());
    }

    event mintedInk(uint256 id, string inkUrl, address to);
    event boughtInk(uint256 id, string inkUrl, address buyer, uint256 price);
    event boughtToken(uint256 id, string inkUrl, address buyer, uint256 price);
    event lockedInk(uint256 id, address recipient);
    event unlockedInk(uint256 id, address recipient);

    mapping (string => EnumerableSet.UintSet) private _inkTokens;
    mapping (uint256 => string) public tokenInk;

    mapping (uint256 => uint256) public tokenPrice;

    function inkTokenCount(string memory _inkUrl) public view returns(uint256) {
      uint256 _inkTokenCount = _inkTokens[_inkUrl].length();
      return _inkTokenCount;
    }

    function _mintInkToken(address to, string memory inkUrl, string memory jsonUrl) internal returns (uint256) {

      _tokenIds.increment();
      uint256 id = _tokenIds.current();
      _inkTokens[inkUrl].add(id);
      tokenInk[id] = inkUrl;

      _mint(to, id);
      _setTokenURI(id, jsonUrl);

      emit mintedInk(id, inkUrl, to);

      return id;
    }

    function firstMint(address to, string calldata inkUrl, string calldata jsonUrl) external returns (uint256) {
      require(_msgSender() == INiftyRegistry(niftyRegistry).inkAddress());
      _mintInkToken(to, inkUrl, jsonUrl);
    }

    function mint(address to, string memory _inkUrl) public returns (uint256) {
        uint256 _inkId = niftyInk().inkIdByInkUrl(_inkUrl);
        require(_inkId > 0, "this ink does not exist!");
        (, address _artist, string memory _jsonUrl, , , uint256 _limit, ) = niftyInk().inkInfoById(_inkId);

        require(_artist == _msgSender(), "only the artist can mint!");

        require(inkTokenCount(_inkUrl) < _limit || _limit == 0, "this ink is over the limit!");

        uint256 tokenId = _mintInkToken(to, _inkUrl, _jsonUrl);

        return tokenId;
    }

    function mintFromSignature(address to, string memory _inkUrl, bytes memory signature) public returns (uint256) {
        uint256 _inkId = niftyInk().inkIdByInkUrl(_inkUrl);
        require(_inkId > 0, "this ink does not exist!");

        uint256 _count = inkTokenCount(_inkUrl);
        (, address _artist, string memory _jsonUrl, , , uint256 _limit, ) = niftyInk().inkInfoById(_inkId);
        require(_count < _limit || _limit == 0, "this ink is over the limit!");

        bytes32 messageHash = keccak256(abi.encodePacked(byte(0x19), byte(0), address(this), to, _inkUrl, _count));
        bool isArtistSignature = checkSignature(messageHash, signature, _artist);
        require(isArtistSignature || !checkSignatureFlag, "only the artist can mint!");

        uint256 tokenId = _mintInkToken(to, _inkUrl, _jsonUrl);

        return tokenId;
    }

    function lock(uint256 _tokenId) external {
      address _bridgeMediatorAddress = INiftyRegistry(niftyRegistry).bridgeMediatorAddress();
      require(_bridgeMediatorAddress == _msgSender(), 'only the bridgeMediator can lock');
      address from = ownerOf(_tokenId);
      _transfer(from, _msgSender(), _tokenId);
    }

    function unlock(uint256 _tokenId, address _recipient) external {
      require(_msgSender() == INiftyRegistry(niftyRegistry).bridgeMediatorAddress(), 'only the bridgeMediator can unlock');
      require(_msgSender() == ownerOf(_tokenId), 'the bridgeMediator does not hold this token');
      safeTransferFrom(_msgSender(), _recipient, _tokenId);
    }

    function buyInk(string memory _inkUrl) public payable returns (uint256) {
      uint256 _inkId = niftyInk().inkIdByInkUrl(_inkUrl);
      require(_inkId > 0, "this ink does not exist!");
      (, address payable _artist, string memory _jsonUrl, , uint256 _price, uint256 _limit, ) = niftyInk().inkInfoById(_inkId);
      require(inkTokenCount(_inkUrl) < _limit || _limit == 0, "this ink is over the limit!");
      require(_price > 0, "this ink does not have a price set");
      require(msg.value >= _price, "Amount of Ether sent too small");
      address _buyer = _msgSender();
      uint256 _tokenId = _mintInkToken(_buyer, _inkUrl, _jsonUrl);
      //Note: a pull mechanism would be safer here: https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment
      _artist.transfer(msg.value);
      emit boughtInk(_tokenId, _inkUrl, _buyer, msg.value);
      return _tokenId;
    }

    function setTokenPrice(uint256 _tokenId, uint256 _price) public returns (uint256) {
      require(_exists(_tokenId), "this token does not exist!");
      require(ownerOf(_tokenId) == _msgSender(), "only the owner can set the price!");

      tokenPrice[_tokenId] = _price;

      return _price;
    }

    function buyToken(uint256 _tokenId) public payable {
      uint256 _price = tokenPrice[_tokenId];
      require(_price > 0, "this token is not for sale");
      require(msg.value >= _price, "Amount of Ether sent too small");
      address _buyer = _msgSender();
      address payable _seller = address(uint160(ownerOf(_tokenId)));
      _transfer(_seller, _buyer, _tokenId);
      //Note: a pull mechanism would be safer here: https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment

      uint256 _artistTake = niftyInk().artistTake().mul(msg.value).div(100);
      uint256 _sellerTake = msg.value.sub(_artistTake);
      string memory _inkUrl = tokenInk[_tokenId];

      (, address payable _artist, , , , , ) = niftyInk().inkInfoByInkUrl(_inkUrl);

      _artist.transfer(_artistTake);
      _seller.transfer(_sellerTake);
      delete tokenPrice[_tokenId];
      emit boughtInk(_tokenId, _inkUrl, _buyer, msg.value);
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


// File contracts/ValidSignatureTester.sol

pragma solidity >=0.6.0 <0.7.0;


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
