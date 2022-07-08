contract JB {
  function pay(
    uint256 _projectId,
    uint256 _amount,
    address,
    address _beneficiary,
    uint256 _minReturnedTokens,
    bool _preferClaimedTokens,
    string calldata _memo,
    bytes calldata _metadata
  ) external payable virtual returns (uint256) {
    return 1;
  }
}
