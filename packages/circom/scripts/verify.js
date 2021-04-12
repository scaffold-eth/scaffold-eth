const snarkjs = require("snarkjs");
const fs = require("fs");

let circuitsList = process.argv[2];
const inputJson = process.argv[3];

if (process.argv.length < 3 || process.argv.length > 4) {
  console.log('usage');
  console.log(
    'verify comma,seperated,list,of,circuits optionalinput.json'
  );
  process.exit(1);
}

const cwd = process.cwd();
console.log(cwd);

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

const proofLog = [];

async function run() {

  for (circuitName of circuitsList.split(',')) {

    const input = JSON.parse(fs.readFileSync("./circuits/" + circuitName + "/inputs/" + (inputJson ? inputJson : "input.json")));

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      input,
      "./circuits/" + circuitName + "/compiled/circuit.wasm",
      "./circuits/" + circuitName + "/keys/circuit_final.zkey"
    );

    console.log("Proof: ");
    console.log(JSON.stringify(proof, null, 1));

    const vKey = JSON.parse(fs.readFileSync("./circuits/" + circuitName + "/keys/verification_key.json"));

    const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    if (res === true) {
        console.info(circuitName + ": Verification OK");
        proofLog.push(circuitName + ": Verification OK");
    } else {
        console.warn(circuitName + ": Invalid proof");
        proofLog.push(circuitName + ": Invalid proof");
    }

  }

}

run().then(() => {
  console.log("\nVerification summary:");
  for (let i = 0; i < proofLog.length; i++) {
    console.log(proofLog[i]);
  }
  process.exit(0);
});
