
template Main(n) {
  signal private input x;
  signal input state;

  signal output out;

  signal temp[n+2];
  temp[0] <== x*x;
  temp[1] <== state*state;

  for (var i = 0; i < n; i++) {
    temp[i+2] <== temp[i]*temp[i+1];
  }

  out <== temp[n+1];
}

component main = Main(53);
