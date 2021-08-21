include "../../node_modules/circomlib/circuits/mimcsponge.circom"
include "../../node_modules/circomlib/circuits/comparators.circom"

template Main() {
  signal private input x;
  signal input threshold;

  signal output out;

  component greater = LessThan(4);
  greater.in[0] <== x;
  greater.in[1] <== threshold;

  out <== greater.out;
  out === 0;
}

component main = Main();
