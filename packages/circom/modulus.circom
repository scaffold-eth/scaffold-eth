include "node_modules/circomlib/circuits/sign.circom"
include "node_modules/circomlib/circuits/comparators.circom"
include "node_modules/circomlib/circuits/bitify.circom"

// NB: RangeProof is inclusive.
// input: field element, whose abs is claimed to be <= than max_abs_value
// output: none
// also checks that both max and abs(in) are expressible in `bits` bits
template RangeProof(bits) {
    signal input in; 
    signal input max_abs_value;

    /* check that both max and abs(in) are expressible in `bits` bits  */
    component n2b1 = Num2Bits(bits+1);
    n2b1.in <== in + (1 << bits);
    component n2b2 = Num2Bits(bits);
    n2b2.in <== max_abs_value;

    /* check that in + max is between 0 and 2*max */
    component lowerBound = LessThan(bits+1);
    component upperBound = LessThan(bits+1);

    lowerBound.in[0] <== max_abs_value + in; 
    lowerBound.in[1] <== 0;
    lowerBound.out === 0

    upperBound.in[0] <== 2 * max_abs_value;
    upperBound.in[1] <== max_abs_value + in; 
    upperBound.out === 0
}

// input: n field elements, whose abs are claimed to be less than max_abs_value
// output: none
template MultiRangeProof(n, bits) {
    signal input in[n];
    signal input max_abs_value;
    component rangeProofs[n];

    for (var i = 0; i < n; i++) {
        rangeProofs[i] = RangeProof(bits);
        rangeProofs[i].in <== in[i];
        rangeProofs[i].max_abs_value <== max_abs_value;
    }
}

// input: any field elements
// output: 1 if field element is in (p/2, p-1], 0 otherwise
template IsNegative() {
    signal input in;
    signal output out;

    component num2Bits = Num2Bits(254);
    num2Bits.in <== in;
    component sign = Sign();
    
    for (var i = 0; i < 254; i++) {
        sign.in[i] <== num2Bits.out[i];
    }

    out <== sign.sign;
}

// input: dividend and divisor field elements in [0, sqrt(p))
// output: remainder and quotient field elements in [0, p-1] and [0, sqrt(p)
// Haven't thought about negative divisor yet. Not needed.
// -8 % 5 = 2. [-8 -> 8. 8 % 5 -> 3. 5 - 3 -> 2.]
// (-8 - 2) // 5 = -2
// -8 + 2 * 5 = 2
// check: 2 - 2 * 5 = -8
template Modulo(divisor_bits, SQRT_P) {
    signal input dividend; // -8
    signal input divisor; // 5
    signal output remainder; // 2
    signal output quotient; // -2
 
    component is_neg = IsNegative();
    is_neg.in <== dividend;
 
    signal output is_dividend_negative;
    is_dividend_negative <== is_neg.out;
 
    signal output dividend_adjustment;
    dividend_adjustment <== 1 + is_dividend_negative * -2; // 1 or -1
 
    signal output abs_dividend;
    abs_dividend <== dividend * dividend_adjustment; // 8
 
    signal output raw_remainder;
    raw_remainder <-- abs_dividend % divisor;
 
    signal output neg_remainder;
    neg_remainder <-- divisor - raw_remainder;
 
    if (is_dividend_negative == 1 && raw_remainder != 0) {
        remainder <-- neg_remainder;
    } else {
        remainder <-- raw_remainder;
    }
 
    quotient <-- (dividend - remainder) / divisor; // (-8 - 2) / 5 = -2.
 
    dividend === divisor * quotient + remainder; // -8 = 5 * -2 + 2.
 
    component rp = MultiRangeProof(3, 128);
    rp.in[0] <== divisor;
    rp.in[1] <== quotient;
    rp.in[2] <== dividend;
    rp.max_abs_value <== SQRT_P;
 
    // check that 0 <= remainder < divisor
    component remainderUpper = LessThan(divisor_bits);
    remainderUpper.in[0] <== remainder;
    remainderUpper.in[1] <== divisor;
    remainderUpper.out === 1;
}