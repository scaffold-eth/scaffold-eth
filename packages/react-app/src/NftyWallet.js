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

  let accountDisplay = (
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
  )

  let accountWithCreateButton = (
    <div style={{ position: 'fixed', textAlign: 'right', right: 0, bottom: 20, padding: 10 }}>
      <Row gutter={16} verticalAlign={"middle"}>
        <Col>
        <Button style={{ marginRight: 8, marginTop:8 }} shape="round" size="large" type="secondary" onClick={() => {newInk()
      }}><span style={{marginRight:12}}>🖌</span> New Ink</Button>
        </Col>
        <Col>
          {accountDisplay}
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
                    localProvider={props.kovanProvider}
                    readContracts={props.readKovanContracts}
                    tab={tab}
                    showInk={showInk}
                    ipfsConfig={ipfsConfig}
                    totalInks={totalInks}
                    thisTab={"1"}
                  />
                  {process.env.REACT_APP_NETWORK_NAME?"":(<Contract
                  provider={props.injectedProvider}
                  name={"ValidSignatureTester"}
                  price={props.price}
                  />)}
                  {process.env.REACT_APP_NETWORK_NAME?"":(<Contract
                  provider={props.injectedProvider}
                  name={"NFTINK"}
                  price={props.price}
                  />)}
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
                      tab={tab}
                      showInk={showInk}
                      ipfsConfig={ipfsConfig}
                      nftyBalance={nftyBalance}
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
