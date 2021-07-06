import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import 'antd/dist/antd.css';
import { StaticJsonRpcProvider, JsonRpcProvider, Web3Provider, ExternalProvider } from '@ethersproject/providers';
import '~~/styles/main-page.css';
import {
  ExportOutlined,
  ForkOutlined,
  ExperimentOutlined,
  ReconciliationOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import {
  message,
  Input,
  Image,
  List,
  Row,
  Col,
  Button,
  Menu,
  Alert,
  Switch as SwitchD,
  Progress,
  notification,
} from 'antd';
import WalletConnectProvider from '@walletconnect/web3-provider';
import 'antd/dist/antd.css';
import { useUserAddress } from 'eth-hooks';
import {
  useLocalStorage,
  useExchangePrice,
  useGasPrice,
  useUserProvider,
  useContractLoader,
  useContractReader,
  useEventListener,
  useBalance,
  useExternalContractLoader,
  useOnBlock,
} from '~~/components/common/hooks';
import {
  Header,
  Account,
  Faucet,
  Ramp,
  GasGauge,
  PunkBlockie,
  EtherInput,
  AddressInput,
  Balance,
  Address,
  ThemeSwitcher,
} from '~~/components/common';
import { GenericContract } from '~~/components/generic-contract';
import { transactor } from '~~/helpers';
import { formatEther, parseEther } from '@ethersproject/units';
//import Hints from "./Hints";
import { Checkout, Hints, Subgraph } from '~~/components/views';

import { useThemeSwitcher, ThemeSwitcherProvider } from 'react-css-theme-switcher';
import {
  INFURA_ID,
  DAI_ADDRESS,
  DAI_ABI,
  SIMPLE_STREAM_ABI,
  BUILDERS,
  BUILDS,
  mainStreamReader_ADDRESS,
  mainStreamReader_ABI,
} from '~~/models/constants/constants';
import { NETWORK, NETWORKS } from '~~/models/constants/networks';
import pretty from 'pretty-time';
import { Contract, ethers } from 'ethers';
import { TNetwork } from '~~/models/networkTypes';
import { ExampleUI } from '~~/components/views/ExampleUI';
import { web3ModalProvider, logoutOfWeb3Modal } from '~~/components/layout/web3ModalProvider';

/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/austintgriffith/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

const translateAddressesForLocal = (addy: string) => {
  //if(addy=="0x90FC815Fe9338BB3323bAC84b82B9016ED021e70") return "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE"
  //if(addy=="0x21e18260357D33d2e18482584a8F39D532fb71cC") return "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c"
  return addy;
};

/// 📡 What chain are your contracts deployed to?
const targetNetwork: TNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;

// 🛰 providers
if (DEBUG) console.log('📡 Connecting to Mainnet Ethereum');
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
const scaffoldEthProvider = new StaticJsonRpcProvider('https://rpc.scaffoldeth.io:48544');
const mainnetInfura = new StaticJsonRpcProvider('https://mainnet.infura.io/v3/' + INFURA_ID);
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log('🏠 Connecting to provider:', localProviderUrlFromEnv);
const localProvider = new StaticJsonRpcProvider(localProviderUrlFromEnv);

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

export const MainPage: FC<{ subgraphUri: string }> = (props) => {
  const mainnetProvider = scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura;

  const [injectedProvider, setInjectedProvider] = useState<Web3Provider>();
  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, 'fast');
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);

  //@ts-ignore
  const address = useUserAddress(userProvider);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId = userProvider && userProvider._network && userProvider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = transactor(userProvider, gasPrice);

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = transactor(localProvider, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, { chainId: localChainId });

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetDAIContract = useExternalContractLoader(mainnetProvider, DAI_ADDRESS, DAI_ABI);

  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  });

  const contracts: Record<string, Contract> = {};
  if (mainnetDAIContract) {
    contracts['DAI'] = mainnetDAIContract;
  }

  // Then read your DAI balance like:
  const myMainnetDAIBalance = useContractReader(contracts, 'DAI', 'balanceOf', [
    '0x34aA3F359A9D614239015126635CE7732c18fDF3',
  ]);

  // keep track of a variable from the contract in the local React state:
  const purpose = useContractReader(readContracts, 'YourContract', 'purpose');

  // 📟 Listen for broadcast events
  const setPurposeEvents = useEventListener(readContracts, 'YourContract', 'SetPurpose', localProvider, 1);

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  //search filter for front page
  const [filter, setFilter] = useState(() => {
    const { search } = (window as any).location;
    return new URLSearchParams(search).get('s');
  });
  const [filterExplanation, setFilterExplanation] = useState();

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (DEBUG && mainnetProvider && address && selectedChainId) {
      console.log('_____________________________________ 🏗 scaffold-eth _____________________________________');
      console.log('🌎 mainnetProvider', mainnetProvider);
      console.log('🏠 localChainId', localChainId);
      console.log('👩‍💼 selected address:', address);
      console.log('🕵🏻‍♂️ selectedChainId:', selectedChainId);
      /*console.log("💵 yourLocalBalance",yourLocalBalance?formatEther(yourLocalBalance):"...")
      console.log("💵 yourMainnetBalance",yourMainnetBalance?formatEther(yourMainnetBalance):"...")
      console.log("📝 readContracts",readContracts)
      console.log("🌍 DAI contract on mainnet:",mainnetDAIContract)
      console.log("🔐 writeContracts",writeContracts)*/
    }
  }, [mainnetProvider, address, selectedChainId]);

  let networkDisplay: ReactElement | undefined = undefined;
  if (localChainId && selectedChainId && localChainId != selectedChainId) {
    networkDisplay = (
      <div style={{ zIndex: 2, position: 'absolute', right: 0, top: 60, padding: 16 }}>
        <Alert
          message={'⚠️ Wrong Network'}
          description={
            <div>
              You have <b>{NETWORK(selectedChainId)?.name}</b> selected and you need to be on{' '}
              <b>{NETWORK(localChainId).name}</b>.
            </div>
          }
          type="error"
          closable={false}
        />
      </div>
    );
  } else {
    networkDisplay = (
      <div style={{ zIndex: -1, position: 'absolute', right: 154, top: 28, padding: 16, color: targetNetwork.color }}>
        {targetNetwork.name}
      </div>
    );
  }

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3ModalProvider.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3ModalProvider.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState<string>('');
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  let faucetHint: ReactElement = <></>;
  const faucetAvailable = true && localProvider && localProvider.connection && targetNetwork.name == 'localhost';

  const [faucetClicked, setFaucetClicked] = useState(false);
  if (
    !faucetClicked &&
    localProvider &&
    localProvider._network &&
    localProvider._network.chainId == 31337 &&
    yourLocalBalance &&
    yourLocalBalance.toBigInt() <= 0
  ) {
    faucetHint = (
      <div style={{ padding: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            if (faucetTx) {
              faucetTx({
                to: address,
                value: parseEther('0.01'),
              });
            }
            setFaucetClicked(true);
          }}>
          💰 Grab funds from the faucet ⛽️
        </Button>
      </div>
    );
  }

  const [randomizedBuilds, setRandomizedBuilds] = useState<any[]>();
  useEffect(() => {
    setRandomizedBuilds(shuffle(BUILDS));
  }, [BUILDS]);

  const [cart, setCart] = useLocalStorage('buidlguidlcart', [], 12000000); //12000000 ms timeout? idk
  //console.log("cart",cart)
  //console.log("route",route)

  let displayCart = [];
  if (cart && cart.length > 0) {
    for (let c in cart) {
      console.log('CART ITEM', c, cart[c]);
      if (!cart[c].streamAddress) {
        displayCart.push(
          <div key={c} style={{ padding: 22, border: '1px solid #dddddd', borderRadius: 8 }}>
            <div style={{ marginLeft: 32 }}>
              <div style={{ float: 'right', zIndex: 2 }}>
                <Button
                  // borderless={true}
                  onClick={() => {
                    console.log('REMOVE ', c, cart[c]);
                    let update = [];
                    for (let x in cart) {
                      if (cart[c].id != cart[x].id) {
                        update.push(cart[x]);
                      }
                    }
                    console.log('update', update);
                    setCart(update);
                  }}>
                  x
                </Button>
              </div>
              <div style={{ fontSize: 18, marginLeft: -54 }}>{cart[c].name}</div>
            </div>
          </div>
        );
      } else {
        displayCart.push(
          <div key={c} style={{ padding: 16, border: '1px solid #dddddd', borderRadius: 8 }}>
            <div style={{ marginLeft: 32 }}>
              <div style={{ float: 'right', zIndex: 2 }}>
                <Button
                  onClick={() => {
                    console.log('REMOVE ', c, cart[c]);
                    let update = [];
                    for (let x in cart) {
                      if (cart[c].id != cart[x].id) {
                        update.push(cart[x]);
                      }
                    }
                    console.log('update', update);
                    setCart(update);
                  }}>
                  x
                </Button>
              </div>
              <Address
                hideCopy={true}
                punkBlockie={true}
                fontSize={18}
                address={cart[c].address}
                ensProvider={mainnetProvider}
                blockExplorer={blockExplorer}
              />
            </div>
          </div>
        );
      }
    }
  }

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      {networkDisplay}
      <BrowserRouter>
        <Menu style={{ textAlign: 'center' }} selectedKeys={[route]} mode="horizontal">
          <Menu.Item key="/">
            <Link
              onClick={() => {
                setRoute('/');
              }}
              to="/">
              YourContract
            </Link>
          </Menu.Item>
          <Menu.Item key="/hints">
            <Link
              onClick={() => {
                setRoute('/hints');
              }}
              to="/hints">
              Hints
            </Link>
          </Menu.Item>
          <Menu.Item key="/exampleui">
            <Link
              onClick={() => {
                setRoute('/exampleui');
              }}
              to="/exampleui">
              ExampleUI
            </Link>
          </Menu.Item>
          <Menu.Item key="/mainnetdai">
            <Link
              onClick={() => {
                setRoute('/mainnetdai');
              }}
              to="/mainnetdai">
              Mainnet DAI
            </Link>
          </Menu.Item>
          <Menu.Item key="/subgraph">
            <Link
              onClick={() => {
                setRoute('/subgraph');
              }}
              to="/subgraph">
              Subgraph
            </Link>
          </Menu.Item>
        </Menu>

        <Switch>
          <Route exact path="/">
            {/*
                🎛 this scaffolding is full of commonly used components
                this <Contract/> component will automatically parse your ABI
                and give you a form to interact with it locally
            */}

            {userProvider?.getSigner() != null && (
              <>
                <GenericContract
                  name="YourContract"
                  signer={userProvider?.getSigner()}
                  provider={localProvider}
                  address={address}
                  blockExplorer={blockExplorer}
                />

                {/* uncomment for a second contract:
            <Contract
              name="SecondContract"
              signer={userProvider.getSigner()}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
            />
            */}

                {/* Uncomment to display and interact with an external contract (DAI on mainnet):
            <Contract
              name="DAI"
              customContract={mainnetDAIContract}
              signer={userProvider.getSigner()}
              provider={mainnetProvider}
              address={address}
              blockExplorer={blockExplorer}
            />
            */}
              </>
            )}
          </Route>
          <Route path="/hints">
            <Hints
              address={address}
              yourLocalBalance={yourLocalBalance}
              mainnetProvider={mainnetProvider}
              price={price}
            />
          </Route>
          <Route path="/exampleui">
            <ExampleUI
              address={address}
              userProvider={userProvider}
              mainnetProvider={mainnetProvider}
              localProvider={localProvider}
              yourLocalBalance={yourLocalBalance}
              price={price}
              tx={tx}
              writeContracts={writeContracts}
              readContracts={readContracts}
              purpose={purpose ?? ''}
              setPurposeEvents={setPurposeEvents}
            />
          </Route>
          <Route path="/mainnetdai">
            {userProvider?.getSigner() != null && (
              <GenericContract
                name="DAI"
                customContract={mainnetDAIContract}
                signer={userProvider.getSigner()}
                provider={mainnetProvider}
                address={address}
                blockExplorer="https://etherscan.io/"
              />
            )}
          </Route>
          <Route path="/subgraph">
            <Subgraph
              subgraphUri={props.subgraphUri}
              tx={tx}
              writeContracts={writeContracts}
              mainnetProvider={mainnetProvider}
            />
          </Route>
        </Switch>
      </BrowserRouter>

      <ThemeSwitcher />

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: 'fixed', textAlign: 'right', right: 0, top: 0, padding: 10 }}>
        <Account
          address={address}
          localProvider={localProvider}
          userProvider={userProvider}
          mainnetProvider={mainnetProvider}
          price={price}
          web3Modal={web3ModalProvider}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          blockExplorer={blockExplorer}
        />
        {faucetHint}
      </div>

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      <div style={{ position: 'fixed', textAlign: 'left', left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={[4, 4]}>
          <Col span={8}>
            <Ramp price={price} address={address} networks={NETWORKS} />
          </Col>

          <Col span={8} style={{ textAlign: 'center', opacity: 0.8 }}>
            <GasGauge gasPrice={gasPrice?.toString() ?? ''} />
          </Col>
          <Col span={8} style={{ textAlign: 'center', opacity: 1 }}>
            <Button
              onClick={() => {
                window.open('https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA');
              }}
              size="large"
              shape="round">
              <span style={{ marginRight: 8 }} role="img" aria-label="support">
                💬
              </span>
              Support
            </Button>
          </Col>
        </Row>

        <Row align="middle" gutter={[4, 4]}>
          <Col span={24}>
            {
              /*  if the local provider has a signer, let's show the faucet:  */
              faucetAvailable ? (
                <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
              ) : (
                ''
              )
            }
          </Col>
        </Row>
      </div>
    </div>
  );
};

function shuffle(array: any[]) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
