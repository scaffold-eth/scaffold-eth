//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract AddressList {
    // Add the library methods
    using EnumerableSet for EnumerableSet.AddressSet;

    struct List {
        bool joinable;
        address owner;
        EnumerableSet.AddressSet list;
    }

    mapping(bytes32 => List) listGroup;

    event ListCreated(
        string indexed name,
        bytes32 indexed id,
        address[] indexed users
    );

    event Transfer(
        address indexed from,
        address indexed to,
        bytes32 indexed id
    );

    event UserAddedToList(
        address indexed by,
        address indexed user,
        bytes32 indexed id
    );

    event UserJoinedList(address indexed user, bytes32 indexed id);

    event UserLeftList(address indexed user, bytes32 indexed id);

    function _getRoomId(string memory name) private pure returns (bytes32 id) {
        id = keccak256(abi.encodePacked(name));
    }

    // create List
    function createList(
        string calldata name,
        address[] calldata users,
        bool joinable
    ) external {
        require(users.length > 0, "You can't create an empty list");
        bytes32 id = _getRoomId(name);

        require(
            listGroup[id].owner == address(0),
            "Someone already owns this list"
        );

        listGroup[id].owner = msg.sender;
        listGroup[id].joinable = joinable;

        for (uint256 i = 0; i < users.length; i++) {
            require(
                users[i] != address(0),
                "You can't add the genesis address to a list"
            );
            require(
                !listGroup[id].list.contains(users[i]),
                "Duplicate user address"
            );

            listGroup[id].list.add(users[i]);
        }

        emit ListCreated(name, id, users);
    }

    // fetch List
    function getList(string calldata name)
        external
        view
        returns (address[] memory list)
    {
        bytes32 id = _getRoomId(name);

        list = listGroup[id].list.values();
    }

    // get list length
    function getLength(string calldata name)
        external
        view
        returns (uint256 length)
    {
        bytes32 id = _getRoomId(name);

        length = listGroup[id].list.length();
    }

    function getAddressAtIndex(string calldata name, uint256 index)
        external
        view
        returns (address add)
    {
        bytes32 id = _getRoomId(name);

        add = listGroup[id].list.at(index);
    }

    // get List owner
    function getListMeta(string calldata name)
        external
        view
        returns (address owner, bool joinable)
    {
        bytes32 id = _getRoomId(name);

        owner = listGroup[id].owner;
        joinable = listGroup[id].joinable;
    }

    // update List
    function changeListJoinable(string memory name, bool joinable) external {
        bytes32 id = _getRoomId(name);
        require(
            listGroup[id].owner == msg.sender,
            "You are not the owner of this list group"
        );

        listGroup[id].joinable = joinable;
    }

    // transfer List
    function transfer(string memory name, address to) external {
        bytes32 id = _getRoomId(name);
        require(
            listGroup[id].owner == msg.sender,
            "You are not the owner of this list group"
        );

        listGroup[id].owner = to;

        emit Transfer(msg.sender, to, id);
    }

    // add users to List
    function addUserToList(string memory name, address user) external {
        bytes32 id = _getRoomId(name);
        require(
            listGroup[id].owner == msg.sender,
            "You are not the owner of this list group"
        );

        require(!listGroup[id].list.contains(user), "Duplicate user address");

        listGroup[id].list.add(user);

        emit UserAddedToList(msg.sender, user, id);
    }

    // join List
    function joinList(string memory name) external {
        bytes32 id = _getRoomId(name);
        require(
            !listGroup[id].list.contains(msg.sender),
            "You are already on this list"
        );

        listGroup[id].list.add(msg.sender);

        emit UserJoinedList(msg.sender, id);
    }

    // leave List
    function leaveList(string memory name) external {
        bytes32 id = _getRoomId(name);
        require(
            listGroup[id].list.contains(msg.sender),
            "You are not on this list"
        );

        listGroup[id].list.remove(msg.sender);

        emit UserLeftList(msg.sender, id);
    }
}
