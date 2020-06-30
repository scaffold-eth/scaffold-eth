import { ethers } from "ethers";

export default async function approveAndCall(provider,tx,address,contractAddress,amount,tokenContract,call,args,optionalOverrides) {
  return new Promise(async (resolve, reject) => {
    console.log("approveAndCall",amount)
    let allowance = await tokenContract.allowance(address, contractAddress)
    console.log("allowance", allowance)
    if (allowance.lt(ethers.utils.parseEther("" + amount))) {
      console.log("getting tx count")
      let nonce = await provider.getTransactionCount(address)
      console.log("nonce:",nonce)
      tx(tokenContract.approve(contractAddress, ethers.utils.parseEther("" + amount), { nonce: nonce }))
      setTimeout(
        () => {
          console.log("second tx fired 1.5s later....")
          resolve( tx(call(...args,{ ...optionalOverrides, nonce: nonce + 1 })) )
        }, 1500 // you know why I have to do this @danfinlay! 😂😅🤣
      )
    } else {
      resolve( tx(call(...args,{ ...optionalOverrides })) )
    }
  })

}
/*gasLimit: optionalGasLimit?optionalGasLimit:120000*/
