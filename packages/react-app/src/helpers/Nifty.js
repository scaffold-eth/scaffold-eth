import { ethers } from "ethers";

export async function signInk(artist, inkUrl, jsonUrl, limit, provider, contract) {

  console.log("INK", artist, inkUrl, jsonUrl, limit, provider, contract)

  let hashToSign = await contract.getHash(artist, inkUrl, jsonUrl, ""+limit)
  console.log("hashToSign",hashToSign)

  //let signer = provider.getSigner()
  //console.log("signer",signer)

  console.log("signing",hashToSign)

  //let messageHashBytes = ethers.utils.arrayify(hashToSign) //this was the trick I was stuck on, why can't you just sign the freaking hash ricmoo
  //console.log("messageHashBytes",messageHashBytes)

  let signature = await provider.send("personal_sign", [hashToSign, artist]);
  //let signature = await signer.signMessage(messageHashBytes)
  console.log("signature:",signature)

  let verifySignature = await contract.getSigner(hashToSign,signature)
  console.log("verifySignature",verifySignature)

  if(verifySignature !== artist) {
    throw console.log('Signer is not the artist!')
  }

  return signature

}
