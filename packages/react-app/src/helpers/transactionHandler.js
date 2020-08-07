import React from 'react'
import { ethers } from "ethers";
import { Modal } from 'antd';
import { getSignature } from "./getSignature";

export async function transactionHandler(
  address, injectedProvider, localProvider, metaSigner,
  regularContract, metaContract,
  regularFunction, regularFunctionArgs,
  signatureFunction, signatureFunctionArgs, getSignatureTypes, getSignatureArgs
) {

  console.log(metaContract)

    function chainWarning(network, chainId) {
        Modal.warning({
          title: 'MetaMask Network Mismatch',
          content: <>Please connect to <b>https://dai.poa.network</b></>,
        });
      }

    function showXDaiModal() {
      Modal.info({
        title: 'You need some xDai!',
        content: (
          <a target="_blank" href={"https://xdai.io"}>Take it to the bridge.</a>
        ),
        onOk() {},
      });
    }

      let balance = await localProvider.getBalance(address)
      console.log('artist balance', balance)
      let injectedNetwork = await injectedProvider.getNetwork()
      let localNetwork = await localProvider.getNetwork()
      console.log('networkcomparison',injectedNetwork,localNetwork)

      if (parseFloat(ethers.utils.formatEther(balance))>0.001){
        if (injectedNetwork.chainId === localNetwork.chainId) {
          console.log('Got xDai + on the right network, so kicking it old school')
            let result = await regularContract[regularFunction](...regularFunctionArgs)
            console.log("Regular RESULT!!!!!!",result)
          return result
        } else {
          chainWarning()
          throw 'Got xDai, but Metamask is on the wrong network'
        }
      }
      else if (process.env.REACT_APP_USE_GSN === 'true') {

        if (signatureFunction && signatureFunctionArgs && getSignatureTypes && getSignatureArgs) {
          console.log('Doing it the chain-agnostic signature way!')
          let signature = await getSignature(
            injectedProvider, address,
            getSignatureTypes,
            getSignatureArgs)

          console.log("Got signature: ",signature)

          let result = await metaContract[signatureFunction](...[...signatureFunctionArgs,signature])
          console.log("Fancy signature RESULT!!!!!!",result)
          return result
        }
        else if(injectedNetwork.chainId === localNetwork.chainId && address === metaSigner) {
          console.log('On the same chain & our address is the signer, initiating a user-signed metatransaction')
          let result = await metaContract[regularFunction](...regularFunctionArgs)
          console.log("Meta RESULT!!!!!!",result)
          return result
        }
        else if (address !== metaSigner) {
          throw 'Meta-transaction signer is not the user address, so transaction would be invalid'
        }
        else if (injectedNetwork.chainId !== localNetwork.chainId) {
          chainWarning()
          throw 'Metamask is on the wrong network'
        }
      }
      else {
        showXDaiModal()
        throw 'Need XDai'
      }

  }
