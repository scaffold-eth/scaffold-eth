pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RetroactiveFunding {
    uint128 constant MAX_FLOOR_LIMIT = 1000 ether;

    IERC20 public immutable weth;

    /// @dev struct containing details about the floor increase request, the new floor price and no of id's the whale is willing to pay for
    struct FloorConfig {
        uint128 floor;
        uint128 quantity;
    }

    /// @dev mapping which tracks the te whale floor config with 2 keys the nft address and te whale address
    mapping(address => mapping(address => FloorConfig))
        public whaleFloorRequest;

    constructor(IERC20 _weth) {
        weth = _weth;
    }

    /**
     * @notice Whale request a new floor price for a particular nft
     * @param _nft nft address
     * @param _floor new floor price
     * @param _quantity no of id's the whale can pay for
     */
    function requestToIncreaseFloor(
        IERC721 _nft,
        uint128 _floor,
        uint128 _quantity
    ) external {
        require(_floor > 0, "RetroactiveFunding: invalid floor amount");
        require(
            _floor < MAX_FLOOR_LIMIT,
            "RetroactiveFunding: floor limit reached"
        );
        require(
            weth.allowance(msg.sender, address(this)) >= _floor * _quantity,
            "RetroactiveFunding: weth allowance missing"
        );
        whaleFloorRequest[address(_nft)][msg.sender] = FloorConfig(
            _floor,
            _quantity
        );
    }

    /**
     * @notice Executes a sale after the nft holder sees the new floor request they can call this function burn the nft and get WETH
     * @param _nft nft address
     * @param _whale whale address
     * @param _ids array of the nft id's the holder is burning
     */
    function executeSale(
        IERC721 _nft,
        address _whale,
        uint256[] calldata _ids
    ) external {
        require(
            msg.sender != _whale,
            "RetroactiveFunding: _whale cannot be the caller"
        );
        require(_ids.length > 0, "RetroactiveFunding: _ids is empty");
        FloorConfig storage floorConfig = whaleFloorRequest[address(_nft)][
            _whale
        ];
        require(
            _ids.length <= floorConfig.quantity,
            "RetroactiveFunding: _ids exceed the floor request quantity"
        );

        floorConfig.quantity = floorConfig.quantity - uint128(_ids.length);

        weth.transferFrom(_whale, msg.sender, floorConfig.floor * _ids.length);
        for (uint256 i = 0; i < _ids.length; i++) {
            // burn the nft's approval required
            _nft.safeTransferFrom(msg.sender, address(0), _ids[i]);
        }
    }
}
