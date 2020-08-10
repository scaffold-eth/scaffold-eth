import React, { useState, useEffect } from 'react'
import { Button, notification, Badge } from 'antd';
import { LikeTwoTone, LikeOutlined } from '@ant-design/icons';
import { useContractLoader, usePoller } from "./hooks"
import { signLike, getSignature, transactionHandler } from "./helpers"

export default function LikeButton(props) {

  const [minting, setMinting] = useState(false)

  const writeContracts = useContractLoader(props.signingProvider);
  const metaWriteContracts = useContractLoader(props.metaProvider);

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
  }, 2987
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

            let metaSigner = await props.metaProvider.getAddress()

            let result = await transactionHandler(
              props.likerAddress, props.signingProvider, props.localProvider, metaSigner,
              writeContracts["Liker"], metaWriteContracts["Liker"],
              "like", [contractAddress, target],
              "likeWithSignature", [contractAddress, target, liker],
              ['bytes','bytes','address','address','uint256','address'],
              ['0x19','0x0',writeContracts["Liker"].address,contractAddress,target,liker]
            )

            if(result) {
              notification.open({
                message: 'You liked this ink!',
                description:(
                  <a target="_blank" href={"https://kovan.etherscan.io/tx/"+result.hash}>view transaction.</a>
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
