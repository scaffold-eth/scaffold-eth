// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import 'base64-sol/base64.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import './HexStrings.sol';
/// @title NFTSVG
/// @notice Provides a function for generating an SVG associated with a Uniswap NFT
library MetaDataGenerator {

  using Strings for uint256;
  using HexStrings for uint160;

  struct MetaDataParams {
    uint256 tokenId;
    string tokenIpfsHash;
    address owner;
  }

  function tokenURI(MetaDataParams memory params) internal pure returns (string memory) {

      string memory name = string(abi.encodePacked('Nata #',params.tokenId.toString()));

      string memory description = string(abi.encodePacked('A tasty pastel de nata'));

      return
          string(
              abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    bytes(
                          abi.encodePacked(
                              '{"name":"',
                              name,
                              '", "description":"',
                              description,
                              '", "external_url":"https://natadao.surge.sh/token/',
                              params.tokenId.toString(),
                              '", "owner":"',
                              (uint160(params.owner)).toHexString(20),
                              '", "image": "',
                              'https://',
                              params.tokenIpfsHash,
                              '.ipfs.dweb.link/"}'
                          )
                        )
                    )
              )
          );
  }

}
