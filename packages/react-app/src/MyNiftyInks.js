import React, { useState, useEffect } from 'react'
import { List, Avatar, Empty, Spin, Typography, Row } from 'antd';
import { LoadingOutlined, StarTwoTone } from '@ant-design/icons';
import { getFromIPFS } from "./helpers"

export default function MyNiftyInks(props) {

  const [inkData, setInkData] = useState()
  let inkView

  useEffect(()=>{

      if(props.readContracts && props.address && props.tab === props.thisTab) {

        setInkData()
        let inks

        const loadInks = async () => {
          inks = new Array(props.inksCreatedBy)

          const getInkInfo = async (i) => {
            let inkId = await props.readKovanContracts['NFTINK']["inkOfArtistByIndex"](props.address, i)
            let inkInfo = await props.readKovanContracts['NFTINK']["inkInfoById"](inkId)
            let mainChainId = await props.readContracts['NFTINK']["inkIdByUrl"](inkInfo[3])

            let jsonIpfsHash = inkInfo[0]

            const jsonContent = await getFromIPFS(jsonIpfsHash, props.ipfsConfig)
            const inkJson = JSON.parse(jsonContent)
            const linkUrl = inkJson['drawing']
            const inkImageHash = inkJson.image.split('/').pop()
            const imageContent = await getFromIPFS(inkImageHash, props.ipfsConfig)
            const inkImageURI = 'data:image/png;base64,' + imageContent.toString('base64')

            return {inkId: inkId.toString(), inkCount: inkInfo[2], url: linkUrl, name: inkJson['name'], limit: inkJson['attributes'][0]['value'], image: inkImageURI, mainChainId: mainChainId}
          }

          for(var i = 0; i < props.inksCreatedBy; i++){
            let inkInfo = await getInkInfo(i)
            inks[i] = inkInfo
          }

          setInkData(inks.reverse())
        }

        loadInks()

      }

  },[props.address,props.tab])


      if(props.inksCreatedBy > 0 && inkData) {
        try{
          inkView = (
            <List
            itemLayout="horizontal"
            dataSource={inkData}
            renderItem={item => (
              <List.Item>
              <List.Item.Meta
              avatar={item['image']?<a><img src={item['image']} onClick={() => props.showInk(item['url'])} alt={item['name']} height="50" width="50"/></a>:<Avatar icon={<LoadingOutlined />} />}
              title={<a href="#" onClick={() => props.showInk(item['url'])} >{item['name'] /*+ ": Ink #" + item['inkId']*/}</a>}
              description={(item['mainChainId'].toString() !== "0"?<Row style={{justifyContent: 'center'}}><StarTwoTone/><Typography>{"Upgraded ink: " + (item['limit']>0?item['limit'] + ' copies':'unlimited copies')}</Typography><StarTwoTone/></Row>:'Ink not upgraded')}
              />
              </List.Item>
            )}
            />)
        }catch(e){
          console.log(e)
        }

      } else if(props.inksCreatedBy.toString() === "0") { inkView = (<Empty
          description={
            <span>
              <a href="" onClick={() => {props.newInk()}}><span style={{paddingRight:8}}>🖌</span>Create a Nifty Ink!</a>
              </span>
            }
            />
          )}
        else {
          inkView = (<Spin/>)
        }


          return inkView

        }
