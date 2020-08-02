import { ethers } from "ethers";
import { verifySignature } from "./VerifySignature";

export async function signLike(contractAddress, target, liker, provider, contract) {

  let hashToSign = ethers.utils.solidityKeccak256(
    ['bytes','bytes','address','address','uint256','address'],
    ['0x19','0x0',contract.address,contractAddress,target,liker])//await contract.getHash(contractAddress, target, liker)
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
