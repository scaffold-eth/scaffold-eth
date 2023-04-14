pragma solidity ^0.6.2;

contract MaputoToken {
    address public addr = address(0x0);
    address public pAddr;

    mapping(address => uint) public tokens;
    mapping(address => bool) public calledMint;

    constructor() public {
        tokens[addr] = 1000000000;
    }

    function getToken(address _address) public view returns (uint) {
        return tokens[_address];
    }

    function mint(
        address _address
    ) public checkPossible(addr, 10001) callOnce(_address) {
        tokens[addr] -= 10001;
        tokens[_address] += 10000;
        tokens[pAddr] += 1;
        calledMint[_address] = true;
    }

    function transfer(
        address sender,
        address receiver,
        uint amount
    ) public checkPossible(sender, amount + (amount / 1000)) {
        tokens[sender] -= amount + amount / 1000;
        tokens[receiver] += amount;
        tokens[pAddr] += amount / 1000;
    }

    function setPhilanthropicAddress(address _pAddr) public {
        pAddr = _pAddr;
    }

    modifier checkPossible(address _address, uint value) {
        require(tokens[_address] >= value, "There's no enougth tokens!");
        _; //1st check than run
    }

    modifier callOnce(address _address) {
        require(
            calledMint[_address] == false,
            "This address already called the mint function!"
        );
        _;
    }
}
