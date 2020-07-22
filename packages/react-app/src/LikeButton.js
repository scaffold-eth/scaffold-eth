import React, { useState, useEffect } from 'react'
import { Button, notification, Badge } from 'antd';
import { LikeTwoTone } from '@ant-design/icons';
import { useContractLoader, usePoller } from "./hooks"
import { signLike } from "./helpers"

export default function LikeButton(props) {

  const [minting, setMinting] = useState(false)

  const writeContracts = useContractLoader(props.metaProvider);

  const [likes, setLikes] = useState()
  const [hasLiked, setHasLiked] = useState()

  let likeButton

  let displayLikes
  if(likes) {
    displayLikes = likes.toString()
  }

  usePoller(() => {
    const getLikeInfo = async () => {
      if(writeContracts){
        try {
        const newInkLikes = await writeContracts['Liker']['getLikesByTarget'](props.contractAddress, props.targetId)
        setLikes(newInkLikes)
        const newHasLiked = await writeContracts['Liker']['checkLike'](props.contractAddress, props.targetId, props.likerAddress)
        setHasLiked(newHasLiked)
      } catch(e){ console.log(e)}
      }
    }
    getLikeInfo()
  }, 3000
)


          likeButton = (<>
            <Badge style={{ backgroundColor: '#2db7f5' }} count={displayLikes} showZero>
            <Button loading={minting} shape={"circle"} disabled={hasLiked} onClick={async ()=>{
              setMinting(true)
              try {
                let contractAddress = props.contractAddress
                let target = props.targetId
                let liker = props.likerAddress
                let signature = await signLike(contractAddress, target, liker, props.signingProvider, writeContracts["Liker"])
                let result = await writeContracts["Liker"].likeWithSignature(contractAddress, target, liker, signature)
                if(result) {
                  notification.open({
                    message: 'You liked this ink!',
                    description:(
                      <a target="_blank" href={"https://kovan.etherscan.io/tx/"+result.hash}>liked! view transaction.</a>
                    ),
                  });
                setMinting(false)
                console.log(result)
              }
              } catch(e) {
                notification.open({
                  message: 'Like unsuccessful',
                  description:
                  e.message,
                });
                setMinting(false)
                console.log(e.message)
              }
            }} style={{ marginBottom: 12 }}><LikeTwoTone /></Button>
            </Badge>
            </>
          )

    return likeButton
  }
