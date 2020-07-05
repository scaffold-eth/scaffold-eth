import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.css';
//import { gql } from "apollo-boost";
import { ethers } from "ethers";
//import { useQuery } from "@apollo/react-hooks";
import "./App.css";
import { LinkOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { Row, Col, Button } from 'antd';
import { useExchangePrice, useGasPrice, useContractLoader, useCustomContractLoader, useCustomContractReader, useBalance, useNetwork } from "./hooks"
import { Header, Account, Provider, Faucet, Ramp, Contract, TokenBalance, Balance, Address, AmountInput, Exchange, Bridge, GasGauge, Curve } from "./components"
import { Transactor, approveAndCall } from "./helpers"
import DEX from "./DEX.js"
//DEX AMB from "./AMB.js"

const productionxDaiExchangeAddress = ""

const RinkebyToxDaiBridge = "0xFEaB457D95D9990b7eb6c943c839258245541754"
const XDaiToRinkebyBridge = "0x1E0507046130c31DEb20EC2f870ad070Ff266079"

const DaiToxDaiBridge = "0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016"
const XDaiToDaiBridge = "0x7301CFA0e1756B71869E93d4e4Dca5c7d0eb0AA6"

const BRIDGEABI = [{ "inputs": [{ "internalType": "address", "name": "_receiver", "type": "address" }, { "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "relayTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]

const mainnetProvider = new ethers.providers.InfuraProvider("mainnet", "e59c464c322f47e2963f5f00638be2f8")
const rinkebyProvider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/e59c464c322f47e2963f5f00638be2f8")
const xdaiProvider = new ethers.providers.JsonRpcProvider("https://dai.poa.network")

const localProvider = mainnetProvider

function App() {

  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();
  const price = useExchangePrice(mainnetProvider)
  const gasPrice = useGasPrice("fast")

  const xDaiContracts = useContractLoader(xdaiProvider);
  const injectedXDaiContracts = useContractLoader(injectedProvider);

  const totalLiquidity = useCustomContractReader(xDaiContracts ? xDaiContracts['DEX']:null, "totalLiquidity", [])

  const xMoonToxDaiDEXAddress = xDaiContracts ? xDaiContracts["DEX"].address : ""

  const tx = Transactor(injectedProvider,gasPrice)
  const rinkebyTx = Transactor(rinkebyProvider,1,"https://rinkeby.etherscan.io/")
  const xdaiTx = Transactor(xdaiProvider,1.0102,"https://blockscout.com/poa/xdai/tx/")
  const injectedXdaiTx = Transactor(injectedProvider,1.0102,"https://blockscout.com/poa/xdai/tx/")

  const moonContractAddress = "0xDF82c9014F127243CE1305DFE54151647d74B27A"
  const moonContract = useCustomContractLoader(rinkebyProvider, "Balloons", moonContractAddress)
  const injectedMoonContract = useCustomContractLoader(injectedProvider, "Balloons", moonContractAddress)
  const moonBalance = useCustomContractReader(moonContract, "balanceOf", [address])

  const xmoonContractAddress = "0x1e16aa4Df73d29C029d94CeDa3e3114EC191E25A"//"0xC5C35D01B20f8d5cb65C60f02113EF6cd8e79910"
  const xmoonContract = useCustomContractLoader(xdaiProvider, "Balloons", xmoonContractAddress)
  const injectedXmoonContract = useCustomContractLoader(injectedProvider, "Balloons", xmoonContractAddress)
  const xmoonBalance = useCustomContractReader(xmoonContract, "balanceOf", [address])

  const daiContractAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
  const daiContract = useCustomContractLoader(mainnetProvider, "Balloons", daiContractAddress)
  const injectedDaiContract = useCustomContractLoader(injectedProvider, "Balloons", daiContractAddress)
  const daiBalance = useCustomContractReader(daiContract, "balanceOf", [address])

  const rinkebyBridgeContractWriteable = useCustomContractLoader(injectedProvider, "", RinkebyToxDaiBridge, BRIDGEABI)
  const xdaiBridgeContractWriteable = useCustomContractLoader(injectedProvider, "", XDaiToRinkebyBridge, BRIDGEABI)

  const contractsWriteable = useContractLoader(injectedProvider);

  const xdaiBalance = useBalance(xdaiProvider, address)

  const xDaiExchangeAddress = xDaiContracts ? xDaiContracts["DEX"].address : ""
  const xDaiBalanceOfExchange = useBalance(xdaiProvider, xDaiExchangeAddress)
  const xMoonBalanceOfExchange = useCustomContractReader(xmoonContract, "balanceOf", [ xDaiExchangeAddress ])

  const injectedNetwork = useNetwork(injectedProvider);

  const size = useWindowSize();


  let adminExtras = ""

  if(address=="0x34aA3F359A9D614239015126635CE7732c18fDF3"&&injectedNetwork &&injectedNetwork.chainId==100){
    adminExtras = (
      <div>
        <Button onClick={()=>{
          const xDaiStartAmount = '400'
          const xMoonStartAmount =  '20000'
          approveAndCall(
            injectedProvider,
            xdaiTx,
            address,
            injectedXDaiContracts['DEX'].address,
            xMoonStartAmount,
            injectedXmoonContract,
            injectedXDaiContracts['DEX'].init,
            [ethers.utils.parseEther(xMoonStartAmount), "0x1e16aa4Df73d29C029d94CeDa3e3114EC191E25A"],
            { gasLimit: 150000, value: ethers.utils.parseEther(xDaiStartAmount) }
          )
        }}>INIT</Button>



      </div>
    )
  }
/*

<Contract
name={"DEX"}
provider={injectedProvider}
address={address}
/>

<Button onClick={()=>{
  xdaiTx( injectedXDaiContracts['DEX'].drain({gasLimit:250000}) )
}}>DRAIN</Button>

*/

  return (
    <div className="App" style={{backgroundColor:"#E9E9E9",color:"#bcbcbc",}}>
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


      <div style={{width:"100%",backgroundColor:"#999999"}}>

        <div style={{float:"right",padding:16}}>
          <img src="./rinkeby.png" style={{maxWidth:30}}/> Rinkeby <a href={"https://rinkeby.etherscan.io"} target="_blank"><LinkOutlined /></a>
          <Balance address={address} provider={rinkebyProvider} />
          <div style={{fontSize:14,marginTop:-8}}>
            <a style={{color:"#6677bb"}} href="https://faucet.rinkeby.io/" target="_blank">💦 faucet</a>
          </div>
        </div>

        <div style={{textAlign:"left",padding:16}}>
          {/*<Address value={moonContractAddress} />*/} MOON <a href="https://rinkeby.etherscan.io/token/0xdf82c9014f127243ce1305dfe54151647d74b27a" target="_blank"><LinkOutlined /></a>
          <TokenBalance name={"MOON"} img={(<img src="./moons.png" style={{maxWidth:32}}/>)} address={address} balance={moonBalance} />
        </div>

      </div>

      <div style={{width:"100%",backgroundColor:"#777777",padding:16}}>

        <div style={{ width: 600, margin: "auto", padding: 24 }}>
          <Bridge
            topBalance={moonBalance}
            bottomBalance={xmoonBalance}
            upText={"xMOON to MOON"}
            downText={"MOON to xMOON"}
            topNetwork="Rinkeby"
            bottomBalance={daiBalance}
            bottomNetwork="https://dai.poa.network"
            upDisabled={!injectedNetwork || injectedNetwork.chainId != 100}
            downDisabled={!injectedNetwork || injectedNetwork.chainId != 4}
            timeEstimations={[15,40]}
            transferDown = { async (amount) => {
              let result = approveAndCall(
                injectedProvider,
                rinkebyTx,
                address,
                RinkebyToxDaiBridge,
                amount,
                injectedMoonContract,
                rinkebyBridgeContractWriteable.relayTokens,
                [address, ethers.utils.parseEther("" + amount)],
                { gasLimit: 250000 }
              )
              console.log("result",result)
              console.log("await------>:",await result)
              console.log("----- done ----")
            }}
            transferUp = { async (amount) => {
              return approveAndCall(
                injectedProvider,
                xdaiTx,
                address,
                XDaiToRinkebyBridge,
                amount,
                injectedXmoonContract,
                xdaiBridgeContractWriteable.relayTokens,
                [address, ethers.utils.parseEther("" + amount)],
                { gasLimit: 250000 }
              )

            }}
          />
        </div>

      </div>


      <div style={{width:"100%",height:700,backgroundColor:"#555555"}}>

        <div style={{float:"right",padding:16}}>
          <img src="./xdai.png" style={{maxWidth:30}}/> xDAI <a href={"https://blockscout.com/poa/xdai/"} target="_blank"><LinkOutlined /></a>
          <Balance address={address} provider={xdaiProvider} dollarMultiplier={1} />
        </div>

        <div style={{textAlign:"left",padding:16}}>
          {/*<Address value={xmoonContractAddress} />*/} xMOON <a href={"https://blockscout.com/poa/xdai/tokens/"+xmoonContractAddress} target="_blank"><LinkOutlined /></a>
          <TokenBalance name={"xMOON"} img={"🌒"} address={address} balance={xmoonBalance}  />
        </div>

        <DEX
          size={size}
          injectedNetwork={injectedNetwork}
          xdaiTx={injectedXdaiTx}
          address={address}
          injectedProvider={injectedProvider}
          localProvider={xdaiProvider}
          readContracts={xDaiContracts}
          price={1}
          tokenContract={xmoonContract}
          writeTokenContract={injectedXmoonContract}
        />

        {adminExtras}


      </div>




      <div style={{width:"100%",backgroundColor:"#040404"}}>

        <div style={{width:"100%",backgroundColor:"#333333",padding:16}}>

          <div style={{ width: 600, margin: "auto", padding: 24 }}>
            <Bridge
              topBalance={xdaiBalance}
              topNetwork="https://dai.poa.network"
              bottomBalance={daiBalance}
              bottomNetwork="Mainnet"
              upText={"DAI to xDAI"}
              downText={"xDAI to DAI"}
              upDisabled={!injectedNetwork || injectedNetwork.chainId != 1}
              downDisabled={!injectedNetwork || injectedNetwork.chainId != 100}
              transferDown = { async (amount) => {
                return injectedXdaiTx({
                  to: XDaiToDaiBridge,
                  value: ethers.utils.parseEther(amount),
                })
              }}
              transferDownTime = {180}
              transferUp = { async (amount) => {
                return tx(
                  injectedDaiContract.transfer(DaiToxDaiBridge,ethers.utils.parseEther(amount),{
                    gasLimit: 100000,
                    gasPrice: gasPrice
                  })
                )
              }}
              transferUpTime = {180}
              //60 seconds and then 120 'hold time' // detect one balance changing by amount and display in the middle until the other address moves that amount
              //its important that we show the funds 'in holding' -- people are always up in my DMs like wtf where is it?!? and then it shows up.
            />
          </div>

        </div>

        <div style={{width:"100%",backgroundColor:"#111111"}}>


          <div style={{float:"right",padding:16}}>
            <img src="./eth.png" style={{maxWidth:30}}/> ETH <a href={"https://etherscan.io"} target="_blank"><LinkOutlined /></a>
            <Balance address={address} provider={mainnetProvider} dollarMultiplier={price} />
          </div>


          <div style={{textAlign:'left',padding:16}}>
             {/* <Address value={daiContractAddress} /> */} DAI <a href="https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f" target="_blank"><LinkOutlined /></a>
            <TokenBalance name={"DAI"} img={<img src="./dai.png" style={{maxWidth:30}}/>} address={address} balance={daiBalance} dollarMultiplier={1}/>
          </div>

        </div>


      </div>









      {/*<div style={{ position: 'fixed', textAlign: 'right', right: 0, bottom: 20, padding: 10 }}>
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
      </div>*/}
      <div style={{ textAlign: 'center', left: 0, bottom: 20, padding: 16, backgroundColor:"#040404"}}>
        <Row align="middle" gutter={4}>
          <Col span={8} style={{textAlign:"center", opacity:0.8}}>
            <Ramp
              price={price}gz
              address={address}
            />
          </Col>

          <Col span={8} style={{textAlign:"center", opacity:1}}>
            <Button onClick={()=>{window.open("https://t.me/joinchat/KByvmRPhYA7DsIbCmxoCTg")}} size="large" shape="round">
              <span style={{marginRight:8}}>💬</span>
              Chat / Support
            </Button>
          </Col>

          <Col span={8} style={{textAlign:"center", opacity:0.8}}>
            <GasGauge gasPrice={gasPrice}/>
          </Col>

          {/*<Col span={12}>
            <Faucet
              localProvider={localProvider}
              price={price}
            />
          </Col>*/}
        </Row>


      </div>

    </div>
  );
}

export default App;


function useWindowSize() {
  const isClient = typeof window === 'object';

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}
