import React, { useState, useEffect } from 'react'
import { List, Popover, Avatar, Spin, Typography, Empty, Button } from 'antd';
import { LoadingOutlined, SendOutlined, RocketOutlined } from '@ant-design/icons';
import { getFromIPFS } from "./helpers"
import SendInkForm from "./SendInkForm.js"
import UpgradeInkButton from "./UpgradeInkButton.js"
import { Loader } from "./components"

export default function MyNiftyHoldings(props) {

  const [tokenData, setTokenData] = useState()
  const [lastBalance, setLastBalance] = useState()
  const [lastMainBalance, setLastMainBalance] = useState()

  let tokenView

  useEffect(()=>{

    if(props.readContracts && props.readKovanContracts && props.address && props.tab === props.thisTab && (props.nftyBalance.toString() !== lastBalance) || props.nftyMainBalance.toString() !== lastMainBalance) {

      let tokens
      setLastBalance(props.nftyBalance.toString())
      setLastMainBalance(props.nftyMainBalance.toString())

      const loadTokens = async () => {
        tokens = []//new Array(props.nftyBalance + props.nftyMainBalance).fill({})

        const getTokenInfo = async (i, chain) => {
          let tokenId
          let jsonUrl
          if(chain === 'main') {
            tokenId = await props.readContracts['NiftyMain']["tokenOfOwnerByIndex"](props.address, i)
            jsonUrl = await props.readContracts['NiftyMain']["tokenURI"](tokenId)
          } if(chain === 'lower') {

            console.log("props:", props)

            tokenId = await props.readKovanContracts['NiftyToken']["tokenOfOwnerByIndex"](props.address, i)
            jsonUrl = await props.readKovanContracts['NiftyToken']["tokenURI"](tokenId)
          }

          let parts = jsonUrl.split('/');
          let ipfsHash = parts.pop();

          let jsonContent
          try{
            jsonContent = await getFromIPFS(ipfsHash, props.ipfsConfig)
          }catch(e){}
          if(jsonContent){
            const inkJson = JSON.parse(jsonContent)
            const linkUrl = inkJson['drawing']
            const inkImageHash = inkJson.image.split('/').pop()
            const imageContent = await getFromIPFS(inkImageHash, props.ipfsConfig)
            const inkImageURI = 'data:image/png;base64,' + imageContent.toString('base64')

            return {tokenId: tokenId.toString(), jsonUrl: jsonUrl, url: linkUrl, name: inkJson['name'], image: inkImageURI, chain: chain}
          }
          return {}
        }

        for(var i = 0; i < props.nftyBalance; i++){
          let tokenInfo = await getTokenInfo(i,'lower')
          tokens.push(tokenInfo)
        }

        for(var i = 0; i < props.nftyMainBalance; i++){
          let tokenInfo = await getTokenInfo(i,'main')
          tokens.push(tokenInfo)
        }

        setTokenData(tokens.reverse())
      }

      loadTokens()

    }

  },[props.nftyBalance,props.nftyMainBalance,props.address,props.tab])

  if(props.nftyBalance > 0 || props.nftyMainBalance > 0) {
    if (tokenData) {
    tokenView = (
      <List
      itemLayout="horizontal"
      dataSource={tokenData}
      renderItem={(item) => {
        if(!item || !item.name) return (<></>)
        else{
          return (
            <List.Item>
            <List.Item.Meta
            avatar={item['image']?<a><img src={item['image']} onClick={() => props.showInk(item['url'])} alt={item['name']} height="50" width="50"/></a>:<Avatar icon={<LoadingOutlined />} />}
            title={(
              <div style={{marginTop:-4}}>

              <Typography.Text  copyable={{ text: "https://nifty.ink/"+item['url']}} style={{fontSize:24,verticalAlign:"middle"}}>
              <a style={{color:"#222222"}} href="#" onClick={() => props.showInk(item['url'])} >
              {item['name'] /*+ ": Token #" + item['tokenId']*/}
              </a>
              </Typography.Text>


              {item['chain']==='main'?
              <Button type="primary" style={{ margin:8, background: "#722ed1", borderColor: "#722ed1"  }} onClick={()=>{
                console.log("item",item)
                window.open("https://opensea.io/assets/0xc02697c417ddacfbe5edbf23edad956bc883f4fb/"+item['tokenId'])
              }}>
               <RocketOutlined />  View on OpenSea
              </Button>
              :
              <span style={{marginBottom:-4}}>
              <Popover content={
                <SendInkForm tokenId={item['tokenId']} address={props.address} mainnetProvider={props.mainnetProvider} injectedProvider={props.injectedProvider} transactionConfig={props.transactionConfig}/>
              }
              title="Send Ink">
                <Button type="secondary" style={{margin:4}}><SendOutlined/> Send</Button>
              </Popover>
              <UpgradeInkButton
                tokenId={item['tokenId']}
                injectedProvider={props.injectedProvider}
                gasPrice={props.gasPrice}
                upgradePrice={props.upgradePrice}
                transactionConfig={props.transactionConfig}
              />
              </span>
             }

              </div>
            )}
            />
            </List.Item>
          )
        }
      }}
      />)
    }
      else {
        tokenView = <Loader/>
      }
    }
    else { tokenView = (<Loader/>)}

    return tokenView

  }
