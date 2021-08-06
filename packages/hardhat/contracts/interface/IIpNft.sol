pragma solidity >=0.6.0 <0.8.4;
//SPDX-License-Identifier: MIT

/// @title NFT contract for licensening IP
/// @author elocremarc

interface IIpNft {
  function changeLicenseCost ( uint256 newLicenseCost ) external returns ( uint256 );
  function changeLicensor ( address newLicensor ) external;
  function licenseIP (  ) external returns ( uint256 );
}