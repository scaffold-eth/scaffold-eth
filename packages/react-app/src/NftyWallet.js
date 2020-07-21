import React, { useState, useEffect } from 'react'
import { Button, Badge, Tabs } from 'antd';
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

  const [tab, setTab] = useState("1")

  const [mode, setMode] = useState("edit")

  const [drawing, setDrawing] = useLocalStorage("drawing")
  const [ipfsHash, setIpfsHash] = useState()
  const [ink, setInk] = useState({})
  const [canvasKey, setCanvasKey] = useState(Date.now())

  let nftyBalance = useContractReader(props.readContracts,'NFTINK',"balanceOf",[props.address],1777);
  let inksCreatedBy = useContractReader(props.readKovanContracts,'NFTINK',"inksCreatedBy",[props.address],1777);
  let totalInks = useContractReader(props.readKovanContracts,'NFTINK',"totalInks",1777);

  let displayBalance
  if(nftyBalance) {
    displayBalance = nftyBalance.toString()
  }
  let displayInksCreated
  if(inksCreatedBy) {
    displayInksCreated = inksCreatedBy.toString()
  }
  let displayTotalInks
  if(totalInks) {
    displayTotalInks = totalInks.toString()
  }

  const showInk = ((newIpfsHash) => {
    console.log(newIpfsHash)
    if(newIpfsHash === ipfsHash) {
      setTab('2')
    } else {
    window.history.pushState({id: newIpfsHash}, newIpfsHash, '/' + newIpfsHash)
    setDrawing()
    setInk({})
    setIpfsHash(newIpfsHash)
    setMode('mint')
    setTab('2')
    setCanvasKey(Date.now())
    return false
  }
  })

  const newInk = (() => {
    window.history.pushState({id: 'draw'}, 'draw', '/')
    setMode("edit")
    setDrawing("")
    setIpfsHash()
    setInk({})
    setTab("2")
    setCanvasKey(Date.now())
  })

  const badgeStyle = {
    backgroundColor: "#fff",
    color: "#999",
    boxShadow:"0 0 0 1px #d9d9d9 inset",
  }

  useEffect(() => {
    const loadPage = async () => {

      console.log(process.env.REACT_APP_NETWORK_NAME)

      let ipfsHashRequest = window.location.pathname.replace("/", "")
      if (ipfsHashRequest && isIPFS.multihash(ipfsHashRequest)) {
        setMode("mint")
        setDrawing("")
        setTab("2")
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
      relayHubAddress = "0x2E0d94754b348D208D64d52d78BcD443aFA9fa52"
      stakeManagerAddress = "0x0ecf783407C5C80D71CFEa37938C0b60BD255FF8"
      paymasterAddress = "0x38489512d064106f5A7AD3d9e13268Aaf777A41c"

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
    gsnConfig.chainId = 42//31337
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

  let newButton
  if (true/*mode!=="edit" /*|| tab!=="1"*/) {
  newButton = (
  <div style={{ position: 'fixed', textAlign: 'right', right: 0, bottom: 20, padding: 10 }}>
  <Button style={{ marginRight: 8 }} shape="round" size="large" type="primary" onClick={() => {newInk()
  }}><PlusOutlined /> New Ink</Button>
  </div>
)}
  else {newButton = (<></>)}

  let inkInfo

  if (mode === "edit") {
  inkInfo = (<></>)

  } else if (mode === "mint") {

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
    />)
  }

          return (
            <div>
              <div style={{position:"absolute",right:8,top:0}}>
              <Account
                  address={props.address}
                  setAddress={props.setAddress}
                  localProvider={props.localProvider}
                  injectedProvider={props.injectedProvider}
                  setInjectedProvider={props.setInjectedProvider}
                  mainnetProvider={props.mainnetProvider}
                  price={props.price}
                  minimized={props.minimized}
              />

              </div>
              <Tabs activeKey={tab} onChange={setTab} style={{marginTop:32,padding:16,textAlign:"center"}} tabBarExtraContent={""} defaultActiveKey="1">
                <TabPane defaultActiveKey="1" tab={<><span style={{fontSize:24,padding:8}}>🧑‍🎨 Nifty Ink</span><Badge style={badgeStyle} count={displayTotalInks} showZero/></>} key="1">
                <div style={{maxWidth:500,margin:"0 auto"}}>
                  <Button style={{ marginBottom: 8 }} shape="round" size="large" type="primary" onClick={() => {newInk()
                  }}><PlusOutlined /> New Ink</Button>
                  <AllNiftyInks
                    mainnetProvider={props.mainnetProvider}
                    localProvider={props.kovanProvider}
                    readContracts={props.readKovanContracts}
                    tab={tab}
                    showInk={showInk}
                    ipfsConfig={ipfsConfig}
                    totalInks={totalInks}
                    thisTab={"1"}
                  />
                  {/*<Contract
                  provider={props.injectedProvider}
                  name={"Liker"}
                  price={props.price}
                  />*/}
                </div>
                </TabPane>
                <TabPane tab={<><span><span style={{padding:8}}>🖌️</span>create</span></>} key="2">
                  <div>
                    <InkCanvas
                      canvasKey={canvasKey}
                      address={props.address}
                      mainnetProvider={props.mainnetProvider}
                      injectedProvider={props.injectedProvider}
                      metaProvider={props.metaProvider}
                      readContracts={props.readKovanContracts}
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
                    />
                    {inkInfo}
                  </div>
                </TabPane>
                <TabPane tab={<><span><span style={{padding:8}}>🖼</span> inks</span> <Badge style={badgeStyle} count={displayInksCreated} showZero/></>} key="3">
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
                      thisTab={"3"}
                      newInk={newInk}
                    />
                  </div>
                </TabPane>
                <TabPane tab={<><span><span style={{padding:8}}>👛</span> holdings</span> <Badge style={badgeStyle} count={displayBalance} showZero/></>} key="4">
                  <div style={{maxWidth:300,margin:"0 auto"}}>
                    <MyNiftyHoldings
                      address={props.address}
                      mainnetProvider={props.mainnetProvider}
                      injectedProvider={props.injectedProvider}
                      readContracts={props.readContracts}
                      tab={tab}
                      showInk={showInk}
                      ipfsConfig={ipfsConfig}
                      nftyBalance={nftyBalance}
                      thisTab={"4"}
                    />
                  </div>
                </TabPane>
              </Tabs>


              {newButton}
            </div>
          );

        }
