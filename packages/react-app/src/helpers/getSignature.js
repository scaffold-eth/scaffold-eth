import { ethers } from "ethers";
import { verifySignature } from "./VerifySignature";

export async function getSignature(provider, signingAddress, types, values) {

  console.log("INK", provider, signingAddress, types, values)

  let hashToSign = await ethers.utils.solidityKeccak256(
    types,//['bytes','bytes','address','address','string','string','uint256'],
    values//['0x19','0x0',contract.address,artist,inkUrl,jsonUrl,limit]
  )

  console.log("hashToSign",hashToSign)

  let signature
  if(ethers.Signer.isSigner(provider)) {
    signature = await provider.signMessage(ethers.utils.arrayify(hashToSign));
  } else {
    signature = await provider.send("personal_sign", [hashToSign, signingAddress]);
  }
  console.log('signature', signature)
  let signerSignedMessage = await verifySignature(signingAddress, signature, hashToSign, provider)

  if(signerSignedMessage) {
    return signature
  }
  else {
    throw console.log('Signer is not the signingAddress!')
  }

}
