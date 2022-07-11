import * as fs from 'fs'

export function mnemonic() {
  try {
    return fs.readFileSync("./mnemonic.txt").toString().trim();
  } catch (e) {
    console.log("☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`.")
  }
  return "";
}

export function privatekey() {
  try {
    return fs.readFileSync("./privatekey.txt").toString().trim();
  } catch (e) {
    console.log("☢️ WARNING: No key file created")
  }
  return "";
}