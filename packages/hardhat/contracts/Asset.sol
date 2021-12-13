pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./Payment.sol";

contract Asset is ERC721, Payment {
    using Counters for Counters.Counter;
    using EnumerableMap for EnumerableMap.UintToAddressMap;
    using EnumerableSet for EnumerableSet.UintSet;

    Counters.Counter private _tokenIds;

    EnumerableMap.UintToAddressMap private _tokenCreators;
    EnumerableSet.UintSet private _available;

    mapping(address => EnumerableSet.UintSet) private rented;
    mapping(uint256 => int96) private records;

    constructor(
        string memory _name,
        string memory _symbol,
        ISuperfluid host,
        IConstantFlowAgreementV1 cfa,
        ISuperToken acceptedToken
    ) ERC721(_name, _symbol) Payment(host, cfa, acceptedToken) {}

    receive() external payable {}

    function getAvailableTokens() public view returns (bytes32[] memory) {
        return _available._inner._values;
    }

    function getRentedTokens() public view returns (bytes32[] memory) {
        return rented[msg.sender]._inner._values;
    }

    function createAsset(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newAssetId = _tokenIds.current();
        _safeMint(msg.sender, newAssetId);
        _setTokenURI(newAssetId, tokenURI);
        _tokenCreators.set(newAssetId, msg.sender);
        _available.add(newAssetId);

        return newAssetId;
    }

    function updateAsset(bytes calldata ctx, uint256 tokenId)
        private
        returns (bytes memory newCtx)
    {
        address requester = host.decodeCtx(ctx).msgSender;

        newCtx = ctx;
        int96 netFlowRate = cfa.getNetFlow(acceptedToken, address(this));
        if (netFlowRate > 0) {
            if (ownerOf(tokenId) == _tokenCreators.get(tokenId)) {
                (, int96 currentRate, , ) =
                    cfa.getFlow(acceptedToken, address(this), ownerOf(tokenId));

                if (currentRate == 0) {
                    (newCtx, ) = host.callAgreementWithContext(
                        cfa,
                        abi.encodeWithSelector(
                            cfa.createFlow.selector,
                            acceptedToken,
                            ownerOf(tokenId),
                            netFlowRate,
                            new bytes(0)
                        ),
                        new bytes(0),
                        newCtx
                    );
                } else {
                    (newCtx, ) = host.callAgreementWithContext(
                        cfa,
                        abi.encodeWithSelector(
                            cfa.updateFlow.selector,
                            acceptedToken,
                            ownerOf(tokenId),
                            currentRate + netFlowRate,
                            new bytes(0)
                        ),
                        new bytes(0),
                        newCtx
                    );
                }

                records[tokenId] = netFlowRate;
                _safeTransfer(ownerOf(tokenId), requester, tokenId, "");
                _available.remove(tokenId);
                rented[requester].add(tokenId);
            } else {
                (newCtx, ) = host.callAgreementWithContext(
                    cfa,
                    abi.encodeWithSelector(
                        cfa.deleteFlow.selector,
                        acceptedToken,
                        address(this),
                        ownerOf(tokenId),
                        new bytes(0)
                    ),
                    new bytes(0),
                    newCtx
                );
            }
        } else if (netFlowRate < 0) {
            if (_exists(tokenId) && ownerOf(tokenId) == requester) {
                _safeTransfer(
                    requester,
                    _tokenCreators.get(tokenId),
                    tokenId,
                    ""
                );

                (, int96 currentRate, , ) =
                    cfa.getFlow(acceptedToken, address(this), ownerOf(tokenId));
                int96 newRate = currentRate + netFlowRate;
                if (newRate == 0) {
                    (newCtx, ) = host.callAgreementWithContext(
                        cfa,
                        abi.encodeWithSelector(
                            cfa.deleteFlow.selector,
                            acceptedToken,
                            address(this),
                            ownerOf(tokenId),
                            new bytes(0)
                        ),
                        new bytes(0),
                        newCtx
                    );
                } else {
                    (newCtx, ) = host.callAgreementWithContext(
                        cfa,
                        abi.encodeWithSelector(
                            cfa.updateFlow.selector,
                            acceptedToken,
                            ownerOf(tokenId),
                            newRate,
                            new bytes(0)
                        ),
                        new bytes(0),
                        newCtx
                    );
                }
                _available.add(tokenId);
                rented[requester].remove(tokenId);
                delete records[tokenId];
            }
        }
        return newCtx;
    }

    function afterAgreementCreated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, // _agreementId
        bytes calldata, // _agreementData
        bytes calldata, // _cbdata
        bytes calldata _ctx
    )
        external
        override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        returns (bytes memory)
    {
        uint256 userData = abi.decode(host.decodeCtx(_ctx).userData, (uint256));
        return updateAsset(_ctx, userData);
    }

    function afterAgreementUpdated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, // _agreementId
        bytes calldata, // _agreementData
        bytes calldata, // _cbdata
        bytes calldata _ctx
    )
        external
        override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        returns (bytes memory)
    {
        uint256 userData = abi.decode(host.decodeCtx(_ctx).userData, (uint256));
        return updateAsset(_ctx, userData);
    }

    function afterAgreementTerminated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, // _agreementId
        bytes calldata, // _agreementData
        bytes calldata, // _cbdata
        bytes calldata _ctx
    )
        external
        override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        returns (bytes memory)
    {
        uint256 userData = abi.decode(host.decodeCtx(_ctx).userData, (uint256));
        bytes memory newCtx = updateAsset(_ctx, userData);
        return newCtx;
    }
}