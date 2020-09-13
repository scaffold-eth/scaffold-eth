import React, { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { List, Avatar, Empty, Spin, Typography, Row, Badge, Col, Space, Button, Form, Popover, notification } from 'antd';
import { LoadingOutlined, LikeTwoTone, SearchOutlined, ShareAltOutlined } from '@ant-design/icons';
import { getFromIPFS } from "./helpers"
import { AddressInput, Address, Loader } from "./components"


export default function MyNiftyInks(props) {

  const [lastArtist, setLastArtist] = useState()
  const [inkData, setInkData] = useState()
  let inkView
  let [inkCounter, setInkCounter] = useState()
  let [inkPage, setInkPage] = useState(0)
  let [lastInkPage, setLastInkPage] = useState()
  let inksPerPage = 10
  let [loading, setLoading] = useState(true)

  const [searchArtist] = Form.useForm();
  let searchFlow

  useEffect(()=>{
      let inksToDisplay

      if(!props.artist) {
        props.setArtist(props.address)
      }
      if(props.readKovanContracts && props.artist && props.tab === props.thisTab) {
        let inks
        const loadInks = async () => {
          if(lastArtist !== props.artist || inkPage !== lastInkPage) {
            setLoading(true)
            if (props.address === props.artist && props.inksCreatedBy) {
              inksToDisplay = props.inksCreatedBy
            } else {
              inksToDisplay = await props.readKovanContracts['NiftyInk']["inksCreatedBy"](props.artist)
            }

            if (props.artist === lastArtist && inksToDisplay.toNumber() === inkCounter) {
              inks = Array.from(inkData)
            } else {
              setInkData()
              setInkPage(0)
              inks = []
            }

            setLastArtist(props.artist)
            setLastInkPage(inkPage)

            window.history.pushState({id: props.artist}, props.artist, '/artist/' + props.artist)

            if(inksToDisplay.toString() === "0") {
              setInkCounter(inksToDisplay.toNumber())
              setLoading(false)
              return
            }

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
              }catch(e){
                console.log(e)
              }
              if(jsonContent){
                try {
                const inkJson = JSON.parse(jsonContent)
                const linkUrl = inkJson['drawing']
                const inkImageHash = inkJson.image.split('/').pop()
                const imageContent = await getFromIPFS(inkImageHash, props.ipfsConfig)
                const inkImageURI = 'data:image/png;base64,' + imageContent.toString('base64')
                return {inkId: inkId.toString(), inkCount: inkCount, url: linkUrl, name: inkJson['name'], limit: inkJson['attributes'][0]['value'], image: inkImageURI, likes: likes.toString()}
              } catch(e) {
                console.log(e)
              }
              }
              return {}
            }

            let allInksToDisplay = ([...Array(inksToDisplay.toNumber()).keys()])
            let pageOfInks = allInksToDisplay.reverse().slice(inkPage * inksPerPage, inkPage * inksPerPage + inksPerPage)
            console.log(pageOfInks)

            for(let i of pageOfInks){
              let inkInfo = await getInkInfo(i)
              if(inkInfo && inkInfo.inkId) inks[inksToDisplay.toNumber() - i - 1] = inkInfo
              setInkData(Array.from(inks))
              setInkCounter(inksToDisplay.toNumber())
            }
            console.log(inks)
            //setInkCounter(inksToDisplay.toNumber())
            setLoading(false)
          }
        }

        loadInks()

      }

  },[props.readKovanContracts, props.address,props.tab, props.artist, inkPage])

  const search = async (values) => {

    try {
      const newAddress = ethers.utils.getAddress(values['address'])
      props.setArtist(newAddress)
    } catch (e) {
      console.log('not an address')
      notification.open({
          message: '📛 Not a valid address!',
          description:
          "Please try again",
        });
    }
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const searchForm = (
    <Row style={{justifyContent: 'center'}}>

    <Form
    form={searchArtist}
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
    <Button type="primary" htmlType="submit" disabled={loading}>
    <SearchOutlined />
    </Button>
    </Form.Item>
    </Form>

    {props.address!==props.artist?<Button type="secondary" onClick={() => {
      search({'address': props.address})}
    } disabled={loading}>My Inks</Button>:null}
    </Row>
  )
  searchFlow =       (
    <Popover content={searchForm}
    title="Show Artist">
    <Button type="secondary" disabled={loading}>Artist <SearchOutlined /></Button>
    </Popover>
  )

      if(inkCounter > 0 && inkData && props.artist === lastArtist) {

        try{
          inkView = (
            <>
            <List
            itemLayout="horizontal"
            dataSource={inkData}
            header={<Space>{props.artist==props.address?<span style={{fontSize:24,padding:8}}>My Inks</span>:<Address value={props.artist} ensProvider={props.mainnetProvider}/>}{searchFlow}</Space>}
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
          />
          {<Button
            onClick={() => {setInkPage(inkPage + 1)}}
            loading={loading}
            disabled={(inkPage * inksPerPage + inksPerPage).toString() >= inkCounter}
            >
            {loading?'Loading':(((inkPage * inksPerPage + inksPerPage).toString() < inkCounter)?inkData.length + '/' + inkCounter + ': Show More':inkData.length + ' inks')}
          </Button>}
          </>)
        }catch(e){
          console.log(e)
        }

      } else if(inkCounter === 0 && props.address === props.artist) { inkView = (
        <>
        <Empty
          description={
            <span>
              Click "Create" to create a new ink!
              </span>
            }
            />
            {searchFlow}
            </>
          )}
        else if(inkCounter === 0 && props.address !== props.artist) {
        inkView = (
          <>
          <Empty
            description={
              <span>
                This account has not created any inks :(
                </span>
              }
              />
              {searchFlow}
              </>
            )}
        else {
          inkView = (<Loader/>)
        }


          return inkView

        }
