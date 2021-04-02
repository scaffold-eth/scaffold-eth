// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "./IGoodDataFeed.sol";
import "./IDateTime.sol";

contract GoodDataFeed is ChainlinkClient, IGoodDataFeed, Ownable {

    // FeedRegistered event
    event FeedRegistered(string feedId, string apuBaseUrl);

    // FeedDataUpdated
    // TODO: Could maybe just a graph CALL_HALNDER callback??
    event FeedDataUpdated(string feedId, uint256 latestFeedData);

    // Chainlink request parameter storage
    struct FeedRequestData {
        string feedId;
        string requestedDate;
    }

    struct FeedParameters {
        string apiBaseUrl;
        string apiValueParseMap; // JSONParse string for Chainlink request. i.e. [0].data.value
        uint8 yearOffset;
    }
   
    // mapping from feedId to apiBaseUrl
    mapping(string => FeedParameters) registeredFeeds;

    // mapping from feedId => latestData
    mapping(string => uint256) latestData;

    // mapping from apiSymbol => (mapping from YYYY-Q => data feed value)
    mapping(string => mapping(string => uint256)) historicalFeedData;

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
        dateTime = IDateTime(0x5C3D0ABABf110CdC54af47445D9739F5C1776E9E); // KOVAN ADDRESS

        // setup chainlink props
        //setPublicChainlinkToken();
        oracle = 0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b; // https://market.link/nodes/323602b9-3831-4f8d-a66b-3fb7531649eb/jobs?network=42
    	jobId = "c7dd72ca14b44f0c9b6cfcd4b7ec0a2c"; // https://market.link/jobs/0609deab-6d61-4937-85e4-a8e810b8b272?network=42
    	fee = 0.1 * 10 ** 18; // 0.1 LINK
    }

    function decimals() external override view returns (uint8) {
        return API_DECIMALS;
    }

    function latestDataForFeed(string calldata feedId) external override view returns (uint256) {
        // get year offset
        return latestData[feedId];
    }

    function feedDataForDate(string memory feedId, string memory date) public view returns (uint256) {
        return historicalFeedData[feedId][date];
    }

    /**
     * @dev Formats a timestamp to a valid feed date, as api use format YYYYMM
     */
    function formatDate(uint256 timestamp) public pure returns (uint16) {
        // TODO!!!!
        return uint16(timestamp);
    }

    function formatDateByQuarter(uint256 timestamp, uint8 yearOffset) public view returns (string memory) {
        uint16 year = 2019 - yearOffset;//dateTime.getYear(timestamp);
        uint8 month = 4;//dateTime.getMonth(timestamp);
        string memory quarter = "Q1";
        if(month > 9) {
            quarter = "Q4";
        } else if (month > 6) {
            quarter = "Q3";
        } else if (month > 3) {
            quarter = "Q2";
        }

        return string(abi.encodePacked(uint2str(year), "-", quarter));
    }

    function feedExists(string memory feedId) public view returns (bool) {
        return bytes(registeredFeeds[feedId].apiBaseUrl).length != 0;
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
        string memory baseUrl = feedData.apiBaseUrl;
        string memory dateString = formatDateByQuarter(timestamp, feedData.yearOffset);
        string memory formattedUrl = string(abi.encodePacked(baseUrl, dateString));

        console.log(formattedUrl);
    	
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfilFeedRequest.selector);

    	// request CO2 emissions from API
    	req.add("get", formattedUrl);
    	
    	// set correct path within JSON data of API result
    	req.add("path", feedData.apiValueParseMap);

        // Answer in decimals so remove decimals
        req.addUint("times", 10**uint256(API_DECIMALS));

    	bytes32 requestId = bytes32("hfsadf");//sendChainlinkRequestTo(oracle, req, fee);

        // register request data
        pendingRequests[requestId] = FeedRequestData(feedId, dateString);

        fulfilFeedRequest(requestId, 100);
    }

    /**
     * @dev Chainlink API fulfilled handler. Updates historical data of feed
     */
    function fulfilFeedRequest(bytes32 _requestId, uint256 feedData) public /*recordChainlinkFulfillment(_requestId)*/ {
    	
        FeedRequestData memory reqData = pendingRequests[_requestId];
        historicalFeedData[reqData.feedId][reqData.requestedDate] = feedData;

        // update latest data? still need to update historical data?
        latestData[reqData.feedId] = feedData;

        console.log("Request fulfilled: %s at %s", reqData.requestedDate, feedData);

        // cleanup pending requests
        delete pendingRequests[_requestId];
    }


    function registerApi(
        string memory feedId,
        string memory apiBaseUrl,
        string memory apiValueParseMap,
        uint8 yearOffset
    ) public onlyOwner {
        // ensure api is not already registered
        require(!feedExists(feedId), "GoodDataFeed: FeedId already exists!");

        registeredFeeds[feedId] = FeedParameters(
            apiBaseUrl,
            apiValueParseMap,
            yearOffset
        );

        emit FeedRegistered(feedId, apiBaseUrl);
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