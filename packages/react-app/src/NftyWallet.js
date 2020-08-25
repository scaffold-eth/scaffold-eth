import React, { useState, useEffect } from 'react'
import { Button, Badge, Tabs, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useContractReader, useLocalStorage } from "./hooks"
import { ethers } from "ethers";
import { RelayProvider } from '@opengsn/gsn';
import { Account, Contract } from "./components"
import InkCanvas from "./InkCanvas.js"
import InkInfo from "./InkInfo.js"
import MyNiftyHoldings from "./MyNiftyHoldings.js"
import MyNiftyInks from "./MyNiftyInks.js"
import AllNiftyInks from "./AllNiftyInks.js"
const { TabPane } = Tabs;

const Web3HttpProvider = require( 'web3-providers-http')

const isIPFS = require('is-ipfs')
const ipfsConfigInfura = { host: 'ipfs.infura.io', port: '5001', protocol: 'https' }
const ipfsConfig = {host: 'ipfs.nifty.ink', port: '3001', protocol: 'https' , timeout: 2500}

export default function NftyWallet(props) {

  const calculatedVmin = Math.min(window.document.body.clientHeight, window.document.body.clientWidth)

  const [tab, setTab] = useState("create")

  const [mode, setMode] = useState("edit")

  const [drawing, setDrawing] = useLocalStorage("drawing")
  const [ipfsHash, setIpfsHash] = useState()
  const [ink, setInk] = useState({})
  const [renderKey, setRenderKey] = useState(Date.now())
  const [canvasKey, setCanvasKey] = useState(Date.now())

  const [injectedGsnSigner, setInjectedGsnSigner] = useState()

  let transactionConfig = {
    'address': props.address,
    'localProvider': props.kovanProvider,
    'injectedProvider': props.injectedProvider,
    'injectedGsnSigner': injectedGsnSigner,
    'metaSigner': props.metaProvider
  }

  let nftyBalance = useContractReader(props.readKovanContracts,'NiftyToken',"balanceOf",[props.address],2777);
  let nftyMainBalance = useContractReader(props.readContracts,'NiftyMain',"balanceOf",[props.address],2777);
  let inksCreatedBy = useContractReader(props.readKovanContracts,'NiftyInk',"inksCreatedBy",[props.address],2777);
  let totalInks = useContractReader(props.readKovanContracts,'NiftyInk',"totalInks",2777);
  let upgradePrice = useContractReader(props.readKovanContracts,'NiftyMediator',"relayPrice",9999);

  let displayBalance
  if(nftyMainBalance && nftyBalance) {
    displayBalance = Number(nftyMainBalance.toString()) + Number(nftyBalance.toString())
  }
  let displayInksCreated
  if(inksCreatedBy) {
    displayInksCreated = inksCreatedBy.toString()
  }

  const showInk = ((newIpfsHash) => {
    console.log(newIpfsHash)
    if(newIpfsHash === ipfsHash) {
      setTab('create')
    } else {
    window.history.pushState({id: newIpfsHash}, newIpfsHash, '/' + newIpfsHash)
    setDrawing()
    setInk({})
    setIpfsHash(newIpfsHash)
    setMode('mint')
    setTab('create')
    setCanvasKey(Date.now())
    return false
  }
  })

  const newInk = (() => {
    if(mode==="mint") {
    window.history.pushState({id: 'draw'}, 'draw', '/')
    setMode("edit")
    setDrawing("")
    setIpfsHash()
    setInk({})
    setTab("create")
    setCanvasKey(Date.now())
  } else {
    setTab("create")
  }
  })

  const badgeStyle = {
    backgroundColor: "#fff",
    color: "#999",
    boxShadow:"0 0 0 1px #d9d9d9 inset",
  }

  useEffect(() => {
    const loadPage = async () => {

      let ipfsHashRequest = window.location.pathname.replace("/", "")
      if (ipfsHashRequest && isIPFS.multihash(ipfsHashRequest)) {
        setMode("mint")
        setDrawing("")
        setTab("create")
        setIpfsHash(ipfsHashRequest)

      } else {
        if (ipfsHashRequest) {window.history.pushState({id: 'edit'}, 'edit', '/')}
    }

    let relayHubAddress
    let stakeManagerAddress
    let paymasterAddress
    if(process.env.REACT_APP_NETWORK_NAME === 'xdai'){
      // we will use Kovan GSN for minting and liking:
      //https://docs.opengsn.org/gsn-provider/networks.html
      //relayHubAddress = "0x2E0d94754b348D208D64d52d78BcD443aFA9fa52"
      //stakeManagerAddress = "0x0ecf783407C5C80D71CFEa37938C0b60BD255FF8"
      //paymasterAddress = "0x38489512d064106f5A7AD3d9e13268Aaf777A41c"

      relayHubAddress = "0xA58B6fC9264ce507d0B0B477ceE31674341CB27e"
      stakeManagerAddress = "0xd1Fa0c7E52440078cC04a9e99beA727f3e0b981B"
      paymasterAddress = "0x2ebc08948d0DD5D034FBE0b1084C65f57eF7D0bC"
    } else if (process.env.REACT_APP_NETWORK_NAME == 'sokol'){
      relayHubAddress = "0xA17C8F25668a5748E9B80ED8Ff842f8909258bF6"
      stakeManagerAddress = "0xbE9B5be78bdB068CaE705EdF1c18F061698B6F83"
      paymasterAddress = "0x205091FE2AFAEbCB8843EDa0A8ee28B170aa0619"

      /*
      Deployed GSN to network: kovan

          RelayHub: 0xA17C8F25668a5748E9B80ED8Ff842f8909258bF6
          StakeManager: 0xbE9B5be78bdB068CaE705EdF1c18F061698B6F83
          Penalizer: 0x89c2Ed7235992F9e761Fb105E58704FeA9dBa6Bd
          Forwarder: 0x77777e800704Fb61b0c10aa7b93985F835EC23fA
          Paymaster (Default): 0x205091FE2AFAEbCB8843EDa0A8ee28B170aa0619

          ---------

          Deployed GSN to network: ropsten

            RelayHub: 0xB3e93d8B141732cFd5e5d7bf0018f6Cbca193e9a
            StakeManager: 0x62264ab69A01a3e7aC0d7b8C7F7E6899372d90C3
            Penalizer: 0x9e828894427c56da92c6054e9B8A0Da2C423A220
            Forwarder: 0x3a6f59D5a07AB99BC3DCF2561D23fC59a0177E77
            Paymaster (Default): 0x45Aae984d4b1b0C55E3D2231d38882Fd7E6A5796

          ---------

          Deployed GSN to network: xdai

            RelayHub: 0xA58B6fC9264ce507d0B0B477ceE31674341CB27e
            StakeManager: 0xd1Fa0c7E52440078cC04a9e99beA727f3e0b981B
            Penalizer: 0x19120dD5a594Da608aF904b3BECD1a1b9A839100
            Forwarder: 0xB851B09eFe4A5021E9a4EcDDbc5D9c9cE2640CCb
            Paymaster (Default): 0x2ebc08948d0DD5D034FBE0b1084C65f57eF7D0bC

          ---------

          MAINNET:

          StakeManager: 0x5ae81a75AA2eA4647a31F099c239Bc76433141eA
          Penalizer:    0x67c6e83F247fa404708A09032475Eda551e768fA
          Forwarder:    0x4699d5C42A3BC7dd9c72D218cCEA45954aF24f53
          RelayHub:     0x5648B6306380689AF8d2DE7Bdd23D916b9eE0db5
          Paymaster:    0xF50B17A7Ca64447Ae782dc6c4AABe992c37476c7
        */

    }else{
      relayHubAddress = require('./gsn/RelayHub.json').address
      stakeManagerAddress = require('./gsn/StakeManager.json').address
      paymasterAddress = require('./gsn/Paymaster.json').address
      console.log("local GSN addresses",relayHubAddress,stakeManagerAddress,paymasterAddress)
    }

    let newGsnConfig = { relayHubAddress, stakeManagerAddress, paymasterAddress }

    newGsnConfig.chainId = 100//31337
    newGsnConfig.relayLookupWindowBlocks= 1e5
    newGsnConfig.verbose = true

      let origProvider
      if(process.env.REACT_APP_NETWORK_NAME === 'xdai') {
      origProvider = new Web3HttpProvider("https://dai.poa.network")
    } else if (process.env.REACT_APP_NETWORK_NAME === 'sokol') {
      origProvider = new ethers.providers.InfuraProvider("kovan", "9ea7e149b122423991f56257b882261c")
    } else {
      origProvider = new ethers.providers.JsonRpcProvider("http://localhost:8546")
    }
      const gsnProvider = new RelayProvider(origProvider, newGsnConfig);

      const account = await gsnProvider.newAccount()
      let from = account.address

      const provider = new ethers.providers.Web3Provider(gsnProvider);
      //console.log("GOT GSN PROVIDER",gsnProvider)
      const signer = provider.getSigner(from)

      props.setMetaProvider(signer)
    }
    loadPage()
  }, [])

  let accountDisplay = (
    <Account
        address={props.address}
        setAddress={props.setAddress}
        localProvider={props.kovanProvider}
        injectedProvider={props.injectedProvider}
        setInjectedProvider={props.setInjectedProvider}
        setInjectedGsnSigner={setInjectedGsnSigner}
        mainnetProvider={props.mainnetProvider}
        price={props.price}
        minimized={props.minimized}
    />
  )

  let accountWithCreateButton = (
    <div style={{ zIndex:99, position: 'fixed', textAlign: 'right', right: 0, bottom: 20, padding: 10, backgroundColor: "#FFFFFF", borderRadius:16 }}>
      <Row gutter={16} align={"middle"}>

        <Col>
          {accountDisplay}
        </Col>

        <Col>
        <Button style={{ marginRight: 8, marginTop:8 }} shape="round" size="large" type="primary" onClick={() => {newInk()
      }}><span style={{marginRight:12}}>🖌</span></Button>
        </Col>

      </Row>
    </div>
  )

  let supportButton = (
    <div style={{ zIndex:99, position: 'fixed', textAlign: 'left', left: 0, bottom: 20, padding: 10, backgroundColor: "#FFFFFF", borderRadius:16 }}>
      <Row gutter={16} align={"middle"}>

      <Col>
      <Button style={{ marginRight: 8, marginTop:8 }} shape="round" size="large" type="secondary" onClick={() => {window.open("https://t.me/joinchat/KByvmRpuA2XzQVYXWICiSg")}}><span style={{marginRight:12}}>💬</span>Chat</Button>
      </Col>

        <Col>
        <Button style={{ marginRight: 8, marginTop:8 }} shape="round" size="large" type="secondary" onClick={() => {window.open("https://medium.com/@austin_48503/nifty-ink-an-ethereum-tutorial-c860a4904cb2")}}><span style={{marginRight:12}}>🧐</span>About</Button>
        </Col>

      </Row>
    </div>
  )

  let inkInfo = (<></>)
  if (mode === "mint") {
    inkInfo = (<InkInfo
      address={props.address}
      mainnetProvider={props.mainnetProvider}
      metaProvider={props.metaProvider}
      injectedProvider={props.injectedProvider}
      kovanProvider={props.kovanProvider}
      readContracts={props.readContracts}
      readKovanContracts={props.readKovanContracts}
      ink={ink}
      setInk={setInk}
      ipfsHash={ipfsHash}
      ipfsConfig={ipfsConfig}
      ipfsConfigInfura={ipfsConfigInfura}
      gasPrice={props.gasPrice}
      calculatedVmin={calculatedVmin}
      upgradePrice={upgradePrice}
      transactionConfig={transactionConfig}
    />)
  }

          return (
            <div>
              <Tabs activeKey={tab} onChange={(t)=>{
                window.history.pushState({id: 'draw'}, 'draw', '/')
                setTab(t)

              }} style={{marginTop:0,padding:8,textAlign:"center"}} tabBarExtraContent={""} defaultActiveKey="create">
                <TabPane tab={<><span style={{fontSize:24,padding:8}}>🎨  Nifty Ink</span>{/* pull this our for now <Badge style={badgeStyle} count={displayTotalInks} showZero/>*/}</>} key="1">
                <div style={{maxWidth:720,margin:"0 auto"}}>
                  <AllNiftyInks
                    mainnetProvider={props.mainnetProvider}
                    kovanProvider={props.kovanProvider}
                    readKovanContracts={props.readKovanContracts}
                    tab={tab}
                    showInk={showInk}
                    ipfsConfig={ipfsConfig}
                    ipfsConfigInfura={ipfsConfigInfura}
                    totalInks={totalInks}
                    thisTab={"1"}
                  />
                  {process.env.REACT_APP_NETWORK_NAME?"":(<><Contract
                  provider={props.injectedProvider}
                  name={"NiftyRegistry"}
                  price={props.price}
                  /><Contract
                  provider={props.injectedProvider}
                  name={"NiftyInk"}
                  price={props.price}
                  />
                  <Contract
                  provider={props.injectedProvider}
                  name={"NiftyToken"}
                  price={props.price}
                  />
                  <Contract
                  provider={props.injectedProvider}
                  name={"NiftyMediator"}
                  price={props.price}
                  />
                  <Contract
                  provider={props.injectedProvider}
                  name={"Liker"}
                  price={props.price}
                  /></>)}
                </div>
                </TabPane>
                <TabPane disabled={!(inksCreatedBy&&inksCreatedBy.toString)} tab={<><span><span style={{padding:8}}>🖼</span> inks</span> <Badge style={badgeStyle} count={displayInksCreated} showZero/></>} key="inks">
                  <div style={{width:400,margin:"0 auto"}}>
                    <MyNiftyInks
                      address={props.address}
                      mainnetProvider={props.mainnetProvider}
                      readContracts={props.readContracts}
                      readKovanContracts={props.readKovanContracts}
                      tab={tab}
                      showInk={showInk}
                      ipfsConfig={ipfsConfig}
                      ipfsConfigInfura={ipfsConfigInfura}
                      inksCreatedBy={inksCreatedBy}
                      thisTab={"inks"}
                      newInk={newInk}
                    />
                  </div>
                </TabPane>
                <TabPane disabled={!(nftyBalance&&nftyBalance.toString&&nftyMainBalance&&nftyMainBalance.toString)} tab={<><span><span style={{padding:8}}>👛</span> holdings</span> <Badge style={badgeStyle} count={displayBalance} showZero/></>} key="holdings">
                  <div style={{maxWidth:500,margin:"0 auto"}}>
                    <MyNiftyHoldings
                      address={props.address}
                      mainnetProvider={props.mainnetProvider}
                      injectedProvider={props.injectedProvider}
                      readContracts={props.readContracts}
                      readKovanContracts={props.readKovanContracts}
                      gasPrice={props.gasPrice}
                      tab={tab}
                      showInk={showInk}
                      ipfsConfig={ipfsConfig}
                      ipfsConfigInfura={ipfsConfigInfura}
                      nftyBalance={nftyBalance}
                      nftyMainBalance={nftyMainBalance}
                      transactionConfig={transactionConfig}
                      thisTab={"holdings"}
                      upgradePrice={upgradePrice}
                    />
                  </div>
                </TabPane>
                <TabPane tab={
                    <Button style={{ marginBottom: 8 }} shape="round" size="large" type={tab==="create" && mode==="edit"?"secondary":"primary"} onClick={() => {newInk()}}><PlusOutlined /> Create</Button>
                  } key="create">
                  <div>
                    <InkCanvas
                      key={renderKey}
                      canvasKey={canvasKey}
                      address={props.address}
                      mainnetProvider={props.mainnetProvider}
                      injectedProvider={props.injectedProvider}
                      metaProvider={props.metaProvider}
                      kovanProvider={props.kovanProvider}
                      readKovanContracts={props.readKovanContracts}
                      mode={mode}
                      ink={ink}
                      ipfsHash={ipfsHash}
                      setMode={setMode}
                      setIpfsHash={setIpfsHash}
                      setInk={setInk}
                      drawing={drawing}
                      setDrawing={setDrawing}
                      ipfsConfig={ipfsConfig}
                      ipfsConfigInfura={ipfsConfigInfura}
                      gasPrice={props.gasPrice}
                      calculatedVmin={calculatedVmin}
                      transactionConfig={transactionConfig}
                    />
                    {inkInfo}
                  </div>
                </TabPane>
              </Tabs>

              {supportButton}
              {accountWithCreateButton}
            </div>
          );

        }
