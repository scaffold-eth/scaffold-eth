import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Modal, Button, List, Popover, Badge, Avatar, Empty, Tabs, Typography } from 'antd';
import { LoadingOutlined, PlusOutlined, SendOutlined } from '@ant-design/icons';
import { useContractReader, useLocalStorage, useEventListener } from "./hooks"
import { Account } from "./components"
import { getFromIPFS } from "./helpers"
import SendInkForm from "./SendInkForm.js"
import InkCanvas from "./InkCanvas.js"
import InkInfo from "./InkInfo.js"
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
const { TabPane } = Tabs;

const useStyles = makeStyles((theme) => ({
  gridList: {
    width: "95vw"
  },
  titleBar: {
  background:
    'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
    'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
},
}));

const ipfsConfig = { host: 'ipfs.infura.io', port: '5001', protocol: 'https' }

export default function NftyWallet(props) {

  const [tab, setTab] = useState("1")

  const [mode, setMode] = useState("edit")

  const [drawing, setDrawing] = useLocalStorage("drawing")
  const [ipfsHash, setIpfsHash] = useState()
  const [ink, setInk] = useState({})
  const [formLimit, setFormLimit] = useState(false);

  const [sends, setSends] = useState(0)
  let tokens
  let inks
  let showcase
  const [tokenData, setTokenData] = useState()
  const [inkData, setInkData] = useState()
  const [allInks, setAllInks] = useState()

  let tokenView
  let inkView
  let allInkView

  let nftyBalance
  nftyBalance = useContractReader(props.readContracts,'NFTINK',"balanceOf",[props.address],1777);
  let inksCreatedBy
  inksCreatedBy = useContractReader(props.readContracts,'NFTINK',"inksCreatedBy",[props.address],1777);
  let totalInks
  totalInks = useContractReader(props.readContracts,'NFTINK',"totalInks",1777);
  let inkCreations = useEventListener(props.readContracts,'NFTINK',"newInk",props.localProvider, 1)

  let displayBalance
  if(nftyBalance) {
    displayBalance = nftyBalance.toString()
  }
  let displayInksCreated
  if(inksCreatedBy) {
    displayInksCreated = inksCreatedBy.toString()
  }

  const classes = useStyles();

  const getImageWidth = () => {
    if(window.document.body.clientWidth / 9 < 120) {
      return 120
    }
    return window.document.body.clientWidth / 9
  }

  const showInk = ((newIpfsHash) => {
    console.log(newIpfsHash)
    window.history.pushState({id: newIpfsHash}, newIpfsHash, '/' + newIpfsHash)
    setIpfsHash(newIpfsHash)
    setDrawing()
    setInk({})
    setMode('mint')
    setTab('1')
    return false
  })

  useEffect(()=>{

      if(props.readContracts && props.address) {

        const loadTokens = async () => {
          nftyBalance = await props.readContracts['NFTINK']["balanceOf"](props.address)
          tokens = new Array(nftyBalance)
          //console.log(tokens)

          const getTokenInfo = async (i) => {
            let tokenId = await props.readContracts['NFTINK']["tokenOfOwnerByIndex"](props.address, i)
            let jsonUrl = await props.readContracts['NFTINK']["tokenURI"](tokenId)

            let parts = jsonUrl.split('/');
            let ipfsHash = parts.pop();

            const jsonContent = await getFromIPFS(ipfsHash, ipfsConfig)
            const inkJson = JSON.parse(jsonContent)
            const urlArray = window.location.href.split("/");
            const linkUrl = inkJson['drawing']//urlArray[0] + "//" + urlArray[2] + "/" + inkJson['drawing']
            const inkImageHash = inkJson.image.split('/').pop()
            const imageContent = await getFromIPFS(inkImageHash, ipfsConfig)
            const inkImageURI = 'data:image/png;base64,' + imageContent.toString('base64')

            return {tokenId: tokenId.toString(), jsonUrl: jsonUrl, url: linkUrl, name: inkJson['name'], image: inkImageURI}
          }

          for(var i = 0; i < nftyBalance; i++){
            let tokenInfo = await getTokenInfo(i)
            tokens[i] = tokenInfo
          }

          setTokenData(tokens.reverse())
        }

        const loadInks = async () => {
          inksCreatedBy = await props.readContracts['NFTINK']["inksCreatedBy"](props.address)
          inks = new Array(inksCreatedBy)

          const getInkInfo = async (i) => {
            let inkId = await props.readContracts['NFTINK']["inkOfArtistByIndex"](props.address, i)
            let inkInfo = await props.readContracts['NFTINK']["inkInfoById"](inkId)

            let ipfsHash = inkInfo[0]

            const jsonContent = await getFromIPFS(ipfsHash, ipfsConfig)
            const inkJson = JSON.parse(jsonContent)
            const urlArray = window.location.href.split("/");
            const linkUrl = inkJson['drawing']// urlArray[0] + "//" + urlArray[2] + "/" + inkJson['drawing']
            const inkImageHash = inkJson.image.split('/').pop()
            const imageContent = await getFromIPFS(inkImageHash, ipfsConfig)
            const inkImageURI = 'data:image/png;base64,' + imageContent.toString('base64')

            return {inkId: inkId.toString(), inkCount: inkInfo[2], url: linkUrl, name: inkJson['name'], limit: inkJson['attributes'][0]['value'], image: inkImageURI}
          }

          for(var i = 0; i < inksCreatedBy; i++){
            let inkInfo = await getInkInfo(i)
            inks[i] = inkInfo
          }

          setInkData(inks.reverse())
        }

        const getInkImages = async (e) => {
          const jsonContent = await getFromIPFS(e['jsonUrl'], ipfsConfig)
          const inkJson = JSON.parse(jsonContent)
          const inkImageHash = inkJson.image.split('/').pop()
          const imageContent = await getFromIPFS(inkImageHash, ipfsConfig)
          const inkImageURI = 'data:image/png;base64,' + imageContent.toString('base64')
          return Object.assign({image: inkImageURI, name: inkJson.name, url: inkJson.drawing}, e);
        }

        const loadStream = async (e) => {
          if(inkCreations) {
            const newInkCreations = await Promise.all(inkCreations.map(getInkImages))
            setAllInks(newInkCreations.reverse())
          }
        }

        loadTokens()
        loadInks()
        loadStream()

      }

  },[sends,props.readContracts,props.address,tab])



  const badgeStyle = {
    backgroundColor: "#fff",
    color: "#999",
    boxShadow:"0 0 0 1px #d9d9d9 inset",
  }

  const newButton = (
  <div style={{ position: 'fixed', textAlign: 'right', right: 0, bottom: 20, padding: 10 }}>
  <Button style={{ marginRight: 8 }} shape="round" size="large" type="primary" onClick={() => {
    window.history.pushState({id: 'draw'}, 'draw', '/')
    setMode("edit")
    setDrawing("")
    setIpfsHash()
    setFormLimit(false)
    setInk({})
    setTab("1")
    //window.location = "/" // something is wrong with rendering so this is a hack for now
  }}><PlusOutlined /> New Ink</Button>
  </div>
  )

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

  if(nftyBalance > 0) {
    tokenView = (
      <List
      itemLayout="horizontal"
      dataSource={tokenData}
      renderItem={item => (
        <List.Item>
        <List.Item.Meta
        avatar={item['image']?<a><img src={item['image']} onClick={() => showInk(item['url'])} alt={item['name']} height="50" width="50"/></a>:<Avatar icon={<LoadingOutlined />} />}
        title={(
          <div style={{marginTop:8}}>

            <Typography.Text  copyable={{ text: item['url']}} style={{fontSize:24,verticalAlign:"middle"}}>
            <a style={{color:"#222222"}} href="#" onClick={() => showInk(item['url'])} >
            {item['name'] /*+ ": Token #" + item['tokenId']*/}
            </a>
            </Typography.Text>

            <Popover content={
              <SendInkForm tokenId={item['tokenId']} address={props.address} mainnetProvider={props.mainnetProvider} injectedProvider={props.injectedProvider} sends={sends} setSends={setSends}/>
            }
            title="Send Ink" trigger="click">
            <a href="#"><SendOutlined style={{fontSize:24,marginLeft:4,verticalAlign:"middle"}}/></a>
            </Popover>

          </div>
        )}
        description={""}
        />
        </List.Item>
      )}
      />)
    } else { tokenView = (<Empty
      description={
        <span>
        You don't have any inks :(
          </span>
        }
        />
      )}

      if(inksCreatedBy > 0 && inkData) {
        try{
          inkView = (
            <List
            itemLayout="horizontal"
            dataSource={inkData}
            renderItem={item => (
              <List.Item>
              <List.Item.Meta
              avatar={item['image']?<a><img src={item['image']} onClick={() => showInk(item['url'])} alt={item['name']} height="50" width="50"/></a>:<Avatar icon={<LoadingOutlined />} />}
              title={<a href={item['url']}>{item['name'] /*+ ": Ink #" + item['inkId']*/}</a>}
              description={(item['inkCount']?item['inkCount'].toString():'') + (item['limit']>0?'/' + item['limit']:'') + ' minted'}
              />
              </List.Item>
            )}
            />)
        }catch(e){
          console.log(e)
        }

        } else { inkView = (<Empty
          description={
            <span>
              <a href="/"><span style={{paddingRight:8}}>🖌</span>Create a Nifty Ink!</a>
              </span>
            }
            />
          )}

       if(allInks) {
         allInkView = (
      <GridList cellHeight={"auto"} className={classes.gridList} cols={0}>
        {allInks.map((item) => (
          <a onClick={() => showInk(item['url'])}><GridListTile key={item.image} cols={1}>
            {item['image']?<a><img src={item['image']} alt={item['name']} height={getImageWidth()} width={getImageWidth()}/></a>:<Avatar icon={<LoadingOutlined />} />}
            <GridListTileBar className={classes.titleBar} titlePosition="top"
                title={item.name}
                subtitle={<span>{item.limit.toString()=="0"?'unlimited':item.limit.toString()}</span>}
              />
          </GridListTile></a>
        ))}
      </GridList>)
       }

          /*return (
            <>
            <Button type="primary" onClick={showModal} size={"large"}>
            My Inks
            </Button>
            <Modal

            onOk={handleOk}
            onCancel={handleCancel}
            >
            <Tabs defaultActiveKey="1">
            <TabPane tab={<><span>My wallet</span> <Badge count={displayBalance} showZero/></>} key="1">
            {tokenView}
            </TabPane>
            <TabPane tab={<><span>My creations</span> <Badge count={displayInksCreated} showZero/></>} key="2">
            {inkView}
            </TabPane>
            </Tabs>
            </Modal>
            </>
          );*/

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
                  setMetaProvider={props.setMetaProvider}
                  metaProvider={props.metaProvider}
                  gsnConfig={props.gsnConfig}
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
                    {tokenView}
                  </div>
                </TabPane>
                <TabPane tab={<><span><span style={{padding:8}}>🖼</span> inks</span> <Badge style={badgeStyle} count={displayInksCreated} showZero/></>} key="3">
                  <div style={{maxWidth:500,margin:"0 auto"}}>
                    {inkView}
                  </div>
                </TabPane>
                <TabPane tab={<><span><span style={{padding:8}}>🎥</span> stream</span></>} key="4">
                  <div style={{margin:"0 auto"}}>
                    {allInkView}
                  </div>
                </TabPane>
              </Tabs>


              {newButton}
            </div>
          );

        }
