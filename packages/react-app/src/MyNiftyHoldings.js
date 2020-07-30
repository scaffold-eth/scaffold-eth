import React, { useState, useEffect } from 'react'
import { List, Popover, Avatar, Spin, Typography, Empty } from 'antd';
import { LoadingOutlined, SendOutlined, StarTwoTone } from '@ant-design/icons';
import { getFromIPFS } from "./helpers"
import SendInkForm from "./SendInkForm.js"
import UpgradeInkButton from "./UpgradeInkButton.js"

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
            tokenId = await props.readKovanContracts['NiftyToken']["tokenOfOwnerByIndex"](props.address, i)
            jsonUrl = await props.readKovanContracts['NiftyToken']["tokenURI"](tokenId)
          }

          let parts = jsonUrl.split('/');
          let ipfsHash = parts.pop();

          const jsonContent = await getFromIPFS(ipfsHash, props.ipfsConfig)
          const inkJson = JSON.parse(jsonContent)
          const linkUrl = inkJson['drawing']
          const inkImageHash = inkJson.image.split('/').pop()
          const imageContent = await getFromIPFS(inkImageHash, props.ipfsConfig)
          const inkImageURI = 'data:image/png;base64,' + imageContent.toString('base64')

          return {tokenId: tokenId.toString(), jsonUrl: jsonUrl, url: linkUrl, name: inkJson['name'], image: inkImageURI, chain: chain}
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
      renderItem={item => (
        <List.Item>
        <List.Item.Meta
        avatar={item['image']?<a><img src={item['image']} onClick={() => props.showInk(item['url'])} alt={item['name']} height="50" width="50"/></a>:<Avatar icon={<LoadingOutlined />} />}
        title={(
          <div style={{marginTop:8}}>

          <Typography.Text  copyable={{ text: item['url']}} style={{fontSize:24,verticalAlign:"middle"}}>
          <a style={{color:"#222222"}} href="#" onClick={() => props.showInk(item['url'])} >
          {item['name'] /*+ ": Token #" + item['tokenId']*/}
          </a>
          </Typography.Text>

          {item['chain']==='main'?'':
          <>
          <Popover content={
            <SendInkForm tokenId={item['tokenId']} address={props.address} mainnetProvider={props.mainnetProvider} injectedProvider={props.injectedProvider}/>
          }
          title="Send Ink">
          <a href="#"><SendOutlined style={{fontSize:24,marginLeft:4,verticalAlign:"middle"}}/></a>
          </Popover>
          <UpgradeInkButton
            tokenId={item['tokenId']}
            injectedProvider={props.injectedProvider}
            gasPrice={props.gasPrice}
          />
          </>
         }

          </div>
        )}
        description={item['chain']==='main'?<Typography level={4}>{"Upgraded to "+process.env.REACT_APP_NETWORK_NAME}<StarTwoTone /></Typography>:''}
        />
        </List.Item>
      )}
      />)
    }
      else {
        tokenView = <Spin/>
      }
    }
    else { tokenView = (
      <Empty
        description={
        <span>
          You don't own any Ink NFTs yet. Click "Create" to create a new Ink!
          </span>
        }
        />)}

    return tokenView

  }
