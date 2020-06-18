import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.css';
//import { gql } from "apollo-boost";
import { ethers } from "ethers";
//import { useQuery } from "@apollo/react-hooks";
import "./App.css";
import { LinkOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { Row, Col, Button } from 'antd';
import { useExchangePrice, useGasPrice, useContractLoader, useCustomContractLoader, useCustomContractReader } from "./hooks"
import { Header, Account, Provider, Faucet, Ramp, Contract, TokenBalance, Balance, Address, AmountInput } from "./components"
import { Transactor } from "./helpers"
import DEX from "./DEX.js"
import AMB from "./AMB.js"



const RinkebyToxDaiBridge = "0xFEaB457D95D9990b7eb6c943c839258245541754"
const XDaiToRinkebyBridge = "0x1E0507046130c31DEb20EC2f870ad070Ff266079"

const DaiToxDaiBridge = "0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016"
const XDaiToDaiBridge = "0x7301cfa0e1756b71869e93d4e4dca5c7d0eb0aa6"

const BRIDGEABI = [{ "inputs": [{ "internalType": "address", "name": "_receiver", "type": "address" }, { "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "relayTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]

const mainnetProvider = new ethers.providers.InfuraProvider("mainnet", "2717afb6bf164045b5d5468031b93f87")
const rinkebyProvider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/e59c464c322f47e2963f5f00638be2f8")
const xdaiProvider = new ethers.providers.JsonRpcProvider("https://dai.poa.network")


const localProvider = mainnetProvider

function App() {

  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();
  const price = useExchangePrice(mainnetProvider)
  const gasPrice = useGasPrice("fast")

  const xDaiContracts = useContractLoader(xdaiProvider);
  const xMoonToxDaiDEXAddress = xDaiContracts ? xDaiContracts["DEX"].address : ""

  const rinkebyTx = Transactor(rinkebyProvider)
  const xdaiTx = Transactor(xdaiProvider)

  const moonContractAddress = "0xDF82c9014F127243CE1305DFE54151647d74B27A"
  const moonContract = useCustomContractLoader(rinkebyProvider, "Balloons", moonContractAddress)
  const moonBalance = useCustomContractReader(moonContract, "balanceOf", [address])

  const xmoonContractAddress = "0xC5C35D01B20f8d5cb65C60f02113EF6cd8e79910"
  const xmoonContract = useCustomContractLoader(xdaiProvider, "Balloons", xmoonContractAddress)
  const xmoonBalance = useCustomContractReader(xmoonContract, "balanceOf", [address])

  const daiContractAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
  const daiContract = useCustomContractLoader(mainnetProvider, "Balloons", daiContractAddress)
  const daiBalance = useCustomContractReader(daiContract, "balanceOf", [address])

  const moonContractWriteable = useCustomContractLoader(injectedProvider, "Balloons", moonContractAddress)
  const rinkebyBridgeContractWriteable = useCustomContractLoader(injectedProvider, "", RinkebyToxDaiBridge, BRIDGEABI)

  const xmoonContractWriteable = useCustomContractLoader(injectedProvider, "Balloons", xmoonContractAddress)
  const xdaiBridgeContractWriteable = useCustomContractLoader(injectedProvider, "", XDaiToRinkebyBridge, BRIDGEABI)

  const contractsWriteable = useContractLoader(injectedProvider);

  const [injectedNetwork, setInjectedNetwork] = useState();
  console.log(injectedNetwork)
  useEffect(() => {
    const getNetwork = async () => {
      if (injectedProvider) {
        let injectedNetwork = await injectedProvider.getNetwork()
        setInjectedNetwork(injectedNetwork)
      }
    }
    getNetwork()
  }, [injectedProvider])


  //////////////////////////////////////////////////////////////////////////   MOON BRIDGE   //////////////////////////////////////////////////////

  let moonToxMoonBridge, max
  const [moonToxMoonBridgeMode, setMoonToxMoonBridgeMode] = useState();
  const [moonToxMoonBridgeAmount, setMoonToxMoonBridgeAmount] = useState();
  if (!moonToxMoonBridgeMode) {
    moonToxMoonBridge = (
      <Row gutter={8}>
        <Col span={12} align="right">
          <Button shape="round" size="large" type="primary" onClick={() => { setMoonToxMoonBridgeMode("down") }} disabled={!injectedNetwork || injectedNetwork.chainId != 4}  >
            <DownOutlined /> MOON to xMOON
          </Button>
        </Col>
        <Col>
          <Button shape="round" size="large" type="primary" onClick={() => { setMoonToxMoonBridgeMode("up") }} disabled={!injectedNetwork || injectedNetwork.chainId != 100}  >
            <UpOutlined /> xMOON to MOON
          </Button>
        </Col>
      </Row>
    )
  } else {
    let button
    if (moonToxMoonBridgeMode == "down") {
     max = moonBalance ? ethers.utils.formatEther(moonBalance) : 0
      button = (
        <Button shape="round" size="large" type="primary" onClick={async () => {
          let allowance = await moonContract.allowance(address, RinkebyToxDaiBridge)
          let amountInWei = ethers.utils.parseEther(moonToxMoonBridgeAmount)
          if (amountInWei.gt(allowance)) {
            console.log("they are not approved, this is a two tx move...")
            rinkebyTx(moonContractWriteable.approve(RinkebyToxDaiBridge, ethers.utils.parseEther("" + moonToxMoonBridgeAmount)))
          } else {
            console.log("they are approved, single tx move...")
            rinkebyTx(rinkebyBridgeContractWriteable.relayTokens(address, ethers.utils.parseEther("" + moonToxMoonBridgeAmount)))
          }
        }}>
          <DownOutlined /> MOON to xMOON
        </Button>
      )
    } else {
      max = xmoonBalance ? ethers.utils.formatEther(xmoonBalance) : 0
      button = (
        <Button shape="round" size="large" type="primary" onClick={async () => {
          let allowance = await xmoonContract.allowance(address, XDaiToRinkebyBridge)
          let amountInWei = ethers.utils.parseEther(moonToxMoonBridgeAmount)
          if (amountInWei.gt(allowance)) {
            console.log("they are not approved, this is a two tx move...")
            xdaiTx(xmoonContractWriteable.approve(XDaiToRinkebyBridge, ethers.utils.parseEther("" + moonToxMoonBridgeAmount)))
          } else {
            console.log("they are approved, single tx move...")
            xdaiTx(xdaiBridgeContractWriteable.relayTokens(address, ethers.utils.parseEther("" + moonToxMoonBridgeAmount)))
          }
        }}>
          <UpOutlined /> xMOON to MOON
        </Button>
      )
    }

    moonToxMoonBridge = (
      <Row gutter={8}>
        <Col span={10} align="center">
          <AmountInput prefix="" max={max} value={moonToxMoonBridgeAmount} setValue={setMoonToxMoonBridgeAmount} />
        </Col>
        <Col span={8} align="center">
          {button}
        </Col>
        <Col span={6} align="center">
          <Button shape="round" size="large" onClick={() => { setMoonToxMoonBridgeMode() }}>
            cancel
        </Button>
        </Col>
      </Row>
    )
  }




  //////////////////////////////////////////////////////////////////////////  xMOON DEX   //////////////////////////////////////////////////////


  let xMoonDex, xMoonDexMax
  const [xMoonDexMode, setXMoonDexMode] = useState();
  const [xMoonDexAmount, setXMoonDexAmount] = useState();
  if (!xMoonDexMode) {
    xMoonDex = (
      <Row gutter={8}>
        <Col span={12} align="right">
          <Button shape="round" size="large" type="primary" onClick={() => { setXMoonDexMode("down") }} disabled={!injectedNetwork || injectedNetwork.chainId != 100}  >
            <DownOutlined /> xMOON to xDAI
          </Button>
        </Col>
        <Col>
          <Button shape="round" size="large" type="primary" onClick={() => { setXMoonDexMode("up") }} disabled={!injectedNetwork || injectedNetwork.chainId != 100}  >
            <UpOutlined /> xDAI to xMOON
          </Button>
        </Col>
      </Row>
    )
  } else {
    xMoonDexMax = xmoonBalance ? ethers.utils.formatEther(xmoonBalance) : 0
    let button
    if (xMoonDexMode == "down") {
      button = (
        <Button shape="round" size="large" type="primary" onClick={async () => {
          
          let allowance = await xmoonContract.allowance(address, xMoonToxDaiDEXAddress)
          let amountInWei = ethers.utils.parseEther(xMoonDexAmount)
          if (amountInWei.gt(allowance)) {
            console.log("they are not approved, this is a two tx move...")
            xdaiTx(xmoonContractWriteable.approve(xMoonToxDaiDEXAddress, ethers.utils.parseEther("" + xMoonDexAmount)))
          } else {
            console.log("they are approved, single tx move...")
            xdaiTx(contractsWriteable["DEX"].tokenToEth(ethers.utils.parseEther("" + xMoonDexAmount)))
          }
        }}>
          <DownOutlined /> xMOON to xDAI
        </Button>
      )
    } else {
      xMoonDexMax = moonBalance ? ethers.utils.formatEther(moonBalance) : 0
      button = (
        <Button shape="round" size="large" type="primary" onClick={async () => {
          let amountInWei = ethers.utils.parseEther(xMoonDexAmount)
          xdaiTx(contractsWriteable["DEX"].ethToToken({value: amountInWei}))
          //let swapEthToTokenResult = await tx( writeContracts[contractName]["ethToToken"]({value: valueInEther}) )
        }}>
          <UpOutlined /> xDAI to xMOON
        </Button>
      )
    }



    xMoonDex = (
      <Row gutter={8}>
        <Col span={10} align="center">
          <AmountInput prefix="" max={xMoonDexMax} value={xMoonDexAmount} setValue={setXMoonDexAmount} />
        </Col>
        <Col span={8} align="center">
          {button}
        </Col>
        <Col span={6} align="center">
          <Button shape="round" size="large" onClick={() => { setXMoonDexMode() }}>
            cancel
        </Button>
        </Col>
      </Row>
    )
  }



  //////////////////////////////////////////////////////////////////////////   xDAI/DAI BRIDGE   //////////////////////////////////////////////////////
/*
  let xdaiBridge
  const [xdaiBridgeMode, setXdaiBridgeMode] = useState();
  const [moonToxMoonBridgeAmount, setMoonToxMoonBridgeAmount] = useState();
  if (!moonToxMoonBridgeMode) {
    xdaiBridge = (
      <Row gutter={8}>
        <Col span={12} align="right">
          <Button shape="round" size="large" type="primary" onClick={() => { setXdaiBridgeMode("down") }} disabled={!injectedNetwork || injectedNetwork.chainId != 4}  >
            <DownOutlined /> MOON to xMOON
          </Button>
        </Col>
        <Col>
          <Button shape="round" size="large" type="primary" onClick={() => { setXdaiBridgeMode("up") }} disabled={!injectedNetwork || injectedNetwork.chainId != 100}  >
            <UpOutlined /> xMOON to MOON
          </Button>
        </Col>
      </Row>
    )
  } else {
    let button
    if (moonToxMoonBridgeMode == "down") {
      button = (
        <Button shape="round" size="large" type="primary" onClick={async () => {
          let allowance = await moonContract.allowance(address, RinkebyToxDaiBridge)
          let amountInWei = ethers.utils.parseEther(moonToxMoonBridgeAmount)
          if (amountInWei.gt(allowance)) {
            console.log("they are not approved, this is a two tx move...")
            rinkebyTx(moonContractWriteable.approve(RinkebyToxDaiBridge, ethers.utils.parseEther("" + moonToxMoonBridgeAmount)))
          } else {
            console.log("they are approved, single tx move...")
            rinkebyTx(rinkebyBridgeContractWriteable.relayTokens(address, ethers.utils.parseEther("" + moonToxMoonBridgeAmount)))
          }
        }}>
          <DownOutlined /> MOON to xMOON
        </Button>
      )
    } else {
      button = (
        <Button shape="round" size="large" type="primary" onClick={async () => {
          let allowance = await xmoonContract.allowance(address, XDaiToRinkebyBridge)
          let amountInWei = ethers.utils.parseEther(moonToxMoonBridgeAmount)
          if (amountInWei.gt(allowance)) {
            console.log("they are not approved, this is a two tx move...")
            xdaiTx(xmoonContractWriteable.approve(XDaiToRinkebyBridge, ethers.utils.parseEther("" + moonToxMoonBridgeAmount)))
          } else {
            console.log("they are approved, single tx move...")
            xdaiTx(xdaiBridgeContractWriteable.relayTokens(address, ethers.utils.parseEther("" + moonToxMoonBridgeAmount)))
          }
        }}>
          <UpOutlined /> xMOON to MOON
        </Button>
      )
    }

    xdaiBridge = (
      <Row gutter={8}>
        <Col span={10} align="center">
          <AmountInput prefix="" max={moonBalance ? ethers.utils.formatEther(moonBalance) : 0} value={moonToxMoonBridgeAmount} setValue={setMoonToxMoonBridgeAmount} />
        </Col>
        <Col span={8} align="center">
          {button}
        </Col>
        <Col span={6} align="center">
          <Button shape="round" size="large" onClick={() => { setXdaiBridgeMode() }}>
            cancel
        </Button>
        </Col>
      </Row>
    )
  }
  */


  return (
    <div className="App">
      <Header />
      <div style={{ position: 'fixed', textAlign: 'right', right: 0, top: 0, padding: 10 }}>
        <Account
          address={address}
          setAddress={setAddress}
          localProvider={localProvider}
          injectedProvider={injectedProvider}
          setInjectedProvider={setInjectedProvider}
          mainnetProvider={mainnetProvider}
          price={price}
        />
      </div>

      <div>
        Rinkeby
        <Balance address={address} provider={rinkebyProvider} />
      </div>

      <div>
        <Address value={moonContractAddress} /> MOON <a href="https://rinkeby.etherscan.io/token/0xdf82c9014f127243ce1305dfe54151647d74b27a" target="_blank"><LinkOutlined /></a>
        <TokenBalance name={"MOON"} img={"🌘"} address={address} balance={moonBalance} />
      </div>

      <div style={{ width: 600, margin: "auto", padding: 24 }}>
        {moonToxMoonBridge}
      </div>

      <div>
        <Address value={xmoonContractAddress} /> xMOON <a href="https://blockscout.com/poa/xdai/token/0xC5C35D01B20f8d5cb65C60f02113EF6cd8e79910" target="_blank"><LinkOutlined /></a>
        <TokenBalance name={"xMOON"} img={"🌒"} address={address} balance={xmoonBalance} />
      </div>

      <div style={{ width: 600, margin: "auto", padding: 24 }}>
        {xMoonDex}
      </div>

      <div>
        xDAI
        <Balance address={address} provider={xdaiProvider} dollarMultiplier={1} />
      </div>

      <div>
        <Address value={daiContractAddress} /> DAI <a href="https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f" target="_blank"><LinkOutlined /></a>
        <TokenBalance name={"DAI"} img={"💵"} address={address} balance={daiBalance} />
      </div>

      <div>
        ETH
        <Balance address={address} provider={mainnetProvider} dollarMultiplier={price} />
      </div>

      <AMB
        address={address}
        moonContract={moonContract}
        injectedProvider={injectedProvider}
        localProvider={localProvider}
        mainnetProvider={mainnetProvider}
        readContracts={xDaiContracts}
        price={price}
      />

      <DEX
        address={address}
        injectedProvider={injectedProvider}
        localProvider={xdaiProvider}
        xmoonContract={xmoonContract}
        mainnetProvider={mainnetProvider}
        readContracts={xDaiContracts}
        price={price}
      />

      <Contract
        name={"DEX"}
        show={["init"]}
        provider={injectedProvider}
        address={address}
      />

      {// <Contract
        //   title={"🎈 Balloons"}
        //   name={"Balloons"}
        //   show={["balanceOf","approve"]}
        //   provider={localProvider}
        //   address={address}
        // />
      }


      <div style={{ position: 'fixed', textAlign: 'right', right: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={4}>
          <Col span={10}>
            <Provider name={"mainnet"} provider={mainnetProvider} />
          </Col>
          <Col span={6}>
            <Provider name={"local"} provider={localProvider} />
          </Col>
          <Col span={8}>
            <Provider name={"injected"} provider={injectedProvider} />
          </Col>
        </Row>
      </div>
      <div style={{ position: 'fixed', textAlign: 'left', left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={4}>
          <Col span={9}>
            <Ramp
              price={price}
              address={address}
            />
          </Col>
          <Col span={15}>
            <Faucet
              localProvider={localProvider}
              price={price}
            />
          </Col>
        </Row>


      </div>

    </div>
  );
}

export default App;
