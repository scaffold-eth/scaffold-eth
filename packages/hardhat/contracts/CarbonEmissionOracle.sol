// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
import "./IOracleDataFeed.sol";
import "hardhat/console.sol";

// Base api: https://api.v2.emissions-api.org/ui/#/default/emissionsapi.web.get_average


contract CarbonEmissionOracle is ChainlinkClient, IOracleDataFeed {
    
    uint256 public latestEmissions;
    
    // mapping from month => emission for historical emissions
    mapping(uint16 => uint256) historicalEmissions;

    // Chainlink Props
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    
    uint8 constant API_DECIMALS = 18;
    string constant apiBasePath = "https://api.v2.emissions-api.org/api/v2/carbonmonoxide/average.json?country=USA&begin=2019-01-11&end=2019-02-11&limit=1&offset=0";


    function name() external override view returns (string memory) {
        return "CarbonEmission Data Feed";
    }

    function description() external override view returns (string memory) {
        return "CarbonEmission Data Feed Oracle that returns the average daily carbon emissions by month in the US.";
    }

    function decimals() external override view returns (uint8) {
        return API_DECIMALS;
    }

    function latestRate() public override view returns (uint256) {
        return latestEmissions;
    }

    /**
     * @dev Gets historical emission data.
     *   - Returns 0 if no data exists 
     */
    function rateForMonth(uint16 month) external override view returns (uint256) {
        // will return 0 if no data exists
        uint256 historicalEmission = historicalEmissions[month];
        console.log("Historical emission for %s: %s", uint256(month), historicalEmission);
        return historicalEmission;
    }



    constructor() public {
        setPublicChainlinkToken();
        
        oracle = 0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b; // https://market.link/nodes/323602b9-3831-4f8d-a66b-3fb7531649eb/jobs?network=42
    	jobId = "c7dd72ca14b44f0c9b6cfcd4b7ec0a2c"; // https://market.link/jobs/0609deab-6d61-4937-85e4-a8e810b8b272?network=42
    	fee = 0.1 * 10 ** 18; // 0.1 LINK
        
    }
    
    /**
     * Make initial request
     */
    function requestCarbonEmissionLevel() public {
    	Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfillEthereumPrice.selector);
    	
    	// request CO2 emissions from API
    	req.add("get", apiBasePath);
    	
    	// set correct path within JSON data of API result
    	// get the average daily CO2 emissions
    	req.add("path", "0.average");

        // Answer in decimals so remove decimals
        req.addInt("times", int256(10**uint256(API_DECIMALS)));

    	sendChainlinkRequestTo(oracle, req, fee);
    }
    
    /**
     * Callback function
     */
    function fulfillEthereumPrice(bytes32 _requestId, uint256 averageCarbonEmission) public recordChainlinkFulfillment(_requestId) {
    	latestEmissions = averageCarbonEmission;
    }
    
}