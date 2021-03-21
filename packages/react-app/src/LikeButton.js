import React, { useState } from 'react'
import { Button, notification, Badge } from 'antd';
import { LikeTwoTone, LikeOutlined } from '@ant-design/icons';
import { useContractLoader, usePoller } from "./hooks"
import { transactionHandler } from "./helpers"

export default function LikeButton(props) {

  const [minting, setMinting] = useState(false)

  const readContracts = useContractLoader(props.metaProvider);

  const [likes, setLikes] = useState()
  const [hasLiked, setHasLiked] = useState()

  let likeButton

  let displayLikes
  if(likes) {
    displayLikes = likes.toString()
  }

  usePoller(() => {
    const getLikeInfo = async () => {
      if(readContracts && props.likerAddress && props.contractAddress){
        try {
        const newInkLikes = await readContracts['Liker']['getLikesByTarget'](props.contractAddress, props.targetId)
        setLikes(newInkLikes)
        const newHasLiked = await readContracts['Liker']['checkLike'](props.contractAddress, props.targetId, props.likerAddress)
        setHasLiked(newHasLiked)
      } catch(e){ console.log(e)}
      }
    }
    getLikeInfo()
  }, 4333
)



    likeButton = (<>
      <Badge style={{ backgroundColor: '#2db7f5' }} count={displayLikes}>
      <Button onClick={async (e)=>{
        e.preventDefault();
        if(!hasLiked&&!minting){
          setMinting(true)
          try {
            let contractAddress = props.contractAddress
            let target = props.targetId
            let liker = props.likerAddress

            let contractName = "Liker"
            let regularFunction = "like"
            let regularFunctionArgs = [contractAddress, target]
            let signatureFunction = "likeWithSignature"
            let signatureFunctionArgs = [contractAddress, target, liker]
            let getSignatureTypes = ['bytes','bytes','address','address','uint256','address']
            let getSignatureArgs = ['0x19','0x00',readContracts["Liker"].address,contractAddress,target,liker]

            let likeConfig = {
              ...props.transactionConfig.current,
              contractName,
              regularFunction,
              regularFunctionArgs,
              signatureFunction,
              signatureFunctionArgs,
              getSignatureTypes,
              getSignatureArgs,
            }

            console.log(likeConfig)

            let result = await transactionHandler(likeConfig)

            if(result) {
              notification.open({
                message: 'You liked this ink!',
                description:(
                  <a target="_blank" href={"https://blockscout.com/poa/xdai/tx/"+result.hash}>view transaction.</a>
                ),
              });
            setMinting(false)
            console.log(result)
          }
          } catch(e) {

            setMinting(false)
            console.log(e.message)
          }
        }
        return false;
      }} loading={minting} shape={"circle"} type={hasLiked||minting?"primary":"secondary"} style={{ zIndex:99, cursor:"pointer", marginBottom: 12, boxShadow: "2px 2px 3px #d0d0d0" }}>
        {minting?"":hasLiked?<LikeOutlined />:<LikeTwoTone />}
      </Button>
      </Badge>
      </>
    )

    return likeButton
  }
