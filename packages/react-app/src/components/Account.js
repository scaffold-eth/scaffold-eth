import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import BurnerProvider from 'burner-provider';
import Web3Modal from 'web3modal';
import { Balance, Address, Wallet } from '.';
import { usePoller } from '../hooks';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Button } from 'antd';
import { RelayProvider } from '@opengsn/gsn';
//import Fortmatic from "fortmatic";
//import Portis from "@portis/web3";
const Web3HttpProvider = require('web3-providers-http');

const INFURA_ID = '9ea7e149b122423991f56257b882261c'; // MY INFURA_ID, SWAP IN YOURS!

const web3Modal = new Web3Modal({
  network: 'mainnet', // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
    /*fortmatic: {
      package: Fortmatic, // required
      options: {
        key: "pk_live_4463D2C286A0B058", // required
      }
    },

    portis: {
      package: Portis, // required
      options: {
        id: "5b42dc23-b8b7-494e-a1e0-a32918e4aebe", // required
      }
    }*/
  },
});

export default function Account(props) {
  let gsnConfig;
  if (process.env.REACT_APP_USE_GSN === 'true') {
    let relayHubAddress;
    let stakeManagerAddress;
    let paymasterAddress;
    let chainId;
    if (process.env.REACT_APP_NETWORK_NAME === 'xdai') {
      relayHubAddress = '0xA58B6fC9264ce507d0B0B477ceE31674341CB27e';
      stakeManagerAddress = '0xd1Fa0c7E52440078cC04a9e99beA727f3e0b981B';
      paymasterAddress = '0x2ebc08948d0DD5D034FBE0b1084C65f57eF7D0bC';
      chainId = 100;
    } else if (process.env.REACT_APP_NETWORK_NAME === 'sokol') {
      relayHubAddress = '0xA17C8F25668a5748E9B80ED8Ff842f8909258bF6';
      stakeManagerAddress = '0xbE9B5be78bdB068CaE705EdF1c18F061698B6F83';
      paymasterAddress = '0x205091FE2AFAEbCB8843EDa0A8ee28B170aa0619';
      chainId = 42;
    } else {
      relayHubAddress = require('.././gsn/RelayHub.json').address;
      stakeManagerAddress = require('.././gsn/StakeManager.json').address;
      paymasterAddress = require('.././gsn/Paymaster.json').address;
      //console.log("local GSN addresses",relayHubAddress,stakeManagerAddress,paymasterAddress)
    }

    gsnConfig = {
      relayHubAddress,
      stakeManagerAddress,
      paymasterAddress,
      chainId,
    };

    gsnConfig.relayLookupWindowBlocks = 1e5;
    gsnConfig.verbose = true;
  }
  //gsnConfig.preferredRelays = ["https://relay.tokenizationofeverything.com"]

  /*
  function warning(network, chainId) {
      Modal.warning({
        title: 'MetaMask Network Mismatch',
        content: <>Please connect to <b>https://dai.poa.network</b></>,
      });
    }
    */

  const createBurnerIfNoAddress = async () => {
    if (
      !props.injectedProvider &&
      props.localProvider &&
      typeof props.setInjectedGsnSigner == 'function' &&
      typeof props.setInjectedProvider == 'function' &&
      !web3Modal.cachedProvider
    ) {
      let burner;
      if (process.env.REACT_APP_NETWORK_NAME === 'xdai') {
        burner = new BurnerProvider('https://dai.poa.network');
      } else if (process.env.REACT_APP_NETWORK_NAME === 'sokol') {
        burner = new BurnerProvider(
          'https://kovan.infura.io/v3/9ea7e149b122423991f56257b882261c'
        ); //new ethers.providers.InfuraProvider("kovan", "9ea7e149b122423991f56257b882261c")
      } else {
        burner = new BurnerProvider('http://localhost:8546'); //
      }
      console.log('🔥📡 burner', burner);
      updateProviders(burner);
    } else {
      pollInjectedProvider();
    }
  };
  useEffect(() => {
    createBurnerIfNoAddress();
  // eslint-disable-next-line
  }, [props.injectedProvider]);

  const updateProviders = async (provider) => {
    console.log('UPDATE provider:', provider);
    let newWeb3Provider = await new ethers.providers.Web3Provider(provider);
    props.setInjectedProvider(newWeb3Provider);

    if (process.env.REACT_APP_USE_GSN === 'true') {
      if (provider._metamask) {
        //console.log('using metamask')
        gsnConfig = {
          ...gsnConfig,
          gasPriceFactorPercent: 70,
          methodSuffix: '_v4',
          jsonStringifyRequest: true /*, chainId: provider.networkVersion*/,
        };
      }

      const gsnProvider = new RelayProvider(provider, gsnConfig);
      const gsnWeb3Provider = new ethers.providers.Web3Provider(gsnProvider);
      //console.log("GOT GSN PROVIDER",gsnProvider)
      const gsnSigner = gsnWeb3Provider.getSigner(props.address);
      props.setInjectedGsnSigner(gsnSigner);
    }
  };

  const pollInjectedProvider = async () => {
    if (props.injectedProvider) {
      let accounts = await props.injectedProvider.listAccounts();
      if (accounts && accounts[0] && accounts[0] !== props.account) {
        //console.log("ADDRESS: ",accounts[0])
        if (typeof props.setAddress == 'function')
          props.setAddress(accounts[0]);
      }
    }
  };
  usePoller(
    () => {
      pollInjectedProvider();
    },
    props.pollTime ? props.pollTime : 1999
  );

  const loadWeb3Modal = async () => {
    const provider = await web3Modal.connect();
    if (typeof props.setInjectedProvider == 'function') {
      updateProviders(provider);
    }
    pollInjectedProvider();
  };

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    window.localStorage.removeItem('walletconnect');
    //console.log("Cleared cache provider!?!",clear)
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  let modalButtons;
  if (typeof props.setInjectedProvider == 'function') {
    if (web3Modal.cachedProvider) {
      modalButtons = (
        <Button
          style={{ verticalAlign: 'top', marginLeft: 8, marginTop: 4 }}
          shape={'round'}
          size={'large'}
          onClick={logoutOfWeb3Modal}
        >
          Logout
        </Button>
      );
    } else {
      modalButtons = (
        <Button
          style={{ verticalAlign: 'top', marginLeft: 8, marginTop: 4 }}
          shape={'round'}
          size={'large'}
          type={props.minimized ? 'default' : 'primary'}
          onClick={loadWeb3Modal}
        >
          Connect Wallet
        </Button>
      );
    }
  }

  React.useEffect(() => {
    const checkForProvider = async () => {
      if (web3Modal.cachedProvider) {
        try {
          if (web3Modal.cachedProvider === 'injected') {
            const accounts = await window.ethereum.request({
              method: 'eth_accounts',
            });
            console.log('injected accounts', accounts);
            if (!accounts.length) {
              await web3Modal.clearCachedProvider();
              window.localStorage.removeItem('walletconnect');
              createBurnerIfNoAddress();
              throw new Error('Injected provider is not accessible');
            } else {
              loadWeb3Modal();
            }
          } else {
            console.log(web3Modal.cachedProvider);
            loadWeb3Modal();
          }
        } catch (e) {
          console.log('Could not get a wallet connection', e);
          return;
        }
      }
    };
    checkForProvider();

    if (process.env.REACT_APP_USE_GSN === 'true') {
      const createBurnerMetaSigner = async () => {
        let origProvider;
        if (process.env.REACT_APP_NETWORK_NAME === 'xdai') {
          origProvider = new Web3HttpProvider('https://dai.poa.network');
        } else if (process.env.REACT_APP_NETWORK_NAME === 'sokol') {
          origProvider = new ethers.providers.InfuraProvider(
            'kovan',
            '9ea7e149b122423991f56257b882261c'
          );
        } else {
          origProvider = new ethers.providers.JsonRpcProvider(
            'http://localhost:8546'
          );
        }
        const gsnProvider = new RelayProvider(origProvider, gsnConfig);

        const account = await gsnProvider.newAccount();
        let from = account.address;

        const provider = new ethers.providers.Web3Provider(gsnProvider);
        const signer = provider.getSigner(from);

        props.setMetaProvider(signer);
      };
      createBurnerMetaSigner();
    }
  // eslint-disable-next-line
  }, []);

  return (
    <div>
      <span>
        {props.address ? (
          <Address value={props.address} ensProvider={props.mainnetProvider} />
        ) : (
          'Connecting...'
        )}
        <Balance
          address={props.address}
          provider={props.localProvider}
          dollarMultiplier={props.price}
        />
        <Wallet
          address={props.address}
          provider={props.injectedProvider}
          ensProvider={props.mainnetProvider}
          price={props.price}
        />
      </span>
      {modalButtons}
    </div>
  );
}
