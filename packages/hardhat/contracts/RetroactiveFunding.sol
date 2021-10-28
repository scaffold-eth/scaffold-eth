pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RetroactiveFunding {
    uint128 constant MAX_FLOOR_LIMIT = 1000 ether;

    IERC20 public immutable weth;

    struct FloorConfig {
        uint128 floor;
        uint128 quantity;
    }

    mapping(address => mapping(address => FloorConfig))
        public whaleFloorRequest;

    constructor(IERC20 _weth) {
        weth = _weth;
    }

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
            _nft.safeTransferFrom(msg.sender, address(0), _ids[i]);
        }
    }
}
