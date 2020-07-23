import { ethers } from "ethers";
import { verifySignature } from "./VerifySignature";
import * as ethUtil from "ethereumjs-util";

export async function signLike(contractAddress, target, liker, provider, contract) {

  let hashToSign = await contract.getHash(contractAddress, target, liker)
  console.log("hashToSign",hashToSign)

  let signature = await provider.send("personal_sign", [hashToSign, liker]);

  let likerSignedMessage = await verifySignature(liker, signature, hashToSign, provider)
  console.log('signature', signature)

  if(likerSignedMessage) {
    return signature
  }
  else {
    throw console.log('Signer is not the artist!')
  }
}
