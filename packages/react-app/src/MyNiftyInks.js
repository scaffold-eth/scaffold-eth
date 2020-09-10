import React, { useState, useEffect } from 'react'
import { List, Avatar, Empty, Spin, Typography, Row, Badge, Col, Space, Button, Form, Popover } from 'antd';
import { LoadingOutlined, LikeTwoTone, SearchOutlined, ShareAltOutlined } from '@ant-design/icons';
import { getFromIPFS } from "./helpers"
import { AddressInput, Address, Loader } from "./components"


export default function MyNiftyInks(props) {

  const [lastBalance, setLastBalance] = useState()
  const [lastArtist, setLastArtist] = useState()
  const [inkData, setInkData] = useState()
  let inkView
  let [inkCounter, setInkCounter] = useState()

  useEffect(()=>{
      let inksToDisplay

      if(!props.artist) {
        props.setArtist(props.address)
      }

      console.log(props.artist)

      if(props.readContracts && props.artist && props.tab === props.thisTab && (lastBalance !== inkCounter || lastArtist !== props.artist)) {
        setInkData()
        let inks

        const loadInks = async () => {

          if (props.address === props.artist && props.inksCreatedBy) {
            setLastBalance(props.inksCreatedBy.toNumber())
            inksToDisplay = props.inksCreatedBy
          } else {
            inksToDisplay = await props.readKovanContracts['NiftyInk']["inksCreatedBy"](props.artist)
            console.log(inksToDisplay)
          }

          setLastArtist(props.artist)
          setLastBalance(inksToDisplay.toNumber())

          window.history.pushState({id: props.artist}, props.artist, '/artist/' + props.artist)

          inks = new Array(inksToDisplay)

          const getInkInfo = async (i) => {
            let inkId = await props.readKovanContracts['NiftyInk']["inkOfArtistByIndex"](props.artist, i)
            let inkInfo = await props.readKovanContracts['NiftyInk']["inkInfoById"](inkId)
            let inkCount = await props.readKovanContracts['NiftyToken']["inkTokenCount"](inkInfo[6])

            let likes
            if (props.readKovanContracts['Liker']) {
              let niftyAddress = props.readKovanContracts['NiftyInk']['address']
              likes = await props.readKovanContracts['Liker']['getLikesByTarget'](niftyAddress, inkId)
            }

            let jsonIpfsHash = inkInfo[2]
            let jsonContent
            try{
              jsonContent = await getFromIPFS(jsonIpfsHash, props.ipfsConfig)
            }catch(e){}
            if(jsonContent){
              const inkJson = JSON.parse(jsonContent)
              const linkUrl = inkJson['drawing']
              const inkImageHash = inkJson.image.split('/').pop()
              const imageContent = await getFromIPFS(inkImageHash, props.ipfsConfig)
              const inkImageURI = 'data:image/png;base64,' + imageContent.toString('base64')
              return {inkId: inkId.toString(), inkCount: inkCount, url: linkUrl, name: inkJson['name'], limit: inkJson['attributes'][0]['value'], image: inkImageURI, likes: likes.toString()}
            }
            return {}
          }

          for(var i = 0; i < inksToDisplay; i++){
            let inkInfo = await getInkInfo(i)
            if(inkInfo) inks[i] = inkInfo
            setInkData(Array.from(inks).reverse())
          }
          setInkData(inks.reverse())
          setInkCounter(inksToDisplay.toNumber())
        }

        loadInks()

      }

  },[props.address,props.tab, props.artist])

      if(inkCounter > 0 && inkData) {

        const search = async (values) => {
          props.setArtist(values['address'])
        }

        const onFinishFailed = errorInfo => {
          console.log('Failed:', errorInfo);
        };

        const searchForm = (
          <Row style={{justifyContent: 'center'}}>

          <Form
          layout={'inline'}
          name="searchArtist"
          onFinish={search}
          onFinishFailed={onFinishFailed}
          >
          <Form.Item
          name="address"
          rules={[{ required: true, message: 'Search for an Address or ENS' }]}
          >
          <AddressInput
          ensProvider={props.mainnetProvider}
          placeholder={"to address"}
          />
          </Form.Item>

          <Form.Item >
          <Button type="primary" htmlType="submit">
          <SearchOutlined />
          </Button>
          </Form.Item>
          </Form>

          </Row>
        )
        let searchFlow =       (
          <Popover content={searchForm}
          title="Show Artist">
          <Button type="secondary"><SearchOutlined /></Button>
          </Popover>
        )

        try{
          inkView = (
            <List
            itemLayout="horizontal"
            dataSource={inkData}
            header={<>{props.artist==props.address?<Typography.Title level={3} >My inks</Typography.Title>:<Address value={props.artist} ensProvider={props.mainnetProvider}/>}{searchFlow}</>}
            renderItem={(item) => {
              if(!item || !item.name) return (<></>)
              else{
                return (
                  <List.Item>
                  <List.Item.Meta
                  avatar={item['image']?<a><Badge style={{ backgroundColor: '#2db7f5' }} count={item['likes']}><img src={item['image']} onClick={() => props.showInk(item['url'])} alt={item['name']} height="100" width="100"/></Badge></a>:<Avatar icon={<LoadingOutlined />} />}
                  title={<a href="#" onClick={() => props.showInk(item['url'])} >{<span>{item['name']}</span>}</a>}
                  description={<Row style={{justifyContent: 'center'}}>{<><Typography>{item['inkCount'].toNumber()+" of " + (item['limit']>0?item['limit'] + ' minted':'unlimited copies')}</Typography></>}
                        </Row>
                        }
                  />
                  </List.Item>
                )
              }
            }}
          />)
        }catch(e){
          console.log(e)
        }

      } else if(inkCounter && inkCounter.toString() === "0" && props.address === props.artist) { inkView = (<Empty
          description={
            <span>
              Click "Create" to create a new ink!
              </span>
            }
            />
          )}
        else if(inkCounter && inkCounter.toString() === "0" && props.address !== props.artist) { inkView = (<Empty
            description={
              <span>
                This account has not created any inks :(
                </span>
              }
              />
            )}
        else {
          inkView = (<Loader/>)
        }


          return inkView

        }
