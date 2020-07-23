import { ethers } from "ethers";
import { isValidSignature } from "./eip1271";
import * as ethUtil from "ethereumjs-util";

export async function verifySignature(
  address,
  sig,
  hash,
  provider
) {

  function recoverPublicKey(sig, hash) {
    const params = ethUtil.fromRpcSig(sig);
    const result = ethUtil.ecrecover(ethUtil.toBuffer(hash), params.v, params.r, params.s);
    const signer = ethUtil.bufferToHex(ethUtil.publicToAddress(result));
    return signer;
  }

  let messageToArray = ethers.utils.arrayify(hash)
  let arrayToHash = ethers.utils.hashMessage(messageToArray)
  const bytecode = await provider.getCode(address);
  console.log(bytecode)
  if (!bytecode || bytecode === "0x" || bytecode === "0x0" || bytecode === "0x00") {
    const signer = recoverPublicKey(sig, arrayToHash);
    console.log(signer)
    return signer.toLowerCase() === address.toLowerCase();
  } else {
    return isValidSignature(address, sig, arrayToHash, provider);
  }

}
