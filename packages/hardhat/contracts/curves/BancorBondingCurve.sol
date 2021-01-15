pragma solidity >=0.6.0 <0.7.0;

import "../math/BancorFormula.sol";
import "../interfaces/IBondingCurve.sol";


abstract contract BancorBondingCurve is IBondingCurve, BancorFormula {
    /*
        reserve ratio, represented in ppm, 1-1000000
        1/3 corresponds to y= multiple * x^2
        1/2 corresponds to y= multiple * x
        2/3 corresponds to y= multiple * x^1/2
    */
    uint32 public reserveRatio;

    constructor(uint32 _reserveRatio) public {
        reserveRatio = _reserveRatio;
    }

    function getContinuousMintReward(uint _reserveTokenAmount) public override view returns (uint) {
        return calculatePurchaseReturn(continuousSupply(), reserveBalance(), reserveRatio, _reserveTokenAmount);
    }

    function getContinuousBurnRefund(uint _continuousTokenAmount) public override view returns (uint) {
        return calculateSaleReturn(continuousSupply(), reserveBalance(), reserveRatio, _continuousTokenAmount);
    }

    /**
    * @dev Abstract method that returns continuous token supply
    */
    function continuousSupply() public virtual view returns (uint);

    /**
    * @dev Abstract method that returns reserve token balance
    */    
    function reserveBalance() public virtual view returns (uint);
}