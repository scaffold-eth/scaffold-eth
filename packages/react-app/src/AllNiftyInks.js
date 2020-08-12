import React, { useState, useEffect } from 'react'
import { Row, Col, Avatar, Empty, Space, Spin, Badge } from 'antd';
import { useEventListener } from "./hooks"
import { getFromIPFS } from "./helpers"
import { Loader } from "./components"
import StackGrid from "react-stack-grid";

const MAX_FRONT_PAGE_DISPLAY = 24
const BATCH_DOWNLOAD = 6

export default function NftyWallet(props) {
  //const [allInks, setAllInks] = useState()
  const [allInksArray, setAllInksArray] = useState([])

  let allInkView
  const [lastStreamCount, setLastStreamCount] = useState("0")

  let inkCreations = useEventListener(props.readKovanContracts,'NiftyInk',"newInk",props.kovanProvider, 1)
  let likes

  useEffect(()=>{
      if(props.tab === props.thisTab && props.readKovanContracts && inkCreations && props.totalInks && inkCreations.length) {
      if(inkCreations.length.toString() == props.totalInks.toString() &&
        props.totalInks.toString() !== lastStreamCount
      ) {
        let inksToShow = Math.min(MAX_FRONT_PAGE_DISPLAY, props.totalInks.toString())
        let allInks = new Array(inksToShow).fill({})
        setLastStreamCount(props.totalInks.toString())

        const getInkImages = async (e) => {
          const jsonContent = await getFromIPFS(e['jsonUrl'], props.ipfsConfig)
          const inkJson = JSON.parse(jsonContent)
          const inkImageHash = inkJson.image.split('/').pop()
          const imageContent = await getFromIPFS(inkImageHash, props.ipfsConfig)
          const inkImageURI = 'data:image/png;base64,' + imageContent.toString('base64')
          return Object.assign({image: inkImageURI, name: inkJson.name, url: inkJson.drawing}, e);
        }

        const loadStream = async () => {
          if(inkCreations) {
            let mostRecentInks = inkCreations.slice(-inksToShow).reverse()
            let promises = []
            for(var i = 0; i < inksToShow; i++){
              try {
                promises.push(getInkImages(mostRecentInks[i]))
              } catch (e) {console.log(e)}
              if(promises.length>=BATCH_DOWNLOAD){
                for(var p = 0; p <= promises.length; p++){
                  let result
                  try {
                    result = await promises[p]
                    if(result){
                      let thisIndex = i-(promises.length-1)+p
                      allInks[thisIndex] = result
                      setAllInksArray(allInks)
                    }
                  } catch (e) {console.log(e)}
                }
                promises = []
              }
            }
          }
        }

        loadStream()
      }
    }
  },[props.tab, props.totalInks])

  if(allInksArray && allInksArray.length>0) {
           allInkView = (
        <StackGrid
           columnWidth={120}
           gutterHeight={32}
           gutterWidth={32}
         >
          {allInksArray.map(item =>{
            return (
              <div key={item['id']}>
                {item['image']?/*<Badge style={{ backgroundColor: '#2db7f5' }} count={item['likes']}>*/<img src={item['image']} alt={item['name']} onClick={() => props.showInk(item['url'])} width='120' height='120'/>/*</Badge>*/:<Avatar size={120} style={{ backgroundColor: '#FFFFFF' }} icon={<Spin style={{opacity:0.125}} size="large" />} />}
              </div>
            )
          })}
        </StackGrid>
        )
  } else {
    allInkView = (<Loader/>)
  }

  return allInkView
}
