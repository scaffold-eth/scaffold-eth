import React, { useState, useEffect } from 'react'
import { List, Avatar, Empty, Spin, Typography, Row, Badge, Col, Space } from 'antd';
import { LoadingOutlined, LikeTwoTone } from '@ant-design/icons';
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
            let inkId = await props.readKovanContracts['NiftyInk']["inkOfArtistByIndex"](props.address, i)
            let inkInfo = await props.readKovanContracts['NiftyInk']["inkInfoById"](inkId)
            console.log(inkInfo)
            let inkCount = await props.readKovanContracts['NiftyToken']["inkTokenCount"](inkInfo[6])

            let likes

            if (props.readKovanContracts['Liker']) {
              let niftyAddress = props.readKovanContracts['NiftyInk']['address']
              likes = await props.readKovanContracts['Liker']['getLikesByTarget'](niftyAddress, inkId)
            }

            let jsonIpfsHash = inkInfo[2]

            console.log(jsonIpfsHash)

            const jsonContent = await getFromIPFS(jsonIpfsHash, props.ipfsConfig)
            const inkJson = JSON.parse(jsonContent)
            const linkUrl = inkJson['drawing']
            const inkImageHash = inkJson.image.split('/').pop()
            const imageContent = await getFromIPFS(inkImageHash, props.ipfsConfig)
            const inkImageURI = 'data:image/png;base64,' + imageContent.toString('base64')

            return {inkId: inkId.toString(), inkCount: inkCount, url: linkUrl, name: inkJson['name'], limit: inkJson['attributes'][0]['value'], image: inkImageURI, likes: likes.toString()}
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

      if(props.inksCreatedBy > 0 && inkData && inkData[0]) {



        try{

          inkView = (
            <List
            itemLayout="horizontal"
            dataSource={inkData}
            renderItem={item => (
                <List.Item>
                <List.Item.Meta
                avatar={item['image']?<a><Badge style={{ backgroundColor: '#2db7f5' }} count={item['likes']}><img src={item['image']} onClick={() => props.showInk(item['url'])} alt={item['name']} height="50" width="50"/></Badge></a>:<Avatar icon={<LoadingOutlined />} />}
                title={<a href="#" onClick={() => props.showInk(item['url'])} >{<span>{item['name']}</span>}</a>}
                description={<Row style={{justifyContent: 'center'}}>{<><Typography>{item['inkCount'].toNumber()+" of " + (item['limit']>0?item['limit'] + ' minted':'unlimited copies')}</Typography></>}
                      </Row>
                      }
                />
                </List.Item>
              )
            }
          />)
        }catch(e){
          console.log(e)
        }

      } else if(props.inksCreatedBy && props.inksCreatedBy.toString() === "0") { inkView = (<Empty
          description={
            <span>
              Click "Create" to create a new ink!
              </span>
            }
            />
          )}
        else {
          inkView = (<Spin/>)
        }


          return inkView

        }
