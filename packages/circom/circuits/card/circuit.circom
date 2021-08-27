include "../../node_modules/circomlib/circuits/mimcsponge.circom"
include "../../modulus.circom"

template Main() {
  signal private input seed;
  signal input blockhash;
  
  signal output cardCommit;
  signal output seedCommit;
  
  signal card;
  
  component cardCalculator = Modulo(16, 100000000000000000000000000000000000000);
  
  cardCalculator.dividend <== seed + blockhash;
  cardCalculator.divisor <== 13;

  card <== cardCalculator.remainder + 1;

  component cardHash = MiMCSponge(1, 220, 1);
  cardHash.ins[0] <== card;
  cardHash.k <== 0;
  cardCommit <== cardHash.outs[0]

  component seedHash = MiMCSponge(1, 220, 1);
  seedHash.ins[0] <== seed;
  seedHash.k <== 0;
  seedCommit <== seedHash.outs[0];
}

component main = Main();