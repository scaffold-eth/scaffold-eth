//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Secrets {
    struct Secret {
        bytes32 entity_id;
        string text;
        uint256 likes;
        uint256 reports;
        uint256 created_at;
        bool is_entity;
    }

    bytes32[] private secretIds;
    mapping(bytes32 => Secret) private secrets;
    mapping(address => mapping(bytes32 => bool)) private likes;
    mapping(address => mapping(bytes32 => bool)) private reports;

    function isEntity(bytes32 entity_id) private view returns (bool) {
        return secrets[entity_id].is_entity;
    }

    function getCount() public view returns (uint) {
        return secretIds.length;
    }

    function getPaginatedSecrets(uint256 cursor, uint256 limit) public view returns (Secret[] memory values, uint256 newCursor, bool isEnd){
        if (cursor >= secretIds.length) {
            cursor = secretIds.length - 1;
        }
        if (limit > cursor) {
            limit = cursor + 1;
        }

        values = new Secret[](limit);
        for (uint256 i = 0; i < limit; i++) {
            values[i] = secrets[secretIds[cursor - i]];
        }

        return (values, (limit > cursor) ? 0 : cursor - limit, (limit > cursor) ? true : false);
    }

    function add(string memory text) public {
        require(bytes(text).length > 0, "Error: Message must not be empty!");
        bytes32 identifier = keccak256(abi.encodePacked(msg.sender, text, block.timestamp));

        if (isEntity(identifier)) revert("Error: Duplicate message id! Please try again.");

        Secret memory newSecret = Secret(
            identifier,
            text,
            0,
            0,
            block.timestamp,
            true
        );
        secretIds.push(identifier);
        secrets[identifier] = newSecret;
    }

    function getUserLike(address user, bytes32 entity_id) public view returns (bool) {
        return likes[user][entity_id];
    }

    function like(bytes32 entity_id) external {
        require(isEntity(entity_id), "Error: This message does not exists.");

        if (likes[msg.sender][entity_id]) {
            delete likes[msg.sender][entity_id];
            secrets[entity_id].likes--;
        } else {
            likes[msg.sender][entity_id] = true;
            secrets[entity_id].likes++;
        }
    }

    function getUserReport(address user, bytes32 entity_id) public view returns (bool) {
        return reports[user][entity_id];
    }

    function report(bytes32 entity_id) external {
        require(isEntity(entity_id), "Error: This message does not exists.");

        if (reports[msg.sender][entity_id]) {
            delete reports[msg.sender][entity_id];
            secrets[entity_id].reports--;
        } else {
            reports[msg.sender][entity_id] = true;
            secrets[entity_id].reports++;
        }
    }
}
