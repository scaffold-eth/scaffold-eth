import { Row, Col, Button, Input } from "antd";
import { Web3Provider } from "@ethersproject/providers";
import { useUserAddress } from "eth-hooks";
import React, { useCallback, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { RightSquareOutlined } from "@ant-design/icons";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { AddressInput } from "../../components";
import { Transactor } from "../../helpers";
import {
  useExchangePrice,
  useGasPrice,
  useUserProvider,
  useContractLoader,
  useContractReader
} from "../../hooks";
import { Header, Account, Faucet, Ramp, GasGauge } from "../../components";
import { INFURA_ID, ETHERSCAN_KEY } from "../../constants";
import Ownership from "./Ownership";
import Round from "./Round";

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

function Admin(props) {
  const [injectedProvider, setInjectedProvider] = useState();
  const userProvider = useUserProvider(injectedProvider, props.localProvider);

  /* 💵 this hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(props.mainnetProvider); //1 for xdai

  /* 🔥 this hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice("fast"); //1000000000 for xdai

  const address = useUserAddress(userProvider);

  const tx = Transactor(userProvider, gasPrice)
  const readContracts = useContractLoader(props.localProvider)
  const writeContracts = useContractLoader(userProvider)

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  return (
    <div className="Admin">
      <Header />

       {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <Account
          address={address}
          localProvider={props.localProvider}
          userProvider={userProvider}
          mainnetProvider={props.mainnetProvider}
          price={price}
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
        />
      </div>

      <Ownership
        localProvider={props.localProvider}
        userProvider={userProvider}
        mainnetPRovider={props.mainnetProvider}
      />

      <Round
        localProvider={props.localProvider}
        userProvider={userProvider}
      />

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
       <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
         <Row align="middle" gutter={[4, 4]}>
           <Col span={8}>
             <Ramp price={price} address={address} />
           </Col>

           <Col span={8} style={{ textAlign: "center", opacity: 0.8 }}>
             <GasGauge gasPrice={gasPrice} />
           </Col>
           <Col span={8} style={{ textAlign: "center", opacity: 1 }}>
             <Button
               onClick={() => {
                 window.open("https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA");
               }}
               size="large"
               shape="round"
             >
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
               props.localProvider && !process.env.REACT_APP_PROVIDER && price > 1 ? (
                 <Faucet localProvider={props.localProvider} price={price} />
               ) : (
                 ""
               )
             }
           </Col>
         </Row>
       </div>
    </div>
  );
}

export default Admin;
