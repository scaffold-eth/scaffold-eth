// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "./IGoodDataFeed.sol";
import "./IDateTime.sol";

contract GoodDataFeed is ChainlinkClient, IGoodDataFeed, Ownable {

    // FeedRegistered event
    event FeedRegistered(string feedId, string apiBaseUrl, string name, string description, uint256 yearOffset);

    // FeedDataUpdated
    // TODO: Could maybe just a graph CALL_HALNDER callback??
    event FeedDataUpdated(string feedId, uint256 latestFeedData);

    // Base struct for storing feed information.
    struct FeedParameters {
        string apiBaseUrl;
        string apiValueParseMap; // JSONParse string for Chainlink request. i.e. 0.data.value
        uint8 yearOffset;
    }

    // Chainlink request parameter storage
    struct FeedRequestData {
        string feedId;
        string requestedDate;
    }
   
    // mapping from feedId to apiBaseUrl
    mapping(string => FeedParameters) registeredFeeds;

    // mapping from feedId => latestData
    mapping(string => uint256) latestData;

    // mapping from Chainlink _requestId => data feed shortcode
    mapping (bytes32 => FeedRequestData) pendingRequests;

    // Chainlink Props
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    uint8 constant API_DECIMALS = 18;

    IDateTime dateTime;


    constructor() public {
        
        // link to datetime contract
        // https://kovan.etherscan.io/address/0x5C3D0ABABf110CdC54af47445D9739F5C1776E9E
        //dateTime = IDateTime(0x5C3D0ABABf110CdC54af47445D9739F5C1776E9E); // KOVAN ADDRESS
        dateTime = IDateTime(0x92482Ba45A4D2186DafB486b322C6d0B88410FE7); // RINKEBY ADDRESS

        // setup chainlink props
        // #if !IS_LOCAL_NETWORK
        setPublicChainlinkToken();
        // #endif
        
        // KOVAN DATA
        //oracle = 0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b; // https://market.link/nodes/323602b9-3831-4f8d-a66b-3fb7531649eb/jobs?network=42
    	//jobId = "c7dd72ca14b44f0c9b6cfcd4b7ec0a2c"; // https://market.link/jobs/f870737d-7550-4ec9-a009-eb596719dff8/runs?network=42

        // RINKEBY DATA
        oracle = 0x032887D0D0055e0f90447369F57EEb76b7a8e210; // https://docs.chain.link/docs/decentralized-oracles-ethereum-mainnet
        jobId = "f4b27e1552f0429294e1d138e643b041"; // https://docs.chain.link/docs/decentralized-oracles-ethereum-mainnet

    	fee = 1 * 10 ** (18 - 1); // 0.1 LINK
    }


    /**
     @dev Update chainlink oracla and jobId if need be.
     */
    function setChainlinkTarget(address newOracleAddress, bytes32 newJobId) external onlyOwner {
        oracle = newOracleAddress;
        jobId = newJobId;
    }


    function decimals() external override view returns (uint8) {
        return API_DECIMALS;
    }

    function latestDataForFeed(string calldata feedId) external override view returns (uint256) {
        // get year offset
        return latestData[feedId];
    }

    /**
     * @dev Takes timestamp and returns the year as a string.
     */
    function formatDateByYear(uint256 timestamp, uint8 yearOffset) public view returns (string memory) {
        uint16 year;
        // #if IS_LOCAL_NETWORK
        //year = 2021 - yearOffset;
        // #else
        year = dateTime.getYear(timestamp) - yearOffset;
        // #endif
        return uint2str(year);
    }

    /**
     * @dev Checks if a feed already exists.
     */
    function feedExists(string memory feedId) public view returns (bool) {
        return bytes(registeredFeeds[feedId].apiBaseUrl).length != 0;
    }


    /**
     * @dev Creates a SDMX query request that filters on a specific time range.
     */
    function createSDMXDateRangeRequest(
        string memory baseUrl, 
        string memory startDate,
        string memory endDate
    ) public pure returns (string memory) {
        return string(abi.encodePacked(baseUrl, "&startPeriod=", startDate, "&endPeriod=", endDate));
    }


    /**
     * @dev Request latest feed data.
     */
    function requestLatestFeedData(string memory feedId) public {
        requestFeedData(feedId, block.timestamp);
    }


    /**
     * @dev Request offchain api data for feed.
     */
    function requestFeedData(string memory feedId, uint256 timestamp) public {
        // validate that feed exists
        require(feedExists(feedId), "GoodDataFeed: Feed does not exist!");

        // build api url based on date
        FeedParameters memory feedData = registeredFeeds[feedId];
        string memory dateString = formatDateByYear(timestamp, feedData.yearOffset);
        // Filter for time period based on entire year
        string memory formattedUrl = createSDMXDateRangeRequest(feedData.apiBaseUrl, dateString, dateString);

        console.log(formattedUrl);
    	
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfilFeedRequest.selector);

    	// request CO2 emissions from API
    	req.add("get", formattedUrl);
    	
    	// set correct path within JSON data of API result
    	req.add("path", feedData.apiValueParseMap);

        // Answer in decimals so remove decimals
        req.addUint("times", 10**uint256(API_DECIMALS));

    	bytes32 requestId = sendChainlinkRequestTo(oracle, req, fee);

        // register request data
        pendingRequests[requestId] = FeedRequestData(feedId, dateString);

        // FOR LOCAL TEST, AUTOMATICALLY FULFILL
        //fulfilFeedRequest(requestId, 10 * 10**18);
    }

    /**
     * @dev Chainlink API fulfilled handler. Updates latest data for feed
     */
    function fulfilFeedRequest(bytes32 _requestId, uint256 feedData) 
        public recordChainlinkFulfillment(_requestId) 
    {
    	
        FeedRequestData memory reqData = pendingRequests[_requestId];

        // update latest data? still need to update historical data?
        latestData[reqData.feedId] = feedData;

        console.log("Request fulfilled: %s at %s", reqData.requestedDate, feedData);

        emit FeedDataUpdated(reqData.feedId, feedData);

        // cleanup pending requests
        delete pendingRequests[_requestId];
    }


    function registerApi(
        string memory feedId,
        string memory apiBaseUrl,
        string memory apiValueParseMap,
        string memory name, // used only to emit in event for TheGraph
        string memory description, // used only to emit in event for TheGraph
        uint8 yearOffset
    ) public onlyOwner {
        // ensure api is not already registered
        require(!feedExists(feedId), "GoodDataFeed: FeedId already exists!");

        registeredFeeds[feedId] = FeedParameters(
            apiBaseUrl,
            apiValueParseMap,
            yearOffset
        );

        // put in temporary test data while rinekby chainlink node is not solved
        latestData[feedId] = 102134 * (10 ** (18 -  4));


        emit FeedRegistered(feedId, apiBaseUrl, name, description, yearOffset);
    }
    

    function uint2str(uint _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

}