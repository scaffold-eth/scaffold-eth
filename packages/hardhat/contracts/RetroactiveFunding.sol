pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MoonshotBot.sol";

contract RetroactiveFunding {
    /// @dev mapping which tracks the floor for each nft
    mapping(address => uint256) public stake;

    function floor(MoonshotBot _nft) public view returns (uint256) {
        uint256 totalSupply = _nft.totalSupply();
        if (totalSupply == 0) {
            return stake[address(_nft)];
        }
        return stake[address(_nft)] / totalSupply;
    }

    /**
     * @notice Whale increasesfloor price for a particular nft by locking in a specific amount of eth and floor is calulated based on eth locked and nft's total supply
     * @param _nft nft address
     */
    function increaseFloor(MoonshotBot _nft) external payable {
        require(msg.value > 0, "RetroactiveFunding: zero payment");
        stake[address(_nft)] += msg.value;
    }

    /**
     * @notice Executes a sale and updates the floor price
     * @param _nft nft address
     * @param _id nft id
     */
    function executeSale(MoonshotBot _nft, uint256 _id) external {
        uint256 currentFloor = floor(_nft);
        require(
            currentFloor > 0,
            "RetroactiveFunding: sale cannot be made right now!"
        );
        stake[address(_nft)] -= currentFloor;
        (bool success, ) = msg.sender.call{value: currentFloor}("");
        require(success, "RetroactiveFunding: sending floor price failed");
        _nft.redeem(_id);
    }
}
