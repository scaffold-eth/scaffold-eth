const fs = require('fs');

const circuitName = process.argv[2];
const overwrite = process.argv[3] === "true";

if (process.argv.length < 3 || process.argv.length > 4) {
  console.log('usage');
  console.log(
    'draft <CIRCUIT_NAME> <OVERWRITE_EXISTING>'
  );
  process.exit(1);
}

if (process.argv[3] !== undefined && process.argv[3] !== "false" && overwrite != true) {
  console.log('usage');
  console.log(
    'draft <CIRCUIT_NAME> <OVERWRITE_EXISTING>'
  );
  console.log("<OVERWRITE_EXISTING> must set: true | false");
  process.exit(1);
}

const cwd = process.cwd();
process.chdir(cwd + '/circuits');

try {
  if(!fs.existsSync(circuitName)) {
    fs.mkdirSync(circuitName);
  }
  if(!fs.existsSync(circuitName + "/compiled")) {
    fs.mkdirSync(circuitName + "/compiled");
  }
  if(!fs.existsSync(circuitName + "/contracts")) {
    fs.mkdirSync(circuitName + "/contracts");
  }
  if(!fs.existsSync(circuitName + "/inputs")) {
    fs.mkdirSync(circuitName + "/inputs");
  }
  if(!fs.existsSync(circuitName + "/keys")) {
    fs.mkdirSync(circuitName + "/keys");
  }
  if(!fs.existsSync(circuitName + "/circuit.circom") || overwrite == true) {
    fs.writeFileSync(
      circuitName + "/circuit.circom",
      'include "../../node_modules/circomlib/circuits/mimcsponge.circom"\n\ntemplate Main() {\n\n}\n\ncomponent main = Main();'
    );
  }
  if(!fs.existsSync(circuitName + "/inputs/input.json") || overwrite == true){
    fs.writeFileSync(
      circuitName + "/inputs/input.json",
      "{}"
    );
  }
} catch(error) {
  console.log(error);
  process.exit(1);
}
