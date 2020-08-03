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
import BurnerProvider from 'burner-provider';
const { TabPane } = Tabs;

const isIPFS = require('is-ipfs')
const ipfsConfig = { host: 'ipfs.infura.io', port: '5001', protocol: 'https' }


export default function NftyWallet(props) {

  const calculatedVmin = Math.min(window.document.body.clientHeight, window.document.body.clientWidth)

  const [tab, setTab] = useState("1")

  const [mode, setMode] = useState("edit")

  const [drawing, setDrawing] = useLocalStorage("drawing")
  const [ipfsHash, setIpfsHash] = useState()
  const [ink, setInk] = useState({})
  const [renderKey, setRenderKey] = useState(Date.now())
  const [canvasKey, setCanvasKey] = useState(Date.now())

  let nftyBalance = useContractReader(props.readKovanContracts,'NiftyToken',"balanceOf",[props.address],1777);
  let nftyMainBalance = useContractReader(props.readContracts,'NiftyMain',"balanceOf",[props.address],1777);
  let inksCreatedBy = useContractReader(props.readKovanContracts,'NiftyInk',"inksCreatedBy",[props.address],1777);
  let totalInks = useContractReader(props.readKovanContracts,'NiftyInk',"totalInks",1777);

  let displayBalance
  if(nftyMainBalance && nftyBalance) {
    displayBalance = Number(nftyMainBalance.toString()) + Number(nftyBalance.toString())
  }
  let displayInksCreated
  if(inksCreatedBy) {
    displayInksCreated = inksCreatedBy.toString()
  }
  let displayTotalInks
  if(totalInks) {
    displayTotalInks = totalInks.toString()
  }

  useEffect(() => {
    function handleResize() {
      console.log("RESIZE!!!!")
      setRenderKey(Date.now())
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

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
    if(mode=="mint") {
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

      console.log(process.env.REACT_APP_NETWORK_NAME)
      console.log('providers',props.kovanProvider, props.localProvider)

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
    if(process.env.REACT_APP_NETWORK_NAME){
      // we will use Kovan GSN for minting and liking:
      //https://docs.opengsn.org/gsn-provider/networks.html
      //relayHubAddress = "0x2E0d94754b348D208D64d52d78BcD443aFA9fa52"
      //stakeManagerAddress = "0x0ecf783407C5C80D71CFEa37938C0b60BD255FF8"
      //paymasterAddress = "0x38489512d064106f5A7AD3d9e13268Aaf777A41c"

      relayHubAddress = "0xA58B6fC9264ce507d0B0B477ceE31674341CB27e"
      stakeManagerAddress = "0xd1Fa0c7E52440078cC04a9e99beA727f3e0b981B"
      paymasterAddress = "0x2ebc08948d0DD5D034FBE0b1084C65f57eF7D0bC"

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

    let gsnConfig = { relayHubAddress, stakeManagerAddress, paymasterAddress }
    //if (provider._metamask) {
      //console.log('using metamask')
    //gsnConfig = {...gsnConfig, gasPriceFactorPercent:70, methodSuffix: '_v4', jsonStringifyRequest: true/*, chainId: provider.networkVersion*/}
    //}
    gsnConfig.chainId = 100//31337
    gsnConfig.relayLookupWindowBlocks= 1e5
    gsnConfig.verbose = true

    //let kovanblocknum = await props.kovanProvider.getBlockNumber()
    //console.log("kovanblocknum BLOCK NUMBER IS ",kovanblocknum)

    console.log("gsnConfig",gsnConfig)
    const kovanBurner = new BurnerProvider(props.kovanProvider.connection.url)
    console.log("props.kovanProvider",kovanBurner)
    const gsnProvider = new RelayProvider(kovanBurner, gsnConfig)
    console.log("gsnProvider:",gsnProvider)

    console.log("getting newMetaPriovider")
    let newMetaProvider = new ethers.providers.Web3Provider(gsnProvider)
    console.log("newMetaPriovider is:",newMetaProvider)

    console.log("Setting meta provider.....")
    props.setMetaProvider(newMetaProvider)
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
        mainnetProvider={props.mainnetProvider}
        price={props.price}
        minimized={props.minimized}
    />
  )

  let accountWithCreateButton = (
    <div style={{ position: 'fixed', textAlign: 'right', right: 0, bottom: 20, padding: 10 }}>
      <Row gutter={16} verticalAlign={"middle"}>

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

  let inkInfo = (<></>)
  if (mode === "mint") {
    inkInfo = (<InkInfo
      address={props.address}
      mainnetProvider={props.mainnetProvider}
      metaProvider={props.metaProvider}
      injectedProvider={props.injectedProvider}
      readContracts={props.readContracts}
      readKovanContracts={props.readKovanContracts}
      ink={ink}
      setInk={setInk}
      ipfsHash={ipfsHash}
      ipfsConfig={ipfsConfig}
      gasPrice={props.gasPrice}
      calculatedVmin={calculatedVmin}
    />)
  }

          return (
            <div>
              <Tabs activeKey={tab} onChange={(t)=>{
                window.history.pushState({id: 'draw'}, 'draw', '/')
                setTab(t)

              }} style={{marginTop:0,padding:8,textAlign:"center"}} tabBarExtraContent={""} defaultActiveKey="1">
                <TabPane defaultActiveKey="1" tab={<><span style={{fontSize:24,padding:8}}>🧑‍🎨 Nifty Ink</span>{/* pull this our for now <Badge style={badgeStyle} count={displayTotalInks} showZero/>*/}</>} key="1">
                <div style={{maxWidth:720,margin:"0 auto"}}>
                  <AllNiftyInks
                    mainnetProvider={props.mainnetProvider}
                    kovanProvider={props.kovanProvider}
                    readKovanContracts={props.readKovanContracts}
                    tab={tab}
                    showInk={showInk}
                    ipfsConfig={ipfsConfig}
                    totalInks={totalInks}
                    thisTab={"1"}
                  />
                  {/*process.env.REACT_APP_NETWORK_NAME?"":(<Contract
                  provider={props.injectedProvider}
                  name={"ValidSignatureTester"}
                  price={props.price}
                  />)*/}
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
                <TabPane tab={<><span><span style={{padding:8}}>🖼</span> inks</span> <Badge style={badgeStyle} count={displayInksCreated} showZero/></>} key="inks">
                  <div style={{width:300,margin:"0 auto"}}>
                    <MyNiftyInks
                      address={props.address}
                      mainnetProvider={props.mainnetProvider}
                      readContracts={props.readContracts}
                      readKovanContracts={props.readKovanContracts}
                      tab={tab}
                      showInk={showInk}
                      ipfsConfig={ipfsConfig}
                      inksCreatedBy={inksCreatedBy}
                      thisTab={"inks"}
                      newInk={newInk}
                    />
                  </div>
                </TabPane>
                <TabPane tab={<><span><span style={{padding:8}}>👛</span> holdings</span> <Badge style={badgeStyle} count={displayBalance} showZero/></>} key="holdings">
                  <div style={{maxWidth:300,margin:"0 auto"}}>
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
                      nftyBalance={nftyBalance}
                      nftyMainBalance={nftyMainBalance}
                      thisTab={"holdings"}
                    />
                  </div>
                </TabPane>
                <TabPane tab={
                    <Button style={{ marginBottom: 8 }} shape="round" size="large" type={tab=="create" && mode=="edit"?"secondary":"primary"} onClick={() => {newInk()}}><PlusOutlined /> Create</Button>
                  } key="create">
                  <div>
                    <InkCanvas
                      key={renderKey}
                      canvasKey={canvasKey}
                      address={props.address}
                      mainnetProvider={props.mainnetProvider}
                      injectedProvider={props.injectedProvider}
                      metaProvider={props.metaProvider}
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
                      gasPrice={props.gasPrice}
                      calculatedVmin={calculatedVmin}
                    />
                    {inkInfo}
                  </div>
                </TabPane>
              </Tabs>


              {accountWithCreateButton}
            </div>
          );

        }
