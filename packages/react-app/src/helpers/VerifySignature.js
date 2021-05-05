import { ethers } from "ethers";
import { isValidSignature } from "./eip1271";

export async function verifySignature(address, sig, hash, provider) {
  let messageToArray = ethers.utils.arrayify(hash);
  let arrayToHash = ethers.utils.hashMessage(messageToArray);
  const bytecode = "0x00"; //await provider.getCode(address);/////force this for now because it is failing here
  console.log(bytecode);
  const signer = ethers.utils.verifyMessage(ethers.utils.arrayify(hash), sig);
  console.log(signer);
  if (
    !bytecode ||
    bytecode === "0x" ||
    bytecode === "0x0" ||
    bytecode === "0x00"
  ) {
    return signer.toLowerCase() === address.toLowerCase();
  } else {
    return isValidSignature(address, sig, arrayToHash, provider);
  }
}
