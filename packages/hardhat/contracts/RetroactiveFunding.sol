pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RetroactiveFunding {
    /// @dev mapping which tracks the amount deposited for each nft
    mapping(address => uint256) public amount;

    /// @dev mapping which maps NFT addresses to supplies
    mapping(address => uint256) public totalSupply;

    /// @dev mapping which tracks whether NFT collection was added to the contract in the past
    mapping(address => bool) public addedBefore;

    /**
     * @notice Whale increasesfloor price for a particular nft by locking in a specific amount of eth and floor is calulated based on eth locked and nft's total supply
     * @param _nft nft address
     */
    function increaseFloor(IERC721Enumerable _nft) external payable {
        require(msg.value > 0, "RetroactiveFunding: zero payment");

        if (!addedBefore[address(_nft)]) {
            require(
                _nft.totalSupply() > 0,
                "RetroactiveFunding: invalid collection passed"
            );
            addedBefore[address(_nft)] = true;
            totalSupply[address(_nft)] = _nft.totalSupply();
        }

        amount[address(_nft)] += msg.value;
    }

    /**
     * @notice Executes a sale and updates the floor price
     * @param _nft nft address
     * @param _id nft id
     */
    function executeSale(IERC721Enumerable _nft, uint256 _id) external {
        require(
            _nft.ownerOf(_id) == msg.sender,
            "RetroactiveFunding: invalid ERC721 _id passed"
        );
        require(
            totalSupply[address(_nft)] > 0 && amount[address(_nft)] > 0,
            "RetroactiveFunding: sale execution is not possible"
        );

        uint256 currentFloor = amount[address(_nft)] /
            totalSupply[address(_nft)];
        require(currentFloor > 0, "RetroactiveFunding: zero floor price");

        (bool success, ) = msg.sender.call{value: currentFloor}("");
        require(success);

        amount[address(_nft)] -= currentFloor;
        totalSupply[address(_nft)]--;

        // Approval for address 0x1 is required
        // Address 0x0 is prohibited by ERC721
        _nft.safeTransferFrom(msg.sender, address(1), _id);
    }
}
