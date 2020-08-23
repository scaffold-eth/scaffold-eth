import React, { useState, useEffect } from 'react'
import { Row, Col, Avatar, Empty, Space, Spin, Badge } from 'antd';
import { useEventListener } from "./hooks"
import { getFromIPFS, isBlacklisted } from "./helpers"
import { Loader } from "./components"
import StackGrid from "react-stack-grid";

const MAX_FRONT_PAGE_DISPLAY = 64
const LOADERS_TO_SHOW = 16
const BATCH_DOWNLOAD = 3

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
        let allInks = new Array(Math.min(LOADERS_TO_SHOW, props.totalInks.toString())).fill({})
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
            let mostRecentInks = Array.from(inkCreations).reverse()
            let promises = []
            let hashesForDebugging = []
            let skips = 0
            let newIndex = 0
            for(var i = 0; i < inksToShow; i++){
              if(!isBlacklisted(mostRecentInks[i]['jsonUrl'])){
                try {
                  promises.push(getInkImages(mostRecentInks[i]))
                  hashesForDebugging.push(mostRecentInks[i]['jsonUrl'])
                } catch (e) {console.log("EEEERRRRR",e)}
              }else{
                skips++
              }
              if(promises.length>=BATCH_DOWNLOAD){
                for(var p = 0; p <= (promises.length-skips); p++){
                  let result
                  try {
                    result = await promises[p]
                    if(result){
                      //let thisIndex = i-(promises.length-1)+p-skips
                      //console.log("thisIndex",thisIndex)
                      allInks[newIndex++] = result
                      setAllInksArray(allInks)
                    }
                  } catch (e) {console.log("FAILED TO LOAD FROM IPFS =====>",hashesForDebugging[p])}
                }
                promises = []
                hashesForDebugging = []
                skips = 0
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
            //console.log("item",item)
            return (
              <div key={item['id']} ipfsHash={item['jsonUrl']}>
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
