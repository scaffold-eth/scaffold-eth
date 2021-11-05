pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RetroactiveFunding {

    /// @dev mapping which tracks the floor for each nft
    mapping(address => uint) public floor;

    /**
     * @notice Whale increasesfloor price for a particular nft by locking in a specific amount of eth and floor is calulated based on eth locked and nft's total supply
     * @param _nft nft address
     */
    function increaseFloor(IERC721Enumerable _nft) external payable {
       uint totalSupply = _nft.totalSupply();
       floor[address(_nft)] = msg.value / totalSupply + floor[address(_nft)];
       (bool success, ) = msg.sender.call{value: msg.value}("");
       require(success);
    }

    /**
     * @notice Executes a sale and updates the floor price
     * @param _nft nft address
     * @param _ids array of the nft id's the holder is burning
     */
    function executeSale(
        IERC721Enumerable _nft,
        uint256[] calldata _ids
    ) external {
        require(_ids.length > 0, "RetroactiveFunding: _ids is empty");
        uint currentFloor = floor[address(_nft)];
        // updating the total supply to calculate the new floor
        uint updatedTotalSupply = _nft.totalSupply() - _ids.length;
        // updating floor price by subtracting the current floor by the ratio of the sale amount and the new total supply
        require(floor[address(_nft)] > currentFloor * _ids.length / updatedTotalSupply, "RetroactiveFunding: sale cannot be made right now!");
        floor[address(_nft)] = floor[address(_nft)] - currentFloor * _ids.length / updatedTotalSupply; 
        (bool success, ) = msg.sender.call{value: currentFloor * _ids.length}("");
        require(success);
        for (uint256 i = 0; i < _ids.length; i++) {
            // burn the nft's approval required
            _nft.safeTransferFrom(msg.sender, address(0), _ids[i]);
        }
    }
}
