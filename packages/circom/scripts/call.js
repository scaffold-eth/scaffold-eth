const snarkjs = require("snarkjs");
const fs = require("fs");
const { execSync } = require('child_process');

let circuitsList = process.argv[2];
const inputJson = process.argv[3];

if (process.argv.length < 3 || process.argv.length > 4) {
  console.log('usage');
  console.log(
    'hoot comma,seperated,list,of,circuits optionalinput,json'
  );
  process.exit(1);
}

const ffjavascript = require('ffjavascript');
const {stringifyBigInts: stringifyBigInts$3, unstringifyBigInts: unstringifyBigInts$1} = ffjavascript.utils;

// copy pasta p256 from snarkjs cli.cjs line 6726
function p256(n) {
    let nstr = n.toString(16);
    while (nstr.length < 64) nstr = "0"+nstr;
    nstr = `"0x${nstr}"`;
    return nstr;
}

// copy pasta zkeyExportSolidityCalldata from snarkjs cli.cjs line 6984 with some modifications.
async function genSolidityCalldata(publicName, proofName) {

    // const pub = unstringifyBigInts$1(JSON.parse(publicName, "utf8"));
    // const proof = unstringifyBigInts$1(JSON.parse(proofName, "utf8"));
    const pub = unstringifyBigInts$1(publicName);
    const proof = unstringifyBigInts$1(proofName);

    let inputs = "";
    for (let i=0; i<pub.length; i++) {
        if (inputs != "") inputs = inputs + ",";
        inputs = inputs + p256(pub[i]);
    }

    let S;
    if ((typeof proof.protocol === "undefined") || (proof.protocol == "original")) {
        S=`[${p256(proof.pi_a[0])}, ${p256(proof.pi_a[1])}],` +
          `[${p256(proof.pi_ap[0])}, ${p256(proof.pi_ap[1])}],` +
          `[[${p256(proof.pi_b[0][1])}, ${p256(proof.pi_b[0][0])}],[${p256(proof.pi_b[1][1])}, ${p256(proof.pi_b[1][0])}]],` +
          `[${p256(proof.pi_bp[0])}, ${p256(proof.pi_bp[1])}],` +
          `[${p256(proof.pi_c[0])}, ${p256(proof.pi_c[1])}],` +
          `[${p256(proof.pi_cp[0])}, ${p256(proof.pi_cp[1])}],` +
          `[${p256(proof.pi_h[0])}, ${p256(proof.pi_h[1])}],` +
          `[${p256(proof.pi_kp[0])}, ${p256(proof.pi_kp[1])}],` +
          `[${inputs}]`;
    } else if ((proof.protocol == "groth16")||(proof.protocol == "kimleeoh")) {
        S=`[${p256(proof.pi_a[0])}, ${p256(proof.pi_a[1])}],` +
          `[[${p256(proof.pi_b[0][1])}, ${p256(proof.pi_b[0][0])}],[${p256(proof.pi_b[1][1])}, ${p256(proof.pi_b[1][0])}]],` +
          `[${p256(proof.pi_c[0])}, ${p256(proof.pi_c[1])}],` +
          `[${inputs}]`;
    } else {
        throw new Error("InvalidProof");
    }

    // console.log(S);

    return S;
}

const cwd = process.cwd();

if (circuitsList === "-A" || circuitsList === "--all") {
  try {
    circuitsList = fs.readdirSync(cwd + "/circuits", { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name).join();

      console.log("Compiling all circuits...");
      console.log(circuitsList);
  } catch(error) {
    console.log(error);
    process.exit(1);
  }
}


async function run() {

  for (circuitName of circuitsList.split(',')) {

    process.chdir(cwd + '/circuits/' + circuitName);

    // const calldata = await execSync(
    //   'npx snarkjs zkey export soliditycalldata public.json proof.json'/*,
    //   { stdio: 'inherit' }*/
    // );
    //
    // console.log("CALLDATA:\n" + calldata);

    const input = JSON.parse(fs.readFileSync("./inputs/" + (inputJson ? inputJson : "input.json")));

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      input,
      "./compiled/circuit.wasm",
      "./keys/circuit_final.zkey"
    );

    // const genCalldata = getSolidityCalldata(JSON.stringify(publicSignals), JSON.stringify(proof));
    const genCalldata = await genSolidityCalldata(publicSignals, proof);

    console.log("\nGenerated " + circuitName + "_CALLDATA:\n" + genCalldata);

  }

}

run().then(() => {
    process.exit(0);
});
