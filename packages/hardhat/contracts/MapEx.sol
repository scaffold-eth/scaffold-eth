pragma solidity ^0.6.2;

contract MapEx {
    // Mapping from address to uint
    mapping(address => string) public names;

    function getUserName(address a) public view returns (string memory) {
        // Mapping always returns a value.
        // If the value was never set, it will return the default value.
        return names[a];
    }

    function setUserName(address a, string memory name) public {
        // Update the value at this address
        names[a] = name;
    }
}
