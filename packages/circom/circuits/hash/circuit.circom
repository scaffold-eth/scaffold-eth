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

  /*
  component mimc = MiMCSponge(1, 220, 1);
  mimc.ins[0] <== x;
  mimc.k <== 0;

  out <== mimc.outs[0];

  out === hash; */
}

component main = Main();
