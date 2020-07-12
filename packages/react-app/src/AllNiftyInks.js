import React, { useState, useEffect } from 'react'
import { Row, Avatar, Empty, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useEventListener } from "./hooks"
import { getFromIPFS } from "./helpers"



export default function NftyWallet(props) {

  const [allInks, setAllInks] = useState()

  let allInkView

  let inkCreations = useEventListener(props.readContracts,'NFTINK',"newInk",props.localProvider, 1)

  useEffect(()=>{

      if(props.readContracts && props.tab === props.thisTab) {

        const getInkImages = async (e) => {
          const jsonContent = await getFromIPFS(e['jsonUrl'], props.ipfsConfig)
          const inkJson = JSON.parse(jsonContent)
          const inkImageHash = inkJson.image.split('/').pop()
          const imageContent = await getFromIPFS(inkImageHash, props.ipfsConfig)
          const inkImageURI = 'data:image/png;base64,' + imageContent.toString('base64')
          return Object.assign({image: inkImageURI, name: inkJson.name, url: inkJson.drawing}, e);
        }

        const loadStream = async (e) => {
          if(inkCreations) {
            const newInkCreations = await Promise.all(inkCreations.map(getInkImages))
            setAllInks(newInkCreations.reverse())
          }
        }

        loadStream()

      }

  },[props.tab, inkCreations])

       if(allInks) {
         allInkView = (
      <Row><Space>
        {allInks.map(item =>
        <img src={item['image']} alt={item['name']} onClick={() => props.showInk(item['url'])} width='120' height='120'/>
      )}
      </Space></Row>
    )
    } else {
      allInkView = (<Empty
        description={
          <span>
          No inks...
            </span>
          }
          />
        )
    }

    return allInkView

        }
