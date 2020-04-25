import { ethers } from "ethers";
import { notification } from 'antd';
import Notify from './Notify.js'

const etherscanTxUrl = "https://ropsten.etherscan.io/tx/"

export default function Transactor(provider) {
  if(provider){
    let signer = provider.getSigner()
    return async (tx) => {
      try{
        console.log("tx",tx)
        console.log("signer",signer,"tx",tx)
        let result = await signer.sendTransaction(tx);
        console.log("RESULT:",result)
        const { emitter } = Notify.hash(result.hash)
        emitter.on('all', (transaction) => {
          return {
            onclick: () =>
               window.open(etherscanTxUrl+transaction.hash),
            }
        })
      }catch(e){
        console.log(e)
        notification['error']({
           message: 'Transaction Error',
           description: e.message
         });
      }
    }
  }
}
