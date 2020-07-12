import React, { useState } from 'react'
import { Button, Badge, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useContractReader, useLocalStorage } from "./hooks"
import { Account } from "./components"
import InkCanvas from "./InkCanvas.js"
import InkInfo from "./InkInfo.js"
import MyNiftyHoldings from "./MyNiftyHoldings.js"
import MyNiftyInks from "./MyNiftyInks.js"
import AllNiftyInks from "./AllNiftyInks.js"
const { TabPane } = Tabs;

const ipfsConfig = { host: 'ipfs.infura.io', port: '5001', protocol: 'https' }

export default function NftyWallet(props) {

  const [tab, setTab] = useState("1")

  const [mode, setMode] = useState("edit")

  const [drawing, setDrawing] = useLocalStorage("drawing")
  const [ipfsHash, setIpfsHash] = useState()
  const [ink, setInk] = useState({})
  const [formLimit, setFormLimit] = useState(false);

  const [sends, setSends] = useState(0)

  let nftyBalance = useContractReader(props.readContracts,'NFTINK',"balanceOf",[props.address],1777);
  let inksCreatedBy = useContractReader(props.readContracts,'NFTINK',"inksCreatedBy",[props.address],1777);
  let totalInks = useContractReader(props.readContracts,'NFTINK',"totalInks",1777);

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
      setTab('1')
    } else {
    window.history.pushState({id: newIpfsHash}, newIpfsHash, '/' + newIpfsHash)
    setIpfsHash(newIpfsHash)
    setDrawing()
    setInk({})
    setMode('mint')
    setTab('1')
    return false
  }
  })



  const badgeStyle = {
    backgroundColor: "#fff",
    color: "#999",
    boxShadow:"0 0 0 1px #d9d9d9 inset",
  }

  let newButton
  if (mode!=="edit" || tab!=="1") {
  newButton = (
  <div style={{ position: 'fixed', textAlign: 'right', right: 0, bottom: 20, padding: 10 }}>
  <Button style={{ marginRight: 8 }} shape="round" size="large" type="primary" onClick={() => {
    window.history.pushState({id: 'draw'}, 'draw', '/')
    setMode("edit")
    setDrawing("")
    setIpfsHash()
    setFormLimit(false)
    setInk({})
    setTab("1")
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
      injectedProvider={props.injectedProvider}
      readContracts={props.readContracts}
      ink={ink}
      setInk={setInk}
      ipfsHash={ipfsHash}
      ipfsConfig={ipfsConfig}
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
                  //setMetaProvider={props.setMetaProvider}
                  //metaProvider={props.metaProvider}
                  //gsnConfig={props.gsnConfig}
              />

              </div>
              <Tabs activeKey={tab} onChange={setTab} style={{marginTop:32,padding:16,textAlign:"left"}} tabBarExtraContent={""} defaultActiveKey="1">
                <TabPane defaultActiveKey="1" tab={<><span style={{fontSize:24}}>🧑‍🎨 Nifty Ink</span></>} key="1">
                  <div>
                    <InkCanvas
                      address={props.address}
                      mainnetProvider={props.mainnetProvider}
                      injectedProvider={props.injectedProvider}
                      readContracts={props.readContracts}
                      mode={mode}
                      ink={ink}
                      ipfsHash={ipfsHash}
                      setMode={setMode}
                      setIpfsHash={setIpfsHash}
                      setInk={setInk}
                      drawing={drawing}
                      setDrawing={setDrawing}
                      formLimit={formLimit}
                      setFormLimit={setFormLimit}
                      ipfsConfig={ipfsConfig}
                      metaProvider={props.metaProvider}
                    />
                    {inkInfo}
                  </div>
                </TabPane>
                <TabPane tab={<><span><span style={{padding:8}}>👛</span> holdings</span> <Badge style={badgeStyle} count={displayBalance} showZero/></>} key="2">
                  <div style={{maxWidth:500,margin:"0 auto"}}>
                    <MyNiftyHoldings
                      address={props.address}
                      mainnetProvider={props.mainnetProvider}
                      injectedProvider={props.injectedProvider}
                      readContracts={props.readContracts}
                      sends={sends}
                      tab={tab}
                      showInk={showInk}
                      ipfsConfig={ipfsConfig}
                      nftyBalance={nftyBalance}
                    />
                  </div>
                </TabPane>
                <TabPane tab={<><span><span style={{padding:8}}>🖼</span> inks</span> <Badge style={badgeStyle} count={displayInksCreated} showZero/></>} key="3">
                  <div style={{maxWidth:500,margin:"0 auto"}}>
                    <MyNiftyInks
                      address={props.address}
                      mainnetProvider={props.mainnetProvider}
                      injectedProvider={props.injectedProvider}
                      readContracts={props.readContracts}
                      tab={tab}
                      showInk={showInk}
                      ipfsConfig={ipfsConfig}
                      inksCreatedBy={inksCreatedBy}
                    />
                  </div>
                </TabPane>
                <TabPane tab={<><span><span style={{padding:8}}>🎥</span> stream</span> <Badge style={badgeStyle} count={displayTotalInks} showZero/></>} key="4">
                  <AllNiftyInks
                    mainnetProvider={props.mainnetProvider}
                    injectedProvider={props.injectedProvider}
                    localProvider={props.localProvider}
                    readContracts={props.readContracts}
                    tab={tab}
                    showInk={showInk}
                    ipfsConfig={ipfsConfig}
                  />
                </TabPane>
              </Tabs>


              {newButton}
            </div>
          );

        }
