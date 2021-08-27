include "../../node_modules/circomlib/circuits/mimcsponge.circom"
include "../../node_modules/circomlib/circuits/comparators.circom"

template Main() {
  signal private input playerCard;
  signal input playerCardCommit;
  signal input dealerCard;

  signal output outCardCommit;
  signal output outValid;

  /*
    Verify that the calculated hash of x (outCardCommit) is the inputted hash (playerCardCommit)
  */

  component mimc = MiMCSponge(1, 220, 1);
  mimc.ins[0] <== playerCard;
  mimc.k <== 0;

  outCardCommit <== mimc.outs[0];
  outCardCommit === playerCardCommit;

  /*
    TODO: Verify that the dealer has the given threshold
  */

  /*
    Verify that player card is larger than threshold
    outValid = 1 if x less than threshold;
    outValid = 1 if x >= threshold
  */

  component greater = LessThan(11);
  greater.in[0] <== playerCard;
  greater.in[1] <== dealerCard;

  outValid <== greater.out; 
}

component main = Main();
