import React from 'react'
import { ethers } from "ethers";
import { Modal, notification } from 'antd';
import { getSignature } from "./getSignature";
import { default as Transactor } from "./Transactor";

export async function transactionHandler(c) {

    try {

    function chainWarning(network, chainId) {
        Modal.warning({
          title: 'MetaMask Network Mismatch',
          content: <><p>Nifty Ink is built on xDai: please change your MetaMask Network to point to the <a href="https://www.xdaichain.com/" target="_blank">xDai Chain</a></p><p>You will need to create a custom RPC with the following URL: <b>https://dai.poa.network</b></p></>,
        });
      }

    function showXDaiModal() {
      Modal.info({
        title: 'You need some xDai to make this transaction!',
        content: (
          <span> Nifty.ink runs on xDAI. <a target="_blank" href={"https://xdai.io"}>Take it to the bridge</a> (to transfer DAI from mainnet).  <a target="_blank" href={"https://www.xdaichain.com/for-users/get-xdai-tokens"}>Learn more about using xDai</a>
          </span>
        ),
        onOk() {},
      });
    }

      let contractAddress = require("../contracts/"+c['contractName']+".address.js")
      let contractAbi = require("../contracts/"+c['contractName']+".abi.js")

      let balance = await c['localProvider'].getBalance(c['address'])
      console.log('artist balance', balance)
      let injectedNetwork = await c['injectedProvider'].getNetwork()
      let localNetwork = await c['localProvider'].getNetwork()
      console.log('networkcomparison',injectedNetwork,localNetwork)

      if (c['payment'] && ethers.utils.formatEther(balance) < ethers.utils.formatEther(c['payment'])) {
        showXDaiModal()
      }

      if (parseFloat(ethers.utils.formatEther(balance))>0.001){
        if (injectedNetwork.chainId === localNetwork.chainId) {
          console.log('Got xDai + on the right network, so kicking it old school')

            let contract = new ethers.Contract(
                contractAddress,
                contractAbi,
                c['injectedProvider'].getSigner(),
              );

            let metaData = {}
            if(c['payment']) {
              metaData['value'] = c['payment']
            }

            let result = await contract[c['regularFunction']](...c['regularFunctionArgs'], metaData)
            console.log("Regular RESULT!!!!!!",result)
          return result
        } else {
          chainWarning()
          throw 'Got xDai, but Metamask is on the wrong network'
        }
      }
      else if (process.env.REACT_APP_USE_GSN === 'true') {

        if (c['signatureFunction'] &&
          c['signatureFunctionArgs'] &&
          c['getSignatureTypes'] &&
          c['getSignatureArgs']) {
          console.log('Doing it the chain-agnostic signature way!')
          let signature = await getSignature(
            c['injectedProvider'],
            c['address'],
            c['getSignatureTypes'],
            c['getSignatureArgs'])

          console.log("Got signature: ",signature)

          let contract = new ethers.Contract(
              contractAddress,
              contractAbi,
              c['metaSigner'],
            );

          let result = await contract[c['signatureFunction']](...[...c['signatureFunctionArgs'],signature])
          console.log("Fancy signature RESULT!!!!!!",result)
          return result
        }
        else if (injectedNetwork.chainId === localNetwork.chainId && ['injectedGsnSigner'] in c) {
          console.log('Got a signer on the right network and GSN is go!')
          let contract = new ethers.Contract(
              contractAddress,
              contractAbi,
              c['injectedGsnSigner'],
            );
            let result = await contract[c['regularFunction']](...c['regularFunctionArgs'])
          console.log("Regular GSN RESULT!!!!!!",result)
        return result
        } else if (injectedNetwork.chainId !== localNetwork.chainId) {
          chainWarning()
          throw 'Metamask is on the wrong network'
        }
      }
      else {
        showXDaiModal()
        throw 'Need XDai'
      }

    } catch(e) {
      if(e.message.indexOf("Relay not ready")>=0){
        notification.open({
          message: '📛 Sorry! Transaction limit reached. 😅',
          description:
          "⏳ Please try again in a few seconds. 📡",
        });
      }else if(e.message.indexOf("Ping errors")>=0){
        notification.open({
          message: '📛 Sorry! 📡 Relay Error. 😅',
          description:
          "⏳ Please try again in a few seconds. 📡",
        });
      }else{
        notification.open({
          message: '📛 Transaction unsuccessful',
          description:
          e.message,
        });
      }
      throw e
    }

  }
