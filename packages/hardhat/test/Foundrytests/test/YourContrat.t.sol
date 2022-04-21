pragma solidity ^0.8.10;
import "packages/hardhat/contracts/YourContract.sol";
import "packages/hardhat/test/Foundrytests/test.sol";

/// @author: supernovahs
/// @Title: Foundry tests 
/// @Description: For more details see https://book.getfoundry.sh/

/// @dev This is a test contract that uses the `Foundry` library.   It is a
/// @dev DSTest contract is a helper contract that provides cheatcodes for testing purposes.
/// @dev To test, install Foundry and run forge test -vvvvv in the root directory.
contract testing is DSTest{

    ///@notice: Declaring the imported contract as a variable
    YourContract yourcontract;

/// @notice: setUp function in Foundry is like a beforeEach function used in Hardhat!
/// @dev This function is called before each test.

    function setUp() public {
        /// @notice: Instatntiating the imported contract
        yourcontract = new YourContract();
    }

    /// @dev: It is mandatory to include the word "test" in front of every function which the dev wants to test.
    /// @dev: Testing the setPurpose function.
    /// @dev: To view indepth details of the test traces. Use forge test -vvvvv

    function testPurposeFunction() public {
        /// @notice: Calling the setPurpose function
        yourcontract.setPurpose("Hello Devs");

        /// @notice: Console log to view the output
       console.log(yourcontract.purpose());

        /// @notice: Asserting the output using DsTest Cheatcode.
       assertEq(yourcontract.purpose(),"Hello Devs");
    
    
    }

}