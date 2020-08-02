import { ethers } from "ethers";
import { verifySignature } from "./VerifySignature";

export async function getSignature(provider, signingAddress, types, values) {

  console.log("INK", provider, signingAddress, types, values)

  let hashToSign = await ethers.utils.solidityKeccak256(
    types,//['bytes','bytes','address','address','string','string','uint256'],
    values//['0x19','0x0',contract.address,artist,inkUrl,jsonUrl,limit]
  )

  console.log("hashToSign",hashToSign)

  let signature = await provider.send("personal_sign", [hashToSign, signingAddress]);

  let signerSignedMessage = await verifySignature(signingAddress, signature, hashToSign, provider)
  console.log('signature', signature)

  if(signerSignedMessage) {
    return signature
  }
  else {
    throw console.log('Signer is not the signingAddress!')
  }

}
