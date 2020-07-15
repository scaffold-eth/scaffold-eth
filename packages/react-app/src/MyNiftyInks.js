import React, { useState, useEffect } from 'react'
import { List, Avatar, Empty, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { getFromIPFS } from "./helpers"

export default function MyNiftyInks(props) {

  const [inkData, setInkData] = useState()
  let inkView

  useEffect(()=>{

      if(props.readContracts && props.address && props.tab === props.thisTab) {

        let inks

        const loadInks = async () => {
          inks = new Array(props.inksCreatedBy)

          const getInkInfo = async (i) => {
            let inkId = await props.readContracts['NFTINK']["inkOfArtistByIndex"](props.address, i)
            let inkInfo = await props.readContracts['NFTINK']["inkInfoById"](inkId)

            let ipfsHash = inkInfo[0]

            const jsonContent = await getFromIPFS(ipfsHash, props.ipfsConfig)
            const inkJson = JSON.parse(jsonContent)
            const linkUrl = inkJson['drawing']
            const inkImageHash = inkJson.image.split('/').pop()
            const imageContent = await getFromIPFS(inkImageHash, props.ipfsConfig)
            const inkImageURI = 'data:image/png;base64,' + imageContent.toString('base64')

            return {inkId: inkId.toString(), inkCount: inkInfo[2], url: linkUrl, name: inkJson['name'], limit: inkJson['attributes'][0]['value'], image: inkImageURI}
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
              description={(item['inkCount']?item['inkCount'].toString():'') + (item['limit']>0?'/' + item['limit']:'') + ' minted'}
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
