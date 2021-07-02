import { hexlify } from '@ethersproject/bytes';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Web3Provider } from '@ethersproject/providers/src.ts/web3-provider';
import { parseUnits } from '@ethersproject/units';
import { notification } from 'antd';
import notify, { API } from 'bnc-notify';
import Notify, { InitOptions } from 'bnc-notify';
import { ethers } from 'ethers';
import { parseProviderOrSigner, TProviderOrSigner } from '~~/components/common/functions/providerOrSigner';
import { BLOCKNATIVE_DAPPID } from '~~/models/constants/constants';

const callbacks: Record<string, any> = {};
const DEBUG = true;
/**
 * this should probably just be renamed to "notifier"
 * it is basically just a wrapper around BlockNative's wonderful Notify.js
 * https://docs.blocknative.com/notify
 * @param provider
 * @param gasPrice
 * @param etherscan
 * @returns
 */
export const transactor = (providerOrSigner: TProviderOrSigner, gasPrice?: number, etherscan?: string) => {
  if (typeof providerOrSigner !== 'undefined') {
    // eslint-disable-next-line consistent-return
    return async (tx: any, callback: (param: any) => void) => {
      const { signer, provider, providerNetwork } = await parseProviderOrSigner(providerOrSigner);

      let options: InitOptions | undefined = undefined;
      let notify: API | undefined = undefined;
      if (navigator.onLine) {
        options = {
          dappId: BLOCKNATIVE_DAPPID, // GET YOUR OWN KEY AT https://account.blocknative.com
          system: 'ethereum',
          networkId: providerNetwork?.chainId,
          // darkMode: Boolean, // (default: false)
          transactionHandler: (txInformation: any) => {
            if (DEBUG) console.log('HANDLE TX', txInformation);
            const possibleFunction = callbacks[txInformation.transaction.hash];
            if (typeof possibleFunction === 'function') {
              possibleFunction(txInformation.transaction);
            }
          },
        };
        notify = Notify(options);
      }

      let etherscanNetwork = '';
      if (providerNetwork?.name && providerNetwork?.chainId > 1) {
        etherscanNetwork = providerNetwork.name + '.';
      }

      let etherscanTxUrl = 'https://' + etherscanNetwork + 'etherscan.io/tx/';
      if (providerNetwork?.chainId === 100) {
        etherscanTxUrl = 'https://blockscout.com/poa/xdai/tx/';
      }

      try {
        let result;
        if (tx instanceof Promise) {
          if (DEBUG) console.log('AWAITING TX', tx);
          result = await tx;
        } else {
          if (!tx.gasPrice) {
            tx.gasPrice = gasPrice || ethers.utils.parseUnits('4.1', 'gwei');
          }
          if (!tx.gasLimit) {
            tx.gasLimit = ethers.utils.hexlify(120000);
          }
          if (DEBUG) console.log('RUNNING TX', tx);
          result = await signer?.sendTransaction(tx);
        }
        if (DEBUG) console.log('RESULT:', result);
        // console.log("Notify", notify);

        if (callback) {
          callbacks[result.hash] = callback;
        }

        // if it is a valid Notify.js network, use that, if not, just send a default notification
        if (providerNetwork != null && [1, 3, 4, 5, 42, 100].indexOf(providerNetwork.chainId) >= 0 && notify != null) {
          const { emitter } = notify.hash(result.hash);
          emitter.on('all', (transaction) => {
            return {
              onclick: () => window.open((etherscan || etherscanTxUrl) + transaction.hash),
            };
          });
        } else {
          notification.info({
            message: 'Local Transaction Sent',
            description: result.hash,
            placement: 'bottomRight',
          });
          // on most networks BlockNative will update a transaction handler,
          // but locally we will set an interval to listen...
          if (callback) {
            const txResult = await tx;
            const listeningInterval = setInterval(async () => {
              console.log('CHECK IN ON THE TX', txResult, provider);
              const currentTransactionReceipt = await provider?.getTransactionReceipt(txResult.hash);
              if (currentTransactionReceipt && currentTransactionReceipt.confirmations) {
                callback({ ...txResult, ...currentTransactionReceipt });
                clearInterval(listeningInterval);
              }
            }, 500);
          }
        }

        if (typeof result.wait === 'function') {
          await result.wait();
        }

        return result;
      } catch (e) {
        console.log(e);
        console.log('Transaction Error:', e.message);
        notification.error({
          message: 'Transaction Error',
          description: e.message,
        });
      }
    };
  }
};
