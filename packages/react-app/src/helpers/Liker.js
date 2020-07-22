import { ethers } from "ethers";

export async function signLike(contractAddress, target, liker, provider, contract) {

  let hashToSign = await contract.getHash(contractAddress, target, liker)
  console.log("hashToSign",hashToSign)

  //let signer = provider.getSigner()
  //console.log("signer",signer)

  console.log("signing",hashToSign)

  //let messageHashBytes = ethers.utils.arrayify(hashToSign) //this was the trick I was stuck on, why can't you just sign the freaking hash ricmoo
  //console.log("messageHashBytes",messageHashBytes)

  //let signature = await signer.signMessage(messageHashBytes)
  let signature = await provider.send("personal_sign", [hashToSign, liker]);
  console.log("signature:",signature)

  let verifySignature = await contract.getSigner(hashToSign,signature)
  console.log("verifySignature",verifySignature)

  if(verifySignature !== liker) {
    throw console.log('Signer is not the liker!')
  }

  return signature
}
