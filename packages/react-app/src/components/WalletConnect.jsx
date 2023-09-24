import React, { useEffect } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import styled from "styled-components";
import { Contract, providers, utils } from "ethers";
import { useLazyQuery } from "@apollo/client";
import { GET_PROFILES } from "../utils/queries";
import LensHub from "../abi/LensHub.json";
import { useWallet } from "../utils/wallet";
import Login from "./Login";
import Button from "./Button";
import Logo from "../assets/logo.png";

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

function Wallet({ setProfile = () => {}, ...props }) {
  const { wallet, setWallet, setLensHub, authToken, setProvider } = useWallet();
  const [getProfiles, profiles] = useLazyQuery(GET_PROFILES);

  async function connect() {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "30a44e55236e4a81af8cceb9cb3afc64", // required
        },
      },
    };

    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions, // required
    });

    const instance = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(instance);

    const signer = provider.getSigner();
    // if (!process.env.REACT_APP_INFURA_ID) {
    //   throw new Error("Missing Infura Id");
    // }
    const web3Provider = new WalletConnectProvider({
      infuraId: "30a44e55236e4a81af8cceb9cb3afc64",
    });

    // web3Provider.on("disconnect", reset);

    const accounts = await web3Provider.enable();
    // setAddress(accounts[0]);
    // setChainId(web3Provider.chainId);

    setProvider(provider);
    const address = await signer.getAddress();

    const contractAddr = "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82";
    const contract = new ethers.Contract(contractAddr, LensHub, signer);
    setLensHub(contract);

    setWallet({ ...wallet, signer, address });
  }

  useEffect(() => {
    if (!authToken || !wallet.address) return;

    getProfiles({
      variables: {
        request: {
          // profileIds?: string[];
          ownedBy: wallet.address,
          // handles?: string[];
          // whoMirroredPublicationId?: string;
        },
      },
    });
  }, [authToken, wallet.address]);

  useEffect(() => {
    if (!profiles.data) return;
    console.log(profiles.data.profiles.items[0]);

    setProfile(profiles.data.profiles.items[0]);
  }, [profiles.data]);

  // useEffect(() => {
  //   connectWallet()
  // }, [])

  return (
    <LoginContainer>
      {(!authToken || !wallet.signer) && (
        <>
          <br />
          <br />
          <br />
          <br />
          <br />
          <img height="180px" src={Logo} />
          <br />
        </>
      )}
      {wallet.signer ? <Login /> : <Button onClick={connect}>Connect Wallet</Button>}
    </LoginContainer>
  );
}

export default Wallet;
