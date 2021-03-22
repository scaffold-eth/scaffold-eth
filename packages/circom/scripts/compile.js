require('dotenv').config();

const { execSync } = require('child_process');
const fs = require('fs');

const circuitsList = process.argv[2];
const deterministic = process.argv[3] === 'true' || process.argv[3] === undefined;


// TODO: add an option to generate with entropy for production keys

if (process.argv.length < 3 || process.argv.length > 4) {
  console.log('usage');
  console.log(
    'compile comma,seperated,list,of,circuits [`true` if deterministic / `false` if not]'
  );
  process.exit(1);
}

const cwd = process.cwd();

for (circuitName of circuitsList.split(',')) {
  if (!process.env['beacon']) {
    console.log('ERROR! you probably dont have an .env file');
    process.exit(1);
  }

  process.chdir(cwd + '/circuits/' + circuitName);

  if(!fs.existsSync("compiled")) {
    fs.mkdirSync("compiled");
  }
  if(!fs.existsSync("contracts")) {
    fs.mkdirSync("contracts");
  }
  if(!fs.existsSync("inputs")) {
    fs.mkdirSync("inputs");
  }
  if(!fs.existsSync("keys")) {
    fs.mkdirSync("keys");
  }

  // doesnt catch yet
  // https://github.com/iden3/snarkjs/pull/75
  try {
    execSync(
      'npx circom circuit.circom --r1cs --wasm --sym',
      { stdio: 'inherit' }
    );
    execSync(
      'npx snarkjs r1cs info circuit.r1cs',
      { stdio: 'inherit' }
    );
    execSync(
      'npx snarkjs zkey new circuit.r1cs ../../powersoftau/pot15_final.ptau circuit_' + circuitName + '.zkey',
      { stdio: 'inherit' }
    );
    if (deterministic) {
      execSync(
        'npx snarkjs zkey beacon circuit_' +
          circuitName +
          '.zkey circuit.zkey ' +
          process.env['beacon'] +
          ' 10',
        { stdio: 'inherit' }
      );
    } else {
      execSync(
        'npx snarkjs zkey contribute circuit_' +
          circuitName +
          '.zkey circuit.zkey ' +
          `-e="${Date.now()}"`,
        { stdio: 'inherit' }
      );
    }
    execSync(
      'npx snarkjs zkey export verificationkey circuit.zkey keys/verification_key.json',
      { stdio: 'inherit' }
    );
    execSync(
      'npx snarkjs wtns calculate circuit.wasm inputs/input.json witness.wtns',
      {
        stdio: 'inherit',
      }
    );
    execSync(
      'npx snarkjs groth16 prove circuit.zkey witness.wtns proof.json public.json',
      { stdio: 'inherit' }
    );
    execSync(
      'npx snarkjs groth16 verify keys/verification_key.json public.json proof.json',
      { stdio: 'inherit' }
    );

    fs.copyFileSync(
      'circuit.wasm',
      cwd + '/circuits/' + circuitName + '/compiled/circuit.wasm'
    );
    fs.unlinkSync('circuit.wasm');
    fs.copyFileSync(
      'circuit.zkey',
      cwd + '/circuits/' + circuitName + '/keys/circuit_final.zkey'
    );
    fs.unlinkSync('circuit.zkey');

    execSync(
      'npx snarkjs zkey export solidityverifier keys/circuit_final.zkey contracts/verifier.sol',
      { stdio: 'inherit' }
    );
    // copy files to appropriate places when integrated with scaffold-eth (zkaffold-eth)
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
